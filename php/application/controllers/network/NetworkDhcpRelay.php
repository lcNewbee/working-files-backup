<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class NetworkDhcpRelay extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('network/NetworkDhcpRelay_Model');        
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
    function fetch() {
        return $this->NetworkDhcpRelay_Model->get_dhcp_relay_list();
    }
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        if ($actionType === 'setting') {
            $result = $this->NetworkDhcpRelay_Model->set_dhcp_relay($data);
        } 
        return $result;
    }
    
}
