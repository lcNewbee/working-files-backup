<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class AxcInfo extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	public function index() {
		$result = array(
            'state' => array(
                'code' => 2000, 
                'msg' => 'ok'
            ), 
            'data' => array(
                'version' => '1.0.1', 
                'hardware' => '1.0'
            )
        );
        $version = file_get_contents('/etc/version');
        $version = str_replace('AXC1000_V1_TEST_','',$version);              
        $result['data']['version'] = str_replace("\n","",$version);  
		echo json_encode($result);
	}
}
