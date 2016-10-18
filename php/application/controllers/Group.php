<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class Group extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$apGroups=$this->db->select('id,group_name,remark')
            ->from('ap_group')
            ->get()->result_array();
    $retList=array();

    foreach($apGroups as $group) {
      $groupItem=array(
        'groupname'=>element('group_name', $group),
        'remark'=>element('remark', $group, ''),
        'id'=>element('id', $group)
      );
      $aps = $this->db->select('group_id='.element('id', $group))
            ->from('ap_list')
            ->get()->result_array();
      $groupItem['apNum'] = sizeof($aps);

      array_push($retList, $groupItem);
    }
		$result=array(
      'state'=>array(
        'code'=>2000,
        'msg'=>'OK'
      ),
      'data'=>array(
        'list'=>$retList
      )
    );
		return $result;
	}

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
    function getCgiParam($oriData) {
      $retData = array(
        'groupname'=>element('groupname', $oriData),
        'remark'=>element('remark', $oriData),
        'groupid'=>element('id', $oriData)
      );

      return $retData;
    }

		if ($actionType === 'add') {
			$temp_data=getCgiParam($data);
      //$result=json_encode($temp_data);
      $result=acwlan_add_apgroup(json_encode($temp_data));
		}
		elseif($actionType === 'edit') {
    	$temp_data=getCgiParam($data);
      $result=axc_modify_apgroup(json_encode($temp_data));
		}
    elseif($actionType === 'delete'){
      $selectList=element('selectedList', $data, array());
      foreach($selectList as $item) {
        $deleteItem = getCgiParams($item);
				$result=axc_del_apgroup(json_encode($deleteItem));
			}
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
