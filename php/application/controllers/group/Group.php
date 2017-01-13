<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class Group extends CI_Controller {
	public function __construct() {
		parent::__construct();		
		$this->load->helper('array');
		$this->load->model('group/Group_Model');
	}
	public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		}
		else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
			echo json_encode($result);
		}
	}
	function fetch() {
		$result = null;
		$result = $this->Group_Model->get_apgroup_info();
		return $result;
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);		
		switch($actionType) {			
			case "add" : $result = $this->Group_Model->add_apgroup($data);
				break; 
			case "edit" : $result = $this->Group_Model->up_apgroup($data);
				break; 
			case "deleteGroup" : $result = $this->Group_Model->del_apgroup($data);
				break; 
			case "move" : $result = $this->Group_Model->ap_move($data);
				break; 
			case "deleteGroupAps" : $result = $this->Group_Model->del_apgroup_ap($data);
				break; 
			case "groupApAdd" : $result = $this->Group_Model->add_apgroup_ap($data);
				break; 
			default :
				$result = null;
				break;
		}	
		return $result;
	}	
}
