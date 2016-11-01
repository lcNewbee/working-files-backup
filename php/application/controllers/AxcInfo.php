<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class AxcInfo extends CI_Controller {
  public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	public function index() {
    $result=array(
      'state'=>array(
        'code' => 4000,
        'msg' => 'Username or Password Error',
      ),
      'data'=>array(
        'version'=>'1.0.1',
        'hardware'=>'1.0',
      )
    );

    echo json_encode($result);
	}
}

