<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class WirelessAcl extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch($data){
      $result=axc_get_wireless_acl(json_encode($data));
      return $result;
  }

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {
      $result=axc_set_wireless_acl(json_encode($data));
		}
		elseif($actionType === 'edit') {
      $result=axc_set_wireless_acl(json_encode($data));
		}
    elseif($actionType === 'delete'){
    $temp_data=array(
    'groupid'=>element('groupid', $data),
    'mac'=>element('mac',$data['selectedList'])
    );
       $result=axc_del_wireless_acl(json_encode($temp_data));
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
			$result = $this->fetch($data);
      echo json_encode($result);
		}
	}
}
