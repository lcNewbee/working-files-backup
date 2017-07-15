<?php
class NetworkDhcp_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->helper(array('array', 'db_operation'));
    }

    function get_list() {
        $query = $this->db->select('pool_id,pool_name,attr_name,attr_value')
                            ->from('pool_params')
                            ->join('pool_attr','pool_attr.id=pool_params.attr_id')
                            ->join('pool_list','pool_list.id=pool_params.pool_id')
                            ->get()->result_array();

        $keyname = array(
            "domain" => "domain", 
            "ipaddr" => "startIp", 
            "netmask" => "mask", 
            "route" => "gateway", 
            "dns1" => "mainDns", 
            "dns2" => "secondDns", 
            "lease" => "releaseTime", 
            "opt43" => "opt43", 
            "opt60" => "opt60", 
            "vlan" => "vlan"
        );
        //定义一个临时接口数组
        $interfaces  = array();
        foreach($query as $v){
            $interfaces[$v['pool_id']]['id'] = $v['pool_id'];
            $interfaces[$v['pool_id']]['name'] = $v['pool_name'];
            $interfaces[$v['pool_id']][$v['attr_name']]= $v['attr_value'];
            foreach($keyname as $k1=>$v1) {
                if($k1==$v['attr_name']) {
                    unset($interfaces[$v['pool_id']][$v['attr_name']]);
                    $interfaces[$v['pool_id']][$v1]=$v['attr_value'];
                }
            }
            //删除多余元素
            unset($interfaces[$v['pool_id']]['vlan']);
        }
        //array_values是为了让pool_id也成为数组属性,重新赋值给接口数组
        $interfaces_data = array_values($interfaces);
        $result = array(
            'state'=>array('code'=>2000,'msg'=>'OK'),
            'data'=>array('list'=>$interfaces_data)
        );
        return $result;        
    }
    function add($data) {
		$result = null;
		$temp_data = $this->getCgiParam($data);
		$result = dhcpd_add_pool_name(json_encode($temp_data));
        $loginfo = array(
			'type' => 'Add', 
			'operator' => element('username', $_SESSION, ''), 
			'operationCommand' => "add  dhcp", 
			'operationResult' => preg_replace('#\s+#', '',trim($result)),
			'description' => json_encode($temp_data)
		);
		Log_Record($this->db, $loginfo);
		return $result;
	}
	function delete($data) {
		$result = null;
		$arr = $data['selectedList'];
		$pool_list_arr = str_replace("dhcp_name_", "pool_name", $arr);
		$temp_data = array('pool_list' => $pool_list_arr);
		$result = dhcpd_del_pool_name(json_encode($temp_data));
        $loginfo = array(
			'type' => 'Delete', 
			'operator' => element('username', $_SESSION, ''), 
			'operationCommand' => "del  dhcp", 
			'operationResult' => preg_replace('#\s+#', '',trim($result)),
			'description' => json_encode($temp_data)
		);
		Log_Record($this->db, $loginfo);
		return $result;
	}    
	function edit($data) {
		$result = null;
		$temp_data = $this->getCgiParam($data);
		$result = dhcpd_edit_pool_name(json_encode($temp_data));
        $loginfo = array(
			'type' => 'Edit', 
			'operator' => element('username', $_SESSION, ''),
			'operationCommand' => "edit dhcp", 
			'operationResult' => preg_replace('#\s+#', '',trim($result)),
			'description' => json_encode($temp_data)
		);
		Log_Record($this->db, $loginfo);
		return $result;
	}
    private function getCgiParam($data) {
        $arr = array(
            'pool_name' => element('name', $data, ''), 
            'pool_ipaddr' => element('startIp', $data, ''), 
            'pool_mask' => element('mask', $data, ''), 
            'pool_lease' => element('releaseTime', $data, ''), 
            'pool_route' => element('gateway', $data, ''), 
            'pool_domain' => element('domain', $data, ''), 
            'pool_dns1' => element('mainDns', $data, ''), 
            'pool_dns2' => element('secondDns', $data, ''), 
            'pool_opt43' => element('opt43', $data, ''), 
            'pool_opt60' => element('opt60', $data, '')
        );
        return $arr;
    }
}
