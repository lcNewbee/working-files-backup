<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class ApRadio extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
		$this->load->model('group/ApRadio_Model');
	}
	public function radio() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
			echo $result;
		}
	}
	public function base() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->ApRadio_Model->set_ap_name($data);
			echo $result;
		} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
		}
	}
	function fetch() {
		$result = array();
		$result = $this->ApRadio_Model->get_apradio_info($_GET);
		echo json_encode($result);		
	}
	
	function onAction($data) {
		$result = null;
		$actionType = element('action',$data,'');
		switch($actionType) {
			case 'setting' : $result = $this->ApRadio_Model->set_apradio($data);
				break;							
			default : $result = $this->ApRadio_Model->set_def_apradio($data);
				break;
		}
		return $result;
	}
	
}
