<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class NetworkRadius extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$query_server=$this->db->select('template_id,template_name,server_type,server_pri,attr_id,attr_name,attr_value')
								              ->from('radius_template')
								              ->join('radius_server','radius_template.id=radius_server.template_id')
								              ->join('server_params','radius_server.id=server_params.server_id')
								              ->join('server_attr','server_attr.id=server_params.attr_id')
								              ->get()->result_array();

		$query_template=$this->db->select('template_id,attr_name,attr_value')
								    		->from('radius_template')
								    		->join('template_params','radius_template.id=template_params.template_id')
								    		->join('template_attr','template_attr.id=template_params.attr_id')
								    		->get()->result_array();
		$temp_query_template=array();
		foreach($query_template as $v){
			$temp_query_template[$v['template_id']]['id'] = $v['template_id'];
			$temp_query_template[$v['template_id']][$v['attr_name']] = $v['attr_value'];
    }
		// 		array_values是为了让pool_id也成为数组属性,重新赋值给接口数组
				$temp_query_template=array_values($temp_query_template);

		$temp_query_server=array();
		foreach($query_server as $v){
			if($v['server_type']==0&&$v['server_pri']==0&&$v['attr_id']==1){
				$v['attr_name']="authpri_ipaddr";
			}
			elseif($v['server_type']==0&&$v['server_pri']==0&&$v['attr_id']==2){
				$v['attr_name']="authpri_port";
			}
			elseif($v['server_type']==0&&$v['server_pri']==0&&$v['attr_id']==3){
				$v['attr_name']="authpri_key";
			}
			elseif($v['server_type']==0&&$v['server_pri']==1&&$v['attr_id']==1){
				$v['attr_name']="authsecond_ipaddr";
			}
			elseif($v['server_type']==0&&$v['server_pri']==1&&$v['attr_id']==2){
				$v['attr_name']="authsecond_port";
			}
			elseif($v['server_type']==0&&$v['server_pri']==1&&$v['attr_id']==3){
				$v['attr_name']="authsecond_key";
			}
			elseif($v['server_type']==1&&$v['server_pri']==0&&$v['attr_id']==1){
				$v['attr_name']="acctpri_ipaddr";
			}
			elseif($v['server_type']==1&&$v['server_pri']==0&&$v['attr_id']==2){
				$v['attr_name']="acctpri_port";
			}
			elseif($v['server_type']==1&&$v['server_pri']==0&&$v['attr_id']==3){
				$v['attr_name']="acctpri_key";
			}
			elseif($v['server_type']==1&&$v['server_pri']==1&&$v['attr_id']==1){
				$v['attr_name']="acctsecond_ipaddr";
			}
			elseif($v['server_type']==1&&$v['server_pri']==1&&$v['attr_id']==2){
				$v['attr_name']="acctsecond_port";
			}
			elseif($v['server_type']==1&&$v['server_pri']==1&&$v['attr_id']==3){
				$v['attr_name']="acctsecond_key";
			}
			$temp_query_server[$v['template_id']]['id'] = $v['template_id'];
			$temp_query_server[$v['template_id']]['template_name'] = $v['template_name'];
			$temp_query_server[$v['template_id']][$v['attr_name']] = $v['attr_value'];
		}
		// 		array_values是为了让pool_id也成为数组属性,重新赋值给接口数组
		$temp_query_server=array_values($temp_query_server);
    function merginData($v, $w) {
      $list_data = array_merge($v, $w);
      $temp_data=array(
        "id"=>element('id',$list_data,'' ),
        "template_name"=>element('template_name',$list_data,''),
        "authpri_ipaddr"=>element("authpri_ipaddr",$list_data,'' ),
        "authpri_port"=>element("authpri_port",$list_data,'' ),
        "authpri_key"=>element("authpri_key",$list_data,'' ),
        "authsecond_ipaddr"=>element("authsecond_ipaddr",$list_data ,''),
        "authsecond_port"=>element("authsecond_port",$list_data,'' ),
        "authsecond_key"=>element("authsecond_key",$list_data,'' ),
        "acctpri_ipaddr"=>element("acctpri_ipaddr",$list_data,'' ),
        "acctpri_port"=>element("acctpri_port",$list_data,'' ),
        "acctpri_key"=>element("acctpri_key",$list_data,'' ),
        "acctsecond_ipaddr"=>element("acctsecond_ipaddr",$list_data,'' ),
        "acctsecond_port"=>element("acctsecond_port",$list_data,'' ),
        "acctsecond_key"=>element("acctsecond_key",$list_data,'' ),
        "accton_enable"=>element("accton_enable",$list_data ,''),
        "accton_sendtimes"=>element("accton_sendtimes",$list_data ,''),
        "accton_sendinterval"=>element("accton_sendinterval",$list_data ,''),
        "quiet_time"=>element("quiettime",$list_data ,''),
        "resp_time"=>element("resptime",$list_data ,''),
        "retry_times"=>element("retrytimes",$list_data ,''),
        "acct_interim_interval"=>element("acct_interim_interval",$list_data ,''),
        "realretrytimes"=>element("acct_realretrytimes",$list_data ,''),
        "username_format"=>element("username_format",$list_data ,'')
      );
    if($temp_data['accton_enable']=="enable"){
        $temp_data['accton_enable']="1";
    }else{
        $temp_data['accton_enable']="0";
    }
        return $temp_data;
    }
    $data = array_map('merginData', $temp_query_server, $temp_query_template);

		$state=array(
												'code'=>2000,
												'msg'=>'OK'
												);
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
    function getCgiParams($oriData) {
      $ret = array(
        "id"=>(string)element('id',$oriData,'' ),
        "template_name"=>(string)element('template_name',$oriData,''),
        "authpri_ipaddr"=>(string)element("authpri_ipaddr",$oriData,'' ),
        "authpri_port"=>(string)element("authpri_port",$oriData,'' ),
        "authpri_key"=>(string)element("authpri_key",$oriData,'' ),
        "authsecond_ipaddr"=>(string)element("authsecond_ipaddr",$oriData ,''),
        "authsecond_port"=>(string)element("authsecond_port",$oriData,'' ),
        "authsecond_key"=>(string)element("authsecond_key",$oriData,'' ),
        "acctpri_ipaddr"=>(string)element("acctpri_ipaddr",$oriData,'' ),
        "acctpri_port"=>(string)element("acctpri_port",$oriData,'' ),
        "acctpri_key"=>(string)element("acctpri_key",$oriData,'' ),
        "acctsecond_ipaddr"=>(string)element("acctsecond_ipaddr",$oriData,'' ),
        "acctsecond_port"=>(string)element("acctsecond_port",$oriData,'' ),
        "acctsecond_key"=>(string)element("acctsecond_key",$oriData,'' ),
        "accton_enable"=>(string)element("accton_enable",$oriData ,''),
        "accton_sendtimes"=>(string)element("accton_sendtimes",$oriData ,''),
        "accton_sendinterval"=>(string)element("accton_sendinterval",$oriData ,''),
        "quiet_time"=>(string)element("quiet_time",$oriData ,''),
        "resp_time"=>(string)element("resp_time",$oriData ,''),
        "retry_times"=>(string)element("retry_times",$oriData ,''),
        "acct_interim_interval"=>(string)element("acct_interim_interval",$oriData ,''),
        "realretrytimes"=>(string)element("realretrytimes",$oriData ,''),
        "username_format"=>(string)element("username_format",$oriData ,'')
      );


      return $ret;
    }
		if ($actionType === 'add') {
      $temp=getCgiParams($data);
			$result=radius_add_template_name(json_encode($temp));
		}
		elseif($actionType === 'edit') {
      $temp=getCgiParams($data);
      // $result=json_encode($temp);
			$result=radius_edit_template_name(json_encode($temp));
		}
		elseif($actionType === 'delete'){
			$retdata=array(
				 "radius_list"=>$data["selectedList"]
												      );
			$result=radius_del_template_name(json_encode($retdata));
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
