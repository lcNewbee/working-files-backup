<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class WirelessAcl extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
    $query_server=$this->db->select('id,template_name,server_type,server_pri,attr_id，attr_name,attr_value')
              ->from('radius_template')
              ->join('radius_server','radius_template.id=radius_server.template_id')
              ->join('server_params','radius_server.id=server_params.server_id')
              ->join('server_attr','server_attr.id=server_params.attr_id')
              ->get()->result_array();

    $query_template=$this->db->select('id,attr_name,attr_value')
              ->from('radius_template')
              ->join('template_params','radius_template.id=template_params.template_id')
              ->join('template_attr','template_attr.id=template_params.attr_id')
              ->get()->result_array();
    $temp_query_server=array();
    foreach($query_server as $v){
     if($v['server_type']==0&&$v['server_pri']==0&&$v['attr_id']==1){
          $query_server['attr_name']=authpri_ipaddr;
     }
    elseif($v['server_type']==0&&$v['server_pri']==0&&$v['attr_id']==2){

    }

			$temp_query_template[$v['id']]['id'] = $v['id'];
      $temp_query_template[$v['id']]['template_name'] = $v['template_name'];
      $temp_query_template[$v['id']]['server_type'] = $v['server_type'];
      $temp_query_template[$v['id']]['server_pri'] = $v['server_pri'];
		  $temp_query_template[$v['id']][$v['attr_name']] = $v['attr_value'];
		}
    //array_values是为了让pool_id也成为数组属性,重新赋值给接口数组
		$temp_query_template=array_values($temp_query_template);
    $temp_query_template=array();
    foreach($query_template as $v){
			$temp_query_template[$v['id']]['id'] = $v['id'];
		  $temp_query_template[$v['id']][$v['attr_name']] = $v['attr_value'];
		}
    //array_values是为了让pool_id也成为数组属性,重新赋值给接口数组
		$temp_query_template=array_values($temp_query_template);

		$state=array(
				      'code'=>2000,
				      'msg'=>'OK'
				    );
  }

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {

		}
		elseif($actionType === 'edit') {

		}
    elseif($actionType === 'delete'){

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
      echo $result;
		}
	}
}
