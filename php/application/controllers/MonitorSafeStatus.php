<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class MonitorSafeStatus extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch() {
		$retdata = array('groupid' => (int)element('groupid', $_GET, -1));
		$result = axc_get_safe(json_encode($retdata));
		return $result;
	}
	function onAction($data) {
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
