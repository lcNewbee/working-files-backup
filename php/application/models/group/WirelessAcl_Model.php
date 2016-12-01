<?php
class WirelessAcl_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
		$this->load->library('SqlPage');
	}
	public function get_acl_list($retdata) {
		$result = axc_get_wireless_acl(json_encode($retdata));
		$result = json_decode($result);
		$settingary = array();
		$dyblk = $this->db
              ->select('id as groupid,attack_time as attacttime,attack_cnt as attactcnt,age_time as dyaging')
              ->from('wids_template')
              ->where('id', $retdata['groupid'])
              ->get()->result_array();

		if(count($dyblk) > 0){
			$settingary = $dyblk[0];
		}	  		
		$result->data->settings = $settingary;
		return json_encode($result);
	}
	public function add_acl($data) {
		$result = null;
		if (!empty($data['groupid'])) {
			$cgiary['groupid'] = (int)$data['groupid'];
			$cgiary['mac'] = (string)$data['mac'];
			$cgiary['reason'] = (string)$data['reason'];
			$result = axc_set_wireless_acl(json_encode($cgiary));
		}
		return $result;
	}
	public function copy_config($data) {
		$retdata = array('groupid' => (int)element('copyFromGroupId', $data, -1));
		$datalist = axc_get_wireless_acl(json_encode($retdata));
		$dataary = json_decode($datalist);
		if(is_object($dataary)) {			
			if(count($dataary->data->list) > 0) {
				$arr = array();
				$arr['groupid'] = (int)element('groupid', $data, -1);
				foreach($dataary->data->list as $obj) {
					$arr['mac'] = (string)$obj->mac;
					$arr['reason'] = (string)$obj->reason;
					axc_set_wireless_acl(json_encode($arr));
				}
			}
		}else{
			return json_encode(json_no('groupid error'));
		}
		return json_encode(json_ok());
	}
	public function delete_acl($data) {
		$result = null;
		if (!empty($data['groupid'])) {
			$detary = array();
			$detary['groupid'] = $data['groupid'];
			foreach( $data['selectedList'] as $ary){
				$detary['mac'] = $ary['mac'];
				axc_del_wireless_acl(json_encode($detary));
			}
			$result = json_encode(array('state' => array('code' => 2000, 'msg' => 'ok')));
		}
		return $result;
	}
	public function other_config($data) {
		$result = null;
		if(!empty($data['groupid'])){
			$cgi_dyblk['groupid'] = (int)$data['groupid'];
			$cgi_dyblk['attacttime'] = (int)$data['attacttime'];
			$cgi_dyblk['attactcnt'] = (int)$data['attactcnt'];
			$cgi_dyblk['dyaging'] = (int)$data['dyaging'];
			$result = axc_set_wireless_dyblk(json_encode($cgi_dyblk));
		}
		return $result;
	}
}
