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
        $mac = element('apmac',$data,'');        
        $datalist = array();
        $timedata = $this->get_clients_cfg($groupid);
        if(count($timedata) > 0 && $mac !== ''){
            $dblist = $this->mysql->query("call getwidsreport('".$mac."',".$timedata['reporttime'].")");
            $datalist = $dblist->result_array();
        }                
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'settings'=>$timedata,
                'list'=>$datalist
            )
        );
        return json_encode($arr);
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
            $arr['reporttime'] = $row->wscanrpttime/60;
        }
        return $arr;
    }
    function setting($data) {
        $result = null;
        $min = element('reporttime',$data,100);
        $cgiary = array(
            'groupid'=>element('groupid',$data,1),
            'enable'=>element('enable',$data,1),
            'wscanrpttime'=>$min*60
        );        
        print_r($cgiary);
        $result = wscan_set_param(json_encode($cgiary));
        return $result;
    }
}