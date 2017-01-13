<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class NetworkPortalRules extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
        $this->load->model('network/NetworkPortalRules_Model');
	}
    public function index() {
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo json_encode($result);
        }
    }
	function fetch(){
		return $this->NetworkPortalRules_Model->get_portal_rul_list();
	}

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
        switch($actionType) {
            case 'add' : $result = $this->NetworkPortalRules_Model->add_portal_rules($data);
                break;
            case 'delete' : $result = $this->NetworkPortalRules_Model->del_portal_rules($data);
                break;
            case 'edit' : $result = $this->NetworkPortalRules_Model->exit_portal_rules($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }
        return $result;
	}
	
}
