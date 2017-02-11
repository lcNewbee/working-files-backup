<?php
class DpiMac_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {
		$result = null;
		$cgiary = array(
			'page'=>'1',
			'pagesize'=>'20'
		);
		$mac_result = ndpi_send_mac_to_php_db(json_encode($cgiary));
    $mac_result_array = json_decode($mac_result,true);
    $cgiprm = array(
        'mac'=>(string)element('mac',$data),
        "set_interval_times" =>(string)element('set_interval_times',$data,0),
        'days'=> (string)element('timeType',$data)
    );
    $mac_history_result = ndpi_send_mac_history_statistics(json_encode($cgiprm));
    $mac_history_result_array = json_decode($mac_history_result,true);
    $upFlowList = array();
    if($mac_history_result_array['state']['code'] === 2000){
      foreach ($mac_history_result_array as $key => $val){
        for($i=0;$i< sizeof($mac_history_result_array['data']['list']);$i++){
          $upFlowList[$i]=$mac_history_result_array['data']['list'][$i]['upbytes'];
        }
      }
    }else{
        $j=(int)$data['timeType'];
        if($j==0||$j==1){
          for($i=0;$i<=24;$i++){
          $upFlowList[$i]=0;
          }
        }
        else{
          for($i=0;$i<=$j;$i++){
            $upFlowList[$i]=0;
          }
        }
    }
    $downFlowList = array();
    if($mac_history_result_array['state']['code'] === 2000){
      foreach ($mac_history_result_array as $key => $val){
        for($i=0;$i< sizeof($mac_history_result_array['data']['list']);$i++){
          $downFlowList[$i]=$mac_history_result_array['data']['list'][$i]['downbytes'];
        }
      }
    }else{
        $j=(int)$data['timeType'];
        if($j==0||$j==1){
          for($i=0;$i<=24;$i++){
            $downFlowList[$i]=0;
          }
        }
        else{
          for($i=0;$i<=$j;$i++){
            $downFlowList[$i]=0;
          }
        }
    }
    $result = array(
      'state'=> $mac_result_array['state'],
			'data'=> array (
         'list'=> $mac_result_array['data']['list'],
         'upFlowList'=> $upFlowList,
         'downFlowList'=>$downFlowList
      )
		);
    return json_encode( $result );
	}
}
