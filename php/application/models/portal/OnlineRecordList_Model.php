<?php
class OnlineRecordList_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {   
		$columns = '*';
		$tablenames = 'portal_linkrecordall';
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