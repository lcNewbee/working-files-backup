<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class MapSonList extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->mysql = $this->load->database('mysqli', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function fetch() {
        $buildId = (int)element('buildId',$_GET,0);
        $sondata = $this->db->select('a.id,a.length,a.width,a.mapname as mapName,a.imgpath as backgroundImg,b.lat,b.lng')
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
    public function do_upload() {
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
    public  function add_building_list($data) {
        $result = null;

        $arr['maplist_id'] = element('buildId',$_POST,-1);
        $arr['mapname'] = element('mapName',$_POST,'Name');
        $arr['imgpath'] = str_replace('/var/conf/images','/images/mapimg',element('full_path',$data['upload_data']) );
        $arr['locked'] = 1;
        $arr['length'] = element('length',$_POST,100);
        $arr['width'] = element('width',$_POST,100);
        $arr['column'] = element('column',$_POST,1);
        $arr['rows'] = element('rows',$_POST,1);
        if ( $this->db->insert('map_son_list', $arr)) {
            $result = json_encode(json_ok());
            $id = $this->db->insert_id();
            $this->add_map_area($id, $arr);
        }
        return $result;
    }
    public function del_list($id) {
        $querydata = $this->db->query("select id,imgpath from map_son_list where id=".$id);
        $row = $querydata->row();
        if( $this->db->delete('map_son_list',array('id'=>$id)) ) {
            //delete file
            if( $row->imgpath != "" ) {
                unlink('/usr/web'.$row->imgpath);
            }
            //delete mysql map_area
            $this->mysql->delete('map_area',array('map_son_id'=>$row->id));
            //delete ap_map
            $this->db->delete('ap_map',array('build_id'=>$row->id));
        }
    }
    function onAction($data) {
        if (!$data) {
            $data = $_POST;
        }
        $result = null;
        $actionType = element('action', $data);
        if ($actionType === 'add') {
            if( !is_dir('/usr/web/images/mapimg') ) {
                if( !is_dir('/var/conf/images') ){
                    //创建并赋予权限
                    mkdir('/var/conf/images');
                    chmod('/var/conf/images',0777);
                }
                //软连接
                exec('ln -s /var/conf/images/ /usr/web/images/mapimg');
            }
            $result = $this->do_upload();
            if($result['state']['code'] === 2000){
                $result = $this->add_building_list( $result['data']);
            }else{
                 $result = json_encode($result);
            }
        } elseif ($actionType === 'delete') {
            if(count($data['selectedList']) > 0) {
                foreach ($data['selectedList'] as $v) {
                    $this->del_list($v);
                }
            }
            $result = json_encode(json_ok());
        }
        return $result;
    }
    public function index(){
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        }
        else if($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo json_encode($result);
        }
    }

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
}
