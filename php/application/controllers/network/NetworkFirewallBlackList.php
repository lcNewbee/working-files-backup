<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class NetworkFirewallBlackList extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch() {
		$arr = array(
            'page'=>(string)element('page',$_GET,1),
            'pagesize'=>(string)element('size',$_GET,20),
            'mac' => (string)element('mac', $_GET),
            'dos_type' => (string)element('dos_type', $_GET),
        );
		return axc_get_xdos_black(json_encode($arr));
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
    if ($actionType === 'delete') {
        foreach($data['selectedList'] as $item) {
          $deleteItem = array(
              'mac' => (string)element('mac',$item),
          );
          $result = axc_del_xdos_mac(json_encode($deleteItem));
        }
		}
		return $result;
	}
	public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
			echo $result;
		}
	}
}
