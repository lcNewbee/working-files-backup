<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class AccessWeb extends CI_Controller {
	public function __construct() {
		parent::__construct();		
		$this->load->helper('array');
        $this->load->model('portal/AccessWeb_Model');
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
	function webPage(){
		echo $this->AccessWeb_Model->get_web_page();
	}
	function fetch() {
		return $this->AccessWeb_Model->get_list($_GET);
	}
	function onAction($data) {
		if (!$data) {
            $data = $_POST;
        }
		$result = null;
		$actionType = element('action',$data);
		switch($actionType) {        
            case 'add' : $result = $this->AccessWeb_Model->Add($data);
                break;
            case 'delete' : $result = $this->AccessWeb_Model->Delete($data);
                break;                
            case 'edit' : $result = $this->AccessWeb_Model->Edit($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }
		return $result;
	}
	
}
