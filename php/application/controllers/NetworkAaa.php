<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class NetworkAaa extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$query=$this->db->select('domain_id,domain_id,attr_name,attr_value')
              ->from('domain_params')
              ->join('domain_list','domain_list.id=domain_params.domain_id')
              ->join('domain_attr','domain_attr.id=domain_params.attr_id')
              ->get()->result_array();
		$state=array(
				      'code'=>2000,
				      'msg'=>'OK'
				    );

		$keyname=array(
				      "template_name"=>"radius_name",
				      "auth_access_type"=>"auth_accesstype",
				      "auth_scheme_type"=>"auth_schemetype"
				    );
		// 		定义一个临时接口数组
		$interfaces  = array();
		foreach($query as $v){
			$interfaces[$v['domain_id']]['id'] = $v['domain_id'];
			$interfaces[$v['domain_id']]['template_name'] = $v['domain_name'];
			$interfaces[$v['domain_id']][$v['attr_name']]= $v['attr_value'];
			foreach($keyname as $k1=>$v1)
									        {
				if($k1==$v['attr_name'])
												         {
					unset($interfaces[$v['domain_id']][$v['attr_name']]);
					$interfaces[$v['domain_id']][$v1]=$v['attr_value'];
				}
			}
		//array_values是为了让pool_id也成为数组属性,重新赋值给接口数组
		$interfaces_data=array_values($interfaces);
		$result=array(
						      'state'=>$state,
						      'data'=>array(
						      'list'=>$interfaces_data
						      )
						    );
		return $result;
	}

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
    function getCgiParam($oriData) {
      $retData = array(
        'domain_id'=>element('id', $oriData),
        'domain_name'=>element('template_name', $oriData),
        'template_name'=>element('radius_name', $oriData),
        'auth_scheme_type'=>element('auth_accesstype', $oriData),
        'auth_scheme_type'=>element('auth_schemetype', $oriData),
      );
      return $retData;
    }

		if ($actionType === 'add') {
			$temp_data=getCgiParam($data);
      $result=aaa_add_template_name(json_encode($temp_data));
		}
		elseif($actionType === 'edit') {
    	$temp_data=getCgiParam($data);
      $result=aaa_edit_template_name(json_encode($temp_data));
		}
    elseif($actionType === 'delete'){
      $arr=$data['selectedList'];
      $pool_list_arr=str_replace("radius_name","template_name",$arr);
       $temp_data=array(
        'aaa_list'=>$pool_list_arr
       );
      $state=aaa_del_template_name(json_encode($temp_data));
       $result=$state;
    }

		return $result;
	}
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
