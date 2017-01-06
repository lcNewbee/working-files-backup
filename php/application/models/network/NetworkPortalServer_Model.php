<?php
class NetworkPortalServer_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
    function get_portalsev_list() {
        $result = null;
		$query = $this->db->select('portal_id,portal_name,attr_name,attr_value')
                            ->from('portal_server')
                            ->join('portal_auth', 'portal_auth.id=portal_server.portal_id')
                            ->join('portalserver_attr', 'portalserver_attr.id=portalserver_params.attr_id')
                            ->join('portalserver_params', 'portal_server.id=portalserver_params.portalserver_id')
                            ->get()->result_array();
                            
		$keyname = array(
            "id" => "id", 
            "template_name" => "template_name", 
            "address_type" => "address_type", 
            "server_ip" => "server_ipaddr", 
            "server_port" => "server_port", 
            "server_key" => "server_key", 
            "redirect_url" => "server_url", 
            "ac_ip" => "ac_ip",
        );
		//定义一个临时接口数组
		$server_data = array();
		foreach ($query as $v) {
			$server_data[$v['portal_id']]['id'] = $v['portal_id'];
			$server_data[$v['portal_id']]['template_name'] = $v['portal_name'];
			$server_data[$v['portal_id']][$v['attr_name']] = $v['attr_value'];
			foreach ($keyname as $k1 => $v1) {
				if ($k1 == $v['attr_name']) {
					unset($server_data[$v['portal_id']][$v['attr_name']]);
					$server_data[$v['portal_id']][$v1] = $v['attr_value'];
				}
			}
		}
        //array_values是为了让portal_id也成为数组属性,重新赋值给接口数组
        $server_data=array_values($server_data);
        $result = array(
            'state'=>  array('code' => 2000, 'msg' => 'OK'),
            'data'=> array(
                'list'=>$server_data
            )
        );
        return $result;
	}
    function add_portalsev($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = portal_add_template_name(json_encode($temp_data));
        return $result;
    }
    function del_portalsev($data) {
        $temp_data=array(
            'portal_list'=>$data['selectedList']
        );
        $result = portal_del_template_name(json_encode($temp_data));
        return $result;
    }
    function edit_portalsev($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = portal_edit_template_name(json_encode($temp_data));
        return $result;
    }
    function getCgiParam($data) {
        $retData = array(
            'template_name'=>element('template_name', $data),
            'auth_accesstype'=>element('address_type', $data),
            'server_ipaddr'=>element('server_ipaddr', $data),
            'server_port'=>element('server_port', $data),
            'server_key'=>element('server_key', $data),
            'server_url'=>element('server_url', $data),
            'ac_ip'=>element('ac_ip', $data)
        );
        return $retData;
    }
}