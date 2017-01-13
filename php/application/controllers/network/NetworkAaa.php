<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class NetworkAaa extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper('array');
        $this->load->model('network/NetworkAaa_Model');
    }
    public function index() {
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo json_encode($result);
        }
    }
    function fetch(){
        return $this->NetworkAaa_Model->get_aaa_list();
    }
    
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        switch($actionType) {
            case 'add' : $result = $this->NetworkAaa_Model->add_aaa_template($data);
                break;
            case 'delete' : $result = $this->NetworkAaa_Model->del_aaa_template($data);
                break;
            case 'edit' : $result = $this->NetworkAaa_Model->edit_aaa_template($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }
        return $result;
    }
}
