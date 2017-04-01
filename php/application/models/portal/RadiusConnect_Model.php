<?php
class RadiusConnect_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_radius_connect($data) {   
		$parameter = array(
			'db' => $this->portalsql, 
			'columns' => '*', 
			'tablenames' => 'radius_linkrecordall', 
			'pageindex' => (int) element('page', $data, 1), 
			'pagesize' => (int) element('size', $data, 20), 
			'wheres' => "(name LIKE '%".$data['search']."%' or nasip Like '%".$data['search']."%')", 
			'joins' => array(), 
			'order' => array()
		);
		if(isset($data['state'])){
			$parameter['wheres'] = $parameter['wheres'] . " AND state='".$data['state']."'";
		}
		$datalist = help_data_page_all($parameter);
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page'=>$datalist['page'],
				'list' => $datalist['data'],
				'sqlcmd' => $datalist['sqlcmd']
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