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
            ->where('id >1')
            ->get()->result_array();
    $allGroup = $this->db->select('id')
        ->from('ap_list')
        ->get()->result_array();
    $retList=array();

    // 所有组
    array_push($retList, array(
      'groupname'=>'All Group',
      'remark'=>'',
      'apNum'=>sizeof($allGroup),
      'id'=>-100,
    ));

    foreach($apGroups as $group) {
      $groupItem=array(
        'groupname'=>element('group_name', $group),
        'remark'=>element('remark', $group, ''),
        'id'=>element('id', $group)
      );
      $aps = $this->db->select('group_id')
            ->from('ap_list')
            ->where('group_id', $groupItem['id'])
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
        'groupid'=>(int)element('id', $oriData, -1),
        'aplist'=>element('aplist', $oriData, -1)
      );
      return $retData;
    }
		if ($actionType === 'add') {
			$temp_data=getCgiParam($data);
      $result=axc_add_apgroup(json_encode($temp_data));

		}
		elseif($actionType === 'edit') {
    	$temp_data=getCgiParam($data);
      $result=axc_modify_apgroup(json_encode($temp_data));
		}
    elseif($actionType === 'deleteGroup'){
			$result=axc_del_apgroup(json_encode($data));
    }
    elseif($actionType === 'move') {
      $result=axc_aps_move_to_apgroup(json_encode($data));
    }
    elseif($actionType === 'deleteGroupAps') {
      $temp_data = array(
        'aplist'=>element('aplist', $data),
        'groupid'=>(int)element('groupid', $data, -1),
      );
      $result=axc_del_aptogroup(json_encode($temp_data));
    }
    elseif($actionType === 'groupApAdd'){
      $temp_data = array(
        'apmac'=>element('apmac', $data),
        'name'=>substr(element('name', $data),0,31),
        'model'=>element('model', $data),
        'groupid'=>(int)element('groupid', $data, -1),
      );
      if (element('type', $data) === 'auto') {
        $temp_data = array(
          'groupid'=>(int)element('groupid', $data, -1),
          'autoaplist'=>element('aplist', $data),
        );
      }
      $q = $this->db->select('name')
        ->from('ap_list')
        ->where('name', element('name', $data))
        ->get()->result_array();

      $q_mac=$this->db->select('mac')
        ->from('ap_list')
        ->where('mac', element('apmac', $data))
        ->get()->result_array();

      if (sizeof($q)> 0){
      	$result=array(
           'state'=>array(
           'code'=>6000,
           'msg'=>'the apname is not availble!'
           )
        );
        $result = json_encode($result);
      } elseif(sizeof($q_mac) > 0){
        $result=array(
           'state'=>array(
           'code'=>6001,
           'msg'=>'mac is not availble!'
           )
        );
        $result = json_encode($result);
      } else {
        $result=axc_add_aptogroup(json_encode($temp_data));
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
		else if($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
      echo json_encode($result);
		}
	}
}
