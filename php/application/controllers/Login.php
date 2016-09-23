<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Login extends CI_Controller {
	public function index() {
    $result=array(
      'state'=>array(
        'code' => 2000,
        'msg' => 'ok',
      )
    );
    echo json_encode($result);
	}
}
?>
