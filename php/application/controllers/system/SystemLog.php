<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class SystemLog extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
		$this->load->model('system/Log_Model');
	}
	function fetch() {
		$retdata = array('page' => (int)element('page', $_GET, -1), 'size' => (int)element('size', $_GET, -1));
		return $this->Log_Model->get_log_list($retdata);
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'delete') {
			$result = $this->Log_Model->log_delete($data);
		} elseif ($actionType === 'setting') {
			$result = $this->Log_Model->log_cfg($data);
		}
		return $result;
	}
	public function index() {
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
	public function logdownload() {
		//download
		$this->load->helper('download');

    if (is_file("/var/log/messages")) {
      $data = file_get_contents("/var/netmanager/messages");
      $name = 'messages';
      force_download($name, $data);
    } else {
      echo 'File not exists';
    }
  }
}
