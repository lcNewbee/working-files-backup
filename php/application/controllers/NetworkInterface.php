<?php
class NetworkPort extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
    $this->load->helper('array');
	}

	public function index() {
		$query=$this->db->select('portid,port_name,speed,duplex,ip1,mask1,ip2,mask2,ip3,mask3,ip4,mask4,ip5,mask5,desc,adminstate,mgifname')
				    ->from('port_table')
				    ->get()->result_array();
    $state=array(
      'code'=>2000,
      'msg'=>'OK'
    );

    function myfunction($v) {
      $ret = array();
      $keysMap = array(
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

		echo json_encode($result);
	}
}
?>
