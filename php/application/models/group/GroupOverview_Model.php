<?php
class GroupOverview_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
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

    $neighborsAps = $this->get_neighbors_aps_list($reqdata);
    $result = json_decode($staticJsonStr);
    $result->data->neighborsAps = $neighborsAps;

		return $result;
	}

}
