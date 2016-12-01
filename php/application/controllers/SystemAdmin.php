<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemAdmin extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
		$this->load->model('system/SystemAdmin_Model');
	}
	function fetch() {
        $retdata = array(
            'page' => (int)element('page', $_GET, -1), 
            'size' => (int)element('size', $_GET, -1));

		return $this->SystemAdmin_Model->get_account_list($retdata);
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {
			$result = $this->SystemAdmin_Model->add_account($data);
		} elseif ($actionType === 'edit') {
			$result = $this->SystemAdmin_Model->up_account($data);
		} elseif ($actionType === 'delete') {
            $result = $this->SystemAdmin_Model->del_account($data);
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
