<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class WirelessSmart extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
    	$query=$this->db->select('pool_id,pool_name,attr_name,attr_value')
              ->from('pool_params')
              ->join('pool_attr','pool_attr.id=pool_params.attr_id')
              ->join('pool_list','pool_list.id=pool_params.pool_id')
              ->get()->result_array();
		  $state=array(
				      'code'=>2000,
				      'msg'=>'OK'
				    );

		  $keyname=array(
				      "domain"=>"domain",
				      "ipaddr"=>"startIp",
				      "netmask"=>"mask",
				      "route"=>"gateway",
				      "dns1"=>"mainDns",
				      "dns2"=>"secondDns",
				      "lease"=>"releaseTime",
				      "opt43"=>"opt43",
				      "opt60"=>"opt60",
				      "vlan"=>"vlan"
				    );

     $retdata = array(
        'groupid'=>(int)element('groupid', $_GET),
      );
      $result=axc_get_wireless_smart(json_encode($retdata));
      return $result;
  }

	function onAction($data) {
		$result = null;
    $retdata=array(
      'groupid'=>(int)element('groupid', $data),
      '5gFrist'=>(int)element('5gFrist', $data),
      '11nFrist'=>(int)element('11nFrist', $data),
      'autoChannel'=>(int)element('autoChannel', $data),
      'channel'=>(int)element('channel', $data),
      'country'=>element('country', $data),
      'terminalRelease'=>(int)element('terminalRelease', $data),
      'terminalReleaseVal'=>(int)element('terminalReleaseVal', $data),
      'wirelessPower'=>element('wirelessPower', $data),
    );
    $result=axc_set_wireless_smart(json_encode($retdata));
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
