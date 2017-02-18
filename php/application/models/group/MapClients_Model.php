<?php
class MapClients_Model extends CI_Model {
    public function __construct() {
        parent::__construct();		 
        $this->load->database();	       
        $this->mysql = $this->load->database('mysqli', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {   
        $groupid = (int)element('groupid',$data,0);
        //获取mac列表
        $maclist = $this->get_apmac_list($groupid);

        $cgidata = array();
        foreach($maclist as $row){
            $queryd = $this->mysql->query("call getwidsreport('".$row['mac']."',60)");
            $cgidata = $queryd->result_array();
        }        
        /*    
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'settings'=>$this->get_clients_cfg($groupid),
                'list'=>$cgidata
            )
        );
        return json_encode($arr);
        */
    }
    function get_clients_cfg($groupid){
        $arr = array(
            'enable'=>1,
            'reporttime'=>99
        );
        $query = $this->db->query('select wscanenable,wscanrpttime from wrrm_template where id='.$groupid);
        $row = $query->row();
        if(isset($row)){
            $arr['enable'] = $row->wscanenable;
            $arr['reporttime'] = $row->wscanrpttime;
        }
        return $arr;
    }
    function get_apmac_list($groupid){
        $arr = array();        
        $query = $this->db->select('mac')
                        ->from('ap_list')    
                        ->where('group_id',$groupid)                                        
                        ->get()->result_array();
        echo '<pre>';
        print_r($query);
        echo '</pre>';
        if(count($query) > 0){
            $arr = $query;
        }
        return $arr;
    }
}