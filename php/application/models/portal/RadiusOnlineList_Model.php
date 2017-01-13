<?php
class RadiusOnlineList_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
	}
	function get_online_list($data) {          
        $socketarr = array(
            'action'=>'get',
            'resName'=>'nasonline',
            'data'=>array(
                'pageSize'=>element('size',$data,1),
                'pageIndex'=>element('page',$data,20)                
            )
        );
        $result = $this->notice_socket($socketarr);		
		return json_encode($result);
	}   
    function user_offline($data) {

    }
	//socket java
    function notice_socket($data){
        $result = null;        
        $portal_socket = new PortalSocket();                
        $result = $portal_socket->portal_socket(json_encode($data));         
        if($result['state']['code'] === 2000){            
            return $result;
        }                          
        return $result;
    } 
}
