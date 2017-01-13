<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class SystemLicense extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');		
		//$this->load->model('system/SystemLicense_Model');
	}
	function fetch() {
		$arr = array(
            'secure_type' => (string)element('secure_type', $_GET, 0)
        );//状态 目前固定问硬件 0
		return secure_license_status_get(json_encode($arr));
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'delete') {
			//$result = 
		} elseif ($actionType === 'setting') {
            $arr = array(
                'secure_type'=>(string)element('secure_type',$data,0),
                'secure_license'=>(string)element('secure_license',$data,'')
            );
			$result = serure_license_set(json_encode($arr));
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
