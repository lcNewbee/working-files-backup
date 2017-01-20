<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class DpiMac extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->helper('array');
        $this->load->model('network/DpiMac_Model');
	}
    public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
			echo $result;
		}
	}
	function fetch() {
		//return '{"state":{"code":2000,"msg":"ok"},"data":{"page":{"startline":88888},"list":[{"mac":"dc:fe:07:d4:22:9c","ip":"192.168.0.127","flow_num":"2","upbytes":"334","downbytes":"0","uppackets":"4","downpackets":"0"},{"mac":"dc:fe:07:d4:22:9c","ip":"192.168.0.127","flow_num":"7","upbytes":"694","downbytes":"0","uppackets":"10","downpackets":"0"}]}}';
		return $this->DpiMac_Model->get_list($_GET);
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		switch($actionType) {
            case 'add' : $result = null;
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }
		return $result;
	}
	
}