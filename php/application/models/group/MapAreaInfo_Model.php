<?php
/**
 * 地图区域信息
*/
class MapAreaInfo_Model extends CI_Model {
	public function __construct() {
		parent::__construct();	
        $this->load->database();	
        $this->mysql = $this->load->database('mysqli', TRUE);  
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {       
        $datalist = $this->mysql->select('id,sta_lat,sta_lng,end_lat,end_lng,level,annotation as describe')
                            ->from('map_area')
                            ->where('map_son_id',$data['curMapId'])
                            ->order_by('id','ASC')
                            ->get()->result_array();
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>$datalist
            )   
        );        
        return json_encode($arr);
	}  
    function Edit_All($data) {
        $result = null;
        $selectList = element('list', $data);
        foreach ($selectList as $row) {
            $upary = array(                  
                'level' => $row['level'],
                'annotation' => $row['describe']
            );
            $this->mysql->where('id',$row['id']);
            $this->mysql->update('map_area',$upary);
        }
        return json_encode(json_ok());
    }    
}