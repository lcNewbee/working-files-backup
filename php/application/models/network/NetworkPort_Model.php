<?php
class NetworkPort_Model extends CI_Model {
	public function __construct() {        
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'db_operation'));
	}

    function get_list($data) {
        $result = null;
        $query = $this->db->select('portid,port_name,port_desc,speed,duplex,ip1,mask1,ip2,mask2,ip3,mask3,ip4,mask4,ip5,mask5,adminstate,mgifname')
                            ->from('port_table')->get()->result_array();

        function transformKeys($v) {
            $ret = array();
            $keysMap = array(
                'portid' => 'id', 
                'port_name' => 'name', 
                'duplex' => 'workModel', 
                'port_desc' => 'description', 
                'adminstate' => 'status', 
                'mgifname' => 'mgifname'
            );
            foreach ($v as $key => $value) {
                $realKey = element($key, $keysMap);
                if ($realKey) {
                    $ret[$realKey] = $value;
                } else {
                    $ret[$key] = $value;
                }
            }
            return $ret;
        }
        $list = array_map('transformKeys', $query);
        $result = array(
            'state' => array('code' => 2000, 'msg' => 'OK'), 
            'data' => array('list' => $list)
        );
        return $result;
    }
    
    function edit($data) {
        $result = null;
        $cgiParam = $this->getCgiParams($data);
        $result = acnetmg_add_port(json_encode($cgiParam));
        $loginfo = array(
            'type' => 'Edit', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Edit  Port", 
            'operationResult' => preg_replace('#\s+#', '',trim($result)),
            'description' => json_encode($cgiParam)
        );
        Log_Record($this->db, $loginfo);
        return $result;
    }

    private function getCgiParams($data) {
		$ret = array(
            'portid' => element('id', $data), 
            'portname' => element('name', $data), 
            'speed' => element('speed', $data), 
            'duplex' => element('workModel', $data), 
            'desc' => element('description', $data), 
            'adminstate' => (int)element('status', $data), 
            'mgifname' => (int)element('mgifname', $data)
        );
		return $ret;
	}
}
