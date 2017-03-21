<?php
class MapHeat_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->mysql = $this->load->database('mysqli', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {   
        $list = array();
        //call flow_chart_php(3,'2017-03-19 20:28:30','2017-03-20 20:30:30');
        //call time_chart_php(3,'2017-03-19 20:28:30','2017-03-20 20:30:30');
        $groupid = $data['groupid'];
        $strtime = $data['startDate'].' '.$data['startTime'];
        $endtime = $data['endDate'].' '.$data['endTime'];
        if($data['mapType'] === 'number'){
            //get用户数
            $queryd = $this->mysql->query("call flow_chart_php (".$groupid.",'".$strtime."','".$endtime."')");                  
            foreach($queryd->result_array() as $row){
                $cry['lat'] = (float)$row['Lat'];
                $cry['lng'] = (float)$row['Lon'];
                $cry['value'] = (int)$row['StaNum'];
                $list[] = $cry;
            }
        }
        if($data['mapType'] === 'times'){
            //get 人次
            $queryd = $this->mysql->query("call time_chart_php (".$groupid.",'".$strtime."','".$endtime."')");
            foreach($queryd->result_array() as $row){
                $cry['lat'] = (float)$row['Lat'];
                $cry['lng'] = (float)$row['Lon'];
                $cry['value'] = (int)$row['StaNum'];
                $list[] = $cry;
            }
        } 
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>$list
            )   
        );        
        return json_encode($arr);
	}   
}