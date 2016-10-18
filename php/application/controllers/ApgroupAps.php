<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class ApgroupAps extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch($data){
      $data_array=json_decode($data);
      unset($data_array[' type']);
      unset($data_array[' search']);
      $retdata=array(
        'groupid'=>element('groupid', $data_array),
        'page'=>element('page', $data_array),
        'pagesize'=>element('size', $data_array),
      );
      $result=axc_get_flow(json_encode($retdata));
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
      echo json_encode($result, true);
		}
	}
}
