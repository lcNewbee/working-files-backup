<?php
class WirelessAcl_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper','array_page'));
    }
    public function get_list($data) {
        $page = (int)element('page', $data, 1);
        $size = (int)element('size', $data, 20);
        $result = null;
        //所有组
        if ($data['groupid'] == -100) {
            $result = $this->getAclAll($data['filterGroupid'], $data['aclType']);
        } else {
            $acltype = 'black';
            $querydata = $this->db->select('ap_group.id,wids_template.acltype')
                                    ->from('ap_group')
                                    ->join('wids_template','ap_group.wids_tmp_id=wids_template.id','left')
                                    ->where("ap_group.id=".$data['groupid'])
                                    ->get()->result_array();

            if(count($querydata) > 0) {
              $acltype = $querydata[0]['acltype'];
            }
            $cgijson = array(
                'groupid' => (int)element('groupid', $data, -1),
                'page' => (int)element('page', $data, 1),
                'size' => (int)element('size', $data, 20),
                'search' => element('search', $data, 20)
            );
            $result = axc_get_wireless_acl(json_encode($cgijson));
            $cgidata = json_decode($result, true);

            if ($cgidata['state']['code'] == 2000) {
              $cgidata['data']['settings'] = array('type'=>$acltype);
            } else {
              $cgidata['data'] = array(
                'data'=>array(
                  'type'=>$acltype
                )
              );
            }
            $result = $cgidata;
        }
        /*对数组分页*/
        $where = array();
        if(isset($data['search']) && $data['search'] != ''){
            $where = array('mac',$data['search']);
        }
        $pagedata = $result['data']['list'];
        $data = array_page($pagedata,$page,$size,$where);
        //添加序号index
        $datalist = array();
        $k = 0;
        foreach($data['data'] as $row){
            $k++;
            $row['index'] = $k;
            $datalist[] = $row;
        }
        $result['data']['page'] = $data['page'];
        $result['data']['list'] = $datalist;
        return json_encode($result);
    }
    public function add_acl($data) {
        $result = null;
        if (!empty($data['groupid'])) {
            $cgiary['groupid'] = (int)$data['groupid'];
            $cgiary['mac'] = (string)$data['mac'];
            $cgiary['reason'] = (string)element('reason', $data, '');
            $result = axc_set_wireless_acl(json_encode($cgiary));
            //log
            $cgiObj = json_decode($result);
            if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
                $logary = array(
                    'type'=>'Add',
                    'operator'=>element('username',$_SESSION,''),
                    'operationCommand'=>"Add Acl ".$cgiary['mac']." Target group id=".$cgiary['groupid'],
                    'operationResult'=>'ok',
                    'description'=>""
                );
                Log_Record($this->db,$logary);
            }
        }
        return $result;
    }
    public function copy_config($data) {
        $maclist = $data['copySelectedList'];
        if(is_array($maclist)) {
            $arr['groupid'] = (int)element('groupid', $data, -1);
            foreach ($maclist as $mac) {
                $arr['mac'] = $mac;
                $arr['reason'] = 'static';
                $cgistr = axc_set_wireless_acl(json_encode($arr));
                //log
                $cgiObj = json_decode($cgistr);
                if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
                    $logary = array(
                        'type'=>'Add',
                        'operator'=>element('username',$_SESSION,''),
                        'operationCommand'=>"Add Acl ".$arr['mac']." Target group id=".$arr['groupid'],
                        'operationResult'=>'ok',
                        'description'=>""
                    );
                    Log_Record($this->db,$logary);
                }
            }
        }
        return json_encode(json_ok());

    }
    public function delete_acl($data) {
        $result = null;
        if (!empty($data['groupid'])) {
            $detary = array();
            $detary['groupid'] = $data['groupid'];
            foreach( $data['selectedList'] as $ary){
                $detary['mac'] = $ary['mac'];
                $cagistr = axc_del_wireless_acl(json_encode($detary));
                //log
                $cgiObj = json_decode($cagistr);
                if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
                    $logary = array(
                        'type'=>'Delete',
                        'operator'=>element('username',$_SESSION,''),
                        'operationCommand'=>"Delete Acl ".$detary['mac']." Target group id=".$detary['groupid'],
                        'operationResult'=>'ok',
                        'description'=>""
                    );
                    Log_Record($this->db,$logary);
                }
            }
            $result = json_encode(array('state' => array('code' => 2000, 'msg' => 'ok')));
        }
        return $result;
    }
    public function other_config($data) {
        $result = null;
        if(!empty($data['groupid'])){
            $cgi_dyblk['groupid'] = (int)$data['groupid'];
            $cgi_dyblk['type'] = (string)$data['type'];
            $result = axc_change_wireless_acltype(json_encode($cgi_dyblk));
        }
        return $result;
    }
    /**
     * 获取所有acl（当前组过滤掉）
     * @filterid 过滤groupid
     * @type     获取类型 默认白
    */
    private function getAclAll($filterid=0, $type='black') {
        $tableName = 'sta_black_list';
        if( $type === 'white') {
            $tableName = 'sta_white_list';
        }
        $result = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>array()
            )
        );
        $querydata = $this->db->select('mac,vendor,clientType,reason,lastTime')
                                ->from($tableName)
                                ->where('wids_id !=',$filterid)
                                ->get()->result_array();

        if(count($querydata) > 0){
            $macary = array();
            foreach ($querydata as $row) {
                array_push($macary,$row['mac']);
            }
            //所有组去除重复
            $retdata = array();
            $macary = array_unique($macary);
            foreach ($macary as $res) {
                $queryrow = $this->db->select('mac,vendor,clientType,reason,lastTime')
                                    ->from($tableName)
                                    ->where('mac',$res)
                                    ->get()->result_array();
                $retdata[] = $queryrow[0];
            }
            $result['data']['list'] = $retdata;
        }
        return $result;
    }

}
