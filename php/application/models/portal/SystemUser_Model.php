<?php
class SystemUser_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
	}
	function get_list($data) {   
		$columns = 'portal_user.*,portal_user_role.roleId';
		$tablenames = 'portal_user';
		$pageindex = (int)element('page', $data, 1);
		$pagesize = (int)element('size', $data, 20);	 
        $where = array(array('portal_user.id >','0'));
        $join = array(
            array('portal_user_role','portal_user.departmentId=portal_user_role.userId','left')
        );       
		$datalist = help_data_page($this->portalsql,$columns,$tablenames,$pageindex,$pagesize,$where,$join);
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page'=>$datalist['page'],
				'list' => $datalist['data']
			)
		);               
		return json_encode($arr);
	}
    function Add($data) {        
        $result = null;
        $insertary = $this->getDbParam($data);                   
        $result = $this->portalsql->insert('portal_user', $insertary);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    function Delete($data){
        $result = FALSE;
        $dellist = $data['selectedList'];       
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_user');
        }     
        $result = $result ? json_ok() : json_on('delete error');
        return json_encode($result);
    }
    function Edit($data){
        $result = FALSE;        
        $updata = $this->getDbParam($data);
        $updata['id'] = element('id',$data,0);
        $result = $this->portalsql->replace('portal_user', $updata);       
        $result = $result ? json_ok() : json_on('edit error');
        return json_encode($result);
    }
    function getDbParam($data){
        $arr = array(
            'loginName'=>element('loginName',$data),
            'password'=>md5(element('password',$data)),
            'name'=>element('name',$data),
            'gender'=>element('gender',$data),
            'phoneNumber'=>element('phoneNumber',$data),
            'email'=>element('email',$data),
            'description'=>element('description',$data),
            'departmentId'=>element('departmentId',$data)
        );        
        return $arr;
    }
}