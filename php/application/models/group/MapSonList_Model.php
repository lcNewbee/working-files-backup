<?php
/**
 * 地图功能 AP 规划图
 * 
*/
class MapSonList_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->database();
        $this->mysql = $this->load->database('mysqli', TRUE);     	
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_list($data) {   
        $buildId = (int)element('buildId',$_GET,0);
        $sondata = $this->db->select('a.id,a.length,a.width,a.mapname as mapName,a.imgpath as backgroundImg,b.lat,b.lng,a.column,a.rows')
                            ->from('map_son_list as a')
                            ->join('map_list as b','a.maplist_id=b.id','left')
                            ->where('maplist_id',$buildId)
                            ->get()->result_array();
        $result = array(
            'state' => array('code' => 2000, 'msg' => 'OK'),
            'data' => array(
                'list' => $sondata
            )
        );
        return $result;
	}      

    //上传
    private function do_upload() {
        $config['upload_path'] = '/var/conf/images'; /* /usr/web/images/mapimg & /var/conf/images */
        $config['allowed_types'] = 'gif|jpg|png';
        $config['overwrite'] = true;
        $config['max_size'] = 0;
        $config['file_name'] = time();

        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('mapImg')) {
            $error = array('error' => $this->upload->display_errors());
            $result = array('state' => array('code' => 4000, 'msg' => $error));
        } else {
            $data = array('upload_data' => $this->upload->data());
            $result = array('state' => array('code' => 2000, 'msg' => 'OK'), 'data' => $data);
        }
        return $result;
    }
    //绑定地图
    private  function add_building_list($data) {        
        $arr['maplist_id'] = element('buildId',$_POST,-1);
        $arr['mapname'] = element('mapName',$_POST,'Name');
        $arr['imgpath'] = str_replace('/var/conf/images','/images/mapimg',element('full_path',$data['upload_data']) );
        $arr['locked'] = 1;
        $arr['length'] = element('length',$_POST,100);
        $arr['width'] = element('width',$_POST,100);
        $arr['column'] = element('column',$_POST,1);
        $arr['rows'] = element('rows',$_POST,1);
        if ( $this->db->insert('map_son_list', $arr)) {            
            $id = $this->db->insert_id();
            //分区
            $this->add_map_area($id, $arr);
            return true;
        }
        return false;
    }
    //地图分区
    private function add_map_area($id, $data){
        //1.得到建筑地图经纬度
        $query = $this->db->query("select lat,lng from map_list where id=".$data['maplist_id']);
        if(count($query->result_array()) > 0){
            $lng = (float)$query->result_array()[0]['lng'];
            $lat = (float)$query->result_array()[0]['lat'];

            $add_lng =  ($data['length'] / $data['column']) / 100000;
	          $add_lat =  ($data['width'] / $data['rows'] ) / 110000;

            //得到经纬度
            $rows_ary = array();

            // 纬度
            array_push($rows_ary,$lat);
            for($i = 0; $i < $data['rows']; $i++){
                $lat = $lat - $add_lat;
                array_push($rows_ary, $lat);
            }

            // 经度
            $column_ary = array();
            array_push($column_ary,$lng);
            for($i = 0; $i < $data['column']; $i++){
                $lng = $lng + $add_lng;
                array_push($column_ary,$lng);
            }

            $area_sum = 0;
            for($x = 0; $x < count($rows_ary) - 1; $x++){
                if($area_sum > 400){
                    //区域最大只能400个
                    break;
                }
                for($y = 0; $y < count($column_ary) - 1; $y++){
                    $insary = array(
                        'map_son_id' => $id,
                        'sta_lat' => (float)$rows_ary[$x],
                        'sta_lng' => (float)$column_ary[$y],
                        'end_lat' => (float)$rows_ary[$x + 1],
                        'end_lng' => (float)$column_ary[$y + 1],
                        'level' => 1,
                        'annotation' => ''
                    );
                    $this->mysql->insert('map_area', $insary);
                    $area_sum++;
                }
            }
        }
    }

    function Add($data){             
        //1. 检查存放地图的文件夹是否存在，否则创建 并且让软连接
        if( !is_dir('/usr/web/images/mapimg') ) {
            //mkdir('/usr/web/images/mapimg',0777,true);
            if( !is_dir('/var/conf/images') ){
                //创建并赋予权限
                 mkdir('/var/conf/images',0777,true);                            
                 exec('ln -s /var/conf/images/ /usr/web/images/mapimg');
            }
            //软连接
            //检测软连接是否已经存在
            if(!exec("ls -l /usr/web/images/mapimg  | awk   '$10==\"->\"{print $11}'") === '/var/conf/images/'){
                //不存在则创建
                exec('ln -s /var/conf/images/ /usr/web/images/mapimg');                
            }            
        }
        //2. 上传
        $result = $this->do_upload();
        if($result['state']['code'] != 2000){
            return json_encode($result);            
        }
        //3. 地图绑定和分区
        if( $this->add_building_list( $result['data']) ){
            return json_encode(json_ok());
        }

        return json_encode(json_no());
    }

    function Delete($data){
        if(count($data['selectedList']) > 0) {
            foreach ($data['selectedList'] as $res) {                
                $querydata = $this->db->query("select id,imgpath from map_son_list where id=".$res);
                $row = $querydata->row();
                if( $this->db->delete('map_son_list',array('id'=>$res)) ) {                    
                    //delete file
                    if( $row->imgpath != "" ) {
                        unlink('/usr/web'.$row->imgpath);
                    }
                    //delete ap_map
                    $this->db->delete('ap_map',array('build_id'=>$row->id));
                    //delete mysql map_area
                    $this->mysql->delete('map_area',array('map_son_id'=>$row->id));                                       
                }
            }
        }
        return json_encode(json_ok());
    }

    function Edit($data){
        //1. 直接上传
        $result = $this->do_upload();
        if($result['state']['code'] != 2000){
            //上传失败 视为没有选择新图片依旧用久的img

            //2.修改 map_son_list
            $upary = array(
                'maplist_id' => element('buildId',$data),
                'mapname' => element('mapName',$data,'Name'),
                'length' => element('length',$data,'Name'),
                'width' => element('width',$data,'Name'),
                'rows' => element('rows',$data,'Name'),
                'column' => element('column',$data,'Name')
            );
            $this->db->where('id',$data['id']);
            if( $this->db->update('map_son_list',$upary) ){
                //3.分区
                //3.1 先删除 分区
                if( $this->mysql->delete('map_area',array('map_son_id'=>$data['id'])) ){
                    //3.2 创建分区
                    $this->add_map_area($data['id'], $upary);
                    return json_encode(json_ok());
                }
            }
            return json_encode(json_no());              
        }
        //上传成功   表示重新选择图片了
        //开始修改 map_son_list
        $upary = array(
            'maplist_id' => element('buildId',$data),
            'mapname' => element('mapName',$data,'Name'),
            'length' => element('length',$data,'Name'),
            'width' => element('width',$data,'Name'),
            'rows' => element('rows',$data,'Name'),
            'column' => element('column',$data,'Name'),
            'imgpath' => str_replace('/var/conf/images','/images/mapimg',element('full_path',$result['data']['upload_data']) )
        );
        $this->db->where('id',$data['id']);
        if( $this->db->update('map_son_list',$upary) ){
            //3.分区
            //3.1 先删除 分区
            if( $this->mysql->delete('map_area',array('map_son_id'=>$data['id'])) ){
                //3.2 创建分区
                $this->add_map_area($data['id'], $upary);
                return json_encode(json_ok());
            }
        }
        return json_encode(json_no());
    }
}