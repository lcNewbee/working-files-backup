<?php
class MapOrbit_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->database();
		$this->mysql = $this->load->database('mysqli', TRUE);        
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_list($data) { 
        $list = array();
        $macList = array();
		if( empty($data['groupid']) || empty($data['curMapId']) ){			
			return json_encode(json_no('Parameter error !'));
		}                     
        $build_id = $data['curMapId'];//区域id
        $groupid = $data['groupid'];
        $sta_mac = $data['mac'];    
        $strtime = $data['date'].' '.$data['fromTime'];
        $endtime = $data['date'].' '.$data['toTime'];
        
		$datalist = $this->get_sta_mac($build_id);
		if(count($datalist['ap_mac']) > 0){
			$sql = "select StaMac from sta_flow_sample where Timer>= '{$strtime}' and Timer<='{$endtime}' and ApGroupId={$groupid} and ApMac in({$datalist['where_in']}) group by StaMac LIMIT 1";

			$query = $this->mysql->query($sql);
			foreach($query->result_array() as $row){
				$macList[] = $row['StaMac'];
			}
			//检测mac 是否带入
			if( ($sta_mac == "" || $sta_mac == null || $sta_mac == "undefined") && count($macList) > 0) {
				$sta_mac = $macList[0];
			}
			
			if($sta_mac){            
				$sqlpor = "call active_orbit_func({$groupid},'{$sta_mac}','{$strtime}','{$endtime}')";            
				$queryd = $this->mysql->query($sqlpor);        
				foreach($datalist['ap_mac'] as $value){
					foreach($queryd->result_array() as $row) {
						//对比，确定在同个地图内(避免同建筑不同楼层的情况)
						if($row['ApMac'] === $value){
							$list[] = array(
								'lat'=>$row['Lat'],
								'lng'=>$row['Lon'],
								'time'=>$row['m_timestamp'],
							);
						}
					}                               
				}            
			}
		}		
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'macList'=>$macList,
                'list'=>$list			
            )   
        );
        return json_encode($arr);
	}

    //用内部平面图查找该 图中所有AP mac 去重复
    private function get_sta_mac($build_id){
        $ary = array(
            'ap_mac'=>array(),
            'where_in'=>''
        );
        $where_ins = array();
        $query = $this->db->query("select ap_mac from ap_map where build_id=".$build_id." group by ap_mac");            
        foreach($query->result_array() as $row){
            //1.获取该 地图中所有ap_mac
            $ary['ap_mac'][] = $row['ap_mac'];
            //2.获取该 地图中所有sta_mac
            $ary['where_in'] = $ary['where_in']."'".$row['ap_mac']."',";        
        }			
		$ary['where_in'] = rtrim($ary['where_in'], ','); 
		return $ary;		
    }   
}