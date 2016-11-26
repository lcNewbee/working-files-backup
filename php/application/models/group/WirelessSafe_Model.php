<?php
class WirelessSafe_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	public function get_wips_list($retdata) {
        $arr['state'] = array("code"=>2000,"msg"=>"ok");
        $queryd = $this->db->select('enable,cycles,scantype,apopermode,rpttime,chlnum,enable2g4chl,enable2g4pwr,adjafactor2g4,maxtxpwr')
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
        $arr['groupid'] = (int)element('groupid',$data,-1);
        $arr['enable'] = (int)element('enable',$data,0);      /*功能开关*/
        $arr['cycles'] = (int)element('cycles',$data,0);              /* 扫描循环次数。值255表示持续进行循环扫描，0-扫描停止 */
        $arr['scantype'] = (int)element('scantype',$data,1);          /* 扫描类型，1 主动扫描，2 被动扫描模式 */
        $arr['apopermode'] = (int)element('apopermode',$data,1);      /* AP操作模式，1 正常工作模式，2 纯监测模式 */
        $arr['maxtxpwr'] = element('maxtxpwr',$data,100);             /* 最大功率 */
        $arr['rpttime'] = (int)$data['rpttime'];                      /* 信道质量报告上报时间 */
        $arr['chlnum'] = element('chlnum',$data,'1,2,6,11,13,14');    /* 信道集合 '1,2,6,11,13,14'*/
        $arr['enable2g4chl'] = (int)element('enable2g4chl',$data,0);  /* 2.4G自动信道扫描开关 */
        $arr['enable2g4pwr'] = (int)element('enable2g4pwr',$data,0);  /* 2.4G自动功率扫描开关 */
        $arr['adjafactor2g4'] = (int)element('adjafactor2g4',$data,1); /* 2.4G频段邻居系数 > 0 */
        $result = wrrm_set_param(json_encode($arr));
        return $result;
    }

}
