<?php
class AccountList_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
	}
	function get_account_list($data) {   
		$columns = '*';
		$tablenames = 'portal_account';
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
    function add_account($data) {
        $result = null;
        $insertary = $this->getDbParam($data);                   
        $result = $this->portalsql->insert('portal_account', $insertary);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    function del_account($data) {
        $result = null;
        $selectedList = $data['selectedList'];
        if($this->notice_socket($this->get_socket_pramse('delete',$selectedList))) {            
            foreach($selectedList as $row){             
                $this->portalsql->where('id', $row['id']);
			    $result = $this->portalsql->delete('portal_account');
                if($result){
                    //del portal_accountmacs
                    $this->portalsql->where('accountId', $row['id']);
			        $this->portalsql->delete('portal_accountmacs');
                }            		
		    }
        }
		$result ? $result = json_ok() : $result = json_no('delete fail');
		return json_encode($result);
    }
    function edit_account($data) {
        $result = null;        
        $updata = $this->getDbParam($data);
        $updata['id'] = element('id',$data,0);        
        $result = $this->portalsql->replace('portal_account', $updata);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }  
    function reset($data) {
        $result = null;
        //重置密码
        $upd = array(
            'password' => '123456'
        );
        $this->portalsql->where('id', $data['id']);
        $result = $this->portalsql->update('portal_account', $upd);
        $result ? $result = json_ok() : $result = json_no('reset error');
        return json_encode($result);
    }  
    function getDbParam($data){
        $linuxdate = (string)exec('date "+%Y-%m-%d %H:%M:%S"');
        $numtime = $this->get_config_time();        
        $arr = array(            
            'loginName'=>element('loginName',$data,''),
            'password'=>element('password',$data,''),
            'name'=>element('name',$data,''),
            'gender'=>element('gender',$data,''),
            'phoneNumber'=>element('phoneNumber',$data,''),
            'email'=>element('email',$data,''),
            'description'=>element('description',$data,''),
            'date'=>element('date',$data,$linuxdate),
            'time'=>element('time',$data,$numtime),
            'octets'=>element('octets',$data,''),
            'state'=>element('state',$data,0),
            'idnumber'=>element('idnumber',$data,''),
            'address'=>element('address',$data,''),
            'speed'=>element('speed',$data,''),
            'maclimit'=>element('maclimit',$data,''),
            'maclimitcount'=>element('maclimitcount',$data,1),
            'autologin'=>element('autologin',$data,''),
            'ex1'=>element('ex1',$data,''),
            'ex2'=>element('ex2',$data,''),
            'ex3'=>element('ex3',$data,''),
            'ex4'=>element('ex4',$data,''),
            'ex5'=>element('ex5',$data,''),
            'ex6'=>element('ex6',$data,''),
            'ex7'=>element('ex7',$data,''),
            'ex8'=>element('ex8',$data,''),
            'ex9'=>element('ex9',$data,''),
            'ex10'=>element('ex10',$data,'')
        );        
        return $arr;
    }

    //socket portal
    function notice_socket($data){
        $result = null;
        $portal_socket = new PortalSocket();                
        $result = $portal_socket->portal_socket(json_encode($data));
        if($result['state']['code'] === 2000){
            return TRUE;
        }        
        return FALSE;
    } 
    function get_socket_pramse($type,$data) {
         $socketarr = array(
            'action'=>$type,
            'resName'=>'accountuser',
            'data'=>array('list'=>$data)
        );
        return $socketarr;
    }  

    function get_config_time(){
        $result = 0;
        $query = $this->portalsql->query("select usertime from config where id=1");
        if($query->row()->usertime){
            $result = $query->row()->usertime;
            $result = $result * 60000;
        }
        return $result;        
    }  
}