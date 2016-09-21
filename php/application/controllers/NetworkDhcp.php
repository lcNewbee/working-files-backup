<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class NetworkDhcp extends CI_Controller {

	public function view($page = 'home')
	    {

	}
	public function __construct() {
    parent::__construct();
		$this->load->database();
  }
	public function index()
 {
        $data=array(
          array('name'=>'张三','年龄'=>23),
          array('name'=>'李四','年龄'=>24),
          array('name'=>'王五','年龄'=>25)
        );
        echo json_encode($data);
	}
	public function network()
	    {

        $query = $this->db->get('ap_list');
        $data=$query->result_array();
         echo json_encode($data);

	}
}
?>
