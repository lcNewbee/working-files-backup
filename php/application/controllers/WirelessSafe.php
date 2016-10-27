<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class WirelessAcl extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
     $retdata = array(
        'groupid'=>(int)element('groupid', $_GET,-1),
        'type'=>(int)element('type', $_GET,0),
      );
      if($retdata['groupid']===-1){
        $result=axc_get_default_wireless_wips();
      }
      else{
         $result=axc_get_wireless_wips(json_encode($retdata));
      }
      return $result;
  }

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {

		}
		elseif($actionType === 'edit') {

		}
    elseif($actionType === 'delete'){

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
