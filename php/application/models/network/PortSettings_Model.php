<?php
class PortSettings_Model extends CI_Model {
	public function __construct() {        
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'db_operation'));
	}

    function get_list($data) {
        $parameter = array(
			'db' => $this->db, 
			'columns' => '*', 
			'tablenames' => 'port_cfg', 
			'pageindex' => (int) element('page', $data, 1), 
			'pagesize' => (int) element('size', $data, 20), 
			'wheres' => "1=1", 
			'joins' => array(), 
			'order' => array(array('id','ASC'))
		);		
		$datalist = help_data_page_all($parameter);		  
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(                
                'page' => $datalist['page'],
                'list' => $datalist['data']
            )
        );
		return $arr;
    }
    
    function edit($data){
        $result = 0;
        $up = array(            
            'name' => element('name', $data),
            'vlanId' => element('vlanId', $data),
            'nativeVlan' => element('nativeVlan', $data),
            'vlanList' => element('vlanList', $data),
            'exchangeMode' => element('exchangeMode', $data),
            'status' => element('status', $data),
            'rate' => element('rate', $data),
            'workMode' => element('workMode', $data),
            'maxPacket' => element('maxPacket', $data),
            'description' => element('description', $data)
        );
        $this->db->where('id', $data['id']);
        $result = $this->db->update('port_cfg', $up);          
        $result = $result > 0 ? json_ok() : json_no();
        return json_encode($result);
    }    
}