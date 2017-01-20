<?php
class DpiFlowInfo_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));        
    }
    function get_list($data) {
        $result = null;   
        $cgiprm = array(
            'page'=>element('page',$data,1),
            'pagesize'=>element('size',$data,20)
        );        
        $result = ndpi_send_flowid_to_php_db(json_encode($cgiprm));             
        return $result;
    }
    function add_account($data) {
        $result = null;
        $insertary = $this->getDbParam($data);                   
        $result = $this->portalsql->insert('portal_account', $insertary);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }

}       