<?php
/**
 * AP 反制
*/
defined('BASEPATH') OR exit('No direct script access allowed');
class ApCounter extends CI_Controller {
    public function __construct() {
        parent::__construct();
         $this->mysql = $this->load->database('mysqli', TRUE);
        $this->load->helper('array');        
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
    private function fetch(){
        $result = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>array()
            )
        );        
        $stnssid = $_GET['ssidname'];
        $stnmac = $_GET['ssidmac'];
        // call getapmac_by_ssid('qiangliu-test-222', 'b6:c6:f8:00:00:89');
        $query = $this->mysql->query("call getapmac_by_ssid('{$stnssid}', '{$stnmac}')");
        foreach($query->result_array() as $row){
            array_push($result['data']['list'],array('apMac'=>$row['ApMac']));
        }        
        return json_encode($result);
    }
    function onAction($data) {        
        $result = null;
        $actionType = element('action', $data);
        switch($actionType) {
            case 'edit' : $result = $this->ap_counter($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }
        return $result;        
    } 
    //反制
    private function ap_counter($data){
        $result = null;
        $arycgi = array(
            'apmac'=>element('apMac',$data),
            'radioid'=>(int)element('radioId',$data,1),
            'ssidmac'=>element('ssidmac',$data),
            'ssidname'=>element('ssidname',$data),
            'channel'=>(int)element('channel',$data),
            'wirelessmode'=>element('wirelessmode',$data)
        );
        $result = axc_set_apagainst(json_encode($arycgi));
        return $result;
    }
}