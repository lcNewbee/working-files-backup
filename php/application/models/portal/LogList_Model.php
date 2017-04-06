<?php
class LogList_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_list($data) {   
		$parameter = array(
			'db' => $this->portalsql, 
			'columns' => 'id,info,rec_date as recDate', 
			'tablenames' => 'portal_logrecord', 
			'pageindex' => (int) element('page', $data, 1), 
			'pagesize' => (int) element('size', $data, 20), 
			'wheres' => "1=1", 
			'joins' => array(), 
			'order' => array()
		);
		if(isset($data['search'])){
			$parameter['wheres'] = $parameter['wheres'] . " AND info LIKE '%".$data['search']."%'";
		}
		if(isset($data['startDate'])){
			$start_date = $data['startDate'] . " 00:00:00";
            $end_date = $data['endDate'] . " 23:59:59";
            $parameter['wheres'] = $parameter['wheres'] . " AND (rec_date > '{$start_date}' AND rec_date < '{$end_date}')";			
		}	
		$datalist = help_data_page_all($parameter);
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page'=>$datalist['page'],
				'list' =>$datalist['data']
			)
		);               
		return json_encode($arr);
	}
    function Delete($data){
        $result = FALSE;
        $dellist = $data['selectedList'];       
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_logrecord');
        }     
        $result = $result ? json_ok() : json_on('delete error');
        return json_encode($result);
    }
}