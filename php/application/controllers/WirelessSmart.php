<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class WirelessSmart extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
     $retdata = array(
        'groupid'=>(int)element('groupid', $_GET),
      );
      $result=axc_get_wireless_smart(json_encode($retdata));
      return $result;
  }

	function onAction($data) {
		$result = null;
    $retdata=array(
      'groupid'=>(int)element('groupid', $data),
      '5gFrist'=>(int)element('5gFrist', $data),
      '11nFrist'=>(int)element('11nFrist', $data),
      'autoChannel'=>(int)element('autoChannel', $data),
      'channel'=>(int)element('channel', $data),
      'country'=>element('country', $data),
      'terminalRelease'=>(int)element('terminalRelease', $data),
      'terminalReleaseVal'=>(int)element('terminalReleaseVal', $data),
      'wirelessPower'=>element('wirelessPower', $data),
    );
    $result=axc_set_wireless_smart(json_encode($retdata));
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
