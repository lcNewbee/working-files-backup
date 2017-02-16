<?php
date_default_timezone_set("PRC");
defined('BASEPATH') OR exit('No direct script access allowed');
class AccessDefault extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper('array');   
        //$this->load->library('PHPZip');        
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
    function list_dir($dir){
        $result = array();
        if (is_dir($dir)){
            $file_dir = scandir($dir);                     
            foreach($file_dir as $file){
                if ($file == '.' || $file == '..'){
                    continue;
                }
                elseif (is_dir($dir.$file)){
                    $res = $this->list_dir($dir.$file.'/');                    
                    $result = array_merge($result, $res);
                }
                else{
                    array_push($result, $dir.$file);
                }
            }
            
        }
        return $result;
    }    
    function addFileToZip($path,$zip){
        $handler = opendir($path); //打开当前文件夹由$path指定。            
        while(($filename=readdir($handler))!==false){            
            if($filename != "." && $filename != ".."){//文件夹文件名字为'.'和‘..’，不要对他们进行操作
                if(is_dir($path."/".$filename)){// 如果读取的某个对象是文件夹，则递归
                    $this->addFileToZip($path."/".$filename, $zip);                    
                }else{ //将文件加入zip对象                    
                    $ss = ltrim($path."/".$filename,"/var/conf/portal_web_tmp/");
                    $zip->addFile($path."/".$filename,$ss);//第二个参数加上路径后就会按路径生成文件夹，注意！
                }
            }
        }
        @closedir($path);        
    } 
    public function download() {             
        $path = '/var/conf/portal_web_tmp';
        $copyPath = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/';
        $filename = "/var/conf/portal_web_tmp.zip"; //最终生成的文件名（含路径）
        if(!is_dir($path)){
            mkdir($path,0777,true);            
        }
        /*
        copy('/usr/web/index.html',$path.'/index.html');
        copy('/usr/web/index.php',$path.'/index.php');
        $this->copy_dir('/usr/web/images',$path.'/images');       
        */        
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
        copy($copyPath.'error.jsp',$path.'/error.jsp');
        copy($copyPath.'info.jsp',$path.'/info.jsp');
        copy($copyPath.'OL.jsp',$path.'/OL.jsp');
        copy($copyPath.'wifidogAuth.jsp',$path.'/wifidogAuth.jsp');
        copy($copyPath.'wifidogOk.jsp',$path.'/wifidogOk.jsp');
        copy($copyPath.'wifidogOut.jsp',$path.'/wifidogOut.jsp');
        copy($copyPath.'wifidogWx.jsp',$path.'/wifidogWx.jsp'); 
        
        //PHP压缩文件夹为zip压缩文件
        //获取列表 
        $datalist = $this->list_dir('/var/conf/portal_web_tmp/');
        $zip = new ZipArchive();
        if($zip->open('/var/conf/portal_web_tmp.zip', ZipArchive::CREATE)=== TRUE){
            $this->addFileToZip('/var/conf/portal_web_tmp', $zip); //调用方法，对要打包的根目录进行操作，并将ZipArchive的对象传递给方法
            $zip->close(); //关闭处理的zip文件
        }           
        header("Cache-Control: public"); 
        header("Content-Description: File Transfer"); 
        header('Content-disposition: attachment; filename='.basename($filename)); //文件名   
        header("Content-Type: application/zip"); //zip格式的   
        header("Content-Transfer-Encoding: binary"); //告诉浏览器，这是二进制文件    
        header('Content-Length: '. filesize($filename)); //告诉浏览器，文件大小   
        @readfile($filename);    
           
    }    
    public function upload() {
        $result = null;
        $config['upload_path'] = '/var/conf/portalserver';
        $config['allowed_types'] = 'zip|rar';
        $config['overwrite'] = true;
        $config['max_size'] = 0;
        $config['file_name'] = 'portal_web_tmp.zip';

        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('filename')) {
            $error = array('error' => $this->upload->display_errors());
            $result = array('state' => array('code' => 4000, 'msg' => $error));
        } else {
            $data = array('upload_data' => $this->upload->data());
            $result = array('state' => array('code' => 2000, 'msg' => 'OK'), 'data' => $data);
        }
        echo json_encode($result);
    }           
}
