<?php
class AccessWeixin_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));        
    }
    function get_list($data) {
        $parameter = array(
            'db' => $this->portalsql, 
            'columns' => 'portal_weixin_wifi.id,portal_weixin_wifi.basip,portal_weixin_wifi.ssid,portal_weixin_wifi.shopId,portal_weixin_wifi.appId,portal_weixin_wifi.secretKey,portal_weixin_wifi.domain,portal_weixin_wifi.outTime', 
            'tablenames' => 'portal_weixin_wifi', 
            'pageindex' => (int) element('page', $data, 1), 
            'pagesize' => (int) element('size', $data, 20), 
            'wheres' => "basip LIKE '%".$data['search']."%' or ssid Like '%".$data['search']."%'", 
            'joins' => array(), 
            'order' => array()
        );
        $datalist = help_data_page_all($parameter);
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'page'=>$datalist['page'],
                'list' => $datalist['data']
            )
        );
        return json_encode($arr);
    }

    function getPram($data){
        $default_domain = $this->portalsql->select('domain')
                                ->from('config')
                                ->get()->result_array();
        $default_outTime = $this->portalsql->select('outTime')
                        ->from('portal_weixin_wifi')
                        ->where('id=1')
                        ->get()->result_array();
        $arr = array(
            'id'=> element('id',$data),
            'basip' => element('basip',$data),
            'ssid' => element('ssid',$data),
            'shopId' => element('shopId',$data),
            'appId' => element('appId',$data),
            'secretKey' => element('secretKey',$data),
            'domain' => element('domain',$data,$default_domain['0']['domain']),
            'outTime' => element('outTime',$data,$default_outTime['0']['outTime'])
        );
        return $arr;
    }
    function Add($data) {
        $result = FALSE;
        $insertary = $this->getPram($data);
        $result = $this->portalsql->insert('portal_weixin_wifi', $insertary);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    function Delete($data) {
        $result = FALSE;
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_weixin_wifi');
        }
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }
    function Edit($data) {
        $result = null;
        $updata = $this->getPram($data);
        $updata ['id'] = element('id',$updata);
        $result = $this->portalsql->replace('portal_weixin_wifi',$updata,array('id'=>$updata['id']));
        $result ? $result = json_ok() : $result = json_no('update error');
        return json_encode($result);
    }
}
