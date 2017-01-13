<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class WirelessSmart extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->model('group/WirelessAcl_Model');
    }
    function fetch(){
        $retdata = array(
            'groupid'=>(int)element('groupid', $_GET),
        );
        $cgiResult = json_decode(axc_get_wireless_smart(json_encode($retdata)));
        $result=array(
            'state'=>$cgiResult->state,
            'data'=>array(
                'settings'=>$cgiResult->data
            )
        );
        return json_encode($result);
    }

    function onAction($data) {
        $result = null;
        $result = axc_set_wireless_smart(json_encode($data));
        //log
        $cgiObj = json_decode($result);			
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log                
            $logary = array(
                'type'=>'Setting',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Setting Default Radio  groupId=".$data['groupid'],
                'operationResult'=>'ok',
                'description'=>json_encode($data)
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }

    public function index() {
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $result = $this->onAction($data);
            echo $result;
        } else if($_SERVER['REQUEST_METHOD'] == 'GET') {
        $result = $this->fetch();
            echo $result;
        }
    }
}
