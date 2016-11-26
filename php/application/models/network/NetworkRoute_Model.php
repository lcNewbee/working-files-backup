<?php
class NetworkRoute_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	public function get_route_list($retdata) {
		$query=$this->db->select('id,destnet,netmask,gateway')
        ->from('route_table')
        ->get()->result_array();


		$state=array(
      'code'=>2000,
      'msg'=>'OK'
    );
    $newArray=null;
    $keys = array(
      'id'=>'id',
      'destnet'=> 'destnet',
      'netmask'=>'mask',
      'gateway'=>'gateway'
    );

		if ($query !== null) {
      foreach($query as $key=>$val) {
        $newArray[$key] = array();
        foreach($val as $k=>$v) {
          $newArray[$key][$keys[$k]] = $v;
        }
      }
			$result=array(
        'state'=>$state,
        'data'=>array(
          'list'=>$newArray
        )
      );
		} else {
			$result=array(
          'state'=>$state,
          'data'=>array(
            'list'=>'[]'
          )
        );
		}

		return $result;
	}
	public function add_route($data) {
    $arr['destnet'] = element('destnet',$data);
    $arr['gateway'] = element('gateway',$data);
    $arr['mask'] = element('mask',$data);
    $result = acnetmg_add_route(json_encode($arr));

    return $result;
	}
  public function edit_route($data) {
    $result = acnetmg_update_route(json_encode($data));
    return $result;
	}

	public function delete_route($data) {
		$result = null;
    $detary = array();
    foreach( $data['selectedList'] as $ary){
      $result = acnetmg_del_route(json_encode($ary));
    }
		return $result;
	}
}
