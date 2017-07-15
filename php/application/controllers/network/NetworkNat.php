<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class NetworkNat extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->helper('array');
        $this->load->model('network/NetworkNat_Model');
    }
    public function index() {
       $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        } else if($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo json_encode($result);
        }
    }
    function fetch(){        
        return 	$this->NetworkNat_Model->get_list();
    }
  
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        $selectList = element('selectedList', $data);
        switch($actionType) {
            case 'add' : $result = $this->NetworkNat_Model->add($data);
                break;
            case 'delete' : $result = $this->NetworkNat_Model->delete($selectList);
                break;
            case 'edit' : $result = $this->NetworkNat_Model->edit($data);
                break;
            case 'setting' : $result = $this->NetworkNat_Model->setting($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }        
        return 	$result;
    }
}
