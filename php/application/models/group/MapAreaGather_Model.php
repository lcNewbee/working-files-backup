<?php
/**
 * 地图区域配置
*/
class MapAreaGather_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
    $this->mysql = $this->load->database('mysqli', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {
    $datalist = $this->mysql->select('id,sta_sum as total,sta_lat,sta_lng,end_lat,end_lng,level,annotation as describe')
        ->from('map_area')
        ->where('map_son_id',$data['curMapId'])
        ->order_by('id','ASC')
        ->get()->result_array();
    $

    $heatList = array();
    //call flow_chart_php(3,'2017-03-19 20:28:30','2017-03-20 20:30:30');
    //call time_chart_php(3,'2017-03-19 20:28:30','2017-03-20 20:30:30');
    $groupid = $data['groupid'];
    $strtime = $data['startDate'].' '.$data['startTime'];
    $endtime = $data['endDate'].' '.$data['endTime'];



    //get用户数
    $queryd = $this->mysql->query("call flow_chart_php (".$groupid.",'".$strtime."','".$endtime."')");
    foreach($queryd->result_array() as $row){
        $cry['lat'] = (float)$row['Lat'];
        $cry['lng'] = (float)$row['Lon'];
        $cry['value'] = (int)$row['StaNum'];
        $heatList[] = $cry;
    }

    $arr = array(
      'state'=>array('code'=>2000,'msg'=>'ok'),
      'data'=>array(
        'list'=>$datalist,
        'heatList'=>$heatList
      )
    );
    return json_encode($arr);
	}
    //获取扫描周期
    private function getRptTime($groupid) {
        // select * from report_table where InParameter like '{"groupid":3,%';
        $sql = "select InParameter from report_table where InParameter like '{\"groupid\":".$groupid."%'";
        $query = $this->mysql->query($sql);
        if(isset($query->result_array()[0]['InParameter'])){
            $objdata = json_decode($query->result_array()[0]['InParameter']);
            return $objdata->rpttime;
        }
        return 60;
    }
}
