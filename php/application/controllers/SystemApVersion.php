<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemApVersion extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$query=$this->db->select('id,name,subversion')
              ->from('ap_firmware')
              ->get()->result_array();
   $keys = array(
      'id'=>'id',
      'name'=> 'model',
      'subversion'=>'softVersion'
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
    $page=array(
    "start"=>(int) element('start',$_GET,1),
    "size"=> (int)element('size',$_GET,20),
    "currPage"=>(int)element('currPage',$_GET,1),
    "totalPage"=>(int)element('totalPage',$_GET,1),
    "total"=>(int)element('total',$_GET,11),
    "pageCount"=>(int)element('pageCount',$_GET,11),
    "nextPage"=>(int)element('nextPage',$_GET,-1),
    "lastPage"=>(int)element('lastPage',$_GET,1)
    );

		$result=array(
						      'state'=>$state,
						      'data'=>array(
                  'page'=>$page,
						      'list'=>$newArray
						      )
						    );
		return $result;
	}

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
    function getCgiParam($oriData) {
      $retData = array(
        'vendor'=>element('vendor',$oriData,48208),
        'model'=>element('model', $oriData),
        'hardware'=>element('hardware', $oriData,''),
        'radionum'=>element('radionum', $oriData),
        'vendor'=>element('vendor', $oriData),
      );
      return $retData;
    }

		if ($actionType === 'add') {
			$temp_data=getCgiParam($data);
      // $result=json_encode($temp_data);
      $result=axc_add_apfirmware(json_encode($temp_data));
		}

     elseif($actionType === 'active'){
     $temp_data=getCgiParam($data);
    $result=axc_active_apfirmware(json_encode($temp_data));
    }

    elseif($actionType === 'delete'){
      $temp_data=array(
        'name'=>element('name',$data['selectedList']),
       );
      $state=axc_del_apfirmware(json_encode($temp_data));
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
       $data = json_decode(file_get_contents("php://input"), true);
			$result = $this->fetch();
      echo json_encode($result);
		}
	}
}
