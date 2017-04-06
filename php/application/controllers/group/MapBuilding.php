<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class MapBuilding extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->load->model('group/MapBuilding_Model');
	}
	function fetch() {
		$retdata = array(
			'page' => (int)element('page', $_GET),
			'size' => (int)element('size', $_GET,0)
		);        
        return $this->MapBuilding_Model->get_building_list($retdata);
	} 
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);	
		switch($actionType)	{
			case "add" : $result = $this->MapBuilding_Model->add_building($data);
				break;
			case "edit" : $result = $this->MapBuilding_Model->update_building($data);
				break;
			case "delete" : $result = $this->MapBuilding_Model->delete_building($data);
				break;
			case "setting" : $result = $this->MapBuilding_Model->setting_building($data);
				break;
			default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
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
