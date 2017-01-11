<?php
class RadiusConnect_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
	}
	function get_radius_connect($data) {        
		$queryd = $this->portalsql->query('select * from radius_nas');
		$arr['state'] = array('code' => 2000, 'msg' => 'ok');
		$arr['data'] = array(
            'list' => $queryd->result_array()
        );        
		return json_encode($arr);
	}
    function add_radius_connect($data) {

    }
    function del_radius_connect($data) {
        
    }
    function edit_radius_connect($data) {
        
    }
}