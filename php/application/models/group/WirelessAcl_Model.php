<?php
class WirelessAcl_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper','array_page'));
        $this->load->library('SqlPage');
    }
    public function get_acl_list($retdata) {
        $result = null;
        //所有组
        if ($retdata['groupid'] === -100) {
            $result = $this->get_acl_data($retdata['filterGroupid'],$retdata['acltype']);
        } else {
            $acltype = 'black';
            $querydata = $this->db->select('ap_group.id,wids_template.acltype')
                                    ->from('ap_group')
                                    ->join('wids_template','ap_group.wids_tmp_id=wids_template.id','left')
                                    ->where("ap_group.id=".$retdata['groupid'])
                                    ->get()->result_array();
            if(count($querydata) > 0) {
              $acltype = $querydata[0]['acltype'];
            }
            $result = axc_get_wireless_acl(json_encode($retdata));
            $cgidata = json_decode($result);

            if ($cgidata->state->code === 2000) {
              $cgidata->data->settings = array('type'=>$acltype);
            } else {
              $cgidata->data = array(
                'data'=>array(
                  'type'=>$acltype
                )
              );
            }
            $result = $cgidata;
        }
        /*对数组分页*/        
        $where = array();
        if($retdata['search'] != "" && $retdata['search'] != null){
            $where = array('mac',$retdata['search']);
        }
        $data = array_page(json_decode(json_encode($result->data->list),true),$retdata['page'],$retdata['size'],$where);        
        $result->data->list = $data['data'];
        $result->data->page = $data['page'];
        
        return json_encode($result);
    }
    public function add_acl($data) {
        $result = null;
        if (!empty($data['groupid'])) {
            $cgiary['groupid'] = (int)$data['groupid'];
            $cgiary['mac'] = (string)$data['mac'];
            $cgiary['reason'] = (string)$data['reason'];
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
    /*********************
     * @filterid 过滤groupid
     * @type     获取类型 默认白
    *********************/
    public function get_acl_data($filterid=0,$type='black') {
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
