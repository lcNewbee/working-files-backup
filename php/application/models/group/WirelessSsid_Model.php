<?php
class WirelessSsid_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('SqlPage');
    }
    public function get_ssid_list($retdata) {
        $result = null;
        if($retdata['groupid'] === -100){
            $querydata = $this->db->select('id')
                                    ->from('ap_group')
                                    ->where('id !=',$retdata['filterGroupid'])
                                    ->where('ssid_tmp_id !=',0)
                                    ->get()->result_array();

            $retary['state'] = array('code'=>2000,'msg'=>'ok');
            $upary = array();
            $arr = array();
            $cgilist = array();
            foreach($querydata as $row) {
                $arr = array('groupid' => (int)element('id', $row));
                $cgidata = json_decode(axc_get_wireless_ssid(json_encode($arr)) );
                if(is_object($cgidata)) {
                    if(count($cgidata->data->list) >0) {
                        foreach($cgidata->data->list as $row) {
                            foreach($row as $k=>$v) {
                                $cgilist[$k] = $v;
                            }
                            $upary[] = $cgilist;
                            //将							所有分组的SSID打包
                        }
                    }
                }
            }
            //去			掉重复SSID
            $temp = array();
            foreach($upary as $k=>$v) {
                $v = join(',',$v);
                $temp[$k] = $v;
            }
            $temp=array_unique($temp);
            foreach($temp as $k=>$v) {
                $temp[$k]=explode(',',$v);
            }
            $tempdata = array();
            foreach($temp as $row){
                $temp2['ssid'] =$row[0];
                $temp2['remark'] =$row[1];
                $temp2['enabled'] =$row[2];
                $temp2['hiddenSsid'] =$row[3];
                $temp2['maxBssUsers'] =$row[4];
                $temp2['storeForwardPattern'] =$row[5];
                $temp2['encryption'] =$row[6];
                $temp2['password'] =$row[7];
                $temp2['vlanId'] =$row[8];
                $temp2['downstream'] =$row[9];
                $temp2['upstream'] =$row[10];
                $temp2['loadBalanceType'] =$row[11];
                $temp2['ssidisolate'] =$row[11];

                $tempdata[] = $temp2;
            }
            $retary['data'] = array('list'=>$tempdata);
            $result = json_encode($retary);
        }
        else{
            $arr = array('groupid' => (int)element('groupid', $retdata));
            $result = axc_get_wireless_ssid(json_encode($arr));
        }
        return $result;
    }
    function getCgiParam($oriData) {
        $ret = array(
            'groupid' => (int)element('groupid', $oriData),
            'ssid' => element('ssid', $oriData),
            'remark' => element('remark', $oriData),
            'vlanid' => (int)element('vlanid', $oriData, 0),
            'enabled' => (int)element('enabled', $oriData),
            'maxBssUsers' => (int)element('maxBssUsers', $oriData),
            'loadBalanceType' => (int)element('loadBalanceType', $oriData),
            'hiddenSsid' => (int)element('hiddenSsid', $oriData),
            'storeForwardPattern' => element('storeForwardPattern', $oriData),
            'upstream' => (int)element('upstream', $oriData),
            'downstream' => (int)element('downstream', $oriData),
            'encryption' => element('encryption', $oriData),
            'password' => element('password', $oriData, ''),
            'ssidisolate' => (int)element('ssidisolate', $oriData, '')
        );
        return $ret;
    }
    public function add_ssid($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = axc_add_wireless_ssid(json_encode($temp_data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log
            $logary = array(
                'type'=>'Add',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Add SSID ".$temp_data['ssid']." Target group id=".$temp_data['groupid'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    public function delete_ssid($data) {
        $result = null;
        $selectList = element('selectedList', $data);
        foreach ($selectList as $item) {
            $deleteItem = array('groupid' => element('groupid', $data), 'ssid' => element('ssid', $item));
            $result = axc_del_wireless_ssid(json_encode($deleteItem));
            $cgiObj = json_decode($result);
            if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
                //log
                $logary = array(
                    'type'=>'Delete',
                    'operator'=>element('username',$_SESSION,''),
                    'operationCommand'=>"Delete SSID ".$deleteItem['ssid']." Target group id=".$deleteItem['groupid'],
                    'operationResult'=>'ok',
                    'description'=>""
                );
                Log_Record($this->db,$logary);
            }
        }
        return json_encode(json_ok());
    }
    public function update_ssid($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = axc_modify_wireless_ssid(json_encode($temp_data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log
            $logary = array(
                'type'=>'Update',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Update SSID ".$temp_data['ssid']." Target group id=".$temp_data['groupid'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    public function bind_ssid($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = axc_bind_wireless_ssid(json_encode($temp_data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log
            $logary = array(
                'type'=>'Binding',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Binding SSID ".$temp_data['ssid']." Target group id=".$temp_data['groupid'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    public  function unbind_ssid($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = axc_unbind_wireless_ssid(json_encode($temp_data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log
            $logary = array(
                'type'=>'Unbundling',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Unbundling SSID ".$temp_data['ssid']." Target group id=".$temp_data['groupid'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    public function copy_ssid($data) {
        $result = null;
        $arr = array();
        if(count($data['copySelectedList']) > 0) {
            $arr['groupid'] = (int)element('groupid', $data,-1);
            foreach ($data['copySelectedList'] as $res) {
                if($res != ""){
                    $arr['ssid'] = (string)$res;
                    $result = axc_bind_wireless_ssid(json_encode($arr));
                    $cgiObj = json_decode($result);
                    if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
                        //log
                        $logary = array(
                            'type'=>'Binding',
                            'operator'=>element('username',$_SESSION,''),
                            'operationCommand'=>"Binding SSID ".$arr['ssid']." Target group id=".$arr['groupid'],
                            'operationResult'=>'ok',
                            'description'=>""
                        );
                        Log_Record($this->db,$logary);
                    }
                }
            }
        }
        return json_encode(json_ok());
    }
}
