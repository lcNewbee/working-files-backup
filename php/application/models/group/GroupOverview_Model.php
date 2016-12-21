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
		$staticJsonStr = '{"state":{"code":2000,"msg":"ok"},"data":{"cpuUsed":20,"cpuTotal":100,"memoryUsed":40,"memoryTotal":100,"clientsNumber":693,"terminalType":[{"name":"iPhone","value":286},{"name":"Mac","value":164},{"name":"Google","value":126},{"name":"Huaiwei","value":117}],"flowList":[{"name":"http","value":232},{"name":"cifs","value":222},{"name":"smtp","value":180},{"name":"ftp","value":120},{"name":"ssl","value":80},{"name":"https","value":20}],"safeAlarmEvents":[{"name":"DDOS","value":232},{"name":"DNS Cache Snoop","value":345},{"name":"DNS Redirect","value":555},{"name":"DNS Hijacking","value":888}]}}';

		$reqdata['groupid'] = (int)$reqdata['groupid'];
		$reqdata['page'] = (int)$reqdata['page'];
		$reqdata['size'] = (int)$reqdata['size'];
        $reqdata['timeType'] = (string)$reqdata['timeType'];
        $result = json_decode($staticJsonStr);

        $result->data->neighborsAps = $this->get_ap_info($reqdata['groupid'],'getdoubtfulssid');
        $result->data->aroundAps = $this->get_ap_info($reqdata['groupid'],'getaroundssid');
        //$result->data->flowList = $this->flow_list($reqdata);

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
            foreach ($result as $row) {
                $temporaryAry['mac'] = $row['NbrMac'];
                $temporaryAry['channel'] = $row['ChlNum'];
                $temporaryAry['rssi'] = $row['MeanRSSI'];
                $db_list[] = $temporaryAry;
            }
            $arr['list'] = $db_list;
            $arr['page']['total'] = count($result);

            $this->mysql->close();
        }
        return $arr;
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
        foreach($querydata->result_array() as $row) {
            array_push($apAry,$row['ApRxFlow']);
            array_push($wireessAry,$row['RadioRxFlow']);
            array_push($clientAry,$row['StaRxFlow']);
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
}
