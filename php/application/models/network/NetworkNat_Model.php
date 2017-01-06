<?php
class NetworkNat_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}

    function get_net_list() {
        $result = null;
		$query = $this->db->select('id,type,addr,nataddr')
                            ->from('nat_table')
                            ->get()->result_array();

		$settings = $this->db->select('enable')
                                ->from('natenable')
                                ->get()->result_array();
		$keys = array(
            'id' => 'id', 
            'type' => 'ruleType', 
            'addr' => 'sourceAddress', 
            'nataddr' => 'conversionAddress'
        );
		$newArray = array();
		foreach ($query as $key => $val) {
			$newArray[$key] = array();
			foreach ($val as $k => $v) {
				$newArray[$key][$keys[$k]] = $v;
			}
		}
		$data = array(
            "settings" => array("enable" => (string)element('enable', $settings[0]),), 
            'list' => $newArray
        );
		$result = array(
            'state' => array('code' => 2000, 'msg' => 'OK'), 
            'data' => $data
        );
		return $result;
	}

    function add_net($data) {
        $result = null;
        $cgiParams = $this->getCgiParams($data);
        $result = acnetmg_add_nat(json_encode($cgiParams));
        return $result;
    }
    function del_net($data) {
        $result = null;
        foreach($data as $item) {
        $deleteItem = $this->getCgiParams($item);
            $result = acnetmg_del_nat(json_encode($deleteItem));
        }
        return $result;
    }
    function edit_net($data) {
        $result = null;
        $cgiParams = $this->getCgiParams($data);
        $result = acnetmg_update_nat(json_encode($cgiParams));
        return $result;
    }
    function setting_net($data) {
        $result = null;
        $cgiParams = array(
            'enable'=>(int)element('enable', $data)
        );
        $result = acnetmg_nat_enable(json_encode($cgiParams));
        return $result;
    }

    function getCgiParams($data) {
        $ret = array(
            'id'=>element('id', $data),
            'type'=>element('ruleType', $data),
            'ipaddr'=>element('sourceAddress', $data),
            'natipaddr'=>element('conversionAddress', $data),
        );
        return $ret;
    }
}