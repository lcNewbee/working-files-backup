<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemMaintenance extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->helper('file');
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function fetch() {
        $retdata = array(
            'page' => element('page',$_GET,1),
            'size' => element('size',$_GET,20)
        );
        $querydata = $this->db->query('select discover as discoverycnt,countrycode,echo as echotime,acstatistime as statistime,autoap from capwap');
        $arr = array(
            'state' => array('code'=>2000,'msg'=>'ok'),
            'data' => array(
                'settings'=>$querydata->row_array()
            )
        );
        return json_encode($arr);
    }
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        if ($actionType === 'setting') {
            $cgiary = array(
                'discoverycnt' => (int)element('discoverycnt',$data,5),
                'echotime' => (int)element('echotime',$data,10),
                'statistime' => (int)element('statistime',$data,120),
                'autoap' => (int)element('autoap',$data,1),
                'countrycode' => element('countrycode',$data),
            );
            $result = axc_set_capwap_param(json_encode($cgiary));
            //log
            $cgiObj = json_decode($result);
            if(is_object($cgiObj) && $cgiObj->state->code === 2000) {
                $logary = array(
                    'type'=>'Setting',
                    'operator'=>element('username',$_SESSION,''),
                    'operationCommand'=>"Setting capwap",
                    'operationResult'=>'ok',
                    'description'=>json_encode($cgiary)
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
    public function backup() {
        $logary = array(
            'type'=>'Backup',
            'operator'=>element('username',$_SESSION,''),
            'operationCommand'=>"Backup AC config",
            'operationResult'=>'ok',
            'description'=>""
        );
        Log_Record($this->db,$logary);
        //系统备份
        //copy('/var/run/config.db','/var/conf/config.db');
        exec('cp /var/run/config.db /var/conf/config.db');
        //download
        $this->load->helper('download');
        $data = file_get_contents("/var/conf/config.db");
        $name = 'config.db';
        force_download($name, $data);
    }
    public function reboot() {
        $logary = array(
            'type'=>'Reboot',
            'operator'=>element('username',$_SESSION,''),
            'operationCommand'=>"Reboot AC",
            'operationResult'=>'ok',
            'description'=>""
        );
        Log_Record($this->db,$logary);
        //重启系统
        exec('/sbin/reboot');
    }
    public function restore() {
        if(isset($_POST['suffix'])) {
            //从文件恢复
            $result = $this->do_upload();
            if ($result['state']['code'] === 2000){
                exec('/sbin/reboot');
            } else{
                $result = json_encode($result);
            }
        } else {
            //恢复出厂设置
            if(file_exists('/var/conf/config.db')) {
                unlink('/var/conf/config.db');
            }
            if(file_exists('/var/netmanager/mysql')) {
                delete_files('/var/netmanager/mysql', TRUE);
            }
            exec('/sbin/reboot');
        }
    }
    //上传
    public function do_upload() {
        $result = null;
        $config['upload_path'] = '/var/conf';
        $config['allowed_types'] = '*';
        $config['overwrite'] = true;
        $config['max_size'] = 0;
        $config['file_name'] = 'config.db';

        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('filename')) {
            $error = array('error' => $this->upload->display_errors());
            $result = array('state' => array('code' => 4000, 'msg' => $error));
        } else {
            $data = array('upload_data' => $this->upload->data());
            $result = array('state' => array('code' => 2000, 'msg' => 'OK'), 'data' => $data);
        }
        return $result;
    }
}
