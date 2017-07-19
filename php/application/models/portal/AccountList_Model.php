<?php
class AccountList_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));
        $this->load->library('PortalSocket');
    }
    function get_list($data) {
        $socketarr = array(
            'action' => 'get', 
            'resName' => 'account', 
            'data' => array(
                'page' => array(
                    'currPage' => element('page', $data, 1),
                    'size' => element('size', $data, 20)
                ),
                'list' => array(
                    array(
                        'loginName'=> element('search', $data),
                        'state'=> element('state', $data)
                    )
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
    function add($data) {
        //检测重复
        if (is_columns($this->portalsql, 'id', 'portal_account', "where loginName='{$data['loginName']}'")) {
            return json_encode(json_no('The user already exists !'));
        }
        //java socket
        $insertary = $this->getDbParam($data);
        if ($this->notice_socket($this->getSocketPramse('add', array($insertary)))) {
            return json_encode(json_ok());
        }
        return json_encode(json_no('insert error'));
    }
    function delete($data) {
        $selectedList = $data['selectedList'];
        $socket_art = array();
        foreach ($selectedList as $row) {            
            $ary = $this->getDbParam($row);
            $ary['id'] = $row['id'];
            $socket_art[] = $ary;            
        }
        if($this->notice_socket($this->getSocketPramse('delete', $socket_art))){
            return json_encode(json_ok());
        }
        return json_encode(json_no('del error!'));
    }
    function edit($data) {
        //检测重复
        if (is_columns($this->portalsql, 'id', 'portal_account', "where loginName='{$data['loginName']}' and id !={$data['id']}")) {
            return json_encode(json_no('The user already exists !'));
        }
        //javqa socket
        $updata = $this->getDbParam($data);
        $updata['id'] = element('id', $data, 0);
        if ($this->notice_socket($this->getSocketPramse('edit', array($updata)))) {
            return json_encode(json_ok());
        }
        return json_encode(json_no('edit error'));
    }
    //重置密码
    function reset($data) {
        $result = null;
        //重置密码
        $upd = array(
            'password' => '123456'
        );
        $this->portalsql->where('id', $data['id']);
        $result = $this->portalsql->update('portal_account', $upd);
        $result ? $result = json_ok() : $result = json_no('reset error');
        return json_encode($result);
    }    
    //充值
    function recharge($data){
        //java socket
        $ary = $this->getDbParam($data);
        $ary['id'] = $data['id'];
        $result = $this->notice_socket($this->getSocketPramse('recharge', array($ary)), true);
        return json_encode($result);
    } 

    private function getConfigTime(){
        $result = 0;
        $query = $this->portalsql->query("select usertime from config where id=1");
        if($query->row()->usertime){
            $result = $query->row()->usertime;
            $result = $result * 60000;
        }
        return $result;
    }
    private function getDbParam($data){
        $linuxdate = (string)exec('date "+%Y-%m-%d %H:%M:%S"');
        $numtime = $this->getConfigTime();
        $arr = array(
            'loginName' =>element('loginName',$data,''),
            'password' => element('password',$data,''),
            'name' => element('name',$data,''),
            'gender' => element('gender',$data,''),
            'phoneNumber' => element('phoneNumber',$data,''),
            'email' => element('email',$data,''),
            'description' => element('description',$data,''),
            'date' => element('date',$data,$linuxdate),
            'time' => element('time',$data,$numtime),
            'octets' => element('octets',$data,''),
            'state' => element('state',$data,0),
            'idnumber' => element('idnumber',$data,''),
            'address' => element('address',$data,''),
            'speed' => element('speed',$data,''),
            'maclimit' => element('maclimit',$data,''),
            'maclimitcount' => element('maclimitcount',$data,1),
            'autologin' => element('autologin',$data,''),
            'ex1' => element('ex1',$data,''),
            'ex2' => element('ex2',$data,''),
            'ex3' => element('ex3',$data,''),
            'ex4' => element('ex4',$data,''),
            'ex5' => element('ex5',$data,''),
            'ex6' => element('ex6',$data,''),
            'ex7' => element('ex7',$data,''),
            'ex8' => element('ex8',$data,''),
            'ex9' => element('ex9',$data,''),
            'ex10' => element('ex10',$data,''),
            'cardCategoryId' => element('name', $data, '')//用户充值卡使用的属性
        );
        return $arr;
    }
    //socket portal
    private function notice_socket($data, $type = false){
        $result = null;
        $portal_socket = new PortalSocket();
        $result = $portal_socket->portal_socket(json_encode($data));
        if($type){
            //直接返回java消息
            return $result;
        }
        if($result['state']['code'] === 2000){
            return TRUE;
        }
        return FALSE;
    }
    private function getSocketPramse($type, $data) {
         $socketarr = array(
            'action' => $type,
            'resName' => 'account',
            'data' => array(
                'page' => array('currPage' => 1,'size' => 20),
                'list' => $data
            )
        );
        return $socketarr;
    }
}
