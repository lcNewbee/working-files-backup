<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class MonitorApsRadio extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->helper('array');
		$this->load->model('group/MonitorApsRadio_Model');
	}
	public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
			echo $result;
		}
	}
	function fetch() {
		return $this->MonitorApsRadio_Model->get_list($_GET);
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		switch ($actionType) {
			case 'setting': $result = $this->MonitorApsRadio_Model->settings($data);
			    break;			
			default: $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
			    break;
		}
		return $result;
	}
}
