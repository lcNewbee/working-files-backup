<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class WirelessTimer extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch($data){
      $result=axc_get_wireless_timer_policy(json_encode($data));
      return $result;
  }

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {
      $result=axc_add_wireless_timer_policy(json_encode($data));
		}
		elseif($actionType === 'edit') {
      $result=axc_modify_wireless_timer_policy(json_encode($data));
		}
    elseif($actionType === 'delete'){
       $result=axc_del_wireless_timer_policy(json_encode($data));
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