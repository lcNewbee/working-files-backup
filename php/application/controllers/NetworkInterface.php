<?php
class NetworkInterface extends CI_Controller {
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
    $interfaces = array();

    foreach($query as $index=>$value) {
      for ($x=1; $x<=5; $x++) {
        $ip = element('ip'.$x, $value);
        $mask = element('mask'.$x, $value);

        if($ip !== '0.0.0.0' && $mask !== '0.0.0.0') {
          $interfaces[$index] = array(
            'portid'=>element('portid', $value),
            'name'=>element('port_name', $value),
            'ip'=>$ip,
            'mask'=>$mask
          );
        }
      }
    }
    $result=array(
      'state'=>$state,
      'data'=>array(
        'list'=>$interfaces
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
