<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class NetwirkDashboard extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
		$this->load->model('network/NetwirkDashboard_Model');
	}
	function fetch() {
		return $this->NetwirkDashboard_Model->get_list($_GET);
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {
			$result = $this->NetwirkDashboard_Model->add($data);
		} elseif ($actionType === 'edit') {
			$result = $this->NetwirkDashboard_Model->exit($data);
		} elseif ($actionType === 'delete') {
            $result = $this->NetwirkDashboard_Model->delete($data);
		}
		return $result;
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
}
