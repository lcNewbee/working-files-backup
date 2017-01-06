<?php
class NetworkInterface extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper('array');
        $this->load->model('network/NetworkInterface_Model');
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

    function fetch() {
        $result = null;
        $result = $this->NetworkInterface_Model->get_interface_list();
        return $result;
    }
    
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        $selectList = element('selectedList', $data);
        switch($actionType) {
            case 'add' : $result = $this->NetworkInterface_Model->add_interface($data);
                break;
            case 'delete' : $result = $this->NetworkInterface_Model->del_interface($selectList);
                break;
            case 'edit' : $result = $this->NetworkInterface_Model->edit_interface($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }
        return $result;
    }   
}

