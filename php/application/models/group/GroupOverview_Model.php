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
        $result = json_decode($staticJsonStr);
        /*
		$neighborsAps = $this->get_neighbors_aps_list($reqdata);		
		$result->data->neighborsAps = $neighborsAps;
        */
        $result->data->neighborsAps = $this->get_ap_info($reqdata['groupid'],'getdoubtfulssid');                
        $result->data->aroundAps = $this->get_ap_info($reqdata['groupid'],'getaroundssid');
        $result->data->flowList = array(
            array('name'=>'ap','data'=>array(2 ,3, 2, 5, 6, 20, 34, 8, 9, 10, 11, 24, 13, 14, 15, 54, 17, 18, 19, 20, 21, 22, 23, 24)),
            array('wireless'=>'ap','data'=>array(2 ,3, 4, 5, 6, 20, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24)),
            array('clients'=>'ap','data'=>array(12,78, 36, 2, 123, 20, 75, 15, 2, 67, 2, 34, 2, 123, 34, 45,2,46, 34, 2, 2, 20, 2, 2))
        );
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
}
