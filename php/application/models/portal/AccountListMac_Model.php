<?php
class AccountListMac_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));        
	}
	function get_list($data) {   
		$columns = '*';
		$tablenames = 'portal_accountmacs';
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
    function add($data) {
        $result = null;
        $insertary = $this->getDbParam($data);
        $result = $this->portalsql->insert('portal_accountmacs', $insertary);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    function del($data) {
        $result = null;
        $selectedList = $data['selectedList'];                    
        foreach($selectedList as $row){             
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_accountmacs');          		
        }        
		$result ? $result = json_ok() : $result = json_no('delete fail');
		return json_encode($result);
    }       
    function getDbParam($data){
        $resary = $this->portalsql->query("select id from portal_account where loginName='".$data['loginName']."'");
        $row = $resary->row();
        if (isset($row)){
            $arr = array(
                'accountId'=>$row->id,
                'mac'=>element('mac',$data,'')
            );        
            return $arr;
        }                  
    }     
}