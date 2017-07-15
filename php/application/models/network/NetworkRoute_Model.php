<?php
class NetworkRoute_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'db_operation'));
	}
	public function get_list($retdata) {
		$query = $this->db->select('id,destnet,netmask,gateway')
                        ->from('route_table')
                        ->get()
                        ->result_array();
		$state = array('code' => 2000, 'msg' => 'OK');
		$newArray = null;
		$keys = array(
            'id' => 'id', 
            'destnet' => 'destnet', 
            'netmask' => 'mask', 
            'gateway' => 'gateway'
        );
		if ($query !== null) {
			foreach ($query as $key => $val) {
				$newArray[$key] = array();
				foreach ($val as $k => $v) {
					$newArray[$key][$keys[$k]] = $v;
				}
			}
			$result = array('state' => $state, 'data' => array('list' => $newArray));
		} else {
			$result = array('state' => $state, 'data' => array('list' => '[]'));
		}
		return $result;
	}
	function add($data) {
		$arr['destnet'] = element('destnet', $data);
		$arr['gateway'] = element('gateway', $data);
		$arr['mask'] = element('mask', $data);
		$result = acnetmg_add_route(json_encode($arr));
        $loginfo = array(
            'type' => 'Add', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Add  Route", 
            'operationResult' => preg_replace('#\s+#', '',trim($result)),
            'description' => json_encode($arr)
        );
        Log_Record($this->db, $loginfo);
		return $result;
	}
	function edit($data) {
		$result = acnetmg_update_route(json_encode($data));
        $loginfo = array(
            'type' => 'Edit', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Edit  Route", 
            'operationResult' => preg_replace('#\s+#', '',trim($result)),
            'description' => json_encode($data)
        );
        Log_Record($this->db, $loginfo);
		return $result;
	}
	function delete($data) {
		$result = null;
		$detary = array();
		foreach ($data['selectedList'] as $row) {
			$result = acnetmg_del_route(json_encode($row));
            $loginfo = array(
                'type' => 'Delete', 
                'operator' => element('username', $_SESSION, ''), 
                'operationCommand' => "Delete  Route", 
                'operationResult' => preg_replace('#\s+#', '',trim($result)),
                'description' => json_encode($row)
            );
            Log_Record($this->db, $loginfo);
		}
		return $result;
	}
}
