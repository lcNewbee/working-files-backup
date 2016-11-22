<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class WirelessSafe extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
     $retdata = array(
        'groupid'=>(int)element('groupid', $_GET,-1),
        'type'=>(int)element('type', $_GET,0),
      );
      //$result=axc_get_wireless_wips(json_encode($retdata));
			 $queryd = $this->db->select('id,cycles,scantype,apopermode,rpttime,chlnum,enable2g4chl,enable2g4pwr,adjafactor2g4,maxtxpwr')
                            ->from('wrrm_template')
                            /*->where('id', 1)*/
                            ->limit(2,1)
                            ->get()                            
                            ->result_array();
        echo '<pre>';
        print_r($queryd);
        echo '</pre>'; 

				
				$this->db->from('wrrm_template');
				$this->db->where('id', 1);
				echo $this->db->count_all_results(); 
      //return $result;
  }

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'add') {

		}
		elseif($actionType === 'edit') {

		}
    elseif($actionType === 'delete'){

    }
		return $result;
	}

	public function index() {
		$result = null;
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
      echo $result;
		}
		else if($_SERVER['REQUEST_METHOD'] == 'GET') {

			$result = $this->fetch();
      echo $result;
		}
	}
}
