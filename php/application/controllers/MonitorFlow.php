<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class MonitorFlow extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}

	function fetch(){
		$retdata = array(
		        'groupid'=>(int)element('groupid', $_GET,-1),
		      );
			$result=axc_get_flow(json_encode($retdata));

		return $result;
	}

	function onAction($data) {
		// 		$result = null;
		// 		$actionType = element('action', $data);
		// 		if($actionType === 'lock'){

			//
		// }
		// 		elseif($actionType === 'unlock'){

			//
		// }
		// 		elseif($actionType === 'reconnect'){

			//
		// }
		// 		return $result;
	}

  public function user() {
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
  public function app() {
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
