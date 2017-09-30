<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class TotalOverview extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->helper('array');
		$this->load->model('dashboard/TotalOverview_Model');
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
		return $this->TotalOverview_Model->get_list($_GET);
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		switch ($actionType) {
			case 'add': $result = $this->TotalOverview_Model->add($data);
			    break;
			case 'delete': $result = $this->TotalOverview_Model->delete($data);
                break;
			case 'edit': $result = $this->TotalOverview_Model->edit($data);
			    break;
			default: $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
			    break;
		}
		return $result;
	}

	function download(){
		$path = '/usr/web/public/';
		$filename = element('fileName', $_GET, 0);
		switch($filename){
            case 'wirelessTrend' : $filename = 'Wireless Trend.pdf';
                break;
            case 'wiredStatus' : $filename = 'wired status.pdf';
                break;
            case 'clientAnalysis' : $filename = 'Clients.pdf';
                break;
            case 'ssidAnalysis' : $filename = 'SSIDs.pdf';
                break;            
			default : 
				echo json_encode(json_no('error'));
                break;
        }
		if(is_file($path.$filename)){
			$this->load->helper('download');		
			$data = file_get_contents($path.$filename);
			//$name = 'backup.zip';
			force_download($filename, $data);
		}
	}
}
