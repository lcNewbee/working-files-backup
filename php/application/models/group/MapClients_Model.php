<?php
class MapClients_Model extends CI_Model {
    public function __construct() {
        parent::__construct();		 
        $this->load->database();	       
        $this->mysql = $this->load->database('mysqli', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('DbSqlite');
    }
    function get_list($data) {   
        $groupid = (int)element('groupid',$data,0);
        $mac = element('apmac',$data,'');        
        $datalist = array();
        $timedata = $this->get_clients_cfg($groupid);
        if(count($timedata) > 0 && $mac !== ''){
            $s = 60 * (int)$timedata['reporttime'];            
            $dblist = $this->mysql->query("call getwidsreport('".$mac."',".$s.")");
            
            $sql_oui = new DbSqlite('/var/run/oui.db');
            foreach($dblist->result_array() as $row){
                $row['endtime'] = $row['endtime'] === '0000-00-00 00:00:00'? '-- --' : $row['endtime'];   
                $macary = explode(':',$row['stamac']);                
                if(count($macary) > 2){
                    $smac = strtoupper($macary[0].$macary[1].$macary[2]);                    
                    $res = $sql_oui->querySingle("select company_simple from oui_info where mac_prefix='{$smac}'",true);
                    if(isset($res['company_simple'])){
                        $row['type'] = $res['company_simple'];                
                    }else{
                        $row['type'] = '';       
                    }
                } 
                $datalist[] = $row;
            }
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
            'groupid'=>(int)element('groupid',$data,1),
            'enable'=>(int)element('enable',$data,1),
            'wscanrpttime'=>(int)$min*60
        );        
        $result = wscan_set_param(json_encode($cgiary));
        return $result;
    }    
}