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
		$query=$this->db
      ->select('id,type,addr,nataddr')
      ->from('nat_table')
      ->get()->result_array();

    $settings=$this->db
      ->select('enable')
      ->from('natenable')
      ->get()->result_array();

		$keys = array(
      'id'=>'id',
      'type'=> 'ruleType',
      'addr'=>'sourceAddress',
      'nataddr'=>'conversionAddress'
    );
    $newArray = array();
    foreach($query as $key=>$val) {
      $newArray[$key] = array();
      foreach($val as $k=>$v) {
        $newArray[$key][$keys[$k]] = $v;
      }
    }
		$state=array(
      'code'=>2000,
      'msg'=>'OK'
    );
		$data=array(
      "settings"=>element(0, $settings),
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
    $selectList = element('selectedList', $data);

    function getCgiParams($oriData) {
      $ret = array(
        'id'=>element('id', $oriData),
        'type'=>element('ruleType', $oriData),
        'ipaddr'=>element('sourceAddress', $oriData),
        'natipaddr'=>element('conversionAddress', $oriData),
      );
      return $ret;
    }

		if ($actionType === 'add') {
			$cgiParams=getCgiParams($data);
			$state=acnetmg_add_nat(json_encode($cgiParams));
      $result=$state;
		}
		elseif($actionType === 'edit') {
			$cgiParams=getCgiParams($data);
			$state=acnetmg_update_nat(json_encode($cgiParams));
      $result=$state;
		}
		elseif($actionType === 'delete') {

      foreach($selectList as $item) {
        $deleteItem = getCgiParams($item);
				$result=acnetmg_del_nat(json_encode($deleteItem));
			}
		}
    elseif($actionType === 'setting'){
      $cgiParams = array(
        'enable'=>(int)element('enable', $data)
      );
			$state=acnetmg_nat_enable(json_encode($cgiParams));
      $result=$state;
		}
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
