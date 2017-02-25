<?php
class MessageAdd_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {        
        return json_encode(json_ok());
    }

    function getPram($data){  
        $toname = '';
        $toid = (int)element('id',$data,0);
        if($toid){
            $query = $this->portalsql->query("select id,loginName from portal_account where id=".$toid);
            $row = $query->row();
            $toname = $row->loginName;                        
        }        
        $arr = array(
            'title' => element('title',$data,''),// 标题
            'description' => element('description',$data,''),// 内容
            'date' => (string)exec('date "+%Y-%m-%d %H-%M-%S"'),// 当前时间
            'state' => 0,// 消息的状态，0-未读，1-已读
            'ip' => $_SERVER['SERVER_ADDR'],// 发送者ip
            'fromPos' => 0,// 发送者类型
            'fromid' => 1,// 发送者id 暂且默认写admin ID
            'fromname' => element('username',$_SESSION,''),// 发送者名称            
            'toid' => (int)element('id',$data,''),//接收者id
            'toPos' => 1,// 接收者类型，0-系统用户，1-接入用户
            'toname' => $toname,// 接收者名称            
            'delin' => 0,// 默认值0，值为1表示在收件箱中删除了此条记录
            'delout' => 0,// 默认值0，值为1表示在发件箱中删除了此条记录                    
        );
        return $arr;
    }
    function Setting($data){
        $result = FALSE;
        $insertary = $this->getPram($data);
        $result = $this->portalsql->insert('portal_message', $insertary);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
}
