<?php
class NetworkInterface_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'db_operation'));
	}

	function get_list($data) {
		$parameter = array(
			'db' => $this->db,
			'columns' => 'portid,port_name,port_desc,speed,duplex,ip1,mask1,ip2,mask2,ip3,mask3,ip4,mask4,ip5,mask5,adminstate,mgifname',
			'tablenames' => 'port_table',
			'pageindex' => (int) element('page', $data, 1),
			'pagesize' => (int) element('size', $data, 50),
			'wheres' => "1=1",
			'joins' => array(),
			'order' => array()
		);
		$datalist = help_data_page_all($parameter);

		$interfaces = array();
		$interfaceId = 1;
		foreach ($datalist['data'] as $index => $value) {
			for ($x = 1;$x <= 5;$x++) {
				$ip = element('ip' . $x, $value);
				$mask = element('mask' . $x, $value);
				if ($ip !== '0.0.0.0' && $mask !== '0.0.0.0') {
					$interfaces[] = array(
						'id' => $interfaceId, 
						'name' => element('port_name', $value), 
						'ip' => $ip, 
						'mask' => $mask
					);
					$interfaceId = $interfaceId + 1;
				}
			}
		}
		$arr = array(
			'state' => array('code' => 2000, 'msg' => 'OK'), 
			'data' => array('list' => $interfaces)
		);
		return $arr;
	}
	function add($data) {
		$result = null;
		$addItem = $this->getCgiParam($data);
		$result = acnetmg_add_portip(json_encode($addItem));
		$loginfo = array(
			'type' => 'Add', 
			'operator' => element('username', $_SESSION, ''), 
			'operationCommand' => "add  interface", 
			'operationResult' => preg_replace('#\s+#', '',trim($result)),
			'description' => json_encode($addItem)
		);
		Log_Record($this->db, $loginfo);		
		return $result;
	}
	function delete($data) {
		$result = null;
		foreach ($data as $item) {
			$deleteItem = $this->getCgiParam($item);
			$result = acnetmg_del_portip(json_encode($deleteItem));
			$loginfo = array(
				'type' => 'Delete', 
				'operator' => element('username', $_SESSION, ''), 
				'operationCommand' => "del  interface", 
				'operationResult' => preg_replace('#\s+#', '',trim($result)),
				'description' => json_encode($deleteItem)
			);
			Log_Record($this->db, $loginfo);
		}
		return $result;
	}
	function edit($data) {
		$result = null;
		$oldData = element('originalData', $data);  
		$cgiParams = array(
			'portname' => element('name', $data),
			'oip' => element('ip', $oldData),
			'omask' => element('mask', $oldData),
			'nip' => element('ip', $data),
			'nmask' => element('mask', $data)
		);
		$result = acnetmg_update_portip(json_encode($cgiParams));
		$loginfo = array(
			'type' => 'Edit', 
			'operator' => element('username', $_SESSION, ''), 
			'operationCommand' => "edit  interface", 
			'operationResult' => preg_replace('#\s+#', '',trim($result)),
			'description' => json_encode($cgiParams)
		);
		Log_Record($this->db, $loginfo);
    	return $result;
	}
	private function getCgiParam($data) {
		$arr = array(
			'portname' => element('name', $data),
			'ip' => element('ip', $data),
			'mask' => element('mask', $data)
		);
		return $arr;
	}
}
