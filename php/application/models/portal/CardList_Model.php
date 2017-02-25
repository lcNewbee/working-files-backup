<?php
class CardList_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {
        $columns = '*';
        $tablenames = 'portal_card';
        $pageindex = (int)element('page', $data, 1);
        $pagesize = (int)element('size', $data, 20);
        $datalist = help_data_page($this->portalsql,$columns,$tablenames,$pageindex,$pagesize);
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
            'maclimit' => element('maclimit',$data,''),
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
            'maclimit' => element('maclimit',$data,''),
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
}
