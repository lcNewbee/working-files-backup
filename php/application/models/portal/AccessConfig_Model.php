<?php
class AccessConfig_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
    }
    function get_list($data) {   
        $configdata = array();
        $columns = '*';
        $tablenames = 'portal_config';
        $pageindex = (int)element('page', $data, 1);
        $pagesize = (int)element('size', $data, 20);	
        $where = array(array('bas','0'));	
        $datalist = help_data_page($this->portalsql,$columns,$tablenames,$pageindex,$pagesize,$where);
        if(count($datalist['data']) > 0){
            $cdata = $this->portalsql->query('select * from portal_basauth where basid='.$datalist['data'][0]['bas']);
            $configdata = $cdata->result_array();
        }
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'settings'=>array('list'=>$configdata),                
                'page'=>$datalist['page'],
                'list' => $datalist['data']
            )
        );       
        return json_encode($arr);
    }
    function edit_accesss($data) {
        $result = null;        
        $updata = $this->getDbParam($data);
        if($this->notice_socket($this->get_socket_pramse('edit',$updata))){
            //up portal_config
            $updata['id'] = element('id',$data,0);        
            $result = $this->portalsql->replace('portal_config', $updata);
            if($result){
                // up portal_basauth  
                foreach($data['basauth'] as $row){
                    $up2 = array(
                        'id'=>element('id',$row),
                        'username'=>element('username',$row),
                        'password'=>element('password',$row),                    
                        'url'=>element('url',$row)                    
                    );
                    $result = $this->portalsql->replace('portal_basauth', $up2);
                }                                 
            }
        }
        
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
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
            'resName'=>'accessbas',
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