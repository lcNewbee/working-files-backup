<?php
class AlarmEvent_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->database();
        $this->load->helper(array('array','my_customfun_helper'));
	}
	public function get_alarm_list($data) {      
        /*
        page: 2,                // 请求第几页，从 1 开始
        size: 20,               // 每页大小
        */
        $arypage = array(
            "start"=> 1,          // 第一页
            "size"=> 20,          // 每页显示条目
            "currPage"=> 1,       // 当前页码
            "totalPage"=> 1,      // 总页数
            "total"=>11,         // 条目总数
            "nextPage"=> -1,      // 下一页页码，-1 则为最后一页
            "lastPage"=> 1        // 最后一页
        );
        $arrlist = array(
            array('id'=>'1','time'=>'2016-11-21','type'=>'NAT','info'=>'test data 1'),
            array('id'=>'1','time'=>'2016-11-21','type'=>'NAT','info'=>'test data 2')
        );
        $arr['state'] = array('code' => 2000, 'msg' => 'ok');
        $arr['data'] = array('page'=>$arypage,'list'=>$arrlist);    
        return json_encode($arr);
	}

    public function delete_alarm($data) {
        /*
        {
            "action":"delete"
            
            // 选择的项
            "selectedList": [
                {
                "id": "2",
                "time": "2016-10-1",
                "type": "DHCP",
                "info": "DHCP Events Describe"
                }, {
                "id": "3",
                "time": "2016-10-1",
                "type": "DHCP",
                "info": "DHCP Events Describe"
                }
            ]
        }
        */
        $arr = json_ok();
        return json_encode($arr);
    }        
}
