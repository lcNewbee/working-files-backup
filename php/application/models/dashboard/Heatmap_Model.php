<?php
class Heatmap_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->load->helper(array('array', 'db_operation'));    
        $this->mysql = $this->load->database('mysqli', TRUE);  
    }
    function get_list($data) {   
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'mapInfo' => $this->getMapInfo(),
                'list' => $this->getHeatInfo()
            )
        );
        return json_encode($arr);
    }

    private function getMapInfo(){
        $arr = array(
            'id' => '1',
            'mapName' => 'Floor One',
            'width' => '22',
            'length' => '22',
            'backgroundImg' =>'images/map_bg.jpg',
            'lat' => '39.913235',
            'lng' => '116.463524',
            'column' =>'10',
            'rows' => '10'
        );
        $sql = "select a.*,b.lat,b.lng from map_son_list a left join map_list b on a.maplist_id=b.id";
        $query = $this->db->query($sql)->result_array();
        if(count($query) > 0){
            $arr = array(
                'id' => '' . $query[0]['id'],
                'mapName' => '' . $query[0]['mapname'],
                'width' => '' . $query[0]['width'],
                'length' => '' . $query[0]['length'],
                'backgroundImg' => '' . $query[0]['imgpath'],
                'lat' => '' . $query[0]['lat'],
                'lng' => '' . $query[0]['lng'],
                'column' => '' . $query[0]['column'],
                'rows' => '' . $query[0]['rows']
            );
        }
        return $arr;
    }

    private function getHeatInfo(){
        $arr = array();
        /*
        $queryd = $this->mysql->query("call flow_chart_php (".$groupid.",'".$strtime."','".$endtime."')");
        foreach($queryd->result_array() as $row){
            $cry['lat'] = (float)$row['Lat'];
            $cry['lng'] = (float)$row['Lon'];
            $cry['value'] = (int)$row['StaNum'];
            $arr[] = $cry;
        }
        */        
        $arr = $this->suijidian();
        return $arr;
    }
    private function suijidian(){        
        $arr = array();
        $data = array(
            array('sta_lat'=>9826,'sta_lng'=>5832,'end_lat'=>9735,'end_lng'=>5932),           
            array('sta_lat'=>9826,'sta_lng'=>5932,'end_lat'=>9735,'end_lng'=>6032),           
            array('sta_lat'=>9826,'sta_lng'=>6032,'end_lat'=>9735,'end_lng'=>6132),           
            array('sta_lat'=>9826,'sta_lng'=>6132,'end_lat'=>9735,'end_lng'=>6232),           
            array('sta_lat'=>9826,'sta_lng'=>6232,'end_lat'=>9735,'end_lng'=>6332),           
            array('sta_lat'=>9826,'sta_lng'=>6332,'end_lat'=>9735,'end_lng'=>6432),           
            array('sta_lat'=>9826,'sta_lng'=>6432,'end_lat'=>9735,'end_lng'=>6532),           
            array('sta_lat'=>9826,'sta_lng'=>6532,'end_lat'=>9735,'end_lng'=>6632),           
            array('sta_lat'=>9826,'sta_lng'=>6632,'end_lat'=>9735,'end_lng'=>6732),           
            array('sta_lat'=>9826,'sta_lng'=>6732,'end_lat'=>9735,'end_lng'=>6832),           
            array('sta_lat'=>9735,'sta_lng'=>5832,'end_lat'=>9644,'end_lng'=>5932),           
            array('sta_lat'=>9735,'sta_lng'=>5932,'end_lat'=>9644,'end_lng'=>6032),           
            array('sta_lat'=>9735,'sta_lng'=>6032,'end_lat'=>9644,'end_lng'=>6132),           
            array('sta_lat'=>9735,'sta_lng'=>6132,'end_lat'=>9644,'end_lng'=>6232),           
            array('sta_lat'=>9735,'sta_lng'=>6232,'end_lat'=>9644,'end_lng'=>6332),           
            array('sta_lat'=>9735,'sta_lng'=>6332,'end_lat'=>9644,'end_lng'=>6432),           
            array('sta_lat'=>9735,'sta_lng'=>6432,'end_lat'=>9644,'end_lng'=>6532),           
            array('sta_lat'=>9735,'sta_lng'=>6532,'end_lat'=>9644,'end_lng'=>6632),           
            array('sta_lat'=>9735,'sta_lng'=>6632,'end_lat'=>9644,'end_lng'=>6732),           
            array('sta_lat'=>9735,'sta_lng'=>6732,'end_lat'=>9644,'end_lng'=>6832),           
            array('sta_lat'=>9644,'sta_lng'=>5832,'end_lat'=>9553,'end_lng'=>5932),           
            array('sta_lat'=>9644,'sta_lng'=>5932,'end_lat'=>9553,'end_lng'=>6032),           
            array('sta_lat'=>9644,'sta_lng'=>6032,'end_lat'=>9553,'end_lng'=>6132),           
            array('sta_lat'=>9644,'sta_lng'=>6132,'end_lat'=>9553,'end_lng'=>6232),           
            array('sta_lat'=>9644,'sta_lng'=>6232,'end_lat'=>9553,'end_lng'=>6332),           
            array('sta_lat'=>9644,'sta_lng'=>6332,'end_lat'=>9553,'end_lng'=>6432),           
            array('sta_lat'=>9644,'sta_lng'=>6432,'end_lat'=>9553,'end_lng'=>6532),           
            array('sta_lat'=>9644,'sta_lng'=>6532,'end_lat'=>9553,'end_lng'=>6632),           
            array('sta_lat'=>9644,'sta_lng'=>6632,'end_lat'=>9553,'end_lng'=>6732),           
            array('sta_lat'=>9644,'sta_lng'=>6732,'end_lat'=>9553,'end_lng'=>6832),           
            array('sta_lat'=>9553,'sta_lng'=>5832,'end_lat'=>9462,'end_lng'=>5932),           
            array('sta_lat'=>9553,'sta_lng'=>5932,'end_lat'=>9462,'end_lng'=>6032),           
            array('sta_lat'=>9553,'sta_lng'=>6032,'end_lat'=>9462,'end_lng'=>6132),           
            array('sta_lat'=>9553,'sta_lng'=>6132,'end_lat'=>9462,'end_lng'=>6232),           
            array('sta_lat'=>9553,'sta_lng'=>6232,'end_lat'=>9462,'end_lng'=>6332),           
            array('sta_lat'=>9553,'sta_lng'=>6332,'end_lat'=>9462,'end_lng'=>6432),           
            array('sta_lat'=>9553,'sta_lng'=>6432,'end_lat'=>9462,'end_lng'=>6532),           
            array('sta_lat'=>9553,'sta_lng'=>6532,'end_lat'=>9462,'end_lng'=>6632),           
            array('sta_lat'=>9553,'sta_lng'=>6632,'end_lat'=>9462,'end_lng'=>6732),           
            array('sta_lat'=>9553,'sta_lng'=>6732,'end_lat'=>9462,'end_lng'=>6832),           
            array('sta_lat'=>9462,'sta_lng'=>5832,'end_lat'=>9371,'end_lng'=>5932),           
            array('sta_lat'=>9462,'sta_lng'=>5932,'end_lat'=>9371,'end_lng'=>6032),           
            array('sta_lat'=>9462,'sta_lng'=>6032,'end_lat'=>9371,'end_lng'=>6132),           
            array('sta_lat'=>9462,'sta_lng'=>6132,'end_lat'=>9371,'end_lng'=>6232),           
            array('sta_lat'=>9462,'sta_lng'=>6232,'end_lat'=>9371,'end_lng'=>6332),           
            array('sta_lat'=>9462,'sta_lng'=>6332,'end_lat'=>9371,'end_lng'=>6432),           
            array('sta_lat'=>9462,'sta_lng'=>6432,'end_lat'=>9371,'end_lng'=>6532),           
            array('sta_lat'=>9462,'sta_lng'=>6532,'end_lat'=>9371,'end_lng'=>6632),           
            array('sta_lat'=>9462,'sta_lng'=>6632,'end_lat'=>9371,'end_lng'=>6732),           
            array('sta_lat'=>9462,'sta_lng'=>6732,'end_lat'=>9371,'end_lng'=>6832),           
            array('sta_lat'=>9371,'sta_lng'=>5832,'end_lat'=>9281,'end_lng'=>5932),           
            array('sta_lat'=>9371,'sta_lng'=>5932,'end_lat'=>9281,'end_lng'=>6032),           
            array('sta_lat'=>9371,'sta_lng'=>6032,'end_lat'=>9281,'end_lng'=>6132),           
            array('sta_lat'=>9371,'sta_lng'=>6132,'end_lat'=>9281,'end_lng'=>6232),           
            array('sta_lat'=>9371,'sta_lng'=>6232,'end_lat'=>9281,'end_lng'=>6332),           
            array('sta_lat'=>9371,'sta_lng'=>6332,'end_lat'=>9281,'end_lng'=>6432),           
            array('sta_lat'=>9371,'sta_lng'=>6432,'end_lat'=>9281,'end_lng'=>6532),           
            array('sta_lat'=>9371,'sta_lng'=>6532,'end_lat'=>9281,'end_lng'=>6632),           
            array('sta_lat'=>9371,'sta_lng'=>6632,'end_lat'=>9281,'end_lng'=>6732),           
            array('sta_lat'=>9371,'sta_lng'=>6732,'end_lat'=>9281,'end_lng'=>6832),           
            array('sta_lat'=>9281,'sta_lng'=>5832,'end_lat'=>9190,'end_lng'=>5932),           
            array('sta_lat'=>9281,'sta_lng'=>5932,'end_lat'=>9190,'end_lng'=>6032),           
            array('sta_lat'=>9281,'sta_lng'=>6032,'end_lat'=>9190,'end_lng'=>6132),           
            array('sta_lat'=>9281,'sta_lng'=>6132,'end_lat'=>9190,'end_lng'=>6232),           
            array('sta_lat'=>9281,'sta_lng'=>6232,'end_lat'=>9190,'end_lng'=>6332),           
            array('sta_lat'=>9281,'sta_lng'=>6332,'end_lat'=>9190,'end_lng'=>6432),           
            array('sta_lat'=>9281,'sta_lng'=>6432,'end_lat'=>9190,'end_lng'=>6532),           
            array('sta_lat'=>9281,'sta_lng'=>6532,'end_lat'=>9190,'end_lng'=>6632),           
            array('sta_lat'=>9281,'sta_lng'=>6632,'end_lat'=>9190,'end_lng'=>6732),           
            array('sta_lat'=>9281,'sta_lng'=>6732,'end_lat'=>9190,'end_lng'=>6832),           
            array('sta_lat'=>9190,'sta_lng'=>5832,'end_lat'=>9099,'end_lng'=>5932),           
            array('sta_lat'=>9190,'sta_lng'=>5932,'end_lat'=>9099,'end_lng'=>6032),           
            array('sta_lat'=>9190,'sta_lng'=>6032,'end_lat'=>9099,'end_lng'=>6132),           
            array('sta_lat'=>9190,'sta_lng'=>6132,'end_lat'=>9099,'end_lng'=>6232),           
            array('sta_lat'=>9190,'sta_lng'=>6232,'end_lat'=>9099,'end_lng'=>6332),           
            array('sta_lat'=>9190,'sta_lng'=>6332,'end_lat'=>9099,'end_lng'=>6432),           
            array('sta_lat'=>9190,'sta_lng'=>6432,'end_lat'=>9099,'end_lng'=>6532),           
            array('sta_lat'=>9190,'sta_lng'=>6532,'end_lat'=>9099,'end_lng'=>6632),           
            array('sta_lat'=>9190,'sta_lng'=>6632,'end_lat'=>9099,'end_lng'=>6732),           
            array('sta_lat'=>9190,'sta_lng'=>6732,'end_lat'=>9099,'end_lng'=>6832),           
            array('sta_lat'=>9099,'sta_lng'=>5832,'end_lat'=>9008,'end_lng'=>5932),           
            array('sta_lat'=>9099,'sta_lng'=>5932,'end_lat'=>9008,'end_lng'=>6032),           
            array('sta_lat'=>9099,'sta_lng'=>6032,'end_lat'=>9008,'end_lng'=>6132),           
            array('sta_lat'=>9099,'sta_lng'=>6132,'end_lat'=>9008,'end_lng'=>6232),           
            array('sta_lat'=>9099,'sta_lng'=>6232,'end_lat'=>9008,'end_lng'=>6332),           
            array('sta_lat'=>9099,'sta_lng'=>6332,'end_lat'=>9008,'end_lng'=>6432),           
            array('sta_lat'=>9099,'sta_lng'=>6432,'end_lat'=>9008,'end_lng'=>6532),           
            array('sta_lat'=>9099,'sta_lng'=>6532,'end_lat'=>9008,'end_lng'=>6632),           
            array('sta_lat'=>9099,'sta_lng'=>6632,'end_lat'=>9008,'end_lng'=>6732),           
            array('sta_lat'=>9099,'sta_lng'=>6732,'end_lat'=>9008,'end_lng'=>6832),           
            array('sta_lat'=>9008,'sta_lng'=>5832,'end_lat'=>8917,'end_lng'=>5932),           
            array('sta_lat'=>9008,'sta_lng'=>5932,'end_lat'=>8917,'end_lng'=>6032),           
            array('sta_lat'=>9008,'sta_lng'=>6032,'end_lat'=>8917,'end_lng'=>6132),           
            array('sta_lat'=>9008,'sta_lng'=>6132,'end_lat'=>8917,'end_lng'=>6232),           
            array('sta_lat'=>9008,'sta_lng'=>6232,'end_lat'=>8917,'end_lng'=>6332),           
            array('sta_lat'=>9008,'sta_lng'=>6332,'end_lat'=>8917,'end_lng'=>6432),           
            array('sta_lat'=>9008,'sta_lng'=>6432,'end_lat'=>8917,'end_lng'=>6532),           
            array('sta_lat'=>9008,'sta_lng'=>6532,'end_lat'=>8917,'end_lng'=>6632),           
            array('sta_lat'=>9008,'sta_lng'=>6632,'end_lat'=>8917,'end_lng'=>6732),           
            array('sta_lat'=>9008,'sta_lng'=>6732,'end_lat'=>8917,'end_lng'=>6832)
        );
        $lat = 22.559826;
        $lng = 113.955832;
        $x = [0,1,2,3,4,5,6,7,8,9];
        $y = [0,1,2,3,4,5,6,7,8,9];
        foreach($x as $i){
            $lat_str = ($lat * 1000000) - ($i * 10000);  
            foreach($y as $j){
                $lng_str = ($lng * 1000000) + ($j * 10000);
                $index = rand(0,5);
                while($index > 0){
                    $cry['lat'] = rand($lat_str,($lat_str - 10000)) / 1000000;
                    $cry['lng'] = rand($lng_str,($lng_str + 10000)) / 1000000;
                    $cry['value'] = rand(2,20);
                    $arr[] = $cry;
                    $index--;
                }
            }   
        }       
        /*
        for($i = 0; $i < 10; $i++ ){
            $lat_str = ($lat * 1000000) - ($i * 10000);            
            for($j = 0; $j < 10; $j++ ){
                $lng_str = ($lng * 1000000) + ($j * 10000);
                $index = rand(0,10);
                while($index > 0){
                    $cry['lat'] = rand($lat_str,($lat_str - 10000)) / 1000000;//$lat - ($i * 0.011);
                    $cry['lng'] = rand($lng_str,($lng_str + 10000)) / 1000000;;//$lng + ($j * 0.01);
                    $cry['value'] = 1;
                    $arr[] = $cry;
                    $index--;
                }
            }            
        }
        */
        /*
        $cry['lat']  = rand(22559826,22549826) / 1000000;//22.549826;
        $cry['lng'] = rand(113955832,113965832) / 1000000;//113.965832;
        $cry['value'] = 1;
        $arr[] = $cry;
        */
        return $arr;
    }
}