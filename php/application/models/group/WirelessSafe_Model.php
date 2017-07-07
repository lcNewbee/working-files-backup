<?php
class WirelessSafe_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	public function get_wips_list($retdata) {              
        $queryd = $this->db->select('enable,cycles,scantype,apopermode,rpttime,chlnum,enable2g4chl,enable2g4pwr,adjafactor2g4,enable5gchl,enable5gpwr,adjafactor5g,maxtxpwr')
                            ->from('wrrm_template')
                            ->where('id', $retdata['groupid'])
                            ->get()
                            ->result_array();
        $retary = array();                    
        if(count($queryd) > 0) {
            $retary = $queryd[0];   
            //页面UI需要的是字段是scanSpectrum 需要转换，值也要做转换 
            $scanSpectrum = '';
            $ary = explode(",", $queryd[0]['chlnum']);
            if(in_array('1', $ary)){
                $scanSpectrum = '2';
            }
            if(in_array('36', $ary)){
                $scanSpectrum = '5';
            }
            if(in_array('1', $ary) && in_array('36', $ary)){
                $scanSpectrum = '2,5';
            }
            $retary['scanSpectrum'] = $scanSpectrum;
        }

        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'settings' => $retary
            )
        );

        return json_encode($arr);
    }

    public function add_wips_cfg($data) {
        $result = null;
        $arr = array();
        foreach($data as $key => $value){
            if($key == 'action'){
                continue;
            }
            if($key == 'scanSpectrum'){
                if($value == '2'){
                    $arr['chltype'] = 1;
                }
                if($value == '5'){
                    $arr['chltype'] = 2;
                }
                if($value == '2,5' || $value == '5,2'){
                    $arr['chltype'] = 3;
                }
                continue;
            }
            $arr[$key] = $value;
        }
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
