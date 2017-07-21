<?php
class QuickSetup_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
		$this->load->library('PortalSocket');
	}
	function get_list($data) {
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'restoreState' => '1',
                'interfaceList' => array(
                    array('name' => 'eth0'),
                    array('name' => 'eth1'),
                    array('name' => 'eth2'),
                    array('name' => 'eth3'),
                    array('name' => 'eth4')
                )
            )
        );		
		return json_encode($arr);
	}
    function quick_setup($data){
        $result = null;
        $gateway = '';
        foreach($data as $row){
            if(isset($row['enable']) && $row['enable'] === '1'){
                //1.设置接口
                $interface = $this->getCgiParamInteface($row);
                $result = acnetmg_add_portip(json_encode($interface));
                //WAN 设置WAN口就是设置一个路由
                if($row['type'] === 'wan') {
                    $gateway = $row['gateway'];
                    $route = array(
                        'destnet' => element('ip', $row),
                        'gateway' => element('gateway', $row),
                        'mask'    => element('mask', $row), 
                    );
                    $result = acnetmg_add_route(json_encode($route));	
                }
                //dhcp
                if(isset($row['dhcpEnable'])  && $row['dhcpEnable'] === '1') {
                    $dhcp = $this->getCgiParamDhcp($row);
                    $dhcp['pool_route'] = $gateway;
                    $result = dhcpd_add_pool_name(json_encode($dhcp));
                }
                /*
                //net
                $cgiParams = $this->getCgiParamsNet($row);
                $result = acnetmg_add_nat(json_encode($cgiParams));
                */   
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
            'pool_route' => '', //网关 要设置但不在这里设置
            'pool_domain' => '',//element('domain', $data, ''), 
            'pool_dns1' => element('mainDns', $data, '114.114.114.114'), //主DNS
            'pool_dns2' => element('secondDns', $data, ''), //备用DNS
            'pool_opt43' => element('ip', $data, ''), //AC地址
            'pool_opt60' => element('opt60', $data, '')
        );
        return $arr;
    }

    private function getCgiParamsNet($data) {
        $ret = array(
            'id'=>element('id', $data),
            'type'=>element('type', $data),
            'ipaddr'=>element('addr', $data),
            'natipaddr'=>element('nataddr', $data),
            'ifname'=>element('pubifname', $data),
        );
        return $ret;
    }
}