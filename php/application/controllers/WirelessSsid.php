<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class WirelessSsid extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch($data){
      $result=axc_get_wireless_ssid(json_encode($data));
      return $result;
  }

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
    function getCgiParam($oriData) {
      unset ($oriData['nasId']);
      unset ($oriData['compulsoryAuth']);
      unset ($oriData['maxSsidUsers']);
      unset ($oriData['qosType']);
      return $oriData;
    }

		if ($actionType === 'add') {
			$temp_data=getCgiParam($data);
      $result=axc_add_wireless_ssid(json_encode($temp_data));
		}
		elseif($actionType === 'edit') {
    	$temp_data=getCgiParam($data);
      $result=axc_modify_wireless_ssid(json_encode($temp_data));
		}
    elseif($actionType === 'delete'){
       $temp_data=array(
        'groupid'=>element('groupid',$data),
        'ssid'=>element('ssid',$data['selectedList']),
       );
      $state=axc_del_wireless_ssid(json_encode($temp_data));
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
			$result = $this->fetch($data);
      echo json_encode($result);
		}
	}
}
