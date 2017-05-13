<?php
class DpiOverview_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));   
             
    }
    function get_list($data) {
        $all_info = $this->getAll();
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(    
                'settings'=>array('ndpiEnable'=>$this->get_ndpi_state()),            
                'ethInterface'=> $all_info['interface'],
                'mac'=>$all_info['mac'],
                'proto'=>$all_info['proto']
            )
        );        
        return json_encode($arr);        
    }

    private function getAll(){
        $arr = array(
            'interface' => array(),
            'mac' => array(),
            'proto' => array()
        );
        $ret = ndpi_send_general_view(json_encode(array()));
        $ary = json_decode($ret, true);
        if($ary['state']['code'] === 2000){
            $arr['interface'] = $ary['list_obj']['list_ethx_obj'];
            $arr['mac'] = $ary['list_obj']['list_mac_obj'];
            $arr['proto'] = $ary['list_obj']['list_proto_obj'];
        }
        return $arr;
    }   
    function get_ndpi_state(){
        $result = 0;
        $query = $this->db->query("select id,attr_value from ndpi_params where attr_id=(select id from ndpi_attr where attr_name='ndpi_enable')");
        if(count($query->result_array()) > 0 ){
            $result = $query->result_array()[0]['attr_value'];
        }
        return $result;
    }   
}