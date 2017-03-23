<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class WirelessAcl extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper('array');
        $this->load->model('group/WirelessAcl_Model');
    }
    function fetch() {
        $retdata = array(
            'groupid' => (int)element('groupid', $_GET, -1),
            'filterGroupid' => (int)element('filterGroupid', $_GET, -1),
            'acltype' => element('aclType', $_GET, 'black'),
            'page' => (int)element('page', $_GET, 1),
            'size' => (int)element('size', $_GET, 20),
            'search' => element('search', $_GET, 20)
        );
        return $this->WirelessAcl_Model->get_acl_list($retdata);
    }
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        if ($actionType === 'add') {
            return $this->WirelessAcl_Model->add_acl($data);
        } elseif ($actionType === 'edit') {
            //$result=axc_set_wireless_acl(json_encode($data));			
        } elseif ($actionType === 'delete') {
            return $this->WirelessAcl_Model->delete_acl($data);
        } elseif ($actionType === 'setting') {
            return $this->WirelessAcl_Model->other_config($data);
        } elseif ($actionType === 'copy') {
            return $this->WirelessAcl_Model->copy_config($data);
        }
        return $result;
    }
    public function index() {
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo $result;
        }
    }
}
