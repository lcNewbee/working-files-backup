<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class NetworkRoute extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->helper('array');
    $this->load->model('network/NetworkRoute_Model');
	}
	function fetch(){

    $result = $this->NetworkRoute_Model->get_route_list($_GET);
		return $result;
	}
	function onAction($data) {
    $result = null;
    $actionType = element('action', $data);

    if ($actionType === 'add') {
      $result = $this->NetworkRoute_Model->add_route($data);
    } elseif ($actionType === 'edit') {
      $result = $this->NetworkRoute_Model->edit_route($data);
    } elseif ($actionType === 'delete') {
      $result = $this->NetworkRoute_Model->delete_route($data);
    }
    return $result;
	}

	public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
      echo $result;
		}
		elseif($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
      echo json_encode($result, true);
		}
	}
}
