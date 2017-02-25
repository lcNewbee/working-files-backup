<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class CateGory extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->helper('array');
        $this->load->model('portal/CateGory_Model');
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
		return $this->CateGory_Model->get_list($_GET);
	}
	function onAction($data) {
		if (!$data) {
            $data = $_POST;
        }
		$result = null;
		$actionType = element('action',$data);
		switch($actionType) {
            case 'add' : $result = $this->CateGory_Model->Add($data);
                break;
            case 'delete' : $result = $this->CateGory_Model->Delete($data);
                break;
            case 'edit' : $result = $this->CateGory_Model->Edit($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }
		return $result;
	}

}
