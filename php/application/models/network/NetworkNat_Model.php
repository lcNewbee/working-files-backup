<?php
class NetworkNat_Model extends CI_Model {
	public function __construct() {
        $this->load->library('session');
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'db_operation'));
	}

    function get_list() {
        $result = null;
		$query = $this->db->select('id,type,addr,nataddr,pubifname')
                            ->from('nat_table')
                            ->get()->result_array();

		$settings = $this->db->select('enable')
                                ->from('natenable')
                                ->get()->result_array();

		$data = array(
            "settings" => array("enable" => (string)element('enable', $settings[0]),),
            'list' => $query
        );
		$result = array(
            'state' => array('code' => 2000, 'msg' => 'OK'),
            'data' => $data
        );
		return $result;
	}

    function add($data) {
        $result = null;
        $cgiParams = $this->getCgiParams($data);
        $result = acnetmg_add_nat(json_encode($cgiParams));
        $loginfo = array(
            'type' => 'Add', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Add  Nat", 
            'operationResult' => preg_replace('#\s+#', '',trim($result)),
            'description' => json_encode($cgiParams)
        );
        Log_Record($this->db, $loginfo);
        return $result;
    }
    function delete($data) {
        $result = null;
        foreach($data as $item) {
        $deleteItem = $this->getCgiParams($item);
            $result = acnetmg_del_nat(json_encode($deleteItem));
            $loginfo = array(
                'type' => 'Delete', 
                'operator' => element('username', $_SESSION, ''), 
                'operationCommand' => "Delete  Nat", 
                'operationResult' => preg_replace('#\s+#', '',trim($result)),
                'description' => json_encode($deleteItem)
            );
            Log_Record($this->db, $loginfo);
        }
        return $result;
    }
    function edit($data) {
        $result = null;
        $cgiParams = $this->getCgiParams($data);
        $result = acnetmg_update_nat(json_encode($cgiParams));
        $loginfo = array(
            'type' => 'Edit', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Edit  Nat", 
            'operationResult' => preg_replace('#\s+#', '',trim($result)),
            'description' => json_encode($cgiParams)
        );
        Log_Record($this->db, $loginfo);
        return $result;
    }
    function setting($data) {
        $result = null;
        $cgiParams = array(
            'enable'=>(int)element('enable', $data)
        );
        $result = acnetmg_nat_enable(json_encode($cgiParams));
        $loginfo = array(
            'type' => 'Setting', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Setting  Nat", 
            'operationResult' => preg_replace('#\s+#', '',trim($result)),
            'description' => json_encode($cgiParams)
        );
        Log_Record($this->db, $loginfo);
        return $result;
    }

    private function getCgiParams($data) {
        $ret = array(
            'id'=>element('id', $data),
            'type'=>element('type', $data),
            'ipaddr'=>element('addr', $data),
            'natipaddr'=>element('nataddr', $data),
            'ifname'=>element('pubifname', $data),
        );
        return $ret;
    }
}
