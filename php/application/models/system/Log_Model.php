<?php
class Log_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));
		$this->load->library('SqlPage');
	}
	public function get_log_list($data) {
		$sqlpage = new SqlPage();
		$columns = 'id,time,type,operator,operationCommand,operationResult,description';
		$tablenames = 'web_log';
		$pageindex = (int)element('page', $data, 1);
		$pagesize = (int)element('size', $data, 20);
		$datalist = $sqlpage->sql_data_page($columns,$tablenames,$pageindex,$pagesize);

		$arr['state'] = array('code' => 2000, 'msg' => 'OK');
		$arr['data'] = array(
            'settings' => array(), 
            'page' => array(
				'start' => 1, 
				'size' => 20, 
				'currPage' => 1, 
				'totalPage' => $datalist['total_page'], 
				'total' => $datalist['total_row'], 
				'nextPage' => '-1', 
				'lastPage' => 2
			), 
            'list' => $datalist['data']
		);
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
}
