<?php
class MapOrbit_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->mysql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {   
        /*
		$columns = '*';
		$tablenames = 'portal_smsapi';
		$pageindex = (int)element('page', $data, 1);
		$pagesize = (int)element('size', $data, 20);	
		$order = array(array('id','DESC'));      		
		$datalist = help_data_page_order($this->portalsql,$columns,$tablenames,$pageindex,$pagesize,$order);		
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page'=>$datalist['page'],
				'list' =>$datalist['data']
			)
		);               
		return json_encode($arr);
        */
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>array(
                    array('lat'=>116.91261,'lng'=>22.565962,'value'=>3),
                    array('lat'=>116.912735,'lng'=>22.566563,'value'=>2),
                    array('lat'=>116.913113,'lng'=>22.565679,'value'=>3),
                    array('lat'=>116.912448,'lng'=>22.564894,'value'=>7)
                )
            )   
        );
        return json_encode($arr);
	}
    function Add($data){
        $result = 0;
        $arr = $this->params($data);
        $result = $this->portalsql->insert('portal_smsapi',$arr);
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }    
    function Delete($data){
        $result = FALSE;
        $dellist = $data['selectedList'];       
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_smsapi');
        }     
        $result = $result ? json_ok() : json_on('delete error');
        return json_encode($result);
    }
    function Edit($data){
        $result = 0;
        $arr = $this->params($data);        
        $this->portalsql->where('id', $data['id']);
        $result = $this->portalsql->update('portal_smsapi', $arr);
        $result = $result ? json_ok() : json_no('edit error');
        return json_encode($result);
    }        
}