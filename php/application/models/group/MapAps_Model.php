<?php
class MapAps_Model extends CI_Model {
    protected $mysql;
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
		$this->load->library('SqlPage');			
	}
    public function get_aps_list($data) {   
        $result = null;
		$querydata = $this->db->select('*')
								->from('ap_map')
								->where('build_id',1)
								->get()->result_array();    
		
		/*
		$result = array('stare'=>array('code'=>2000))
		*/
		return $result; 
    }  

	public function add_ap_map($data) {
		$result = null;
        $arr = array(
			'id' => null,
            'ap_mac' => element('ap_mac',$data),
            'build_id' => (int)element('build_id',$data),
            'mapname' => element('address',$data),
            'maptype' => element('name',$data),
            'xpos' => (float)element('',$data),
            'ypos' => (float)element('',$data),
			'locked' => (int)element('',$data),
			'coverage' => element('',$data),
        );
        if( $this->db->insert('ap_map', $arr) ) {
            $result = json_ok();
        }
        return json_encode($result);		
	}

	public function del_ap_map($data) {
		//$this->db->delete('map_list', array('id' => $data['id']));
	}
}