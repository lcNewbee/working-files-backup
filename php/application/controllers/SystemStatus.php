<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class SystemStatus extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
		$this->load->model('system/SystemStatus_Model');
	}
	
	function fetch(){
		return $this->SystemStatus_Model->get_ststemstatus();
	}

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {
			$result = axc_add_wireless_timer_policy(json_encode($data));
		} elseif ($actionType === 'edit') {
			$result = axc_modify_wireless_timer_policy(json_encode($data));
		} elseif ($actionType === 'delete') {
			$result = axc_del_wireless_timer_policy(json_encode($data));
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
      echo $result;
		}
	}
}
