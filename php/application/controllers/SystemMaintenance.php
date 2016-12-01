<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemMaintenance extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');		
		//$this->load->model('system/Log_Model');
	}
	function fetch() {
        /*
		$retdata = array('page' => (int)element('page', $_GET, -1), 'size' => (int)element('size', $_GET, -1));
		return $this->Log_Model->get_log_list($retdata);
        */
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
    public function backup() {
        //系统备份        
        //copy('/var/run/config.db','/var/conf/config.db');
        exec('cp /var/run/config.db /var/conf/config.db');
    }
    public function reboot() {
        //重启系统
        exec('/sbin/reboot');
    }
    public function restore() {
        //恢复出厂设置
    }
}
