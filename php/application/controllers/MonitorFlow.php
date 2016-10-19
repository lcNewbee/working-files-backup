<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class MonitorFlow extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch($data){
      $data_array=json_decode($data);
      unset($data_array[' size']);
      unset($data_array[' page']);
      unset($data_array[' search']);
      $result=axc_get_flow(json_encode($data_array));
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
			$result = $this->fetch($data);
      echo $result;
		}
	}
}
