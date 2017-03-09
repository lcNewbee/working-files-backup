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
            /*
            if($this->checkTitle($this->upload->data()['full_path']) != 115117){
                //115117 自己测出来的 AC 固件就是这个值，获取后续会变化->再看吧 额！
                $result = array('state' => array('code' => 6300, 'msg' => 'file error'));
                return $result; 
            }
            */
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
            $needle = 'sysupgrade fail';
            if (strpos($msg, $needle)) {
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
    function checkTitle($filename) {
        $file = fopen($filename, "rb");
        $bin = fread($file, 2); //只读2字节
        fclose($file);
        $strInfo = @unpack("c2chars", $bin);
        $typeCode = intval($strInfo['chars1'].$strInfo['chars2']);
        $fileType = '';
        switch ($typeCode)
        {
        case 7790:
        $fileType = 'exe';
        break;
        case 7784:
        $fileType = 'midi';
        break;
        case 8297:
        $fileType = 'rar';
        break;
        case 255216:
        $fileType = 'jpg';
        break;
        case 7173:
        $fileType = 'gif';
        break;
        case 6677:
        $fileType = 'bmp';
        break;
        case 13780:
        $fileType = 'png';
        break;
        default:
        $fileType = $typeCode;
        }
        //Fix
        if ($strInfo['chars1']=='-1' && $strInfo['chars2']=='-40' ) {
            return 'jpg';
        }
        if ($strInfo['chars1']=='-119' && $strInfo['chars2']=='80' ) {
            return 'png';
        }
        return $fileType;
    }
}
