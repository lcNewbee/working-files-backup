<?php
class DpiProto_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {   
		$result = null;
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'list'=>array()
			)
		); 
		$cgiary = array(
			'page'=>(string)element('page',$data,1),
			'time'=>(string)element('timeType',$data,0),
			'pagesize'=>(string)element('size',$data,20)
		);		
		$result = ndpi_send_proto_to_php_db(json_encode($cgiary));	 
		$cgiobj = json_decode($result);			
		if(is_object($cgiobj) && $cgiobj->state->code === 2000){
			$htmdata = array();
			$sumbts = 0.01;//总流量
			$lsary = array();
			foreach($cgiobj->data->list as $res){
				$sumbts = $sumbts + (int)$res->bytes;
			}
			foreach($cgiobj->data->list as $row){
				$lsary['attr_name'] = $row->attr_name;
				$lsary['curRate'] = $row->bytes_speed;
				$lsary['userNum'] = $row->user_num;
				$lsary['trafficPercent'] = round(($row->bytes / $sumbts)*100,2).'%';
				$htmdata[] = $lsary;
			}
			$arr['data']['list'] = $htmdata;
		}else{
			return json_no($cgiobj->state->msg);
		}		     	
		return json_encode($arr);			
	}
}