<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class MapAps extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->load->model('group/MapAps_Model');
	}
	function fetch() {
		$retdata = array(
			'page' => (int)element('page', $_GET),
			'size' => (int)element('size', $_GET,0)
		);        
        return $this->MapAps_Model->get_aps_list($retdata);
	} 
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);		
		if ($actionType === 'add') {
            $result = $this->MapAps_Model->add_ap_map($data);
		} elseif ($actionType === 'edit') {
			//$result = $this->MapAps_Model->update_building($data);
		} elseif ($actionType === 'remove') {
			//$result = $this->MapAps_Model->delete_building($data);
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
