<?php
class MapClientsSet_Model extends CI_Model {
    public function __construct() {
        parent::__construct();		
        $this->mysql = $this->load->database('mysqli', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {   
        //$queryd = $this->mysql->query("call getwidsreport('12:a1:2c:34:b4:14',rttime)");
        echo 123;
    }
    function setting($data) {
        $result = null;
        $cgiary = array(
            'groupid'=>element('groupid',$data,1),
            'enable'=>element('type',$data,1),
            'reporttime'=>element('wscanrpttime',$data,10)
        );
        $result = axc_set_wscan(json_encode($cgiary));
        return $result;
    }
}