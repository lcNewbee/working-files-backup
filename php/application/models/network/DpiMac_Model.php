<?php
class DpiMac_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {   
		$result = null;
		$cgiary = array(
			'page'=>'1',
			'pagesize'=>'20'
		);
		$result = ndpi_send_mac_to_php_db(json_encode($cgiary));	       	
		return $result;
	}
}