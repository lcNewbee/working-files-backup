<?php
class RadiusConnect_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        //$this->load->library('PortalSocket');
	}
	function get_radius_connect($data) {   
		//help_data_page
		$columns = '*';
		$tablenames = 'radius_linkrecordall';
		$pageindex = (int)element('page', $data, 1);
		$pagesize = (int)element('size', $data, 20);		
		$datalist = help_data_page($this->portalsql,$columns,$tablenames,$pageindex,$pagesize);

		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page'=>$datalist['page'],
				'list' => $datalist['data']
			)
		);       
		return json_encode($arr);
	}
    function del_radius_connect($data) {
		$result = null;
        $selectedList = $data['selectedList'];
		foreach($selectedList as $row){
			$this->portalsql->where('id', $row['id']);
			$result = $this->portalsql->delete('radius_linkrecordall');
		}
		$result ? $result = json_ok() : $result = json_no('delete fail');
		return json_encode($result);
    }
}