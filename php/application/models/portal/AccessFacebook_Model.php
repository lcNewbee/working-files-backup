<?php
class AccessFacebook_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_list($data) {   
        $list = array();
        $parameter = array(
            'db' => $this->portalsql, 
            'columns' => '*', 
            'tablenames' => 'portal_facebook', 
            'pageindex' => (int) element('page', $data, 1), 
            'pagesize' => (int) element('size', $data, 20), 
            'wheres' => "1=1", 
            'joins' => array(), 
            'order' => array(array('id','ASC'))
        );
        if(isset($data['search'])){
            $parameter['wheres'] = $parameter['wheres'] . " AND app_id LIKE '%".$data['search']."%'";
        }
        $datalist = help_data_page_all($parameter);

        foreach($datalist['data'] as $row)	{
            $list[] = array(
                'id'=>element('id',$row),
                'appId'=>element('app_id',$row),
                'appSecret'=>element('app_secret',$row,''),
                'appVersion'=>element('app_version',$row),
                'state'=>element('state',$row)
            );
        }
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page'=>$datalist['page'],
				'list' =>$list
			)
		);               
		return json_encode($arr);
	}
    function add($data){
        $result = 0;
        $arr = $this->params($data);
        $result = $this->portalsql->insert('portal_facebook',$arr);
        if($result == 1 && $data['state'] == 1){
            //关闭其他网关
            $this->close_sms($this->portalsql->insert_id());
        }
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }    
    function delete($data){
        $result = FALSE;
        $dellist = $data['selectedList'];       
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_facebook');
        }     
        $result = $result ? json_ok() : json_on('delete error');
        return json_encode($result);
    }
    function edit($data){
        $result = 0;
        $arr = $this->params($data);        
        $this->portalsql->where('id', $data['id']);
        $result = $this->portalsql->update('portal_facebook', $arr);
        if($result == 1 && $data['state'] == 1){
            //关闭其他网关
            $this->close_sms($data['id']);
        }
        $result = $result ? json_ok() : json_no('edit error');
        return json_encode($result);
    }    
    private function params($data){
        $arr = array(
            'app_id'=>element('appId',$data),
            'app_secret'=>element('appSecret',$data,''),
            'app_version'=>element('appVersion',$data),
            'state'=>element('state',$data)
        );
        return $arr;
    }
    private function close_sms($id){
        $this->portalsql->set('state',0);
        $this->portalsql->where('id !=',$id);
        if($this->portalsql->update('portal_facebook')){
            return 1;
        }        
        return 0;
    }
}