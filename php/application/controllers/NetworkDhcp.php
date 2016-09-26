<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class NetworkDhcp extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
	}
	public function network() {
		$query=$this->db->select('pool_id,pool_name,attr_name,attr_value')
												    ->from('pool_params')
												    ->join('pool_attr','pool_attr.id=pool_params.attr_id')
												    ->join('pool_list','pool_list.id=pool_params.pool_id')
												    ->get()->result_array();
    // 是否返回数据成功
    // $num_results=cout($query);
    // if($num_results!==0)
    // {
    //     $state=array(
    //     'code' => 2000,
    //     'msg' => 'ok'
    //   );
    // }
    $keyname=array(
     "ipaddr"=>"startIp",
     "netmask"=>"netmask",
     "lease"=>"releaseTime",
     "route"=>"gateway",
     "dns1"=>"mainDns",
     "dns2"=>"secondDns",
     "domain"=>"domain",
     "opt43"=>"opt43",
     "opt60"=>"opt60",
     "vlan"=>"vlan");
    $tmp_arr = array();
    foreach($query as $v){
        $tmp_arr[$v['pool_id']]['id'] = $v['pool_id'];
    		$tmp_arr[$v['pool_id']]['name'] = $v['pool_name'];
        $tmp_arr[$v['pool_id']][$v['attr_name']]= $v['attr_value'];
        foreach($keyname as $k1=>$v1)
        {
         if($k1==$v['attr_name'])
         {
           unset($tmp_arr[$v['pool_id']][$v['attr_name']]);
          $tmp_arr[$v['pool_id']][$v1]=$v['attr_value'];
         }
     }
    //删除多余元素
     unset($tmp_arr[$v['pool_id']]['opt43']);
     unset($tmp_arr[$v['pool_id']]['opt60']);
     unset($tmp_arr[$v['pool_id']]['vlan']);
     };
    $array_dhcp=array_values($tmp_arr);
    $data=array(
       'list'=>'$array_dhcp'
    );
    // $result=array(
    //     'state'=>$state,
    //     'data'=>$data
    // );
		echo json_encode($data);
	}
}


