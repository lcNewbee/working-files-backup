
<?php
class NetworkPort extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
    $this->load->helper('array');
	}

  function fetch() {
    $query=$this->db->select('portid,port_name,port_desc,speed,duplex,ip1,mask1,ip2,mask2,ip3,mask3,ip4,mask4,ip5,mask5,adminstate,mgifname')
				    ->from('port_table')
				    ->get()->result_array();
    $state=array(
      'code'=>2000,
      'msg'=>'OK'
    );
    function transformKeys($v) {
      $ret = array();
      $keysMap = array(
        'portid'=>'id',
        'port_name'=>'name',
        'duplex'=>'workModel',
        'port_desc'=>'description',
        'adminstate'=>'status',
        'mgifname'=>'mgifname'
      );
      foreach($v as $key => $value) {
        $realKey = element($key, $keysMap);
        if($realKey) {
          $ret[$realKey] = $value;
        } else {
          $ret[$key] = $value;
        }
      }
      return $ret;
    }

    $list = array_map('transformKeys', $query);
    $result=array(
      'state'=>$state,
      'data'=>array(
        'list'=>$list
      )
    );

    return $result;
  }

  function onAction($data) {
    $state=array(
      'code'=>4000,
      'msg'=>'OK'
    );
    $result = null;
    $actionType = element('action', $data);
    if($actionType === 'edit'){
      $keys=array("portname","speed","duplex","desc","adminstate","mgifname");
			$a1=array_fill_keys($keys,'0');
			$a1['portname']=$data['name'];
			$a1['speed']=$data['workModel'];
			$a1['duplex']=$data['description'];
      $a1['desc']=$data['targetMask'];
      $a1['adminstate']=$data['status'];
      $a1['mgifname']=$data['mgifname'];
      $state=acnetmg_add_port(json_encode($temp_data));
      $result=$state;
    }
    elseif($actionType === 'delete'){
      $keys=array("portname");
			$a1=array_fill_keys($keys,'0');
			$a1['portname']=$data['name'];
      $state=acnetmg_del_port(json_encode($temp_data));
      $result=$state;
    }
    return $result;
  }

	public function index() {
    $result = null;

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      $data = json_decode(file_get_contents("php://input"), true);
      $result = $this->onAction($data);
      echo $result;
    } else if($_SERVER['REQUEST_METHOD'] == 'GET') {
      $result = $this->fetch();
      echo json_encode($result);
    }

	}
}

