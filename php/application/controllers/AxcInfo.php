<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class AxcInfo extends CI_Controller {
	public function __construct() {
		parent::__construct();	
        $this->sqlite_license = $this->load->database('sqlite_license', TRUE);
		$this->load->helper('array');
	}
	public function index() {
		$result = array(
            'state' => array(
                'code' => 2000, 
                'msg' => 'ok'
            ), 
            'data' => array(
                'version' => '1.0.1', 
                'hardware' => '1.0'
            )
        );
        $result['data'] = $this->get_ac_info();
		echo json_encode($result);
	}

    function get_ac_info(){
        $arr = array(
            'version' => $this->get_ac_version(),
            'title' =>  'Axilspot',
            'companyname' =>  'axilspot',
            'email' =>  'support@lenovonet.com'
        );        
        $data = $this->sqlite_license->select('ac_base_conf.companyname, verder_list.title,verder_list.email')
                                    ->from('ac_base_conf')
                                    ->join('verder_list', 'ac_base_conf.vender_id = verder_list.vender_id', 'left')
                                    ->get()
                                    ->result_array();
        if(count($data) > 0) {
            $arr['title'] = $data[0]['title'];
            $arr['companyname'] = $data[0]['companyname'];
            $arr['email'] = $data[0]['email'];
        }
        return $arr;
    }   

    function get_ac_version() {
        /*
        $version = file_get_contents('/etc/version');
        $version = str_replace('AXC1000_V1_TEST_','',$version);              
        $arr['version'] = str_replace("\n",'',$version); 
        */
        $ret = '';

        $name = file_get_contents('/etc/acname');
        $version = file_get_contents('/etc/version');
        $ret = $name . ' ' .$version;

        $ret = str_replace("\n", '' , $ret);
        return $ret;
    }
}
