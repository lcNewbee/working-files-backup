<?php
/**
 * 地图区域配置
*/
class MapArea_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->mysql = $this->load->database('mysqli', TRUE);  
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {   
        $rpttime = $this->getRptTime($data['groupid']);
        $sqlblack  = "select Id,Timer,StaMac as mac,Lat as lat,Lon as lng from";
        $sqlblack .= " (select * from stablack_coordinate_info where ApGroupId={$data['groupid']} AND Timer>=(date_sub(now(),interval {$rpttime} second)) order by Timer desc)";
        $sqlblack .= " as t1 group by StaMac;";
        $datalist = $this->mysql->query($sqlblack)->result_array();
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>$datalist
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