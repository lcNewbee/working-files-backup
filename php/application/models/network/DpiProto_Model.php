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
			'page'=>'1',
			'pagesize'=>'20'
		);
		$result = ndpi_send_proto_to_php_db(json_encode($cgiary));	 
		$cgiobj = json_decode($result);
		if(is_object($cgiobj) && $cgiobj->state->code === 2000){
			$arr['data']['list'] = $cgiobj->data->list;
		}else{
			return json_no($cgiobj->state->msg);
		}		     	
		return json_encode($arr);	
	}
}