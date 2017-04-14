<?php
header('content-type:text/html;charset=utf-8');
require_once __DIR__ . '/DB/DbMySqli.class.php';
class BlackServer {

	public function test_server($groupid, $map_son_id) {
		//1.获取到二次周期黑名单数据
		$data = $this->get_list($groupid);
		//2. 二次周期 经纬度，分别比配各自 区域area_id / 和级别areaLevel
		$last = array(); //上次周期		
		foreach ($data['last'] as $row) {
			$last_data = $this->is_area_id($map_son_id, $row['Lat'], $row['Lon']);			
			if (is_array($last_data)) {
				$row['area_id'] = $last_data['id'];
				$row['areaLevel'] = $last_data['level'];
				$last[] = $row;
			}
		}
		$lately = array(); //最近周期
		foreach ($data['lately'] as $row) {
			$lately_data = $this->is_area_id($map_son_id, $row['Lat'], $row['Lon']);
			if (is_array($lately_data)) {
				$row['area_id'] = $lately_data['id'];
				$row['areaLevel'] = $lately_data['level'];
				$lately[] = $row;
			}
		}		
		//3.对比两次的区域是否变化 如有变化则加入到变化事件集合中
		$result_events = array();
		$index = 1;		
		foreach ($lately as $res1) {			
			foreach ($last as $res2) {
				if($res1['StaMac'] == $res2['StaMac']){
					if ($res1['area_id'] != $res2['area_id']) {
						$result_events[] = array(
							'id' => $index, 
							'type' => 0, //0可疑人员进入
							'areaId' => $res1['area_id'], 
							'areaLevel' => $res1['areaLevel'], 
							'mac' => $res1['StaMac']
						);
						$index++;					
					}
				}				
			}
		}	
		//获取区域及终端数量（实时） 以一次扫描为准
		$db = new DbMySqli();
		$area = $db->query("select id,sta_sum as total,level from map_area where map_son_id={$map_son_id}");
		$socket_json = array(
			'area' => $area, 
			'events' => $result_events
		);
		return $socket_json;
	}
	//判断给定的经纬度 找到所属分区
	private function is_area_id($map_son_id, $lat, $lng) {
		$db = new DbMySqli();
		$data = $db->query("select id,level,sta_lat,end_lat,sta_lng,end_lng from map_area where map_son_id={$map_son_id}");
		foreach ($data as $row) {
			if ($lat <= $row['sta_lat'] && $lat > $row['end_lat'] && $lng >= $row['sta_lng'] && $lng < $row['end_lng']) {
				return $row;
			}
		}
		return 0;
	}
	private function get_list($groupid) {
		$db = new DbMySqli();
		$rpttime = 0; //扫描周期
		// select * from report_table where InParameter like '{"groupid":3,%';
		$sql = "select InParameter from report_table where InParameter like '{\"groupid\":" . $groupid . "%'";
		$res = $db->querySingle($sql);
		if ($res != '' && $res != null) {
			$obj = json_decode($res);
			$rpttime = $obj->rpttime;
		}
		if ($rpttime > 0) {
			//1.得到最近一个周期的数据
			$sqlblack = "select * from stablack_coordinate_info where ApGroupId={$groupid}";
			$sqlblack.= " AND Timer>=date_sub(now(),interval {$rpttime} second)";
			$data = $db->query($sqlblack);
			//2.得到上一个周期的数据
			$lasttime = $rpttime * 2;
			$sqllast = "select * from stablack_coordinate_info where ApGroupId={$groupid}";
			$sqllast.= " AND Timer>=date_sub(now(),interval {$lasttime}  second)";
			$sqllast.= " AND Timer<=date_sub(now(),interval {$rpttime}  second)";
			$datalast = $db->query($sqllast);
			$arr = array('last' => $datalast, 'lately' => $data,);
			return $arr;
		}
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
$data_test = $obj->test_server(2,2);

echo '<pre>';
print_r($data_test['events']);
echo '</pre>';
*/