<?php
header('content-type:text/html;charset=utf-8');
require_once __DIR__ . '/DB/DbMySqli.class.php';
class BlackServer {

	/**
	 * 组织需要发送的数据
	 * @groupid 分组
	 * @map_son_id 地图
	 * return array
	*/
	function start_send($groupid, $map_son_id) {
		$arr = array();
		//1.得到周期
		$rpttime = $this->getRptTime($groupid);
		//2.得到黑名单列表
		$blackdata = $this->getBlackList($groupid, $rpttime);
		//3.处理数据（配备区域信息）
		$index = 1;
		foreach($blackdata as $row){
			$data = $this->getAreaInfo($map_son_id, $row['Lat'], $row['Lon']);
			if(count($data) > 0) {
				$arr[] = array(
					'id' => $index, 
					'type' => 0, //0可疑人员进入
					'areaId' => $data['id'], 
					'areaLevel' => $data['level'], 
					//'sta_sum' => $data['sta_sum'],
					'mac' => $row['StaMac']
				);
				$index++;
			}
		}

		$socket_json = array(
			'area' => $this->getAllArea($map_son_id), 
			'events' => $arr
		);		
		return $socket_json;
	}
	/**
	 * 配置区域信息
	 * @map_son_id 地图
	 * @lat 纬度
	 * @lng 经度
	*/
	private function getAreaInfo($map_son_id, $lat, $lng) {
		$db = new DbMySqli();
		$sql  = "SELECT * FROM map_area WHERE map_son_id={$map_son_id} AND sta_lat>={$lat} AND sta_lng<{$lng} AND end_lat<{$lat} AND end_lng>={$lng};";
		$data = $db->query($sql);
		if(count($data) > 0) {
			return $data[0];
		}
		return array();
	}

	/**
	 * 获取的黑名单列表
	 * @groupid 分组
	 * @rpttime 周期
	*/
	private function getBlackList($groupid, $rpttime) {
		$db = new DbMySqli();
		$sql  = "SELECT * FROM (SELECT * FROM stablack_coordinate_info WHERE APGroupId={$groupid}";
		$sql .= " AND Timer>=(DATE_SUB(NOW(),INTERVAL {$rpttime} SECOND)) ORDER BY Timer DESC) AS t1 GROUP BY StaMac";
		$data = $db->query($sql);
		if(count($data) > 0){
			return $data;
		}
		return array();
	}

	/**
	 * 获取扫描周期
	 * @groupid 分组
	*/
    private function getRptTime($groupid) {   
		$db = new DbMySqli();     
        // select * from report_table where InParameter like '{"groupid":3,%';
        $sql = "SELECT InParameter FROM report_table WHERE InParameter LIKE '{\"groupid\":".$groupid."%'";        
		$res = $db->querySingle($sql);
		if ($res != '' && $res != null) {
			$obj = json_decode($res);
			return $obj->rpttime;
		}
        return 60;
    }

	/**
	 * 获取整个地图的区域信息
	 * @map_son_id 地图id
	*/
	private function getAllArea($map_son_id) {
		$db = new DbMySqli();
		$area = $db->query("select id,sta_sum as total,level from map_area where map_son_id={$map_son_id}");
		if( count($area) > 0 ) {
			return $area;
		}
		return array();
	}
	
}
/*------------------------------*/
/*
$obj = new BlackServer();
while(true){	
	$data_test = $obj->test_server(2,2);
	echo json_encode($data_test['events']);
	sleep(3);
}

*/
/*
$obj = new BlackServer();
$data_test = $obj->start_send(2,1);

echo '<pre>';
print_r($data_test['events']);
echo '</pre>';
*/
