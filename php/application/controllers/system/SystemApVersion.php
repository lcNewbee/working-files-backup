<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemApVersion extends CI_Controller {
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array'));
        $this->load->model('system/SystemApVersion_Model');
	}
    public function index(){
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        }else if($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo json_encode($result);
        }
    }
    function fetch(){
        return $this->SystemApVersion_Model->get_list($_GET);
    }    
    function onAction($data) {
        if (!$data) {
            $data = $_POST;
        }
        $result = null;
        $actionType = element('action', $data);
        $selectList = element('selectedList', $data);
        switch($actionType) {
            case 'add' : $result = $this->SystemApVersion_Model->add_apversion($data);
                break;
            case 'delete' : $result = $this->SystemApVersion_Model->del_apversion($selectList);
                break;
            case 'edit' : $result = $this->SystemApVersion_Model->up_apversion($data);
                break;
            case 'active' : $result = $this->SystemApVersion_Model->active_apversion($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }        
        return $result;
    }
    
}
