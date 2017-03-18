<?php
class NetworkInterface_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}

	function get_interface_list() {
		$result = null;
		$query = $this->db->select('portid,port_name,port_desc,speed,duplex,ip1,mask1,ip2,mask2,ip3,mask3,ip4,mask4,ip5,mask5,adminstate,mgifname')
		                            ->from('port_table')
		                            ->get()->result_array();

		$interfaces = array();
		$interfaceId = 1;
		foreach ($query as $index => $value) {
			for ($x = 1;$x <= 5;$x++) {
				$ip = element('ip' . $x, $value);
				$mask = element('mask' . $x, $value);
				if ($ip !== '0.0.0.0' && $mask !== '0.0.0.0') {
					array_push($interfaces, array(
					                        'id' => $interfaceId,
					                        'name' => element('port_name', $value),
					                        'ip' => $ip,
					                        'mask' => $mask)
					                    );
					$interfaceId = $interfaceId + 1;
				}
			}
		}
		$result = array(
		            'state' => array('code' => 2000, 'msg' => 'OK'),
		            'data' => array('list' => $interfaces)
		        );
		return $result;
	}

	function getCgiParam($data) {
		$retData = array(
		            'portname' => element('name', $data),
		            'ip' => element('ip', $data),
		            'mask' => element('mask', $data)
		        );
		return $retData;
	}

	function add_interface($data) {
		$result = null;
		$addItem = $this->getCgiParam($data);
		$result = acnetmg_add_portip(json_encode($addItem));
		return $result;
	}
	function del_interface($data) {
		$result = null;
		foreach ($data as $item) {
			$deleteItem = $this->getCgiParam($item);
			$result = acnetmg_del_portip(json_encode($deleteItem));
		}
		return $result;
	}
	function edit_interface($data) {
		$result = null;
		$oldData = element('originalData', $data);
  
    $cgiParams = array(
      'portname' => element('name', $data),
      'oip' => element('ip', $oldData),
      'omask' => element('mask', $oldData),
      'nip' => element('ip', $data),
      'nmask' => element('mask', $data)
    )
		//d		el
				//$result = acnetmg_del_portip(json_encode($deleteItem));
		//if (strpos($result, '2000') !== false) {
			//a			dd
		$result = acnetmg_update_portip(json_encode($cgiParams));

		//}
		return $result;
	}
}
