<?php
class MapBuilding_Model extends CI_Model {
    protected $mysql;
	public function __construct() {
		parent::__construct();
		$this->load->database();
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
        $arr = array(
            'id' => (int)element('id',$data),
            'lat' => (float)element('lat',$data),
            'lng' => (float)element('lng',$data),
            'address' => element('address',$data),
            'name' => element('name',$data),
            'mapnumber' => (int)element('mapNumber',$data),
            'marktype' => 'building'
        );

        $this->db->replace('map_list', $arr);

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
}