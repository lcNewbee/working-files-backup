<?php
class AccessSms_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'db_operation'));
        $this->load->library('PortalSocket');      
	}
	function get_list($data) { 
        //send java   
        $socketarr = array(
            'action' => 'get', 
            'resName' => 'sms', 
            'data' => array(
                'page' => array(
                    'currPage' => element('page', $data, 1),
                    'size' => element('size', $data, 20)
                ),
                'list' => array(
                    array(
                        'name' => element('search', $data, ''),
                        'type' => element('gateway_type', $data, '')
                    )
                )
            )
        );
        $portal_socket = new PortalSocket();
        $socket_data = $portal_socket->portal_socket(json_encode($socketarr));
        return json_encode($socket_data);
	}
    function Add($data){
        $socketarr = $this->params($data);
        if ($this->noticeSocket($this->getSocketPramse('add', array($socketarr)))) {
            return json_encode(json_ok());
        }        
        return json_encode(json_no('add error'));
    }
    function Delete($data){
        $dellist = $data['selectedList'];       
        foreach($dellist as $row) {            
            $this->noticeSocket($this->getSocketPramse('delete', array($row)));
        }     
        return json_encode(json_ok());
    }
    function Edit($data){
        $socketarr = $this->params($data);  
        $socketarr['id'] = $data['id'];
        if ($this->noticeSocket($this->getSocketPramse('edit', array($socketarr)))) {
            return json_encode(json_ok());
        } 
        return json_encode(json_no('edit error'));
    }
    private function params($data){
        $arr = array(
            'name' => element('name',$data),
            'url' => element('url',$data,''),
            'count' => element('count',$data),//已使用次数
            'state' => element('state',$data),//状态，启用/停用
            'type' => element('type',$data),//类型，1-虚拟网关 2-前海智讯
            'more' => element('more',$data),//多终端登录 0-允许 1-禁止
            'time' => element('time',$data),//验证码过期时长 分钟
            'text' => element('text',$data),//短信内容
            'appkey' => element('appkey',$data),// 短信网关用户名
            'appsecret' => element('appsecret',$data),// 短信网关密码
            'smssign' => element('smssign',$data),//签名
            'smstemplate' => element('smstemplate',$data),//模板ID
            'company' => element('company',$data)//公司名称
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
            'resName' => 'sms',
            'data' => array(
                'page' => array('currPage' => 1,'size' => 20),
                'list' => $data
            )
        );
        return $socketarr;
    }
}
