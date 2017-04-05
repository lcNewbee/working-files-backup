<?php
class MapBuilding_Model extends CI_Model {
    protected $mysql;
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->mysql = $this->load->database('mysqli', TRUE);  
		$this->load->helper(array('array', 'my_customfun_helper'));
		$this->load->library('SqlPage');			
	}
    public function get_building_list($data) {   
        $sqlpage = new SqlPage();        
		$columns = 'id,lat,lng,address,name,mapnumber as mapNumber,marktype';
		$tablenames = 'map_list';
		$pageindex = (int)element('page', $data, 1);
		$pagesize = (int)element('size', $data, 20);		
        $datalist = $sqlpage->sql_data_page($columns,$tablenames,$pageindex,$pagesize);
        $arr['state'] = array('code' => 2000, 'msg' => 'ok');
		$arr['data'] = array("list" => $datalist['data']);
		return json_encode($arr);     
    }
    public function add_building($data) {
        $result = null;
        $arr = array(
            'lat' => (float)element('lat',$data),
            'lng' => (float)element('lng',$data),
            'address' => element('address',$data),
            'name' => element('name',$data),
            'mapnumber' => 1,
            'marktype' => 'building'
        );
        if( $this->db->insert('map_list', $arr) ) {
            $result = json_ok();
        }
        return json_encode($result);
    }
    public function update_building($data) {
        //1.获取原经纬度
        $place = $this->get_original_place($data['id']);
        //2.计算偏移
        $lat_excursion = 0;
        $lng_excursion = 0;
        if($place){
            $lat_excursion = (float)$data['lat'] - $place['lat'];
            $lng_excursion = (float)$data['lng'] - $place['lng'];
        }
        //3.修改整个建筑经纬度
        $arr = array(
            'id' => (int)element('id',$data),
            'lat' => (float)element('lat',$data),
            'lng' => (float)element('lng',$data),
            'address' => element('address',$data),
            'name' => element('name',$data),
            'mapnumber' => (int)element('mapNumber',$data),
            'marktype' => 'building'
        );
        $ret = $this->db->replace('map_list', $arr);
        //4.修改数据库config.db ap_map记录         
        if($ret){
            $this->up_ap_map($data['id'],$lat_excursion,$lng_excursion);
        }

        return json_encode(json_ok());
    } 

    public function delete_building($data) {
        $result = null;
        if( count($data['selectedList']) > 0 ) {
            foreach( $data['selectedList'] as $res ) {
                $queryason = $this->db->query('select id,imgpath from map_son_list where maplist_id='.$res);                
                if( $this->db->delete('map_list', array('id' => $res)) ){
                    //del map_son_list
                    foreach ($queryason->result_array() as $row) {
                        $this->del_son_list($row['id']);
                    }
                }

            }
            $result = json_ok();
        }
        return json_encode($result);
    }     
    //delete map_son_list
    public function del_son_list($id) {     
        $querydata = $this->db->query("select id,imgpath from map_son_list where id=".$id);
		$row = $querydata->row();
		if( $this->db->delete('map_son_list',array('id'=>$id)) ) {
			//delete file						
			if( $row->imgpath != "" ) {
				unlink('/usr/web'.$row->imgpath);				
			}
			//delete ap_map
			$this->db->delete('ap_map',array('build_id'=>$row->id));
		}	
    }
    //获取原经纬度
    private function get_original_place($id){
        $query = $this->db->query('select lat,lng from map_list where id='.$id);
        if(count($query->result_array()) > 0){
            $arr = array(
                'lat' => $query->result_array()[0]['lat'],
                'lng' => $query->result_array()[0]['lng']
            );
            return $arr;
        }
        return 0;
    }
    private function up_ap_map($id,$lat,$lng){
        //update ap_map set xpos=xpos+22.12,ypos=ypos+113.10 where build_id=(select id from map_son_list where maplist_id=1);
        //1.修改config.db
        $this->db->query("update ap_map set xpos=xpos+{$lat},ypos=ypos+{$lng} where build_id=(select id from map_son_list where maplist_id={$id})");        
        //修改mysql netmanager 
        $query = $this->db->query("select ap_mac from ap_map where build_id=(select id from map_son_list where maplist_id={$id})");
        foreach($query->result_array() as $row){
            $this->mysql->query("update ap_list set Lat=Lat+{$lat},Lon=Lon+{$lng} where ApMac='{$row['ap_mac']}'");
        }

    }
}