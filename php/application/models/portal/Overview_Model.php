<?php
class Overview_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_overview_list($data) {
        $countdata = $this->get_count_info();
		$queryd = $this->portalsql->query('select * from portal_logrecord');        
		$arr['state'] = array('code' => 2000, 'msg' => 'ok');
		$arr['data'] = array(
            'authInterface' => '1,2,3,4,5', 
            'operationRecords' => $queryd->result_array(), 
            'outlineCount' => 80, 
            'onlineCount' => 20, 
            'accCount' => $countdata['accCount'], 
            'lockCount' => $countdata['lockCount'], 
            'trueCount' => $countdata['trueCount']
        );        
		return json_encode($arr);
	}
	function get_interface_info() {
		$queryd = $this->portalsql->query('select * from portal_logrecord');
	}

    function get_count_info() {
        $arr = array();
        $lockcount = 0;
        
        $query = $this->portalsql->query('select * from portal_account');        
        foreach ($query->result_array() as $row) {
            if($row['state'] === 0) {
                $lockcount = $lockcount + 1;
            }
        }
        $arr['accCount'] = (int)$query->num_rows();//总用户数
        $arr['lockCount'] = (int)$lockcount;//锁定用户数
        $arr['trueCount'] = $arr['accCount'] > 0 ? $arr['accCount'] - $arr['lockCount'] : 0;//正常用户数
        return $arr;
    }
}
