<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Login extends CI_Controller {
	public function __construct() {
		parent::__construct();		
		$this->load->helper('array');
		$this->load->model('system/Login_Model');
	}
	public function index() {
		$url = '/index.html';
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->Login_Model->user_load($data);
			echo json_encode($result);
		} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
			echo '<META HTTP-EQUIV="Refresh" CONTENT="0;URL=' . $url . '">';
		} else {
			echo '<META HTTP-EQUIV="Refresh" CONTENT="0;URL=' . $url . '">';
		}
	}
}
