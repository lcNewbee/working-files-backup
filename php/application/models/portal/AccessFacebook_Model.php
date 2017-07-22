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
                'list' => array()
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
        $result = 0;
        $socketarr = $this->params($data);
        if ($this->noticeSocket($this->getSocketPramse('add', array($socketarr)))) {
            return json_encode(json_ok());
        }        
        return json_encode(json_no('delete error'));
    }    
    function delete($data){
        $result = FALSE;
        $dellist = $data['selectedList'];       
        foreach($dellist as $row) {            
            $this->noticeSocket($this->getSocketPramse('delete', array($row)));
        }     
        return json_encode(json_ok());
    }
    function edit($data){
        $result = 0;
        $socketarr = $this->params($data);  
        $socketarr['id'] = $data['id'];
        if ($this->noticeSocket($this->getSocketPramse('edit', array($socketarr)))) {
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
    private function noticeSocket($data){
        $result = null;
        $portal_socket = new PortalSocket();
        $result = $portal_socket->portal_socket(json_encode($data));
        if($result['state']['code'] === 2000){
            return TRUE;
        }
        return FALSE;
    }
    private function getSocketPramse($type, $data) {
         $socketarr = array(
            'action' => $type,
            'resName' => 'facebook',
            'data' => array(
                'page' => array('currPage' => 1,'size' => 20),
                'list' => $data
            )
        );
        return $socketarr;
    }
}