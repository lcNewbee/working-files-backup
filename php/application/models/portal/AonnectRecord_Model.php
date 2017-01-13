<?php
class AonnectRecord_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
	}
	function get_list($data) {   
		$columns = '*';
		$tablenames = 'portal_linkrecord';
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
    function del_aonnect($data) {
        $result = null;
        $selectedList = $data['selectedList'];
        if($this->notice_socket($this->get_socket_pramse('delete',$selectedList))) {  
            foreach($selectedList as $row){
            	$this->portalsql->where('id', $row['id']);
                $result = $this->portalsql->delete('portal_linkrecord');	
		    }            
        }		
		$result ? $result = json_ok() : $result = json_no('delete fail');
		return json_encode($result);
    }
    function getDbParam($data) {
        $arr = array(
            'ip'=>element('ip',$data,''),
            'basip'=>element('basip',$data,''),
            'loginName'=>element('loginName',$data,''),
            'state'=>element('state',$data,''),
            'startDate'=>element('startDate',$data,''),
            'endDate'=>element('endDate',$data,''),
            'time'=>element('time',$data,''),
            'ins'=>element('ins',$data,''),
            'outs'=>element('outs',$data,''),
            'octets'=>element('octets',$data,''),
            'methodtype'=>element('methodtype',$data,''),
            'mac'=>element('mac',$data,''),
            'basname'=>element('basname',$data,''),
            'ssid'=>element('ssid',$data,''),
            'apmac'=>element('apmac',$data,''),
            'auto'=>element('auto',$data,''),
            'agent'=>element('agent',$data,''),
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
        return $result;
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
            'data'=>array(
                'list'=>$data
            )
        );
        return $socketarr;
    }
}