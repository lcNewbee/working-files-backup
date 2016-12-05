<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemNtp extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch() {
        $queryu = $this->db->select('ntptime_attr.attr_name,attr_value')
                            ->from('ntptime_params')
                            ->join('ntptime_attr','ntptime_params.ntptime_attr_id = ntptime_attr.id','left')
                            ->get()->result_array();

        $retadr = array();
        foreach ($queryu as $row) {
            if($row['attr_name'] === 'onoff') {
                $retadr['ac_onoff'] = $row['attr_value'];
            }
            if($row['attr_name'] === 'server_name') {
                $retadr['ac_server_name'] = $row['attr_value'];
            }
            if($row['attr_name'] === 'resever5_str') {
                $retadr['ac_referral_server'] = $row['attr_value'];
            }
            if($row['attr_name'] === 'interval') {
                $retadr['ac_TimeInterval'] = $row['attr_value'];
            }
            if($row['attr_name'] === 'resever6_str') {
                $retadr['ac_timezone'] = $row['attr_value'];
            }
        }
        $arr['state'] = array('code'=>2000,'msg'=>'ok');
        $arr['data'] = array(
            'settings'=>$retadr
        );                
        echo json_encode($arr);
	}
	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {
			
		} elseif ($actionType === 'edit') {
						
		} elseif ($actionType === 'delete') {
			
		} elseif ($actionType === 'setting') {
            $state = $data['ac_onoff'] === '1' ? 'on' : 'off'; 
            $arr = array(                
                'server_name'=>(string)element('ac_server_name',$data,''),
                'onoff'=>$state,
                'reserver_server'=>(string)element('ac_referral_server',$data,''),
                'interval'=>(string)element('ac_TimeInterval',$data,'30'),
                'timezone'=>(string)element('ac_timezone',$data,'')
            );          
			$result = ntptime_msg_from_web(json_encode($arr));
		}
		return $result;
	}
	public function index() {
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
}
