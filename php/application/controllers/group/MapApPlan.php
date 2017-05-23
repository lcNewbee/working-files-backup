<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class MapApPlan extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->mysql = $this->load->database('mysqli', TRUE);//netmanager
    $this->load->helper(array('array', 'my_customfun_helper'));
	}
	function fetch() {
		$buildId = (int)element('buildId',$_GET,0);
		$retdar = array();
		$jsoncgi = array(
			'groupid'=>(int)element('groupid', $_GET, -1),
			'page'=>(int)element('page', $_GET, 1),
			'size'=>(int)element('size', $_GET, 20),
			'search'=>element('search', $_GET, '')
		);
		$cgidata = axc_get_aps(json_encode($jsoncgi));
		$cgiary = json_decode($cgidata, true);

    if (element('data', $cgiary) && count($cgiary['data']['list']) > 0) {
      foreach( $cgiary['data']['list'] as $row ) {
				$aa = array(
					'map' => array(
						'id' => -100,
						'buildId' => $buildId,
						'imgpath' => '',
						'mapName' => '',
						'mapType' => 'plan',
						'lat' => 25,
						'lng' => 25,
						'locked' => '0',
						'coverage' => 100
					)
				);
				$mapdata = $this->db->select('ap_map.*,map_son_list.id as son_id,map_son_list.imgpath,map_son_list.mapname as son_name')
									->from('ap_map')
									->join('map_son_list','ap_map.build_id=map_son_list.id','left')
									->where('ap_map.ap_mac',$row['mac'])->get()->result_array();
				if(count($mapdata) > 0 ) {
					foreach($mapdata as $res) {
						$aa['map']['id'] = element('son_id',$res,-100);
						$aa['map']['imgpath'] = element('imgpath',$res,'');
						$aa['map']['mapName'] = element('son_name',$res,'ap');
						$aa['map']['mapType'] = element('maptype',$res);
						$aa['map']['lat'] = element('xpos',$res,25);
						$aa['map']['lng'] = element('ypos',$res,25);
						$aa['map']['locked'] = element('locked',$res,1);
						$aa['map']['coverage'] = element('coverage',$res,100);
					}
				}
				foreach($row as $k=>$v) {
					$aa[$k] = $v;
				}
				$retdar[] = $aa;
			}
    }
		$result = array(
			'state' => array('code' => 2000, 'msg' => 'OK'),
			'data' => array(
				'settings'=>array('zoom'=>100),
				'list' => $retdar
			)
		);
		return $result;
	}
	function onAction($data) {
		if (!$data) {
            $data = $_POST;
        }
        $result = null;
        $actionType = element('action', $data);
		if ($actionType === 'add') {
           //
		} elseif ($actionType === 'place') {
			$result = $this->ap_map_bind($data);
		} elseif ($actionType === 'delete') {
            foreach ($data['selectedList'] as $mac) {
                $this->db->delete('ap_map',array('ap_mac'=>$mac));
				$this->up_netmanager_ap($mac,true);
            }
            $result = json_encode(json_ok());
        }
		return $result;
	}
	public function ap_map_bind($data) {
		$result = null;
        $arr = array(
            'ap_mac' => element('mac',$data),
            'build_id' => element('mapId',$data),
			'maptype' => element('mapType',$data['map']),
            'xpos' => element('lat',$data),
			'ypos' => element('lng',$data),
			'locked' => element('locked',$data['map']),
			'coverage' => element('coverage',$data['map'])
        );
		//del
		$this->db->where('ap_mac', $data['mac']);
		$this->db->delete('ap_map');
		//add
        if( $this->db->insert('ap_map', $arr) ) {
            $result = json_ok();
			$this->up_netmanager_ap($data);
        }
        return json_encode($result);
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
	//更新 netmanager 数据库 ap_list表
	private function up_netmanager_ap($data,$type=false){
		$result = 0;
		if($type){
			$arr['Lat'] = null;
			$arr['Lon'] = null;
			$this->mysql->where('ApMac', $data);
			$result = $this->mysql->update('ap_list', $arr);
		}else{
			$arr = array(
				'Lat' => element('lat',$data,0),
				'Lon' => element('lng',$data,0)
			);
			$this->mysql->where('ApMac', element('mac',$data));
			$result = $this->mysql->update('ap_list', $arr);
		}
		return $result;
	}
}
