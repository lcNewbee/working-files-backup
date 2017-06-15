<?php
class CardList_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));
    }
    function get_list($data) {
        $parameter = array(
            'db' => $this->portalsql,
            'columns' => '*',
            'tablenames' => 'portal_card',
            'pageindex' => (int) element('page', $data, 1),
            'pagesize' => (int) element('size', $data, 20),
            'wheres' => "1=1",
            'joins' => array(),
            'order' => array()
        );
        if(isset($data['search'])){
            $parameter['wheres'] = $parameter['wheres'] . " AND name LIKE '%".$data['search']."%'";
        }
        if(isset($data['payType']) && $data['payType'] != '-100'){
            $parameter['wheres'] = $parameter['wheres'] . " AND payType='".$data['payType']."'";
        }
        if(isset($data['categoryType']) && $data['categoryType'] != '-100'){
            $parameter['wheres'] = $parameter['wheres'] . " AND categoryType='".$data['categoryType']."'";
        }
        $datalist = help_data_page_all($parameter);

        $htmdata = array();
        foreach($datalist['data'] as $row){
            $time = (int)$row['payTime'];
            switch($row['categoryType']){
                case 0 : $row['payTime'] = ($time/1000/60/60).'H';
                    break;
                case 1 : $row['payTime'] = ($time/24/60/60/1000).'D';
                    break;
                case 2 : $row['payTime'] = ($time/1000/60/60/24/31).'M';
                    break;
                case 3 : $row['payTime'] = ($time/1000/60/60/24/31/12).'Year';
                    break;
                case 4 : $row['payTime'] = ($time/1024/1024).'Mb';
                    break;
            }
            $htmdata[] = $row;
        }
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'page'=>$datalist['page'],
                'list' => $htmdata
            )
        );
        return json_encode($arr);
    }

    function getPram($data){
        $categoryType = element('categoryType',$data);
        switch($categoryType){
            case '0' : $categoryType = 2;
                break;
            case '4' : $categoryType = 4;
                break;
            default:
                $categoryType = 3;
                break;
        }
        $arr = array(
            'id'=> element('id',$data,null),
            'name' => element('name',$data,''),
            'description' => element('description',$data,''),
            'payTime' => element('payTime',$data,''),
            'payType' => $categoryType,
            'state' => 0,
            'cdKey' => uniqid('',true),
            'categoryType' => element('categoryType',$data,''),
            'accountName' => element('accountName',$data,''),
            'accountId' => element('accountId',$data,''),
            'payDate' => element('payDate',$data,''),
            'userDel' => element('userDel',$data,''),
            'accountDel' => element('accountDel',$data,''),
            'money' => element('money',$data,''),
            'buyDate' => (string)exec('date "+%Y-%m-%d %H-%M-%S"'),
            'speed' => 1,//暂时默认给 1，就是1M
            'maclimit' => 0,
            'autologin' => element('autologin',$data,'')
        );
        return $arr;
    }
    function Add($data) {
        $result = FALSE;
        $payType = $this->get_card_id($data['categoryName']);
        switch($payType){
            case '0' : $payType = 2;
                break;
            case '4' : $payType = 4;
                break;
            default:
                $payType = 3;
                break;
        }
        $this->get_card_id($data['categoryName']);

        $insertary = array(
            'name' => element('name',$data,''),
            'description' => element('description',$data,''),
            'categoryType' => $this->get_card_id($data['categoryName']),
            'payType' => $payType,
            'state' => 0,
            'payTime' => $this->get_time($data['categoryName']),
            'accountDel' => element('accountDel',$data,''),
            'userDel' => element('userDel',$data,''),
            'cdKey' => uniqid('',true),
            'money' => element('money',$data,''),
            'maclimit' => 0,
            'maclimitcount' => element('maclimitcount',$data,1),
            'autologin' => element('autologin',$data,''),
            'speed' => 1,//暂时默认给 1，就是1M
        );
        $cardCount = element('cardCount',$data,1);
        for($i = 0; $i < $cardCount; $i++){
            $insertary['cdKey'] = uniqid('',true);
            $result = $this->portalsql->insert('portal_card', $insertary);
        }
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    function Delete($data) {
        $result = FALSE;
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_card');
        }
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }
    function Edit($data) {
        $result = null;
        $updata = $this->getPram($data);
        $updata ['id'] = element('id',$updata);
        $result = $this->portalsql->replace('portal_card',$updata,array('id'=>$updata['id']));
        $result ? $result = json_ok() : $result = json_no('update error');
        return json_encode($result);
    }
    function SendMessage($data){
        $result = FALSE;
        $toid = 0;
        $toname = element('toname',$data);
        if($toname != ""){
            $query = $this->portalsql->query("select id,loginName from portal_account where loginName='".$toname."'");
            $row = $query->row();
            $toid = $row->id;
        }
        $insertary = array(
            'title' => element('title',$data,''),// 标题
            'description' => element('description',$data,''),// 内容
            'date' => (string)exec('date "+%Y-%m-%d %H-%M-%S"'),// 当前时间
            'state' => 0,// 消息的状态，0-未读，1-已读
            'ip' => $_SERVER['SERVER_ADDR'],// 发送者ip
            'fromPos' => 0,// 发送者类型
            'fromid' => 1,// 发送者id 暂且默认写admin ID
            'fromname' => 'admin',// 发送者名称
            'toid' => $toid,//接收者id
            'toPos' => 1,// 接收者类型，0-系统用户，1-接入用户
            'toname' => $toname,// 接收者名称
            'delin' => 0,// 默认值0，值为1表示在收件箱中删除了此条记录
            'delout' => 0,// 默认值0，值为1表示在发件箱中删除了此条记录
        );
        $result = $this->portalsql->insert('portal_message', $insertary);
        if($result){
            $result = json_ok();
            $this->set_card_state($data['id']);
        }else{
            $result = json_no('sendMessage error');
            $result['state']['code'] = 6401;
        }
        return json_encode($result);
    }
    private function get_time($id){
        $result = null;
        $query = $this->portalsql->query('select id,time,state,name from portal_cardcategory where id='.$id);
        $row = $query->row();
        if(is_object($row)){
            $time = $row->time;
            switch($row->state){
                case 0 : $result = $time*1000*60*60;break;
                case 1 : $result = $time*1000*60*60*24;break;
                case 2 : $result = $time*1000*60*60*24*31;break;
                case 3 : $result = $time*1000*60*60*24*31*12;break;
                case 4 : $result = $time*1024*1024;break;
            }
        }
        return $result;
    }
    //用充值卡id 获取该充值卡
    private function get_card_id($id){
        $result = null;
        $query = $this->portalsql->query('select id,state from portal_cardcategory where id='.$id);
        $row = $query->row();
        if(is_object($row)){
            $result = $row->state;
        }
        return $result;
    }
    private function set_card_state($id){
        $result = 0;
        $this->portalsql->set('state',1);
        $this->portalsql->where('id', $id);
        $result = $this->portalsql->update('portal_card');
        return $result;
    }
}
