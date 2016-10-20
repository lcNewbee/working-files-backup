<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class MonitorSsid extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
     $data = array(
        'groupid'=>(int)$_GET['groupid'],
      );
       $retdata = array(
        'groupid'=>element('groupid', $data),
      );
      $result=axc_get_ssidState(json_encode($retdata));
      return $result;
  }


	function onAction($data) {
   	// $result = null;
   // $actionType = element('action', $data);
    // if($actionType === 'lock'){

    // }
    // elseif($actionType === 'unlock'){

    // }
    // elseif($actionType === 'reconnect'){

    // }
    // return $result;
	}
	public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
      echo $result;
		}
		elseif($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
      echo $result;
		}
	}
}
