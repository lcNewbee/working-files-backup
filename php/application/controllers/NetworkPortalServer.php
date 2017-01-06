<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class NetworkPortalServer extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper('array');
        $this->load->model('network/NetworkPortalServer_Model');
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
        return $this->NetworkPortalServer_Model->get_portalsev_list();
    }
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);    
        switch($actionType) {
            case 'add' : $result = $this->NetworkPortalServer_Model->add_portalsev($data);
                break;
            case 'delete' : $result = $this->NetworkPortalServer_Model->del_portalsev($data);
                break;
            case 'edit' : $result = $this->NetworkPortalServer_Model->edit_portalsev($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break; 
        }        
        return $result;
    }
}
