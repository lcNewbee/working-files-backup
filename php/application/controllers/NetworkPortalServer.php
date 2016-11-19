<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class NetworkPortalServer extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
    $query=$this->db->select('portal_id,portal_name,attr_name,attr_value')
              ->from('portal_server')
              ->join('portal_auth','portal_auth.id=portal_server.portal_id')
              ->join('portalserver_attr','portalserver_attr.id=portalserver_params.attr_id')
              ->join('portalserver_params','portal_server.id=portalserver_params.portalserver_id')
              ->get()->result_array();
		$state=array(
				      'code'=>2000,
				      'msg'=>'OK'
				    );
		$keyname=array(
				      "id"=>"id",
				      "template_name"=>"template_name",
				      "address_type"=>"address_type",
				      "server_ip"=>"server_ipaddr",
				      "server_port"=>"server_port",
				      "server_key"=>"server_key",
				      "redirect_url"=>"server_url",
				      "ac_ip"=>"ac_ip",
				    );
		// 		定义一个临时接口数组
		$server_data = array();
		foreach($query as $v){
			$server_data[$v['portal_id']]['id'] = $v['portal_id'];
		  $server_data[$v['portal_id']]['template_name'] = $v['portal_name'];
			$server_data[$v['portal_id']][$v['attr_name']]= $v['attr_value'];
			foreach($keyname as $k1=>$v1)
									        {
				if($k1==$v['attr_name'])
												         {
					unset($server_data[$v['portal_id']][$v['attr_name']]);
					$server_data[$v['portal_id']][$v1]=$v['attr_value'];
				}
			}
    }
		//array_values是为了让portal_id也成为数组属性,重新赋值给接口数组
  	$server_data=array_values($server_data);
		$result=array(
						      'state'=>$state,
						      'data'=>array(
						      'list'=>$server_data
						      )
						    );
		return $result;
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
    function getCgiParam($oriData) {
      $retData = array(
        'template_name'=>element('template_name', $oriData),
        'auth_accesstype'=>element('address_type', $oriData),
        'server_ipaddr'=>element('server_ipaddr', $oriData),
        'server_port'=>element('server_port', $oriData),
        'server_key'=>element('server_key', $oriData),
        'server_url'=>element('server_url', $oriData),
        'ac_ip'=>element('ac_ip', $oriData)
      );
      return $retData;
    }
		if ($actionType === 'add') {
			$temp_data=getCgiParam($data);
      $result=portal_add_template_name(json_encode($temp_data));

		}
		elseif($actionType === 'edit') {
    	$temp_data=getCgiParam($data);
      $result=portal_edit_template_name(json_encode($temp_data));
		}
    elseif($actionType === 'delete'){
      $temp_data=array(
        'portal_list'=>$data['selectedList']
      );
      $state=portal_del_template_name(json_encode($temp_data));
       $result=$state;
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
