<?php
class CateGory_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));
    }
    function get_list($data) {
        $parameter = array(
            'db' => $this->portalsql,
            'columns' => '*',
            'tablenames' => 'portal_cardcategory',
            'pageindex' => (int) element('page', $data, 1),
            'pagesize' => (int) element('size', $data, 20),
            'wheres' => "1=1",
            'joins' => array(),
            'order' => array()
        );
        if(isset($data['search'])){
            $parameter['wheres'] = $parameter['wheres'] . " AND name LIKE '%".$data['search']."%'";
        }
        if(isset($data['state']) && $data['state'] != '-1'){
            $parameter['wheres'] = $parameter['wheres'] . " AND state='".$data['state']."'";
        }
        $datalist = help_data_page_all($parameter);
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'page'=>$datalist['page'],
                'list'=>$datalist['data']
            )
        );
        return json_encode($arr);
    }

    private function getPram($data){
        $arr = array(
            'id'=> element('id',$data,null),
            'name' => element('name',$data),
            'description' => element('description',$data),
            'time' => element('time',$data),
            'state' => element('state',$data),
            'money' => element('money',$data),
            'maclimit' => 0,
            'maclimitcount' => 0,
            'autologin' => 0
        );
        return $arr;
    }
    function Add($data) {
        $result = FALSE;
        $insertary = $this->getPram($data);
        $result = $this->portalsql->insert('portal_cardcategory', $insertary);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    function Delete($data) {
        $result = FALSE;
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_cardcategory');
        }
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }
    function Edit($data) {
        $result = null;
        $updata = $this->getPram($data);
        $updata ['id'] = element('id',$updata);
        $result = $this->portalsql->replace('portal_cardcategory',$updata,array('id'=>$updata['id']));
        $result ? $result = json_ok() : $result = json_no('update error');
        return json_encode($result);
    }
}
