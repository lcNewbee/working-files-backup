<?php
date_default_timezone_set("PRC");
class MonitorApsRadio_Model extends CI_Model {
	public function __construct() {
        parent::__construct();
        $this->load->library('session');
		$this->load->database();
        $this->load->helper(array('array', 'db_operation'));    
        $this->mysql = $this->load->database('mysqli', TRUE);  
    }
    
    function get_list($data) {
        return json_ecode(json_ok());
    }
    function settings($data){
        $mac_list = element('selectedList', $data, array());
        $cgidata = $this->array_remove($data, ['action','groupid','myTitle','selectedList','ssid_2g','ssid_5g']);
        $cgidata['wlan_maxnum'] = '16';//页面限制SSID最多为16个
        $reslut = '';
        foreach($mac_list as $res){
            $cgidata['apmac'] = $res;   
            $reslut .= axc_set_apradio_all(json_encode($cgidata));   
        }        
        return json_encode(json_ok($reslut)); 
    }
    private function array_remove($data, $keyary){  
        foreach($keyary as $key){
            //1.判断键是否存在
            if(!array_key_exists($key, $data)){  
                //return $data;  
                continue;
            }  
            //2.得到数组中所有键
            $keys = array_keys($data);
            //3.在数组中搜索键返回键名  
            $index = array_search($key, $keys);  
            if($index !== FALSE){  
                array_splice($data, $index, 1);  
            } 
        } 
        return $data;        
    } 
}