<?php
class MapClients_Model extends CI_Model {
    public function __construct() {
        parent::__construct();		
        $this->mysql = $this->load->database('mysqli', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {   
        $queryd = $this->mysql->query("call getwidsreport('12:a1:2c:34:b4:14',rttime)");
    }
}