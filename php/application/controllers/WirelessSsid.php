<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class WirelessSsid extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
        $this->load->model('group/WirelessSsid_Model');
	}
	function fetch() {
		$retdata = array(
			'groupid' => (int)element('groupid', $_GET),
			'filterGroupid' => (int)element('filterGroupid', $_GET,0)
		);        
        return $this->WirelessSsid_Model->get_ssid_list($retdata);		
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);		
		if ($actionType === 'add') {
            $result = $this->WirelessSsid_Model->add_ssid($data);
		} elseif ($actionType === 'edit') {
			$result = $this->WirelessSsid_Model->update_ssid($data);
		} elseif ($actionType === 'delete') {
			$result = $this->WirelessSsid_Model->delete_ssid($data);
		} elseif ($actionType === 'bind') {
            $result = $this->WirelessSsid_Model->bind_ssid($data);
		} elseif ($actionType === 'unbind') {
            $result = $this->WirelessSsid_Model->bind_ssid($data);
		} elseif ($actionType === 'copy') {
            $result = $this->WirelessSsid_Model->copy_ssid($data);
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
}
