<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class NetworkDhcp extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
	}
	public function network() {
    $data=$this->db->select('pool_id,pool_name,attr_name,attr_value')
    ->from('pool_params')
    ->join('pool_attr','pool_attr.id=pool_params.attr_id')
    ->join('pool_list','pool_list.id=pool_params.pool_id')
    ->get()->result_array();
    $state=array(
        "code"=>2000,
        "msg"=>"OK"
    );
    echo json_encode($data);
  }
}
?>
