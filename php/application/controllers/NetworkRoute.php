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
			$keys=array("destnet","gateway","mask");
			$a1=array_fill_keys($keys,'0');
			$a1['destnet']=$data['targetAddress'];
			$a1['gateway']=$data['nextHopIp'];
			$a1['mask']=$data['targetMask'];
			$result=acnetmg_add_route(json_encode($a1));
		}
		elseif($actionType === 'edit') {
			$keys=array("id","destnet","gateway","mask");
			$a1=array_fill_keys($keys,'0');
      $a1['id']=$data['id'];
			$a1['destnet']=$data['targetAddress'];
			$a1['gateway']=$data['nextHopIp'];
			$a1['mask']=$data['targetMask'];
			$result=acnetmg_update_route(json_encode($a1));
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
