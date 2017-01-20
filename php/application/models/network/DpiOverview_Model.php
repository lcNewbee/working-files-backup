<?php
class DpiOverview_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));   
             
    }
    function get_list($data) {
        $result = null;   
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(    
                'settings'=>array('ndpiEnable'=>$this->get_ndpi_state()),            
                'ethInterface'=>$this->get_macinfo('ndpi_send_ethx_statistics'),
                'mac'=>$this->get_macinfo('ndpi_send_mac_statistics'),
                'proto'=>$this->get_macinfo('ndpi_send_proto_statistics')
            )
        );        
        return json_encode($arr);        
    }
    function get_macinfo($type) {
        $result = array();
        //该page信息无意义只是格式要求   
        $cgiprm = array(
            'page'=>'0',
            'pagesize'=>'20'
        );
        switch($type){
            case 'ndpi_send_ethx_statistics':$result = ndpi_send_ethx_statistics(json_encode($cgiprm));          
                break;
            case 'ndpi_send_mac_statistics':$result = ndpi_send_mac_statistics(json_encode($cgiprm));
                break;
            case 'ndpi_send_proto_statistics':$result = ndpi_send_proto_statistics(json_encode($cgiprm));
                break;
        }        
        $ret = json_decode($result);
        if(is_object($ret) && $ret->state->code === 2000){
            $result = $ret->data->list;
            $arreth = array();
            switch($type){
                case 'ndpi_send_ethx_statistics':
                    foreach($result as $row){                    
                        $b['name'] = $row->ethx;
                        $b['value'] = (int)$row->throughput_percent;
                        $arreth[] = $b;
                    }
                    break;
                case 'ndpi_send_mac_statistics':
                    foreach($result as $row){                    
                        $b['name'] = $row->mac;
                        $b['value'] = (int)$row->upbytes_precent;
                        $arreth[] = $b;
                    }
                    break;
                case 'ndpi_send_proto_statistics':
                    foreach($result as $row){                    
                        $b['name'] = $row->proto;
                        $b['value'] = (int)$row->bytes_precent;
                        $arreth[] = $b;
                    }
                    break;
            } 
            return $arreth;          
        }else{
            $result = array();
        }                
        return $result;
    }    
    function get_ndpi_state(){
        $result = 0;
        $query = $this->db->query("select id,attr_value from ndpi_params where attr_id=(select id from ndpi_attr where attr_name='ndpi_enable')");
        if(count($query->result_array()) > 0 ){
            $result = $query->result_array()[0]['attr_value'];
        }
        return $result;
    }
    function open_dpi($data){
        $ret = null;
        $value = $data['ndpiEnable'] === '0' ? 'off' : 'on';
        $cgiprm = array(
            'onoff'=>$value
        );
        $result = ndpi_set_switch_to_config(json_encode($cgiprm));
        return $result;
    }    
}