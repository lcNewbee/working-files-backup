<?php
class WirelessSsid_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
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
                $temp2['ssidisolate'] =$row[12];
                $temp2['greenap'] = $row[13];

                $tempdata[] = $temp2;
            }
            $retary['data'] = array('list'=>$tempdata);
            $result = json_encode($retary);
        } else {
            $arr = array('groupid' => (int)element('groupid', $retdata));
            $result = axc_get_wireless_ssid(json_encode($arr));
            $cgiary = json_decode($result,true);
            $list = array();
            if(is_array($cgiary) && $cgiary['state']['code'] == 2000){
                foreach($cgiary['data']['list'] as $row) {
                    if($row['mandatorydomain'] != "" && $row['encryption'] != '802.1x'){
                         $row['accessControl'] = 'portal';
                    }
                    $ssid = addslashes($row['ssid']);//特殊字符转义
                    $sql = "SELECT * FROM `portal_ssid` WHERE BINARY `ssid`='{$ssid}' AND `apmac`=''";
                    //$sql = "SELECT * FROM `portal_ssid` WHERE BINARY `ssid`='{$row['ssid']}' AND `apmac`=''";                                        
                    $query = $this->portalsql->query($sql)->result_array();
                    if(count($query) > 0){
                        $row['accessControl'] = 'portal';
                        $row['auth'] = $query[0]['web'];
                        $row['portalTemplate'] = 'local';
                    }
                    $list[] = $row;
                }
            }
            $cgiary['data']['list'] = $list;
            return json_encode($cgiary);
        }
        return $result;
    }
    public function add_ssid($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);

		    //判断是否选择了1x 认证，并且没选择aaa模板 将默认的local清除
		    if($data['encryption'] === '802.1x' && $data['mandatorydomain'] === 'local'){
            $temp_data['mandatorydomain'] = '';
        }

		    //判断是否选择portal模板
        if($data['accessControl'] === 'portal') {
          //使用portal
          //1. 用portal模板得到aaa模板
          $aaa_template = $this->getDomain($data['portalTemplate']);
			    $temp_data['mandatorydomain'] = $aaa_template;
        }
        if($data['accessControl'] === 'none' && $data['encryption'] != '802.1x'){
            $temp_data['mandatorydomain'] = '';
        }

        $result = axc_add_wireless_ssid(json_encode($temp_data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {

            //绑定portal
            if($data['accessControl'] === 'portal' && isset($data['auth']) && $data['auth'] != '' ) {
                $this->binPortalTemplate($data['auth'], $data['ssid'], $temp_data['mandatorydomain']);
            }
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
				$this->delPoartalSsid($item['ssid']);
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

        // 默认值为 none
        $accessControl = element('accessControl', $data, 'none');

		//判断是否选择了1x 认证，并且没选择aaa模板 将默认的local清除
		if($data['encryption'] === '802.1x' && $data['mandatorydomain'] === 'local'){
            $temp_data['mandatorydomain'] = '';
        }
		//判断是否选择portal模板
        if($accessControl === 'portal') {
            //使用portal
            //1. 用portal模板得到aaa模板
            $aaa_template = $this->getDomain($data['portalTemplate']);
		    	  $temp_data['mandatorydomain'] = $aaa_template;
        }
        if($accessControl === 'none' && $data['encryption'] != '802.1x'){
            $temp_data['mandatorydomain'] = '';
        }
        $result = axc_modify_wireless_ssid(json_encode($temp_data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            if($accessControl === 'none'){
                //没有选择portal认证 删除全部ssid下的portal_ssid
                $this->delPoartalSsid($data['ssid']);
            }
			if($accessControl === 'portal' && isset($data['auth']) && $data['auth'] != '' ) {
                if($this->getPortalSsidState('local_ssid_local', $data['ssid'])) {
                    //有记录就修改
                    $this->editPoartalSsid($data['ssid'], $data['auth'], $temp_data['mandatorydomain']);
                }else{
                    //没有就添加
                    $this->binPortalTemplate($data['auth'], $data['ssid'], $temp_data['mandatorydomain']);
                }

            }
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
    public function unbind_ssid($data) {
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

    private function getCgiParam($oriData) {
        $ret = array(
            'groupid' => (int)element('groupid', $oriData),
            'ssid' => element('ssid', $oriData),
            'remark' => element('remark', $oriData),
            'vlanid' => (int)element('vlanId', $oriData, 0),
            'enabled' => (int)element('enabled', $oriData),
            'maxBssUsers' => (int)element('maxBssUsers', $oriData),
            'loadBalanceType' => (int)element('loadBalanceType', $oriData),
            'hiddenSsid' => (int)element('hiddenSsid', $oriData),
            'mandatorydomain' => element('mandatorydomain', $oriData),
            'storeForwardPattern' => element('storeForwardPattern', $oriData),
            'upstream' => (int)element('upstream', $oriData),
            'downstream' => (int)element('downstream', $oriData),
            'encryption' => element('encryption', $oriData),
            'password' => element('password', $oriData, ''),
            'ssidisolate' => (int)element('ssidisolate', $oriData, ''),
            'greenap' => (int)element('greenap', $oriData, '')
        );
        return $ret;
    }

    //portal 模板获取aaa
    private function getDomain($portal) {
		$sqlcmd  = "select portal_auth.id as aaa_id,portal_params.attr_value from portal_server";
		$sqlcmd .= " left join portal_auth on portal_auth.id=portal_server.portal_id";
		$sqlcmd .= " left join portal_params on portal_auth.id=portal_params.portal_id";
		$sqlcmd .= " where portal_auth.portal_name='{$portal}' AND portal_params.attr_id =3";
		$query = $this->db->query($sqlcmd)->result_array();
        if(count($query) > 0 && $query[0]['attr_value']) {
            return $query[0]['attr_value'];
        }
        return '';
    }

    private function getPortalSsidState($name, $ssid){
        $sqlcmd = "select * from portal_ssid where name='{$name}' and ssid='{$ssid}'";
        $query = $this->portalsql->query($sqlcmd)->result_array();
        if( count($query) > 0 ){
            return TRUE;
        }
        return FALSE;
    }
	/**
     * 绑定portal模板 操作portal_ssid表
     * @web_template 网页模板
     * @ssid
    */
    private function binPortalTemplate($web_template, $ssid, $domain) {
        $arr = array(
            'name'=> 'local_ssid_' . $domain,
            'address'=>'',//地址
            'basip'=> $this->getInterface(),
            'web'=>$web_template,//页面模版
            'des'=>'',//描述
            'ssid'=> $ssid,
            'apmac'=> ''
        );
        if($this->portalsql->insert('portal_ssid', $arr)){
            return True;
        }
        return FALSE;
    }
	//修改portal_ssid
	private function editPoartalSsid($ssid, $web_template, $domain) {
        $name = 'local_ssid_' . $domain;
        $basip =  $this->getInterface();
        $sqlcmd = "update portal_ssid set name='{$name}',basip='{$basip}',web={$web_template} where BINARY ssid='{$ssid}'";
        $this->portalsql->query($sqlcmd);
    }
    //删除portal_ssid
	private function delPoartalSsid($ssid) {
        $sqlcmd = "DELETE FROM portal_ssid WHERE BINARY ssid='{$ssid}'";    
        $this->portalsql->query($sqlcmd);
    }

    //检测是否可
    private function isPortalAdd($ssid) {
        $sql = "SELECT * FROM `portal_ssid` WHERE BINARY `ssid`='{$ssid}' AND `apmac`=''";
        $query = $this->portalsql->query($sql)->result_array();
        if(count($query) > 0){
            return FALSE;
        }
        return TRUE;
    }

    private function getInterface() {
        $data = $this->db->select('port_name,ip1')
                ->from('port_table')
                ->get()
                ->result_array();
        if( count($data) >0 ){
            return $data[0]['ip1'];
        }
        return  $_SERVER['SERVER_ADDR'];
    }
}
