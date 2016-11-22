<?php
class WirelessAcl_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
		$this->load->library('SqliteDB');		
	}
	public function get_acl_list($retdata) {
        $result = axc_get_wireless_acl(json_encode($retdata));
        $result = json_decode($result);
        $dyblk = $this->db->select('id,attack_time,attack_cnt,age_time')
                        ->from('wids_template')
                        ->where('id', $retdata['groupid'])
                        ->get()->result_array();

        $keys = array('id' => 'groupid', 'attack_time' => 'attacttime', 'attack_cnt' => 'attactcnt', 'age_time' => 'dyaging');
        $dyblk_data = array();
        foreach ($dyblk as $key => $val) {
            $dyblk_data[$key] = array();
            foreach ($val as $k => $v) {
                $dyblk_data[$key][$keys[$k]] = $v;
            }
        }
        $result->data->settings = $dyblk_data['0'];
        return json_encode($result);
    }
	public function add_acl($data) {
		$result = null;
		if (!empty($data['groupid'])) {
			$cgiary['groupid'] = $data['groupid'];
			$cgiary['mac'] = $data['mac'];
			$cgiary['reason'] = $data['reason'];
			$result = axc_set_wireless_acl(json_encode($cgiary));
		}
		return $result
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
        return $result
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
        return $result
    } 
}
