<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class MonitorAps extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
    $groupid = (int)element('groupid', $_GET, -1);
    $rqdata = array(
      'groupid'=>$groupid,
      'page'=>(int)element('page', $_GET, 1),
      'pagesize'=>(int)element('size', $_GET, 20)
    );

    // 如果groupid不存在或值为-1则返回默认设备
    if ($groupid === -1) {
      $result = axc_get_default_aps();

    // 非默认组
    } else {
      $result=axc_get_aps(json_encode($rqdata));
    }

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
