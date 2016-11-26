<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class MonitorUser extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
       $retdata = array(
        'groupid'=>(int)element('groupid', $_GET,-1),
        'type'=>(int)element('type', $_GET,1),
        'page'=>(int)element('page', $_GET,1),
        'size'=>(int)element('size', $_GET,30),
        'search'=>element('search', $_GET,222),
      );
        $result=axc_get_clientList(json_encode($retdata));
         return $result;
  }

	function onAction($data) {
   	$result = null;
      $result=axc_set_clientoperate(json_encode($data));
    return $result;
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
