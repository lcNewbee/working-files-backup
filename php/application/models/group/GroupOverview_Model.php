<?php
class GroupOverview_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->mysql = $this->load->database('mysqli', TRUE);
        $this->load->helper('array');
    }
    public function get_neighbors_aps_list($reqdata) {
        $aps = axc_get_neighbors_aps(json_encode($reqdata));
        $result = json_decode($aps);
        return $result->data;
    }

    public function get_all($reqdata) {
        $staticJsonStr = '{"state":{"code":2000,"msg":"ok"},"data":{"online":0,"offline":0,"clientsNumber":693,"terminalType":[{"name":"iPhone","value":286},{"name":"Mac","value":164},{"name":"Google","value":126},{"name":"Huaiwei","value":117}],"flowList":[{"name":"http","value":232},{"name":"cifs","value":222},{"name":"smtp","value":180},{"name":"ftp","value":120},{"name":"ssl","value":80},{"name":"https","value":20}],"safeAlarmEvents":[{"name":"DDOS","value":232},{"name":"DNS Cache Snoop","value":345},{"name":"DNS Redirect","value":555},{"name":"DNS Hijacking","value":888}]}}';

        $reqdata['groupid'] = (int)$reqdata['groupid'];
        $reqdata['page'] = (int)$reqdata['page'];
        $reqdata['size'] = (int)$reqdata['size'];
        $reqdata['timeType'] = (string)$reqdata['timeType'];
        $result = json_decode($staticJsonStr);

        $result->data->neighborsAps = $this->get_ap_info($reqdata['groupid'],'getdoubtfulssid');
        $result->data->aroundAps = $this->get_ap_info($reqdata['groupid'],'getaroundssid');
        //$result->data->flowList = $this->flow_list($reqdata);
        $result->data->flowList = $this->get_flow_data($reqdata);
        $retobj = $this->get_overvies($reqdata['groupid']);        
        $result->data->clientsNumber = $retobj->data->clientnum;//总用户
        $result->data->online = $retobj->data->apstatus->online;
        $result->data->offline = $retobj->data->apstatus->offline;
        
        $arr = array();
        if(is_object($retobj->data->clienttype)) {
            foreach($retobj->data->clienttype as $key=>$val) {
                $mary['name'] = $key;
                $mary['value'] = $val;
                if($mary['name'] === 'Apple'){
                    $mary['name'] = 'iPhone';
                }
                $arr[] = $mary;
            }
        }
        $result->data->terminalType = $arr;//链接数量
        return $result;
    }
    //周围AP
    public function get_ap_info($groupid,$prename) {
        $arr = array(
            'page'=>array(
                "start"=>2,
                "size"=>20,
                "currPage"=>1,
                "totalPage"=>1,
                "total"=>20,
                "nextPage"=>0,
                "lastPage"=>2
            ),
            'list'=>array()
        );
        if(!empty($groupid)) {
            $db_list = array();
            $queryd = $this->mysql->query("call ".$prename."(".$groupid.")");
            $result = $queryd->result_array();
            $temporaryAry = array();
            if(count($result)){
                foreach ($result as $row) {
                    $temporaryAry['mac'] = $row['NbrMac'];
                    $temporaryAry['ssid'] = $row['NbrSsid'];
                    $temporaryAry['channel'] = $row['ChlNum'];
                    $temporaryAry['rssi'] = $row['MeanRSSI'];
                    $db_list[] = $temporaryAry;
                }
            }            
            $arr['list'] = $db_list;
            $arr['page']['total'] = count($result);

            $this->mysql->close();
        }
        return $arr;
    }
    //流量处理
    public function get_flow_data($data){
        $result = null;
        $groupid = (int)element('groupid',$data,0);        
        if($groupid === -100) {
            //All
            $timeType = (string)element('timeType',$data,'today');
            $tablename = 'data_flow_day';
            if($timeType === 'today' || $timeType === 'yesterday'){
                $tablename = 'data_flow_hour';
            }
            $sql = "select Id,ApGroupId FROM ".$tablename." a where not exists (select 1 from  ".$tablename." where a.ApGroupId=ApGroupId  and id>a.id) order by ApGroupId";
            $allquery = $this->mysql->query($sql);
            $alldata = $data;
            $arr = array();
            foreach($allquery->result_array() as $row) {
                $alldata['groupid'] = $row['ApGroupId'];
                $flowlist = $this->flow_list($alldata);                                  
                if(count($arr) === 0){
                   $arr =  $flowlist;
                }else{                                                    
                    for($i = 0; $i < count($arr); $i++) {                              
                        if( count($arr[$i]['data']) > count($flowlist[$i]['data']) ){
                            for($j = 0; $j < count($flowlist[$i]['data']); $j++) {
                                $arr[$i]['data'][$j] = (int)$arr[$i]['data'][$j] + (int)$flowlist[$i]['data'][$j];
                            }
                        }else{
                            for($n = 0; $n < count($arr[$i]['data']); $n++) {
                                $arr[$i]['data'][$n] = (int)$arr[$i]['data'][$n] + (int)$flowlist[$i]['data'][$n];
                            }
                        }
                    }     
                }                                      
            }            
            $result = $arr;   
        }else{
            $result = $this->flow_list($data);
        }
        return $result;
    }
    //流量
    public function flow_list($data) {        
        $groupid = (int)element('groupid',$data,0);
        $timeType = (string)element('timeType',$data,'today');
        $tablename = 'data_flow_day';
        if($timeType === 'today' || $timeType === 'yesterday'){
            $tablename = 'data_flow_hour';
        }
        $timewh = $this->get_start_end_time($timeType);              
        $sqlstr = "select * from ".$tablename." where ApGroupId=".$groupid." and Timer>='".$timewh['start_date']."' and Timer <= '".$timewh['end_date']."'";
        $querydata = $this->mysql->query($sqlstr);

        $apAry = array();
        $wireessAry = array();
        $clientAry = array();
        //添加默认值针对小时
        if($tablename === 'data_flow_hour'){
            $addnumber = 0;
            if(count($querydata->result_array()) >0){
                $st = $querydata->last_row()->Timer;
                $addnumber = (int)substr($st,11,2);
                //截取时间获取整点
            }
            else{
                $addnumber = 24;
            }
            if($addnumber > 0) {
                for ($i = 0; $i <= $addnumber; $i++) {
                    array_push($apAry,0);
                    array_push($wireessAry,0);
                    array_push($clientAry,0);
                }
            }
            for($k=0; $k<count($querydata->result_array()); $k++){
                $apAry[$k] = $querydata->result_array()[$k]['ApRxFlow'];
                $wireessAry[$k] = $querydata->result_array()[$k]['RadioRxFlow'];
                $clientAry[$k] = $querydata->result_array()[$k]['StaRxFlow'];
            }
        }        
        //添加默认值针对天数
        if($tablename === 'data_flow_day'){
            $default_day = 7;
            switch($timeType){
                case 'half_month': $default_day = 15;
                    break;
                case 'month': $default_day = 30;
                    break;
            }
            $add_day = $default_day - count($querydata->result_array());
            for ($j = 0; $j < $add_day; $j++) {                
                array_push($apAry,0);
                array_push($wireessAry,0);
                array_push($clientAry,0);                
            }
            foreach($querydata->result_array() as $row){
                array_push($apAry,$row['ApRxFlow']);
                array_push($wireessAry,$row['RadioRxFlow']);
                array_push($clientAry,$row['StaRxFlow']); 
            }            
        }                     
        $arr = array(
            array('name'=>'ap','data'=>$apAry),
            array('name'=>'wireless','data'=>$wireessAry),
            array('name'=>'clients','data'=>$clientAry)
        );                       
        return $arr;        
    }
    public function get_start_end_time($gettype='today') {
        date_default_timezone_set('Asia/Shanghai');
        //echo (string)exec('date "+%Y-%m-%d %H:%M:%S"');
        //当天初始时间
        $stateDate = (string)exec('date "+%Y-%m-%d"')." 00:00:00";
        //当天结束时间
        $endDate = (string)exec('date "+%Y-%m-%d"')." 24:00:00";
        $startTime = (int)strtotime($stateDate);
        switch($gettype){
            case 'yesterday' :
                $startTime = $startTime - (1 * 86400);
                $endDate = $stateDate;
            break;
                case 'week': $startTime = $startTime - (7 * 86400);
            break;
                case 'half_month': $startTime = $startTime - (15 * 86400);
            break;
                case 'month': $startTime = $startTime - (30 * 86400);
            break;
                default:
                break;
        }
        $stateDate = date('Y-m-d H:i:s',$startTime);
        $arr['start_date'] = $stateDate;
        $arr['end_date'] = $endDate;
        return $arr;
    }

    function get_overvies($groupid) {
        $cgiarr = array('groupid'=>$groupid);
        $cgistr = axc_get_overvies(json_encode($cgiarr));
        $retobj = json_decode($cgistr);
        return $retobj;
    }
}
