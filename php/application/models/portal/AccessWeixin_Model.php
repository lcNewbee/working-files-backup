<?php
class AccessWeixin_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));  
        $this->load->library('PortalSocket');      
    }
    function get_list($data) {        
        $socketarr = array(
            'action' => 'get', 
            'resName' => 'weixin', 
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
    
    function Edit($data) {
        $result = json_encode(json_no('edit error'));
        //上传不检测结果
        $upload_data = $this->uploadWxImg('qrcode');
        //继续配置
        $updata = $this->getParams($data);
        $updata['id'] = element('id', $updata);
        //send java
        if ($this->noticeSocket($this->getSocketPramse('edit', array($updata)))) {
            $result = json_encode(json_ok());
        }
        $loginfo = array(
            'type' => 'Edit', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Edit portal->weixin", 
            'operationResult' => preg_replace('#\s+#', '', trim($result)), 
            'description' => json_encode($updata)
        );
        Log_Record($this->db, $loginfo);
        return $result;
    }

    private function getParams($data){   
        if(!isset($data['basip'])){
            $data['basip'] = $this->getInterface();
        }    
        /*
        $default_outTime = $this->portalsql->select('outTime')
                        ->from('portal_weixin_wifi')
                        ->where('id=1')
                        ->get()->result_array();
        */
        $arr = array(
            'id' => element('id', $data),
            'ssid' => element('ssid', $data),
            'shopId' => element('shopId', $data),
            'appId' => element('appId', $data),
            'secretKey' => element('secretKey', $data),
            'outTime' => ''//element('outTime', $data, $default_outTime['0']['outTime'])
        );        
        return $arr;
    }
    private function getInterface() {
        $data = $this->db->select('port_name,ip1')
                ->from('port_table')
                ->get()
                ->result_array();
        if( count($data) >0 ){
            return $data[0]['ip1'];
        }
        return  $_SERVER['SERVER_ADDR'];
    }
    private function uploadWxImg($upload_name) {
        $config['upload_path'] = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/weixin';
        $config['overwrite'] = true;
        $config['max_size'] = 0;
        $config['allowed_types'] = 'gif|png|jpg|jpeg';
        $config['file_name'] = 'logo.jpg';
        $this->load->library('upload'); //重点
        $this->upload->initialize($config); // 重点
        if (!$this->upload->do_upload($upload_name)) {
            $error = array(
                'error' => $this->upload->display_errors()
            );
            $result = array(
                'state' => array('code' => 4000, 'msg' => $error)
            );
        } else {
            $data = array(
                'upload_data' => $this->upload->data()
            );
            $result = array(
                'state' => array('code' => 2000, 'msg' => 'OK'), 
                'data' => $data
            );
        }
        return $result;
    }
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
            'resName' => 'weixin',
            'data' => array(
                'page' => array('currPage' => 1,'size' => 20),
                'list' => $data
            )
        );
        return $socketarr;
    }
}
