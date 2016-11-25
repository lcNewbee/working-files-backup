<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class WirelessTimer extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
		$this->load->model('group/WirelessTimer_Model');
	}
	function fetch(){
        $retdata = array(
            'groupid'=>(int)element('groupid', $_GET,-1),
			'size'=>(int)element('size', $_GET,-1)
        );        
		$result = $this->WirelessTimer_Model->get_timer_list($retdata);
        return $result;               
    }

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {
			$result = $this->WirelessTimer_Model->add_timer_policy($data);
		}elseif($actionType === 'edit') {
      		$result = $this->WirelessTimer_Model->up_timer_policy($data);
		}elseif($actionType === 'delete'){			
			$result = $this->WirelessTimer_Model->del_timer_policy($data);
    	}elseif($actionType === 'switch'){
			$result = $this->WirelessTimer_Model->up_timer_policy($data);
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