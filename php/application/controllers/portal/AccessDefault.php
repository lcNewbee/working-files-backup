<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class AccessDefault extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');        
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
		//return $this->AccessDefault_Model->get_list($_GET);
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		switch($actionType) {
            case 'setting' : $result = $this->AccessDefault_Model->edit_accesss($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }
		return $result;
	}
	public function download() {
        //download
        $this->load->helper('download');
        $data = file_get_contents("/var/conf/portalserver/portal_web_tmp.zip");
        $name = 'axilspot.zip';
        force_download($name, $data);
    }
    public function upload() {
        $result = null;
        $config['upload_path'] = '/var/conf/portalserver';
        $config['allowed_types'] = 'zip|rar';
        $config['overwrite'] = true;
        $config['max_size'] = 0;
        $config['file_name'] = 'portal_web_tmp.zip';

        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('filename')) {
            $error = array('error' => $this->upload->display_errors());
            $result = array('state' => array('code' => 4000, 'msg' => $error));
        } else {
            $data = array('upload_data' => $this->upload->data());
            $result = array('state' => array('code' => 2000, 'msg' => 'OK'), 'data' => $data);
        }
        echo json_encode($result);
    }
}
