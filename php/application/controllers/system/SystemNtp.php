<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemNtp extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));
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
        date_default_timezone_set('Asia/Shanghai');
        $retadr['ac_manual_time'] = (string)exec('date "+%Y-%m-%d %H:%M:%S"');
        $arr = array(
            'state' => array('code'=>2000,'msg'=>'ok'),
            'data' => array(
                'settings' => $retadr
            )
        );
        echo json_encode($arr);
    }
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        if ($actionType === 'add') {
            //
        } elseif ($actionType === 'setting') {
            $state = $data['ac_onoff'] === '1' ? 'on' : 'off';
            $arr = array(
                'server_name'=>(string)element('ac_server_name',$data,''),
                'onoff'=>$state,
                'reserver_server'=>(string)element('ac_referral_server',$data,''),
                'interval'=>(string)element('ac_TimeInterval',$data,'30'),
                'timezone'=>(string)element('ac_timezone',$data,''),
                'mysql_time_zone'=>(string)element('mysql_time_zone',$data,''),
            );
            $result = ntptime_msg_from_web(json_encode($arr));
            if($state == 'off'){
                //自定义时间
                exec("date -s '{$data['ac_manual_time']}'");
            }
            //log
            $cgiObj = json_decode($result);
            if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
                $logary = array(
                    'type'=>'Setting',
                    'operator'=>element('username',$_SESSION,''),
                    'operationCommand'=>"Setting NTP ".$arr['server_name'],
                    'operationResult'=>'ok',
                    'description'=>""
                );
                Log_Record($this->db,$logary);
            }
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
