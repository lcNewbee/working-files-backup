<?php
class Vlanlist_Model extends CI_Model {
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
			'tablenames' => 'vlan_list', 
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
        $addMethod = element('addMethod', $data, 'single');//默认单个add
        if($addMethod === 'single'){
            $ins = array(
                'vlanId' => element('vlanId', $data, 0),
                'vlanName' => element('vlanName', $data, ''),
                'status' => 'static',
                'description' => element('description', $data, '')
            );
            $result = $this->db->insert('vlan_list', $ins);
        }
        if($addMethod === 'group'){
            //批量add
            $vlanRange = element('vlanRange', $data);
            $ary = explode("-", $vlanRange);
            $strvlan = $ary[0];
            $endvlan = $ary[1];
            while($strvlan <= $endvlan){                
                $result = $result + $this->db->insert('vlan_list', array('vlanId' => $strvlan,'status'=>'static'));
                $strvlan++;
            }
        }        
        $result = $result > 0 ? json_ok($result) : json_no();
        $loginfo = array(
            'type' => 'Add', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "add vlan", 
            'operationResult' => json_encode($result),
            'description' => json_encode($data)
        );
        Log_Record($this->db, $loginfo);
        return json_encode($result);
    }
    function delete($data){
        $del_data = element('selectedList', $data, array());
        foreach($del_data as $row){
            $this->db->where('id', $row['id']);
            $this->db->delete('vlan_list');
        }       
        $loginfo = array(
            'type' => 'Delete', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "delete vlan", 
            'operationResult' => 'ok',
            'description' => json_encode($del_data)
        );
        Log_Record($this->db, $loginfo);
        return json_encode(json_ok());
    }
    function edit($data){
        $result = 0;
        $up = array(            
            'vlanName' => element('vlanName', $data, ''),
            'status' => 'static',
            'description' => element('description', $data, '')
        );
        $this->db->where('id', $data['id']);
        $result = $this->db->update('vlan_list', $up);          
        $result = $result > 0 ? json_ok() : json_no();
        $loginfo = array(
            'type' => 'Update', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "update vlan", 
            'operationResult' => json_encode($result),
            'description' => json_encode($up)
        );
        Log_Record($this->db, $loginfo);
        return json_encode($result);
    }
}