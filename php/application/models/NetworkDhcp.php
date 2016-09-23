<?php
class NetworkDhcp extends CI_Model {

	public function __construct() {
    parent::__construct();
		$this->load->database();
	}
  public function get_networkdhcp( ) {
      $data=$this->db->select('pool_id,attr_name,attr_value')
      ->from('pool_params')
      ->join('pool_attr','pool_attr.id=pool_params.attr_id')
      ->join('pool_list','pool_list.id=pool_params.pool_id')
      ->get()->result_array();

  }
}

