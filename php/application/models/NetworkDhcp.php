<?php
class NetworkDhcp extends CI_Model {

	public function __construct() {
    parent::__construct();
		$this->load->database();
    $query = $this->db->get('ap_list');
    return $query->result_array();
	}


  //  多表联合查询
  // public function get_networkdhcp( ) {
  //     $data=$this->db->from('pool_list')
  //     ->join('pool_list','opid=pid')
  //     ->join('pool_params','id=cid')
  //     ->get()->result_array();
  //     return $data;
  // }
}

