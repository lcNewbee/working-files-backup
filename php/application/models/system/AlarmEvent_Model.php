<?php
class AlarmEvent_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->database();
        $this->load->helper(array('array','my_customfun_helper'));
	}
	public function get_alarm_list($data) {     
        $result = null; 
        $retcgi = array(
            'page'=>(string)element('page',$data,1),
            'pagesize'=>(string)element('size',$data,20)
        );
        $result = axc_get_alarm_event_info(json_encode($retcgi));        
        return $result;
	}

    public function delete_alarm($data) {        
        if( is_array($data['selectedList']) ) {
            $cgiarr = array();            
            foreach ($data['selectedList'] as $row) {
                $arr['event_timer'] = (string)$row['timer'];
                $arr['msg_type'] = (string)$row['msgtype'];
                $cgiarr[] = $arr;              
            }
            $execary['alarm_event_list'] = $cgiarr;
            axc_del_alarm_event(json_encode($execary)); 
        }                 
        $arr = json_ok();
        return json_encode($arr);
    }        
}
