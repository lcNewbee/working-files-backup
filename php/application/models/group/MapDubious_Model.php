<?php
/**
 * 可疑终端列表
 * url： GET:/goform/group/map/dubious
*/
class MapDubious_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->mysql = $this->load->database('mysqli', TRUE);     	
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_list($data) {   
        $parameter = array(
            'db' => $this->mysql, 
            'columns' => 'Id as id,StaMac as mac,Remark as description', 
            'tablenames' => 'stablack_list', 
            'pageindex' => (int) element('page', $data, 1), 
            'pagesize' => (int) element('size', $data, 20), 
            'wheres' => "GroupId=".$data['groupid'], 
            'joins' => array(), 
            'order' => array(array('Id','ASC'))
        );
        if(isset($data['search'])){
            $parameter['wheres'] = $parameter['wheres'] . " AND StaMac LIKE '%".$data['search']."%'";
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
    function add($data){
        $result = 0;
        if(!is_columns($this->mysql,'StaMac','stablack_list'," where StaMac='{$data['mac']}'")){
            $arr = $this->params($data);
            $result = $this->mysql->insert('stablack_list',$arr); 
        }              
        $result = $result ? json_ok() : json_no('add error');
        return json_encode($result);
    }    
    function delete($data){
        $result = FALSE;
        $dellist = $data['selectedList'];       
        foreach($dellist as $res) {        
            $this->mysql->where('Id', $res);
            $result = $this->mysql->delete('stablack_list');
        }     
        $result = $result ? json_ok() : json_on('delete error');
        return json_encode($result);
    }
    function edit($data){
        $result = 0;
        $arr = $this->params($data);        
        $this->mysql->where('Id', $data['id']);
        $result = $this->mysql->update('stablack_list', $arr);    
        $result = $result ? json_ok() : json_no('edit error');
        return json_encode($result);
    }    
    private function params($data){
        $arr = array(            
            'GroupId'=>element('groupid',$data,''),   
            'StaMac'=>element('mac',$data),
            'Remark'=>element('description',$data)
        );
        return $arr;
    }

}