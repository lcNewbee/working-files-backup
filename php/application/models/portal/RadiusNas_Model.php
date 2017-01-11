<?php
class RadiusNas_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
	}
	function get_nas_list($data) {        
		$queryd = $this->portalsql->query('select * from radius_nas');
		$arr['state'] = array('code' => 2000, 'msg' => 'ok');
		$arr['data'] = array(
            'list' => $queryd->result_array()
        );        
		return json_encode($arr);
	}
	function add_radius_nas($data) {        
        $arr = json_no('insert error');
		$insertdata = array(
            'ip' => element('ip',$data,''),
            'name' => element('name',$data,''),
            'description' => element('description',$data,''),
            'type' => element('type',$data,''),
            'sharedSecret' => element('sharedSecret',$data,''),
            'ex1' => element('ex1',$data,'0'),    
            'ex2' => element('ex2',$data,'300'),   
            'ex3' => element('ex3',$data,'600'),
            'ex4' => element('ex4',$data,'600'),    
            'ex5' => element('ex5',$data,'1'),
        );
        if(is_columns($this->portalsql,'name','radius_nas'," where name='".$data['name']."'")){
            return json_encode(json_no('name Already exist'));
        }
        if(is_columns($this->portalsql,'ip','radius_nas'," where ip='".$data['ip']."'")){
            return json_encode(json_no('ip Already exist'));
        }       
        if($this->notice_socket($this->get_socket_pramse('add',$data))) {
            $result = $this->portalsql->insert('radius_nas', $insertdata);
            if($result){
                $arr = json_ok();
            }
        }               
        return json_encode($arr);
	}
    function edit_radius_nas($data) {
        $arr = json_no('update error');
		$updata = array(
            'id' => element('id',$data,0),
            'ip' => element('ip',$data,''),
            'name' => element('name',$data,''),
            'description' => element('description',$data,''),
            'type' => element('type',$data,''),
            'sharedSecret' => element('sharedSecret',$data,''),
            'ex1' => element('ex1',$data,'0'),    
            'ex2' => element('ex2',$data,'300'),   
            'ex3' => element('ex3',$data,'600'),
            'ex4' => element('ex4',$data,'600'),    
            'ex5' => element('ex5',$data,'1'),
        );
        if($this->notice_socket($this->get_socket_pramse('edit',$data))) {
            $result = $this->portalsql->replace('radius_nas', $updata);
            if($result){
                $arr = json_ok();
            }
        }        
        return json_encode($arr);
    }
    function del_radius_nas($data) {
        $arr = json_no('del error');
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {            
            $this->portalsql->where('id', $row['id']);
            if($this->notice_socket($this->get_socket_pramse('delete',$row))) {
                $result = $this->portalsql->delete('radius_nas');
                if($result){
                    $arr = json_ok();
                }
            }		    
        }
        return json_encode($arr);
    }
    //通知java 更新
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
            'resName'=>'nas',
            'data'=>array(
                'ip'=> element('ip',$data),
                'sharedSecret'=>element('sharedSecret',$data),
                'type' => element('type',$data,''),
                'ex1' => element('ex1',$data,'0'),    
                'ex2' => element('ex2',$data,'300'),   
                'ex3' => element('ex3',$data,'600'),
                'ex4' => element('ex4',$data,'600'),    
                'ex5' => element('ex5',$data,'1')
            )
        );
        return $socketarr;
    }
}
