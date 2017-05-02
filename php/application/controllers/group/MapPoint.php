<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class MapPoint extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->helper('array');
	}
  public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		}
	}
	function onAction($data) {
		if (!$data) {
      $data = $_POST;
    }
		$result = json_encode(array('state' => array('code' => 2000, 'msg' => 'ok')));
		$actionType = element('action',$data);
    $mac = element('mac', $data);
    $lng = element('lng', $data);
    $lat = element('lat', $data);

		switch($actionType) {
      case 'add':
        shell_exec('/usr/bin/sta_input.sh ' . $mac . ' ' . $lng . ' ' . $lat);
        break;

      case 'stop':
        shell_exec('/usr/bin/sta_clear.sh ' . $mac);
        break;

      case 'clear':
        shell_exec('killall -9 sta_input.sh');
        break;

      default:
        $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
        break;
    }

		return $result;
	}
}
