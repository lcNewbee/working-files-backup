<?php
class RadiusNas_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
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
        $result = $this->portalsql->insert('radius_nas', $insertdata);
        if($result){
            $arr = json_ok();
        }
        return json_encode($arr);
	}
    function edit_radius_nas($data) {
        $arr = json_no('update error');
		$insertdata = array(
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
        $result = $this->portalsql->replace('radius_nas', $insertdata);
        if($result){
            $arr = json_ok();
        }
        return json_encode($arr);
    }
    function del_radius_nas($data) {
        $arr = json_no('del error');
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {            
            $this->portalsql->where('id', $row['id']);
		    $result = $this->portalsql->delete('radius_nas');
            if($result){
                $arr = json_ok();
            }
        }
        return json_encode($arr);
    }
}
