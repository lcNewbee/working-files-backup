<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class NetworkRoute extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$query=$this->db->select('id,destnet,netmask,gateway')
																				    ->from('route_table')
																			    ->get()->result_array();

    $newArray=null;
    $keys = array(
      'id'=>'id',
      'destnet'=> 'targetAddress',
      'netmask'=>'targetMask',
      'gateway'=>'nextHopIp');


    if ($query !== null) {
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

      $result=array(
        'state'=>$state,
        'data'=>array(
          'list'=>$newArray
        )
      );
    } else {
      $result=array(
        'state'=>$state,
        'data'=>array(
          'list'=>'[]'
        )
      );
    }

		return $result;
	}
	function onAction($data) {
		$result = '';
		$actionType = element('action', $data);
    $selectList = element('selectedList', $data);

		if ($actionType === 'add') {
      $retData = array(
        'destnet'=>element('targetAddress', $data),
        'gateway'=>element('nextHopIp', $data),
        'mask'=>element('targetMask', $data),
      );
			$result=acnetmg_add_route(json_encode($retData));
		}
		elseif($actionType === 'edit') {
      $retData = array(
        'id'=>element('id', $data),
        'destnet'=>element('targetAddress', $data),
        'gateway'=>element('nextHopIp', $data),
        'mask'=>element('targetMask', $data),
      );
			$result=acnetmg_update_route(json_encode($retData));
		}
		elseif($actionType === 'delete'){
      foreach($selectList as $item) {
        $deleteItem=array(
          'id'=>element('id', $item),
          'destnet'=>element('targetAddress', $item),
          'gateway'=>element('nextHopIp', $item),
          'mask'=>element('targetMask', $item)
        );
        $result=acnetmg_del_route(json_encode($deleteItem));
      }
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
		elseif($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
      echo json_encode($result, true);
		}
	}
}
