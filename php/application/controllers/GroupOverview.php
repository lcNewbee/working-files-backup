<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class GroupOverview extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->helper('array');
        $this->load->model('group/GroupOverview_Model');
    }
    function fetch(){
        $result = $this->GroupOverview_Model->get_all($_GET);
        return $result;
    }
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        return $result;
    }
    public function index() {
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        } elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo json_encode($result, true);
        }
    }
}
