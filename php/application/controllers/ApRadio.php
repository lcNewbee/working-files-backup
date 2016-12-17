<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class ApRadio extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));    
	}
	function fetch() {
		$retdata = array(
            'groupid' => (int)element('groupid', $_GET), 
            'mac' => element('mac', $_GET)
        );
		$temp_result = axc_get_apradio(json_encode($retdata));
		$temp_result_data = json_decode($temp_result);
		$result = array(
            'state' => $temp_result_data->state, 
            'data' => array(
                'groupid' => (int)element('groupid', $_GET), 
                'mac' => element('mac', $_GET), 
                'radios' => $temp_result_data->data
            )
        );
		echo json_encode($result);
	}
	function get_radio_id($groupid) {
		$result = 0;
		$queryObj = $this->db->select('radio_tmp_id')
								->from('ap_group')
								->where('id',$groupid)
								->get()->row();
		
		if(is_object($queryObj)) {

			echo $queryObj->radio_tmp_id;
		}

		return $result;
	}
	function onAction($data) {        
		$result = null;
        $actionType = element('action',$data,'');
        switch($actionType) {
            case 'setting' : 
                $arr = array();   
				$arr['radioId'] = $this->get_radio_id($data['groupid']);
                foreach($data as $k=>$v) {
                   if($k === 'selectedList' || $k === 'action'){
                       continue;
                   }else{
                       $arr[$k] = $v;
                   }
                }            
                $get_all_mac = element('selectedList',$data);
				$ok_num = 0;
                foreach($get_all_mac as $res ) {
					$arr['mac'] = $res;					
                    $cgidata = axc_set_apradio(json_encode($arr));
					if(strpos($cgidata,"2000")) {
						$ok_num++;
					}		
                }
                $result = json_encode(json_ok($ok_num));
                break;
            default :
                $result = axc_set_apradio(json_encode($data));
                break;
        }
		
		return $result;
	}
	public function radio() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
			echo $result;
		}
	}
	public function base() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
			//echo $result;			
		}
	}
}
