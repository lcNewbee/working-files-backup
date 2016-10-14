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
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {
			$temp_data=array(
			  'pool_name'=>'test',
			  'pool_ipaddr'=>'test',
			  'pool_mask '=>' test',
			  'pool_lease'=>'test',
			  'pool_route'=>'test',
			  'pool_domain'=>'test',
			 ' pool_dns1'=>'test',
			  'pool_dns2'=>'test'
			        );
       $temp_data['pool_name']=$data['name'];
       $temp_data['pool_ipaddr']=$data['startIp'];
       $temp_data['pool_mask']=$data['netmask'];
       $temp_data['pool_lease']=$data['releaseTime'];
       $temp_data['pool_route']=$data['gateway'];
       $temp_data['pool_domain']=$data['domain'];
       $temp_data['pool_dns1']=$data['mainDns'];
       $temp_data['pool_dns2']=$data['secondDns'];
			$state=dhcpd_add_pool_name(json_encode($temp_data));
      $result=$state;
		}
		elseif($actionType === 'edit') {
    		$temp_data=array(
			  'pool_name'=>'test',
			  'pool_ipaddr'=>'test',
			  'pool_mask '=>' test',
			  'pool_lease'=>'test',
			  'pool_route'=>'test',
			  'pool_domain'=>'test',
			 ' pool_dns1'=>'test',
			  'pool_dns2'=>'test'
			        );
       $temp_data['pool_name']=$data['name'];
       $temp_data['pool_ipaddr']=$data['startIp'];
       $temp_data['pool_mask']=$data['netmask'];
       $temp_data['pool_lease']=$data['releaseTime'];
       $temp_data['pool_route']=$data['gateway'];
       $temp_data['pool_domain']=$data['domain'];
       $temp_data['pool_dns1']=$data['mainDns'];
       $temp_data['pool_dns2']=$data['secondDns'];

			$state=dhcpd_edit_pool_name(json_encode($temp_data));
       $result=$state;
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
