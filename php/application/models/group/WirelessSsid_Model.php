<?php
class WirelessSsid_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
		$this->load->library('SqlPage');
	}
	public function get_ssid_list($retdata) {
		$result = null;
        $result = axc_get_wireless_ssid(json_encode($retdata));
		return $result;
	}	
    function getCgiParam($oriData) {
		$ret = array(
            'groupid' => (int)element('groupid', $oriData), 
            'ssid' => element('ssid', $oriData), 
            'remark' => element('remark', $oriData), 
            'vlanid' => (int)element('vlanid', $oriData, 0), 
            'enabled' => (int)element('enabled', $oriData), 
            'maxBssUsers' => (int)element('maxBssUsers', $oriData), 
            'loadBalanceType' => (int)element('loadBalanceType', $oriData), 
            'hiddenSsid' => (int)element('hiddenSsid', $oriData), 
            'storeForwardPattern' => element('storeForwardPattern', $oriData), 
            'upstream' => (int)element('upstream', $oriData), 
            'downstream' => (int)element('downstream', $oriData), 
            'encryption' => element('encryption', $oriData), 
            'password' => element('password', $oriData, '')
        );
		return $ret;
	}
    public function add_ssid($data) {        
        $temp_data = $this->getCgiParam($data);
		return axc_add_wireless_ssid(json_encode($temp_data));
    }
    public function delete_ssid($data) {
        $selectList = element('selectedList', $data);
        foreach ($selectList as $item) {
            $deleteItem = array('groupid' => element('groupid', $data), 'ssid' => element('ssid', $item));
            axc_del_wireless_ssid(json_encode($deleteItem));
        }
        return json_ok();
    }
    public function update_ssid($data) {
        $temp_data = $this->getCgiParam($data);
		return axc_modify_wireless_ssid(json_encode($temp_data));
    }
    public function bind_ssid($data) {
        $temp_data = $this->getCgiParam($data);
		return axc_bind_wireless_ssid(json_encode($temp_data));
    }
    public  function unbind_ssid($data) {
        $temp_data = $this->getCgiParam($data);
        return axc_unbind_wireless_ssid(json_encode($temp_data));
    }
    public function copy_ssid($data) {
        $retdata = array('groupid' => element('copyFromGroupId', $data,-1));
        $getcopylist = axc_get_wireless_ssid(json_encode($retdata));
        $copyary = json_decode($getcopylist,true);
        if(is_array($copyary)){
            if(count($copyary['data']['list']) >0) {
                foreach ($copyary['data']['list'] as $row) {
                    $arr['groupid'] = (int)element('groupid',$data,-1);
                    $arr['ssid'] = (string)element('ssid',$row);
                    axc_bind_wireless_ssid(json_encode($arr));                                                    
                }
            }
        }
        return json_encode(json_ok());
    }
}
