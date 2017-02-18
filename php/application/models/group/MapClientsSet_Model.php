<?php
class MapClientsSet_Model extends CI_Model {
    public function __construct() {
        parent::__construct();	
        $this->load->database();	
        $this->mysql = $this->load->database('mysqli', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {   
        //$this->db->query('select wscanenable,wscanrpttime from wrrm_template where id='.$data['groupid']);            
    }
    function setting($data) {
        $result = null;
        $cgiary = array(
            'groupid'=>element('groupid',$data,1),
            'enable'=>element('type',$data,1),
            'reporttime'=>element('wscanrpttime',$data,100)
        );
        $result = axc_set_wscan(json_encode($cgiary));
        return $result;
    }
}