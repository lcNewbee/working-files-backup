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
        $rpttime = 0;//扫描周期
        // select * from report_table where InParameter like '{"groupid":3,%';
        $sql = "select * from report_table where InParameter like '{\"groupid\":".$data['groupid']."%'";
        $query = $this->mysql->query($sql);        
        if(isset($query->result_array()[0]['InParameter'])){
            $objdata = json_decode($query->result_array()[0]['InParameter']);
            $rpttime = $objdata->rpttime;
        }

        $sqlblack = "select Id,Timer,StaMac as mac,Lat as lat,Lon as lng from stablack_coordinate_info where ApGroupId={$data['groupid']} and Timer >= (select date_add((select MAX(Timer) from stablack_coordinate_info), interval -{$rpttime} second)) and Timer <= (select MAX(Timer) from stablack_coordinate_info)";
        $datalist = $this->mysql->query($sqlblack)->result_array();
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>$datalist
            )   
        );        
        return json_encode($arr);
	}     
}