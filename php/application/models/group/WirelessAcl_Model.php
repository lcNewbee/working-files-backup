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
		if($retdata['groupid'] === -100) {
			$querydata = $this->db->select('mac,vendor,clientType,reason,lastTime')
									->from('sta_black_list')
									->where('id !=',$retdata['filterGroupid'])
									->get()->result_array();
			if(count($querydata) > 0){
				$result->data->list = $querydata;
			}
		}
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
		$maclist = $data['copySelectedList'];
		if(is_array($maclist)) {
			$arr['groupid'] = (int)element('groupid', $data, -1);
			foreach ($maclist as $mac) {
				$arr['mac'] = $mac;
				$arr['reason'] = 'static';
				axc_set_wireless_acl(json_encode($arr));
			}
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
