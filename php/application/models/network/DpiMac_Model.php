<?php
class DpiMac_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {
		$result = null;
		$cgiary = array(
			'page'=>'1',
			'pagesize'=>'20'
		);
		$mac_result = ndpi_send_mac_to_php_db(json_encode($cgiary));
    $mac_result_array = json_decode($mac_result);
    $cgiprm = array(
        'mac'=>element('mac',$data),
        'days'=>element('days',$data,7)
    );
    $mac_history_result = ndpi_send_mac_history_statistics(json_encode($cgiprm));
    $mac_history_result_array = json_decode($mac_history_result);
    $result_array =  array(
      'state'=> $mac_result_array['state'],
			'data'=> array (
         'list'=> $mac_result_array['data']['list'],
         'downloadlist'=> $mac_history_result_array['data']['list'],
      )
		);
    return json_encode($result);
	}
}
