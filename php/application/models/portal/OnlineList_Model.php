<?php
class OnlineList_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
		$this->load->library('PortalSocket');
	}
	function get_list($data) {
		$socketarr = array(
        'action'=>'get',
        'resName'=>'online',
        'data'=>array(
            'pageSize'=>(int)element('size',$data,1),
            'pageIndex'=>(int)element('page',$data,20)
        )
    );
    $result = $this->notice_socket($socketarr);
		return json_encode($result);
	}

    function Delete($data){
        $result = FALSE;
        $dellist = $data['selectedList'];
        if(count($dellist) > 0){
            $ary = array();
            foreach($dellist as $row){
                $ary[] = $row['ip'];
            }
            $socketarr = array(
                'action'=>'get',
                'resName'=>'offline',
                'data'=>array(
                    'list'=>$ary
                )
            );
            $result = $this->notice_socket($socketarr);
        }
		  return json_encode($result);
    }
	//socket java
    function notice_socket($data){
        $result = null;
        $portal_socket = new PortalSocket();
        $result = $portal_socket->portal_socket(json_encode($data));

        // if (element('state', $result) && $result['state']['code'] === 2000){
        //     return $result;
        // }
        return $result;
    }
}
