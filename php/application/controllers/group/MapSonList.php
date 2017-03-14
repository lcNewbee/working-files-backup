<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class MapSonList extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->database();    
        $this->load->helper(array('array', 'my_customfun_helper'));    
    }
    function fetch() {	
        $buildId = (int)element('buildId',$_GET,0);	
        $sondata = $this->db->select('a.id,a.length,a.width,a.mapname as mapName,a.imgpath as backgroudImg,b.lat,b.lng')
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
        $arr['mapname'] = element('mapImg',$_POST,'Name');
        $arr['imgpath'] = str_replace('/var/conf/images','/images/mapimg',element('full_path',$data['upload_data']) );
        $arr['locked'] = 1;  
        $arr['length'] = element('length',$_POST,100);
        $arr['width'] = element('width',$_POST,100);
        if ( $this->db->insert('map_son_list', $arr)) {
            $result = json_encode(json_ok());
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
}
