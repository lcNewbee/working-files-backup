<?php
class AccessFacebook_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'db_operation'));
        $this->load->library('PortalSocket');  
	}
	function get_list($data) {           
        $socketarr = array(
            'action' => 'get', 
            'resName' => 'facebook', 
            'data' => array(
                'page' => array(
                    'currPage' => element('page', $data, 1),
                    'size' => element('size', $data, 20)
                ),
                'list' => array(
                    array('appId' => element('search', $data, ''))
                )
            )
        );
        $portal_socket = new PortalSocket();
        $socket_data = $portal_socket->portal_socket(json_encode($socketarr));
        if ($socket_data['state']['code'] === 2000) {
            $arr = array(
                'state' => array('code' => 2000, 'msg' => 'ok'), 
                'data' => array(
                    'page' => $socket_data['data']['page'], 
                    'list' => $socket_data['data']['list']
                )
            );
            return json_encode($arr);
        }
        return json_encode(json_no('error !'));
	}
    function add($data){
        $socketarr = $this->params($data);
        if ($this->noticeSocket('add', array($socketarr))) {
            return json_encode(json_ok());
        }        
        return json_encode(json_no('add error'));
    }    
    function delete($data){
        $dellist = $data['selectedList'];       
        foreach($dellist as $row) {            
            $this->noticeSocket('delete', array($row));
        }     
        return json_encode(json_ok());
    }
    function edit($data){
        $socketarr = $this->params($data);  
        $socketarr['id'] = $data['id'];
        if ($this->noticeSocket('edit', array($socketarr))) {
            return json_encode(json_ok());
        } 
        return json_encode(json_no('edit error'));
    }    
    private function params($data){
        $arr = array(
            'appId' => element('appId',$data),
            'appSecret' => element('appSecret',$data,''),
            'appVersion' => element('appVersion',$data),
            'state' => element('state',$data),
            'outTime' => ''
        );
        return $arr;
    }
    //
    private function noticeSocket($action, $data){
        $result = null;
        $portal_socket = new PortalSocket();

        $socket_req = array(
            'action' => $action, 
            'resName' => 'facebook', 
            'data' => array(
                'page' => array('currPage' => 1, 'size' => 20), 
                'list' => $data
            )
        );
        $result = $portal_socket->portal_socket(json_encode($socket_req));
        if($result['state']['code'] === 2000){
            return TRUE;
        }
        return FALSE;
    }
}