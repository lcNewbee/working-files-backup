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
      "netmask"=>"netmask",
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
    $state=array(
          'code'=>4000,
          'msg'=>'OK'
        );
    $result = null;
    $actionType = element('action', $data);
    if ($actionType === 'add') {
     $arr = array();

      // $this->db->where(字段名，字段值)
      // $this->db->delete(表名)
      $state = dhcpd_del_pool_name(s);
      $result=array(
          'state'=>$state
      );
    }
    else {
      $result=array(
              'state'=>$state,
              'data'=>element('action', $data, '')
            );
    }

    return $result;
  }

  public function index() {
    $result = null;

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      $data = json_decode(file_get_contents("php://input"), true);
      $result = $this->onAction($data);
    }
    else if($_SERVER['REQUEST_METHOD'] == 'GET') {
      $result = $this->fetch();
    }

    echo json_encode($result);
  }
}
