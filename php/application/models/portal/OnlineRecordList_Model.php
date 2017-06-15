<?php
class OnlineRecordList_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_list($data) {
		/*   
		$columns = '*';
		$tablenames = 'portal_linkrecordall';
		$pageindex = (int)element('page', $data, 1);
		$pagesize = (int)element('size', $data, 20);
		$order = array(array('id','DESC'));	      
		$datalist = help_data_page_order($this->portalsql,$columns,$tablenames,$pageindex,$pagesize,$order);				
		*/
		$parameter = array(
			'db' => $this->portalsql, 
			'columns' => '*', 
			'tablenames' => 'portal_linkrecordall', 
			'pageindex' => (int) element('page', $data, 1), 
			'pagesize' => (int) element('size', $data, 20), 
			'wheres' => "1=1", 
			'joins' => array(), 
			'order' => array(array('id','DESC'))
		);
		if(isset($data['search'])){
			$parameter['wheres'] = $parameter['wheres'] . " AND ip LIKE '%".$data['search']."%'";
		}
		if(isset($data['state']) && $data['state'] != '-100'){
			$parameter['wheres'] = $parameter['wheres'] . " AND state='".$data['state']."'";
		}
		if(isset($data['auth_type']) && $data['auth_type'] != '-100'){
			$parameter['wheres'] = $parameter['wheres'] . " AND methodtype='".$data['auth_type']."'";
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
            $result = $this->portalsql->delete('portal_linkrecordall');
        }     
        $result = $result ? json_ok() : json_on('delete error');
        return json_encode($result);
    }
}