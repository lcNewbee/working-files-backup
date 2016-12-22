<?php
class WirelessTimer_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('SqlPage');
    }
    public function get_timer_list($data) {
        //时段	操作对象	重复	备注	开始时间	结束时间	状态
        $sqlpage = new SqlPage();
        $columns = '*';

        $tablenames = 'objects_list';
        $pageindex = 1;
        $pagesize =20;
        $datalist = $sqlpage->sql_data_page($columns,$tablenames,$pageindex,$pagesize);
        $htmdata = array();
        foreach($datalist['data'] as $row) {
            $this->db->select('*');
            $this->db->from('policy_params');
            $this->db->join('policy_attr','policy_params.attr_id=policy_attr.id','left');
            $this->db->where('policy_params.policy_id',$row['policy_id']);
            $querypolicy = $this->db->get()->result_array();
            $arya = array();
            foreach($querypolicy as $resp) {
                $arya['policy_id'] = $row['policy_id'];
                $arya['objects_name'] = $row['objects_name'];
                if($resp['attr_name'] === 'policy_type') {
                    $arya['policy_type'] = $resp['attr_value'];//类型
                }elseif($resp['attr_name'] === 'policy_times'){
                    $arya['policy_times'] = $resp['attr_value'];//时间
                }elseif($resp['attr_name'] === 'policy_enable'){
                    $arya['policy_enbale'] = $resp['attr_value'];//状态（开/关）
                }
            }
            $this->db->select('objects_params.*,objects_attr.attr_name');
            $this->db->from('objects_params');
            $this->db->join('objects_attr','objects_params.attr_id=objects_attr.id','left');
            $this->db->where('objects_params.objects_id',$row['id']);
            $queryobject = $this->db->get()->result_array();
            foreach($queryobject as $reso) {
                if($reso['attr_name'] === 'tempalte_name') {
                    $arya['objects_templatename'] = $reso['attr_value'];//操做模板名称
                }elseif($reso['attr_name'] === 'tempalte_id'){
                    $arya['objects_templateid'] = $reso['attr_value'];//操作模板id
                }elseif($reso['attr_name'] === 'tempalte_switch'){
                    $arya['objects_templateswitch'] = $reso['attr_value'];//操作类型
                }
            }
            $htmdata[] = $arya;
        }

        $arr['state'] = array("code"=>2000,"msg"=>"ok");
        $arr['data'] = array("list"=>$htmdata);
        return json_encode($arr);
    }
    public function add_timer_policy($data) {
        $result = null;
        $arr['policy_enable'] = element('policy_enbale',$data,'1');                  //策略开关 （1或0）
        $arr['policy_type'] = element('policy_type',$data,'Once');                 //策略类型 （Once 或者 Mon&Tue&Wed&Thu&Fri&Sat&Sun）
        $arr['policy_times'] = element('policy_times',$data,'2016-11-24 18:00');    //策略执行时间 （2016-11-25 12:35）
        $arr['objects_name'] = element('objects_name',$data,'ssid');                   //操作对象（radio 或 ssid）
        $arr['objects_templatename'] = element('objects_templatename',$data,'');   //操作模板名（ssid 或 ap的mac地址）
        $arr['objects_templateid'] = (string)element('objects_templateid',$data,'');//element('objects_templateid',$data,' ');        //操作模板id（ssid 属性id 或者 ap的radio网卡id）
        $arr['objects_templateswitch'] = (string)element('objects_templateswitch',$data,'1');//执行事件（禁用或启用 （0或1））
        $result = policy_add_profile_id(json_encode($arr));
        //log
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000 ) {
            $logary = array(
                'type'=>'Add',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Add TimingStrategy ".$arr['objects_templatename'],
                'operationResult'=>'ok',
                'description'=>json_encode($arr)
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    public function del_timer_policy($data) {
        $result = null;
        $arr['policy_list'] = null;
        $bakary = array();
        foreach($data['selectedList'] as $value) {
            $bakary[] = (string)$value;
        }
        $arr['policy_list'] = $bakary;
        $result = policy_del_profile_id(json_encode($arr));
        //log
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000 ) {
            $logary = array(
                'type'=>'Delete',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Delete TimingStrategy ",
                'operationResult'=>'ok',
                'description'=> json_encode($data['selectedList'])
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    public function up_timer_policy($data) {
        $result = null;
        $arr['policy_id'] = (string)element('policy_id',$data,'-1');
        $arr['policy_enable'] = element('policy_enbale',$data,'1');
        $arr['policy_type'] = element('policy_type',$data,'Once');
        $arr['policy_times'] = element('policy_times',$data,'2016-11-24 18:00');
        $arr['objects_name'] = element('objects_name',$data,'ssid');
        $arr['objects_templatename'] = element('objects_templatename',$data,'');
        $arr['objects_templateid'] = (string)element('objects_templateid',$data,'');//element('objects_templateid',$data,' ');
        $arr['objects_templateswitch'] = (string)element('objects_templateswitch',$data,'1');
        $result = policy_edit_profile_id(json_encode($arr));
        //log
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000 ) {
            $logary = array(
                'type'=>'Update',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Update TimingStrategy ".$arr['objects_templatename'],
                'operationResult'=>'ok',
                'description'=>json_encode($arr)
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
}
