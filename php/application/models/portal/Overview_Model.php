<?php
class Overview_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
	}
	function get_overview_list($data) {        
        $countdata = $this->get_count_info();        
		$queryd = $this->portalsql->query('select * from portal_logrecord');        
		$arr['state'] = array('code' => 2000, 'msg' => 'ok');
		$arr['data'] = array(
            'authInterface' => $countdata['authInterface'],
            'operationRecords' => $queryd->result_array(), 
            'outlineCount' => $countdata['outlineCount'], 
            'onlineCount' => $countdata['onlineCount'], 
            'accCount' => $countdata['accCount'], 
            'lockCount' => $countdata['lockCount'], 
            'trueCount' => $countdata['trueCount']
        );                   
		return json_encode($arr);
	}
    function get_count_info() {
        $arr = array(
            'authInterface' => 0,
            'outlineCount' => 0,
            'onlineCount' => 0,
            'accCount' => 0,
            'lockCount' => 0,
            'trueCount' => 0
        );
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

        $socket_data = $this->get_online_user();
        if($socket_data){
            $arr['authInterface'] = $socket_data['authMethods'];
            $arr['onlineCount'] = $socket_data['onlineUserCount'];
            $arr['outlineCount'] = $arr['accCount'] > 0 ? $arr['accCount'] - $arr['onlineCount'] : 0;//离线
        }        
        return $arr;
    }

    function get_online_user(){
        $result = null;
        $arr = array();
        $portal_socket = new PortalSocket();
        $arr = array('action'=>'get','resName'=>'overview');        
        $result = $portal_socket->portal_socket(json_encode($arr));          
        if($result['state']['code'] === 2000){
            $arr['onlineUserCount'] = $result['data']['onlineUserCount'];
            $arr['authMethods'] = $result['data']['authMethods'];
            return $arr;
        }                          
        return $result;
    }
}
