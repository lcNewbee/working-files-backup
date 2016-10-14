<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class NetworkDhcp extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$query=$this->db->select('pool_id,pool_name,attr_name,attr_value')
              ->from('pool_params')
              ->join('pool_attr','pool_attr.id=pool_params.attr_id')
              ->join('pool_list','pool_list.id=pool_params.pool_id')
              ->get()->result_array();
		$state=array(
				      'code'=>2000,
				      'msg'=>'OK'
				    );

		$keyname=array(
				      "domain"=>"domain",
				      "ipaddr"=>"startIp",
				      "netmask"=>"mask",
				      "route"=>"gateway",
				      "dns1"=>"mainDns",
				      "dns2"=>"secondDns",
				      "lease"=>"releaseTime",
				      "opt43"=>"opt43",
				      "opt60"=>"opt60",
				      "vlan"=>"vlan"
				    );
		// 		定义一个临时接口数组
		$interfaces  = array();
		foreach($query as $v){
			$interfaces[$v['pool_id']]['id'] = $v['pool_id'];
			$interfaces[$v['pool_id']]['name'] = $v['pool_name'];
			$interfaces[$v['pool_id']][$v['attr_name']]= $v['attr_value'];
			foreach($keyname as $k1=>$v1)
									        {
				if($k1==$v['attr_name'])
												         {
					unset($interfaces[$v['pool_id']][$v['attr_name']]);
					$interfaces[$v['pool_id']][$v1]=$v['attr_value'];
				}
			}
			//删除多余元素
			unset($interfaces[$v['pool_id']]['opt43']);
			unset($interfaces[$v['pool_id']]['opt60']);
			unset($interfaces[$v['pool_id']]['vlan']);
		}
		;
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
        'pool_name'=>element('name', $oriData),
        'pool_ipaddr'=>element('startIp', $oriData),
        'pool_mask'=>element('mask', $oriData),
        'pool_lease'=>element('releaseTime', $oriData),
        'pool_route'=>element('gateway', $oriData),
        'pool_domain'=>element('domain', $oriData),
        'pool_dns1'=>element('mainDns', $oriData),
        'pool_dns2'=>element('secondDns', $oriData)
      );

      return $retData;
    }

		if ($actionType === 'add') {
			$temp_data=getCgiParam($data);
      //$result=json_encode($temp_data);
      $result=dhcpd_add_pool_name(json_encode($temp_data));
		}
		elseif($actionType === 'edit') {
    	$temp_data=getCgiParam($data);
      $result=dhcpd_edit_pool_name(json_encode($temp_data));
		}
    elseif($actionType === 'delete'){
      $arr=$data['selectedList'];
      $pool_list_arr=str_replace("dhcp_name_","pool_name",$arr);
       $temp_data=array(
        'pool_list'=>$pool_list_arr
       );
      $state=dhcpd_del_pool_name(json_encode($temp_data));
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
