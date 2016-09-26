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

    function myfunction($v) {
      $ret = array();
      $keysMap = array(
        'portid'=>'id',
        'port_name'=>'name',
        'duplex'=>'workModel',
        'port_desc'=>'description',
        'adminstate'=>'status'
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

    $list = array_map('myfunction', $query);
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

    if ($actionType === 'delete') {
      $result=array(
        'state'=>$state,
        'data'=>element('action', $data, '')
      );
    } else {
      $result=array(
        'state'=>$state,
        'data'=>element('action', $data, '')
      );
    }

    return $result;
  }

	public function index() {
    $result = null;

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      $data = json_decode(file_get_contents("php://input"), true);
      $result = $this->onAction($data);
    } else if($_SERVER['REQUEST_METHOD'] == 'GET') {
      $result = $this->fetch();
    }

		echo json_encode($result);
	}
}
?>
