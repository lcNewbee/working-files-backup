<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class WirelessSsid extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){

      $retdata = array(
        'groupid'=>(int)element('groupid', $_GET),
      );
        $result=axc_get_wireless_ssid(json_encode($retdata));
      return $result;
  }

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
    $selectList = element('selectedList', $data);
    function getCgiParam($oriData) {
      $ret = array(
        'groupid'=>(int)element('groupid', $oriData),
        'ssid'=>element('ssid', $oriData),
        'remark'=>element('remark', $oriData),
        'vlanid'=>(int)element('vlanid', $oriData,0),
        'enabled'=>(int)element('enabled', $oriData),
        'maxBssUsers'=>(int)element('maxBssUsers', $oriData),
        'loadBalanceType'=>element('loadBalanceType', $oriData),
        'hiddenSsid'=>(int)element('hiddenSsid', $oriData),
        'storeForwardPattern'=>element('storeForwardPattern', $oriData),
        'upstream'=>(int)element('upstream', $oriData),
        'downstream'=>(int)element('downstream', $oriData),
        'encryption'=>element('encryption', $oriData),
        'password'=>element('password', $oriData ,'')
      );
      return $ret;
    }

		if ($actionType === 'add') {
			$temp_data=getCgiParam($data);
      $result=axc_add_wireless_ssid(json_encode($temp_data));
		}
		elseif($actionType === 'edit') {
    	$temp_data=getCgiParam($data);
      $result=axc_modify_wireless_ssid(json_encode($temp_data));
		}
    elseif($actionType === 'delete'){
     foreach($selectList as $item) {
          $deleteItem = array(
            'groupid'=>element('groupid', $data),
            'ssid'=>element('ssid', $item)
          );
       $state=axc_del_wireless_ssid(json_encode($deleteItem));
     }
       $result=$state;
    }
    elseif($actionType === 'bind'){
			$temp_data=getCgiParam($data);
      $result=axc_bind_wireless_ssid(json_encode($temp_data));
    }
    elseif($actionType === 'unbind'){
			$temp_data=getCgiParam($data);
      $result=axc_unbind_wireless_ssid(json_encode($temp_data));
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
