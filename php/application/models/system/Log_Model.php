<?php
class Log_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));
	}
	public function get_log_list($data) {
		$arr['state'] = array('code' => 2000, 'msg' => 'OK');
		$arr['data'] = array(
            'settings' => '2016-11-15 log', 
            'page' => array('start' => 1, 'size' => 20, 'currPage' => 1, 'totalPage' => 2, 'total' => 38, 'nextPage' => '-1', 'lastPage' => 2), 
            'list' => array(
                array('id' => 1, 'time' => '2016-11-15 18:15:20', 'type' => 'client', 'operationCommand' => 'unlock', 'operator' => 'admin', 'operationResult' => 'ok'), 
                array('id' => 2, 'time' => '2016-11-15 18:15:20', 'type' => 'client', 'operationCommand' => 'unlock', 'operator' => 'admin', 'operationResult' => 'ok')
            ));
		return json_encode($arr);
	}
	public function log_delete($data) {
		$result = null;
		$result = json_ok();
		return json_encode($result);
	}
	public function log_cfg($data) {
		$result = null;
		$result = json_no();
		return json_encode($result);
}
