<?php
class ApRadio_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));		
	}
    function get_apradio_info($data) {
        $retdata = array(
			'groupid' => (int)element('groupid', $data),
			'mac' => element('mac', $data)
		);
		$temp_result = axc_get_apradio(json_encode($retdata));
    	$ap_info = null;
    	try {
      		$ap_info = axc_get_apinfo(json_encode($retdata));
			$ap_info = json_decode($ap_info);
			$ap_info = $ap_info->data->info;
		} catch (Exception $e) {
			$ap_info = array(
				'mac'=> element('mac', $data)
			);
		}

		$temp_result_data = json_decode($temp_result);
		$result = array(
			'state' => $temp_result_data->state,
			'data' => array(
				'groupid' => (int)element('groupid', $data),
				'mac' => element('mac', $data),
				'radios' => $temp_result_data->data,
			'info'=>$ap_info
			)
		);
		return $result;
    }
    function set_def_apradio($data) {
        $result = null;
        $result = axc_set_apradio(json_encode($data));
        //l			og
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            $logary = array(
                'type'=>'Setting',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Setting Radio ".$data['mac'],
                'operationResult'=>'ok',
                'description'=>json_encode($data)
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    function set_apradio($data) {
        $result = null;
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
            //l				og
            $cgiObj = json_decode($cgidata);
            if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
                $ok_num++;
                $logary = array(
                    'type'=>'Setting',
                    'operator'=>element('username',$_SESSION,''),
                    'operationCommand'=>"Setting Radio ".$arr['mac'],
                    'operationResult'=>'ok',
                    'description'=>json_encode($arr)
                );
                Log_Record($this->db,$logary);
            }
        }
        $result = json_encode(json_ok($ok_num));
        return $result;
    }
    function get_radio_id($groupid) {
		$result = 0;
		$queryObj = $this->db->select('radio_tmp_id')
							->from('ap_group')
							->where('id',$groupid)
							->get()->row();

		if(is_object($queryObj)) {
			$result = $queryObj->radio_tmp_id;
		}
		return $result;
	}

    function set_ap_name($data) {
        $result = null;
        $cgiary = array(
            'oldname' => (string)element('oldname',$data),
            'newname' => (string)element('newname',$data)
        );
        $result = axc_change_apname(json_encode($cgiary));
        return $result;
    }
}