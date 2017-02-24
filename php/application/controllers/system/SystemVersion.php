<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemVersion extends CI_Controller {
    public $acVersion = '';
    public $acVersionUses = '0';
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper('array');
    }
    function onUpgradeAc() {
        $config['upload_path'] = '/etc/Ac_ver/';
        $config['overwrite'] = true;
        $config['max_size'] = 0;
        $config['allowed_types'] = '*';
        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('versionFile')) {
            $error = array('error' => $this->upload->display_errors());
            $result = array(
                'state' => array(
                    'code' => 4000,
                    'msg' => $error
                )
            );
        } else {
            $data = array('upload_data' => $this->upload->data());
            //$this->acVersion = $data['name'];
            $result = array('state' => array('code' => 2000, 'msg' => $data));
        }
        return $result;
    }
    public function index() {
        $result = null;
        echo $result;
    }
    public function upload() {
        $result = array(
            'state' => array(
                'code' => 2000,
                'msg' => 'Need Post'
            )
        );
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $result = $this->onUpgradeAc();
        }
        echo json_encode($result);
    }
    public function upgrade() {
        $result = array(
            'state' => array(
                'code' => 2000,
                'msg' => 'Need Post'
            )
        );
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $filename = element('filename', $data, '');
            $msg = 'ok';
            $result['state']['msg'] = $msg;
            $msg = shell_exec('sysupgrade -f /etc/Ac_ver/' . $filename);
            $needle = 'sysupgrade success';
            if (strpos($msg, $needle) === FALSE) {
                $result['state']['code'] = 6300;
                $result['state']['msg'] = 'Firmware error upgrade failed';
            }
            echo json_encode($result);
        }
    }
    public function backup() {
        $result = array(
            'state' => array(
                'code' => 2000,
                'msg' => 'Need Post'
            )
        );
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $msg = shell_exec('');
        }
        $result['state']['msg'] = $msg;
        echo json_encode($result);
    }
}
