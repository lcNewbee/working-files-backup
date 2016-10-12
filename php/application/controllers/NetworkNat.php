<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class NetworkNat extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$query=$this->db->select('id,type,addr,nataddr')
																				    ->from('nat_table')
																				    ->get()->result_array();
		$keys = array(
      'id'=>'id',
      'type'=> 'ruleType',
       'addr'=>'sourceAddress',
       'nataddr'=>'conversionAddress');
    foreach($query as $key=>$val)
   {
    $newArray[$key] = array();
    foreach($val as $k=>$v)
    {
        $newArray[$key][$keys[$k]] = $v;
    }
}
		$state=array(
      'code'=>2000,
      'msg'=>'OK'
    );
		$data=array(
      "settings"=>array("enable"=> "1"),
      'list'=> $newArray
    );
		$result=array(
		      'state'=>$state,
		      'data'=>$data
		    );
		return 	$result;
	}

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {
			$keys=array("type","addr","nataddr");
			$a1=array_fill_keys($keys,'0');
			$a1['type']=$data['ruleType'];
			$a1['ipaddr']=$data['sourceAddress'];
			$a1['natipaddr']=$data['conversionAddress'];
			$state=acnetmg_add_nat(json_encode($a1));
      $result=$state;
		}
		elseif($actionType === 'edit') {
			$keys=array("id","type","ipaddr","natipaddr");
			$a1=array_fill_keys($keys,'0');
      $a1['id']=$data['id'];
			$a1['type']=$data['ruleType'];
			$a1['ipaddr']=$data['sourceAddress'];
			$a1['natipaddr']=$data['conversionAddress'];
			$state=acnetmg_update_nat(json_encode($a1));
      $result=$state;
		}
		elseif($actionType === 'delete'){
      $keys=array("id","type","ipaddr","natipaddr");
			$a1=array_fill_keys($keys,'0');
      $a1['id']=$data['id'];
			$a1['type']=$data['ruleType'];
			$a1['ipaddr']=$data['sourceAddress'];
			$a1['natipaddr']=$data['conversionAddress'];
			$state=acnetmg_del_nat(json_encode($a1));
      $result=$state;
		}
    	elseif($actionType === 'setting'){
      $keys = array( 'enable');
      $a1=array_fill_keys($keys,'0');
      $a1['enable']=$data['enable'];
			$state=acnetmg_del_nat(json_encode($a1));
      $result=$state;
		}
		;
		return 	$result;
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
