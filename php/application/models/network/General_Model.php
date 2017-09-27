<?php
class General_Model extends CI_Model {
	public function __construct() {        
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'db_operation'));
	}

    function get_list($data) {
        $settings = $this->getNetworkInterface();
        $route_ipv4 = $this->getRouteList(1,$data);        
        $route_ipv6 = array('page'=>array(),'data'=>array());
        if($settings['ipv6Enable'] == 1){
            $route_ipv6 = $this->getRouteList(2,$data);
        }        
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'settings' => $settings,
                'page' => $route_ipv4['page'],
                'list' => $route_ipv4['data'],
                'ipv6Page' => $route_ipv6['page'],
                'ipv6List' => $route_ipv6['data']
            )
        );
		return $arr;
    }
    function add($data){
        $result = 0;
        $listId = element('listId', $data, 0);
        if($listId === 0){
            //add ipv4
            $ins = array(
                'type' => 1,
                'name' => element('name', $data, ''),
                'subnet' => element('subnet', $data, ''),
                'gateway' => element('gateway', $data, '')
            );
            $result = $this->db->insert('network_route_list', $ins);
            $loginfo = array(
                'type' => 'Add', 
                'operator' => element('username', $_SESSION, ''), 
                'operationCommand' => "Add  route", 
                'operationResult' => preg_replace('#\s+#', '',trim($result)),
                'description' => json_encode($ins)
            );
            Log_Record($this->db, $loginfo);
        }
        if($listId === 'ipv6'){
            //add ipv6
            $ins = array(
                'type' => 2,
                'name' => element('name', $data, ''),
                'prefix' => element('prefix', $data, ''),
                'gateway' => element('gateway', $data, '')
            );
            $result = $this->db->insert('network_route_list', $ins);
            $loginfo = array(
                'type' => 'Add', 
                'operator' => element('username', $_SESSION, ''), 
                'operationCommand' => "Add  route", 
                'operationResult' => preg_replace('#\s+#', '',trim($result)),
                'description' => json_encode($ins)
            );
            Log_Record($this->db, $loginfo);
        }
        $result = $result > 0 ? json_ok() : json_no();
        return json_encode($result);
    }
    function delete($data){
        $listId = element('listId', $data, 0);        
        if($listId === 0){
            //del ipv4
            $del_data = element('selectedList', $data, array());
            foreach($del_data as $row){
                $this->db->where('id', $row['id']);
                $this->db->delete('network_route_list');
            }            
        }
        if($listId === 'ipv6'){
            //del ipv6
            $del_data = element('selectedIpv6List', $data, array());
            foreach($del_data as $row){
                $this->db->where('id', $row['id']);
                $this->db->delete('network_route_list');
            }
        }
        $loginfo = array(
            'type' => 'Delete', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "delete  route", 
            'operationResult' => 'ok',
            'description' => json_encode($data['selectedList'])
        );
        Log_Record($this->db, $loginfo);
        return json_encode(json_ok());
    }
    function edit($data){
        $result = 0;
        $listId = element('listId', $data, 0);
        if($listId === 0){
            //up ipv4
            $up = array(
                'name' => element('name', $data, ''),
                'subnet' => element('subnet', $data, ''),
                'gateway' => element('gateway', $data, ''),
                'prefix' => null
            );
            $this->db->where('id', $data['id']);
            $result = $this->db->update('network_route_list', $up);
            $loginfo = array(
                'type' => 'Update', 
                'operator' => element('username', $_SESSION, ''), 
                'operationCommand' => "update  route", 
                'operationResult' => preg_replace('#\s+#', '',trim($result)),
                'description' => json_encode($up)
            );
            Log_Record($this->db, $loginfo);
        }
        if($listId === 'ipv6'){
            //up ipv6
            $up = array(
                'name' => element('name', $data, ''),
                'subnet' => null,
                'prefix' => element('prefix', $data, ''),
                'gateway' => element('gateway', $data, '')
            );
            $this->db->where('id', $data['id']);
            $result = $this->db->update('network_route_list', $up);
            $loginfo = array(
                'type' => 'Update', 
                'operator' => element('username', $_SESSION, ''), 
                'operationCommand' => "update  route", 
                'operationResult' => preg_replace('#\s+#', '',trim($result)),
                'description' => json_encode($up)
            );
            Log_Record($this->db, $loginfo);
        }
        $result = $result > 0 ? json_ok() : json_no();
        return json_encode($result);
    }
    function setting($data){        
        $deviceName = element('deviceName', $data, '');
        $ipv4Ip = element('ipv4Ip', $data, '');
        $ipv4Mask = element('ipv4Mask', $data, '');
        $ipv4Vlan = element('ipv4Vlan', $data, '');
        $ipv6Enable = (int)element('ipv6Enable', $data, 0);
        $ipv6Ip = element('ipv6Ip', $data, '');
        $ipv6Prefix = element('ipv6Prefix', $data, '');

        $this->setAcConfig($deviceName,$ipv6Enable);

        $is_ipv4 = 0;
        $is_ipv6 = 0;
        $query = $this->db->query("select id,type from network_interface")->result_array();
        foreach($query as $row){
            if($row['type'] === 1){
                $is_ipv4 = $row['id'];
            }
            if($row['type'] === 2){
                $is_ipv6 = $row['id'];
            }
        }
        //ipv4
        if($is_ipv4){
            //up
            $update = array(
                'type' => 1,
                'ipv4Ip' => $ipv4Ip,
                'ipv4Mask' => $ipv4Mask,
                'ipv4Vlan' => $ipv4Vlan,
                'ipv6Ip' => null,
                'ipv6Prefix' => null
            );
            $this->db->where('id',$is_ipv4);
            $this->db->update('network_interface', $update);            
        }else{
            //insert
            $ins = array(
                'type' => 1,
                'ipv4Ip' => $ipv4Ip,
                'ipv4Mask' => $ipv4Mask,
                'ipv4Vlan' => $ipv4Vlan,
                'ipv6Ip' => null,
                'ipv6Prefix' => null
            );
            $this->db->insert('network_interface', $ins);
        }

        if($ipv6Enable === 1){
            if($is_ipv6){
                //up
                $update = array(
                    'type' => 2,
                    'ipv4Ip' => null,
                    'ipv4Mask' => null,
                    'ipv4Vlan' => null,
                    'ipv6Ip' => $ipv6Ip,
                    'ipv6Prefix' => $ipv6Prefix
                );
                $this->db->where('id',$is_ipv6);
                $this->db->update('network_interface', $update);
            }else{
                //insert
                $ins = array(
                    'type' => 2,
                    'ipv4Ip' => null,
                    'ipv4Mask' => null,
                    'ipv4Vlan' => null,
                    'ipv6Ip' => $ipv6Ip,
                    'ipv6Prefix' => $ipv6Prefix
                );
                $this->db->insert('network_interface', $ins);                
            }
        }
        $loginfo = array(
            'type' => 'Setting', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Setting  network", 
            'operationResult' => 'ok',
            'description' => json_encode($data)
        );
        Log_Record($this->db, $loginfo);
        return json_encode(json_ok());
    }

    private function getAcConfig(){
        $arr = array(
            'deviceName' => 'AxilSpot-AXC-4.0',
            'ipv6Enable' => '0'
        );
        $query = $this->db->query("select * from ac_basis_cfg")->result_array();
        foreach($query as $row){
            if($row['cfg_type'] === 2){
                $arr['deviceName'] = $row['value'];
            }
            if($row['cfg_type'] === 3){
                $arr['ipv6Enable'] = ''.$row['value'];
            }
        }
        return $arr;
    }

    private function setAcConfig($deviceName, $ipv6Enable){
        //修改名称
        $this->db->where('cfg_type',2);
        $ret1 = $this->db->update('ac_basis_cfg',array('value'=>$deviceName));
        //修改ipv6开关
        $this->db->where('cfg_type',3);
        $ret2 = $this->db->update('ac_basis_cfg',array('value'=>''.$ipv6Enable));  
        $loginfo = array(
            'type' => 'Setting', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Setting AC config", 
            'operationResult' => 'ok',
            'description' => json_encode(
                array(
                    array('cfg_type'=>2,'value'=>$deviceName),
                    array('cfg_type'=>3,'value'=>$ipv6Enable)
                )
            )
        );
        Log_Record($this->db, $loginfo);
        return $ret1 + $ret2;      
    }

    private function getNetworkInterface(){
        $acinfo = $this->getAcConfig();
        $arr = array(
            'deviceName' => $acinfo['deviceName'],
            'ipv6Enable' => $acinfo['ipv6Enable'],
            'ipv4Ip' => '',
            'ipv4Mask' => '',
            'ipv4Vlan' => '',
            'ipv6Ip' => '',
            'ipv6Prefix' => ''
        );
        $query = $this->db->query("select * from network_interface")->result_array();
        foreach($query as $row){
            if($row['type'] === 1){
                $arr['ipv4Ip'] = $row['ipv4Ip'];
                $arr['ipv4Mask'] = $row['ipv4Mask'];
                $arr['ipv4Vlan'] = $row['ipv4Vlan'];
            }
            if($row['type'] === 2){
                $arr['ipv6Ip'] = $row['ipv6Ip'];
                $arr['ipv6Prefix'] = $row['ipv6Prefix'];
            }
        }
        return $arr;
    }

    private function getRouteList($type, $data){
        $parameter = array(
			'db' => $this->db, 
			'columns' => '*', 
			'tablenames' => 'network_route_list', 
			'pageindex' => (int) element('page', $data, 1), 
			'pagesize' => (int) element('size', $data, 20), 
			'wheres' => "type={$type}", 
			'joins' => array(), 
			'order' => array(array('id','ASC'))
		);		
		$datalist = help_data_page_all($parameter);
		return $datalist;
    }
}