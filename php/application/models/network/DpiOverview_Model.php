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
                'settings'=>array('ndpiEnable'=>$this->getNdpiState()),            
                'ethInterface'=>$this->getViewInfo()['ethInterface'],
                'mac'=>$this->getViewInfo()['mac'],
                'proto'=>$this->getViewInfo()['proto']
            )
        );        
        return json_encode($arr);        
    }
    private function getViewInfo(){
        $arr = array(
            'ethInterface' => array(),
            'mac' => array(),
            'proto' => array()
        );
        $cgiret = ndpi_send_general_view(json_encode(array()));
        $ary = json_decode($cgiret, TRUE);
        if(count($ary) > 0 && $ary['state']['code'] === 2000){
            foreach($ary['list_obj']['list_ethx_obj'] as $row) {
                $arr['ethInterface'][] = array(
                    'name' => $row['ethx'],
                    'value' => $row['ethx_bytes'],
                );
            }
            foreach($ary['list_obj']['list_mac_obj'] as $row) {
                $arr['mac'][] = array(
                    'name' => $row['mac'],
                    'value' => $row['mac_bytes'],
                );
            }
            foreach($ary['list_obj']['list_proto_obj'] as $row) {
                $arr['proto'][] = array(
                    'name' => $row['proto'],
                    'value' => $row['proto_bytes'],
                );
            }
        }
        return $arr;
    }       
    private function getNdpiState(){
        $result = 0;
        $query = $this->db->query("select id,attr_value from ndpi_params where attr_id=(select id from ndpi_attr where attr_name='ndpi_enable')");
        if(count($query->result_array()) > 0 ){
            $result = $query->result_array()[0]['attr_value'];
        }
        return $result;
    }   
}