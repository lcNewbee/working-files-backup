<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class MonitorAps extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function fetch() {
        $rqdata = array(
            'groupid' => (int)element('groupid', $_GET, -1), 
            'page' => (int)element('page', $_GET, 1), 
            'size' => (int)element('size', $_GET, 20), 
            'search' => element('search', $_GET, '')
        );
        // 如果groupid不存在或值为-1则返回默认设备
        if ($rqdata['groupid'] === - 1) {
            $result = axc_get_auto_aps();						
        } else {
            // 非默认组
            $result = axc_get_aps(json_encode($rqdata));
        }
        return $result;
    }
    function is_active($mac){
        $result = FALSE;
        $sql = "select active from ap_firmware where active=1 and model in(select model_name from ap_list where mac='".$mac."')";
        $query = $this->db->query($sql);        
        if($query->row()->active === 1){
            $result = TRUE;
        }
        return $result;
    }
    function onAction($data) {
        $result = null;
        $operate = element("action", $data);
        $selectedList = element("selectedList", $data);
        $groupid = (int)element("groupid", $data);      
        foreach ($selectedList as $mac) {            
            if($operate === 'upgrade' && !$this->is_active($mac)){
                $result = json_encode(json_no('Version not activated'));
            }else{
                $retdata = array("groupid" => $groupid, "operate" => $operate, "mac" => $mac,);
                $result = axc_set_apoperate(json_encode($retdata));
                //log
                $cgiObj = json_decode($result);			
                if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
                    $logary = array(
                        'type'=>$retdata['operate'],
                        'operator'=>element('username',$_SESSION,''),
                        'operationCommand'=>$retdata['operate']." Ap ".$retdata['mac'],
                        'operationResult'=>'ok',
                        'description'=>json_encode($retdata)
                    );
                    Log_Record($this->db,$logary);
                }                
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
        } elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo $result;
        }
    }
}
