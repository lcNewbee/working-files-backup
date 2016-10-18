<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Login extends CI_Controller {
  public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	public function index() {
    $url = '/index.html';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
      $username = element('username', $data, 'root');
      $password = element('password', $data, '');
      $result=array(
        'state'=>array(
          'code' => 4000,
          'msg' => 'Username or Password Error',
        )
      );

      if(strlen($password) > 0) {
        $result=array(
          'state'=>array(
            'code' => 2000,
            'msg' => 'ok',
          )
        );
      }
			echo json_encode($result);
		}
		elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
			echo '<META HTTP-EQUIV="Refresh" CONTENT="0;URL='.$url.'">';
		}
    else {
      echo '<META HTTP-EQUIV="Refresh" CONTENT="0;URL='.$url.'">';
    }
	}
}

