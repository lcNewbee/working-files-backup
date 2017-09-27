<?php
class IpInterface_Model extends CI_Model {
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
			'tablenames' => 'network_interface_2', 
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
    function add($data){        
        $result = 0;
        $ins = array(                
            'name' => element('name', $data),
            'ipType' => element('ipType', $data),
            'ipv4Ip' => element('ipv4Ip', $data),
            'vlanId' => element('vlanId', $data),
            'mask' => element('mask', $data),
            'ipv4Gateway' => element('ipv4Gateway', $data),
            'natEnable' => element('natEnable', $data),
            'interVlanRouting' => element('interVlanRouting', $data),
            'authentication' => element('authentication', $data),
            'dhcpServerEnable' => element('dhcpServerEnable', $data),
            'ipv6Ip' => element('ipv6Ip', $data),
            'prefix' => element('prefix', $data),
            'ipv6Gateway' => element('ipv6Gateway', $data)
        );
        $result = $this->db->insert('network_interface_2', $ins);
        $result = $result > 0 ? json_ok($result) : json_no();
        $loginfo = array(
            'type' => 'Add', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Add  Ip Interface", 
            'operationResult' => json_encode($result),
            'description' => json_encode($ins)
        );
        Log_Record($this->db, $loginfo);
        return json_encode($result);        
    }    
    function delete($data){
        $del_data = element('selectedList', $data, array());
        foreach($del_data as $row){
            $this->db->where('id', $row['id']);
            $this->db->delete('network_interface_2');
        }       
        $loginfo = array(
            'type' => 'Delete', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "delete  Ip Interface", 
            'operationResult' => 'ok',
            'description' => json_encode($del_data)
        );
        Log_Record($this->db, $loginfo);
        return json_encode(json_ok());
    }
    function edit($data){
        $result = 0;
        $up = array(            
            'name' => element('name', $data),
            'ipType' => element('ipType', $data),
            'ipv4Ip' => element('ipv4Ip', $data),
            'vlanId' => element('vlanId', $data),
            'mask' => element('mask', $data),
            'ipv4Gateway' => element('ipv4Gateway', $data),
            'natEnable' => element('natEnable', $data),
            'interVlanRouting' => element('interVlanRouting', $data),
            'authentication' => element('authentication', $data),
            'dhcpServerEnable' => element('dhcpServerEnable', $data),
            'ipv6Ip' => element('ipv6Ip', $data),
            'prefix' => element('prefix', $data),
            'ipv6Gateway' => element('ipv6Gateway', $data)
        );
        $this->db->where('id', $data['id']);
        $result = $this->db->update('network_interface_2', $up);          
        $result = $result > 0 ? json_ok() : json_no();
        $loginfo = array(
            'type' => 'Update', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "update  Ip Interface", 
            'operationResult' => json_encode($result),
            'description' => json_encode($up)
        );
        Log_Record($this->db, $loginfo);
        return json_encode($result);
    }
}