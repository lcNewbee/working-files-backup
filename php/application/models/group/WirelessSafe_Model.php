<?php
class WirelessSafe_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	public function get_wips_list($retdata) {
        $arr['state'] = array("code"=>2000,"msg"=>"ok");
        $queryd = $this->db->select('enable,cycles,scantype,apopermode,rpttime,chlnum,enable2g4chl,enable2g4pwr,adjafactor2g4,enable5gchl,enable5gpwr,adjafactor5g,maxtxpwr')
                            ->from('wrrm_template')
                            ->where('id', $retdata['groupid'])
                            ->get()
                            ->result_array();
        if(count($queryd) > 0) {
            $arr['data'] = array("settings"=>$queryd[0]);
        }else{
            $arr['state'] = array("code"=>4000,"msg"=>"not");
        }
        return json_encode($arr);
    }

    public function add_wips_cfg($data) {
        $result = null;
        $arr = $data;
        $arr['groupid'] = (int)element('groupid',$data);

        $result = wrrm_set_param(json_encode($arr));
        //log
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            $logary = array(
                'type'=>'Setting',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Setting WIPS",
                'operationResult'=>'ok',
                'description'=>json_encode($arr)
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }

}
