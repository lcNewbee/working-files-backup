<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class NetworkPortalRules extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$portal_query=$this->db->select('portal_id,portal_name,attr_name,attr_value')
                  ->from('portal_auth')
                  ->join('portal_params','portal_auth.id=portal_params.portal_id')
                  ->join('portal_attr','portal_attr.id=portal_params.attr_id')
                  ->get()->result_array();
    $interface_query=$this->db->select('portal_id,portal_name,attr_name,attr_value')
                    ->from('portal_server')
                    ->join('portal_auth','portal_auth.id=portal_server.portal_id')
                    ->join('portalserver_attr','portalserver_attr.id=portalserver_params.attr_id')
                    ->join('portalserver_params','portal_server.id=portalserver_params.portalserver_id')
                    ->where('attr_name','server_ifname')
                    ->get()->result_array();
		$state=array(
				      'code'=>2000,
				      'msg'=>'OK'
				    );
		// 定义一个临时接口数组
		$portal_data = array();
		foreach($portal_query as $v){
			$portal_data[$v['portal_id']]['id'] = $v['portal_id'];
			$portal_data[$v['portal_id']]['template_name'] = $v['portal_name'];
			$portal_data[$v['portal_id']][$v['attr_name']]= $v['attr_value'];
    }
		//array_values是为了让portal_id也成为数组属性,重新赋值给接口数组
  	$portal_data=array_values($portal_data);

		// 定义一个临时接口数组
		$interface_data = array();
		foreach($interface_query as $v){
			$interface_data[$v['portal_id']]['id'] = $v['portal_id'];
			$interface_data[$v['portal_id']][$v['attr_name']]= $v['attr_value'];
    }
		//array_values是为了让portal_id也成为数组属性,重新赋值给接口数组
  	$interface_data=array_values($interface_data);

    function merginData($v, $w) {
      $list_data = array_merge($v, $w);
      $temp_data=array(
        "id"=>element('id',$list_data,''),
        "interface_bind"=>element("server_ifname",$list_data,'' ),
        "template_name"=>element('template_name',$list_data,''),
        "max_usernum"=>element("auth_maxuser",$list_data,'' ),
        "auth_mode"=>element("auth_mode",$list_data,'' ),
        "auth_mask"=>element("auth_mask",$list_data,'' ),
        "auth_ip"=>element("auth_ipaddr",$list_data,'' ),
        "auth_domain"=>element("auth_domain",$list_data,'' ),
        "idle_test"=>element("idle_test",$list_data,'' )
      );
      return $temp_data;
    }
    $data = array_map('merginData', $portal_data, $interface_data);
		$result=array(
						      'state'=>$state,
						      'data'=>array(
						      'list'=>$data
						      )
						    );
		return $result;
	}

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
    function getCgiParam($oriData) {
      $retData = array(
        'template_name'=>element('template_name', $oriData,''),
        'interface_bind'=>element('interface_bind', $oriData,''),
        'max_usernum'=>element('max_usernum', $oriData,''),
        'auth_mode'=>element('auth_mode', $oriData,''),
        'auth_ip'=>element('auth_ip', $oriData,''),
        'auth_mask'=>element('auth_mask', $oriData,''),
        'auth_domain'=>element('auth_domain', $oriData,''),
        'idle_test'=>element('idle_test', $oriData,'')
      );
      return $retData;
    }
		if ($actionType === 'add') {
      $temp_data=getCgiParam($data);
      $result=portal_set_template_attr(json_encode($temp_data));
    }
	 elseif($actionType === 'edit') {
      $temp_data=getCgiParam($data);
      $result=portal_set_template_attr(json_encode($temp_data));
		}
    elseif($actionType === 'delete'){
      $temp_data=array(
        'portal_list'=>$data['selectedList']
      );
      $result=portal_del_template_attr(json_encode($temp_data));
    }
		return $result;
	}
	public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		}
		else if($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
      echo json_encode($result);
		}
	}
}
