<?php
date_default_timezone_set("PRC");
defined('BASEPATH') OR exit('No direct script access allowed');
class AccessDefault extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->helper('array');   
        $this->load->library('PHPZip');        
    }
    public function index() {
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        } elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo $result;
        }
    }
    function fetch() {
        //return $this->AccessDefault_Model->get_list($_GET);
    }
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        switch($actionType) {
            case 'setting' : $result = $this->AccessDefault_Model->edit_accesss($data);
                break;
            default : $result = json_encode(array('state' => array('code' => 4000, 'msg' => 'No request action')));
                break;
        }
        return $result;
    }    
    function copy_dir($src, $dst) {
        $dir = opendir($src);
        @mkdir($dst);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    $this->copy_dir($src . '/' . $file, $dst . '/' . $file);
                    continue;
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }  

    public function download() {             
        $copyPath = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/';
        $path = '/var/conf/portal_web_tmp';//需压缩的目录（文件夹）        
        $filename = "/var/conf/portal_web_tmp.zip"; //最终生成的文件名（含路径）
        if(!is_dir($path)){
            mkdir($path,0777,true);            
        }      
        if(!is_dir($path)){
            mkdir($path,0777,true);            
        }        
        copy($copyPath.'auth.jsp',$path.'/auth.jsp');
        copy($copyPath.'ok.jsp',$path.'/ok.jsp');
        copy($copyPath.'out.jsp',$path.'/out.jsp');
        $this->copy_dir($copyPath.'dist',$path.'/dist');//复制文件夹下所有 
        $this->copy_dir($copyPath.'weixin',$path.'/weixin');
        copy($copyPath.'wx.jsp',$path.'/wx.jsp');
        copy($copyPath.'wxpc.jsp',$path.'/wxpc.jsp');
        copy($copyPath.'APIauth.jsp',$path.'/APIauth.jsp');
        copy($copyPath.'APIok.jsp',$path.'/APIok.jsp');
        copy($copyPath.'APIout.jsp',$path.'/APIout.jsp');
        copy($copyPath.'APIwx.jsp',$path.'/APIwx.jsp');
        copy($copyPath.'APIwxpc.jsp',$path.'/APIwxpc.jsp');
        copy($copyPath.'error.html',$path.'/error.html');
        copy($copyPath.'info.jsp',$path.'/info.jsp');
        copy($copyPath.'OL.jsp',$path.'/OL.jsp');
        copy($copyPath.'wifidogAuth.jsp',$path.'/wifidogAuth.jsp');
        copy($copyPath.'wifidogOk.jsp',$path.'/wifidogOk.jsp');
        copy($copyPath.'wifidogOut.jsp',$path.'/wifidogOut.jsp');
        copy($copyPath.'wifidogWx.jsp',$path.'/wifidogWx.jsp'); 
         
        $zip = new PHPZip();
        //压缩并下载 
        $zip->Zip_CompressDownload($path,$filename);
    }    
    public function upload() {
        $result = null;
        $config['upload_path'] = '/var/conf';
        $config['allowed_types'] = 'zip|rar';
        $config['overwrite'] = true;
        $config['max_size'] = 0;
        $config['file_name'] = 'upload_portal_web_tmp.zip';

        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('filename')) {
            $error = array('error' => $this->upload->display_errors());
            $result = array('state' => array('code' => 4000, 'msg' => $error));
        } else {
            //上传成功            
            $data = array('upload_data' => $this->upload->data());
            $result = array('state' => array('code' => 2000, 'msg' => 'OK'), 'data' => $data);
            //解压文件
            $zip = new PHPZip();                
            $path = "/var/conf/upload_portal_web_tmp.zip"; //需解压文件
            $targetpath = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal';//解压地址               
                    	
            if(!$zip->Zip_Decompression($path,$targetpath)){
                $result = array('state' => array('code' => 4000, 'msg' => 'Decompression'), 'data' => $data);
            }            
        }
        echo json_encode($result);
    }           
}
