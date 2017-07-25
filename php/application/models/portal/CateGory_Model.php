<?php
class CateGory_Model extends CI_Model {
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
            'resName' => 'cardcategory', 
            'data' => array(
                'page' => array(
                    'currPage' => element('page', $data, 1),
                    'size' => element('size', $data, 20)
                ),
                'list' => array(
                    array(
                        'name' => element('search', $data, ''),
                        'state' => element('state', $data, '')
                    )
                )
            )
        );
        $portal_socket = new PortalSocket();
        $socket_data = $portal_socket->portal_socket(json_encode($socketarr));        
        return json_encode($socket_data);
    }

    function Add($data) {
        $result = FALSE;
        $socketarr = $this->getPram($data);
        if ($this->noticeSocket('add', array($socketarr))) {
            return json_encode(json_ok());
        }
        return json_encode(json_no('add error'));
    }
    function Delete($data) {
        $result = FALSE;
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {
            $this->noticeSocket('delete', array($row));
        }
        return json_encode(json_ok());
    }
    function Edit($data) {
        $result = null;
        $socketarr = $this->getPram($data);
        $socketarr['id'] = element('id',$data);
        if ($this->noticeSocket('edit', array($socketarr))) {
            return json_encode(json_ok());
        } 
        return json_encode(json_no('edit error'));
    }

    private function getPram($data){
        $arr = array(
            'id'=> element('id',$data,null),
            'name' => element('name',$data),
            'description' => element('description',$data),
            'time' => element('time',$data),
            'state' => element('state',$data),
            'money' => element('money',$data),
            'moneyUnit' => element('moneyUnit', $data, ''),
            'maclimit' => 0,
            'maclimitcount' => 0,
            'autologin' => 0
        );
        return $arr;
    }
    //
    private function noticeSocket($action, $data) {
        $result = null;
        $portal_socket = new PortalSocket();
        $socket_req = array(
            'action' => $action, 
            'resName' => 'cardcategory', 
            'data' => array(
                'page' => array('currPage' => 1, 'size' => 20), 
                'list' => $data
            )
        );
        $result = $portal_socket->portal_socket(json_encode($socket_req));
        if ($result['state']['code'] === 2000) {
            return TRUE;
        }
        return FALSE;
    } 
}
