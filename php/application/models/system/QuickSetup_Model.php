<?php
class QuickSetup_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'db_operation'));
		$this->load->library('PortalSocket');
	}
	function get_list($data) {
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'restoreState' => $this->getRestoreState(),
                'interfaceList' => array(
                    array('name' => 'eth0'),
                    array('name' => 'eth1'),
                    array('name' => 'eth2'),
                    array('name' => 'eth3'),
                    array('name' => 'eth4'),
                    array('name' => 'eth5')
                )
            )
        );	
        $query = $this->db->query('select port_name as name from port_table')->result_array();
        if(count($query) > 0){
            $arr['data']['interfaceList'] = $query;
        }	
		return json_encode($arr);
	}
    function quick_setup($data){
        $result = null;
        $natipaddr = '0.0.0.0';
        $net_name = 'eth0';
        //提前得到wan口的ip
        foreach($data as $row){
            if($row['type'] === 'wan'){
                $net_name = $row['name'];
                $natipaddr = $row['ip'];
                break;
            }
        }
        foreach($data as $row){
            if(isset($row['enable']) && $row['enable'] === '1'){
                //1.设置接口
                $interface = $this->getCgiParamInteface($row);
                $result = acnetmg_add_portip(json_encode($interface));
                $interface_log = array(
                    'type' => 'Add', 
                    'operator' => element('username', $_SESSION, ''), 
                    'operationCommand' => "add  interface", 
                    'operationResult' => preg_replace('#\s+#', '',trim($result)),
                    'description' => json_encode($interface)
                );
                Log_Record($this->db, $interface_log);
                //WAN 设置WAN口就是设置一个默认路由
                if($row['type'] === 'wan') {
                    $route = array(
                        'destnet' => '0.0.0.0',
                        'gateway' => element('gateway', $row),
                        'mask'    => '0.0.0.0', 
                    );
                    $result = acnetmg_add_route(json_encode($route));	
                    $route_log = array(
                        'type' => 'Add', 
                        'operator' => element('username', $_SESSION, ''), 
                        'operationCommand' => "add  route", 
                        'operationResult' => preg_replace('#\s+#', '',trim($result)),
                        'description' => json_encode($route)
                    );
                    Log_Record($this->db, $route_log);
                }
                //dhcp
                if(isset($row['dhcpEnable'])  && $row['dhcpEnable'] === '1') {
                    $dhcp = $this->getCgiParamDhcp($row);
                    //$dhcp['pool_route'] = $gateway;
                    $result = dhcpd_add_pool_name(json_encode($dhcp));
                    $dhcp_log = array(
                        'type' => 'Add', 
                        'operator' => element('username', $_SESSION, ''), 
                        'operationCommand' => "add  dhcp", 
                        'operationResult' => preg_replace('#\s+#', '',trim($result)),
                        'description' => json_encode($dhcp)
                    );
                    Log_Record($this->db, $dhcp_log);
                }                
                //net
                if(!$this->getNetState()){
                    $this->setNet();                    
                }
                if(isset($row['type']) && $row['type'] === 'lan'){
                    $netarr = $this->getCgiParamsNet($row);
                    $netarr['natipaddr'] = $natipaddr;
                    $netarr['ipaddr'] = substr($netarr['ipaddr'], 0, strripos($netarr['ipaddr'], '.')+1) . '0/' . $this->getMaskLength($row['mask']);
                    $netarr['ifname'] = $net_name;
                    $result = acnetmg_add_nat(json_encode($netarr));
                    $net_log = array(
                        'type' => 'Add', 
                        'operator' => element('username', $_SESSION, ''), 
                        'operationCommand' => "add  dhcp", 
                        'operationResult' => preg_replace('#\s+#', '',trim($result)),
                        'description' => json_encode($netarr)
                    );
                    Log_Record($this->db, $net_log);
                }
                // set state
                $this->setRestoreState('0');
            }
        }		
        return json_encode(json_ok());
    }
 
    private function getCgiParamInteface($data) {
		$arr = array(
			'portname' => element('name', $data),
			'ip' => element('ip', $data),
			'mask' => element('mask', $data)
		);
		return $arr;
	}

    private function getCgiParamDhcp($data) {
        $arr = array(
            'pool_name' => 'dhcp_'. element('name', $data, ''), //名称
            'pool_ipaddr' => element('ip', $data, ''), //其实ip
            'pool_mask' => element('mask', $data, ''), //掩码
            'pool_lease' => element('releaseTime', $data, '7200'), //租约时间
            'pool_route' => element('ip', $data, ''), //网关 要设置但不在这里设置
            'pool_domain' => '',//element('domain', $data, ''), 
            'pool_dns1' => element('mainDns', $data, '114.114.114.114'), //主DNS
            'pool_dns2' => '8.8.8.8',//element('secondDns', $data, '8.8.8.8'), //备用DNS
            'pool_opt43' => element('ip', $data, ''), //AC地址
            'pool_opt60' => element('opt60', $data, '')
        );
        return $arr;
    }

    private function getCgiParamsNet($data) {
        $ret = array(
            'id'=>element('id', $data),
            'type'=>'snat',
            'ipaddr'=>element('ip', $data),
            'natipaddr'=>'',//这里使用WAN地址
            'ifname'=>element('name', $data)
        );
        return $ret;
    }

    //检测net是否开启
    private function getNetState(){
        $data = $this->db->select('enable')
                                ->from('natenable')
                                ->get()->result_array();
        if(count($data) > 0){
            return $data[0]['enable'];
        }
        return 0;
    }
    private function setNet(){
        $result = null;
        $cgiParams = array('enable' => 1);
        $result = acnetmg_nat_enable(json_encode($cgiParams));
        $net_log = array(
            'type' => 'Add', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Activate  net Server", 
            'operationResult' => preg_replace('#\s+#', '',trim($result)),
            'description' => json_encode($cgiParams)
        );
        Log_Record($this->db, $net_log);
    }

    //计算掩码长度
    private function getMaskLength($netmask) {
        $len = 0;
        //$netmask="255.255.255.0";
        $split_mask = explode('.', $netmask);
        foreach ($split_mask as $v) {
            $len+= 8 - log(256 - $v, 2);
        }
        return $len;
    }

    private function getRestoreState(){
        $filename = "/var/license/is_sysreset";
        if(is_file($filename)){
            $myfile = fopen($filename, "r");
            $str = fread($myfile, filesize($filename));
            fclose($myfile);
            if(trim($str, "\n") == '1'){
                return '1';
            }
        }
        return '0';
    }

    private function setRestoreState($value){
        $filename = "/var/license/is_sysreset";
        if(is_file($filename)){
            $myfile = fopen($filename, "w") or die("Unable to open file!");
            fwrite($myfile, $value);        
            fclose($myfile);
        }        
    }
}