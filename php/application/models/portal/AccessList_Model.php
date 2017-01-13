<?php
class AccessList_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
	}    
	function get_list($data) {   
		$columns = '*';
		$tablenames = 'portal_bas';
		$pageindex = (int)element('page', $data, 1);
		$pagesize = (int)element('size', $data, 20);	        
		$datalist = help_data_page($this->portalsql,$columns,$tablenames,$pageindex,$pagesize);
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page'=>array(
					'start' => 1, 
					'size' => $pagesize, 
					'currPage' => $pageindex, 
					'totalPage' => $datalist['total_page'], 
					'total' => $datalist['total_row'], 
					'nextPage' => ($pageindex + 1) === $datalist['total_page'] ? ($pageindex + 1) : -1, 
					'lastPage' => $datalist['total_page']
				),
				'list' => $datalist['data']
			)
		);               
		return json_encode($arr);
	}    
    function add_bas($data) {
        $result = FALSE;
        $insertdata = $this->getSocketParam($data);
        if($this->notice_socket($this->get_socket_pramse('add',$insertdata))){
            $insertdata = $this->getDbParam($data);
            $result = $this->portalsql->insert('portal_bas', $insertdata);
        }        
        $result = $result ? json_ok() : json_on('insert error');
        return json_encode($result);        
    }
    function edit_bas($data) {
        $result = FALSE;        
        $updata = $this->getSocketParam($data);
        $updata['id'] = element('id',$data,0);
        if($this->notice_socket($this->get_socket_pramse('edit',$updata))){
            $updata = $this->getDbParam($data);
            $updata['id'] = element('id',$data,0);
            $result = $this->portalsql->replace('portal_bas', $updata);
        }        
        $result = $result ? json_ok() : json_on('insert error');
        return json_encode($result);
    }   
    function delete_bas($data) {
        $result = FALSE;
        $dellist = $data['selectedList'];      
        $listd = array('list'=>$dellist);      
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_bas');
        }     
        $result = $result ? json_ok() : json_on('delete error');
        return json_encode($result);
    } 
    function getSocketParam($data){
        $linuxdate = (string)exec('date "+%Y-%m-%d %H:%M:%S"');
        $numtime = $this->get_config_time();        
        $arr = array(            
            'bas'=>element('bas',$data,''),
            'basname'=>element('basname',$data,''),
            'basIp'=>element('bas_ip',$data,''),
            'basPort'=>element('bas_port',$data,''),
            'portalVer'=>element('portalVer',$data,''),
            'authType'=>element('authType',$data,''),
            'sharedSecret'=>element('sharedSecret',$data,''),
            'basUser'=>element('bas_user',$data,$linuxdate),
            'basPwd'=>element('bas_pwd',$data,$numtime),
            'timeoutSec'=>element('timeoutSec',$data,''),
            'isPortalCheck'=>element('isPortalCheck',$data,0),
            'isOut'=>element('isOut',$data,''),
            'authInterface'=>element('auth_interface',$data,''),
            'isComputer'=>element('isComputer',$data,''),
            'web'=>element('web',$data,''),
            'isdebug'=>element('isdebug',$data,1),
            'lateAuth'=>element('lateAuth',$data,''),
            'lateAuthTime'=>element('lateAuthTime',$data,'')
        );        
        return $arr;
    }
    function getDbParam($data){
        $linuxdate = (string)exec('date "+%Y-%m-%d %H:%M:%S"');
        $numtime = $this->get_config_time();        
        $arr = array(            
            'bas'=>element('bas',$data,''),
            'basname'=>element('basname',$data,''),
            'bas_ip'=>element('bas_ip',$data,''),
            'bas_port'=>element('bas_port',$data,''),
            'portalVer'=>element('portalVer',$data,''),
            'authType'=>element('authType',$data,''),
            'sharedSecret'=>element('sharedSecret',$data,''),
            'bas_user'=>element('bas_user',$data,$linuxdate),
            'bas_pwd'=>element('bas_pwd',$data,$numtime),
            'timeoutSec'=>element('timeoutSec',$data,''),
            'isPortalCheck'=>element('isPortalCheck',$data,0),
            'isOut'=>element('isOut',$data,''),
            'auth_interface'=>element('auth_interface',$data,''),
            'isComputer'=>element('isComputer',$data,''),
            'web'=>element('web',$data,''),
            'isdebug'=>element('isdebug',$data,1),
            'lateAuth'=>element('lateAuth',$data,''),
            'lateAuthTime'=>element('lateAuthTime',$data,'')
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
            'resName'=>'bas',
            'data'=>$data
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