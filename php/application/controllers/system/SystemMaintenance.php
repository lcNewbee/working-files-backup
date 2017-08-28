<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemMaintenance extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->database();
        $this->load->helper('file');
        $this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PHPZip');
    }
    function fetch() {
        $retdata = array(
            'page' => element('page',$_GET,1),
            'size' => element('size',$_GET,20)
        );
        $querydata = $this->db->query('select discover as discoverycnt,countrycode,echo as echotime,acstatistime as statistime,autoap from capwap');
        $arr = array(
            'state' => array('code'=>2000,'msg'=>'ok'),
            'data' => array(
                'settings'=>$querydata->row_array(),
                'info'=>array(
                    'configUpdateAt'=>filectime('/var/conf/config.db')
                )
            )
        );
        return json_encode($arr);
    }
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        if ($actionType === 'setting') {
            $cgiary = array(
                'discoverycnt' => (int)element('discoverycnt',$data,5),
                'echotime' => (int)element('echotime',$data,10),
                'statistime' => (int)element('statistime',$data,120),
                'autoap' => (int)element('autoap',$data,1),
                'countrycode' => element('countrycode',$data),
            );
            $result = axc_set_capwap_param(json_encode($cgiary));
            //log
            $cgiObj = json_decode($result);
            if(is_object($cgiObj) && $cgiObj->state->code === 2000) {
                $logary = array(
                    'type'=>'Setting',
                    'operator'=>element('username',$_SESSION,''),
                    'operationCommand'=>"Setting capwap",
                    'operationResult'=>'ok',
                    'description'=>json_encode($cgiary)
                );
                Log_Record($this->db,$logary);
            }
        }
        return $result;
    }
    public function index() {
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo $result;
        }
    }
    //备份配置（提供下载）
    public function backup() {
        $logary = array(
            'type'=>'Backup',
            'operator'=>element('username',$_SESSION,''),
            'operationCommand'=>"Backup AC config",
            'operationResult'=>'ok',
            'description'=>""
        );
        Log_Record($this->db,$logary);		
        //系统备份
        //copy('/var/run/config.db','/var/conf/config.db');
        // exec('cp /var/run/config.db /var/conf/config.db');
		//1.检测images文件夹，和config 文件夹没有则创建
		if(!is_dir('/var/conf/images')){
			mkdir('/var/conf/images', 0777, true);
		}
		if(!is_dir('/var/conf/config')){
            mkdir('/var/conf/config', 0777, true);
            mkdir('/var/conf/config/ap_version', 0777, true);
        }        
		//2.将需要备份的文件放到config 文件夹中
		//检测是有备份文件，否则再次备份一次
		if(!is_file('/var/conf/config.db')){
			exec('cp /var/run/config.db /var/conf/config.db');
        }
        if(!is_file('/var/conf/openportalserver_bak.sql')){
			exec('mysqldump openportalserver>/var/conf/openportalserver_bak.sql');
        }
        if(!is_dir('/var/conf/ap_version')){
            mkdir('/var/conf/ap_version', 0777, true);
            system('cp -r /etc/Ap_ver/* /var/conf/ap_version');
        }       
        //拷贝数据库文件到/var/conf/config/中
        copy('/var/conf/config.db', '/var/conf/config/config.db');
        //拷贝openportal备份文件到/var/conf/config/中
        copy('/var/conf/openportalserver_bak.sql', '/var/conf/config/openportalserver_bak.sql');
        //拷贝AP版本文件到/var/conf/config 中        
        system('cp -r /var/conf/ap_version/* /var/conf/config/ap_version');
        //拷贝页面图片文件到/var/conf/config/中
		system('cp -r /var/conf/images/* /var/conf/config');
		//3.打包
		$path = '/var/conf/config';//需压缩的目录（文件夹）        
		$filename = "/var/conf/config.zip"; //最终生成的文件名（含路径）                        
		$zip = new PHPZip();            
		//$zip->Zip_CompressDownload($path,$filename);
		$zip->Zip_Compress($path,$filename);
		//4.清除中间文件
		system('rm -rf /var/conf/config');
		//5.下载
		$this->load->helper('download');
		$data = file_get_contents($filename);
		$name = 'backup.zip';
		force_download($name, $data);
    }
    //保存配置（不会下载）
    public function saveConfig() {
        $logary = array(
            'type'=>'saveConfig',
            'operator'=>element('username',$_SESSION,''),
            'operationCommand'=>"Save AC config",
            'operationResult'=>'ok',
            'description'=>""
        );
        Log_Record($this->db,$logary);
        //保存sqlite
        exec('cp /var/run/config.db /var/conf/config.db');
        //保存mysql openportal
        exec('mysqldump openportalserver>/var/conf/openportalserver_bak.sql');
        //保存ap版本
        if(!is_dir('/var/conf/ap_version')){
            mkdir('/var/conf/ap_version',0777,true);                   
        }
        exec('cp /etc/Ap_ver/* /var/conf/ap_version');

        exec('sync');
        $result = array('state' => array('code' => 2000, 'msg' => 'OK'));

        $result = json_encode($result);

        echo $result;
    }
    public function reboot() {
        $logary = array(
            'type'=>'Reboot',
            'operator'=>element('username',$_SESSION,''),
            'operationCommand'=>"Reboot AC",
            'operationResult'=>'ok',
            'description'=>""
        );
        Log_Record($this->db,$logary);
        //重启系统
        exec('/sbin/reboot');
    }
    public function restore() {
        $result = array('state' => array('code' => 2000, 'msg' => 'OK'));
        if (isset($_POST['suffix'])) {
            //从文件恢复
            //1.上传
            $result = $this->do_upload();
            if ($result['state']['code'] === 2000) {
                //2.解压
                if (file_exists('/var/conf/restore_config.zip')) {
                    mkdir('/var/conf/restore_config', 0777, true);
                    $zip = new PHPZip();
                    $pathfile = "/var/conf/restore_config.zip"; //需解压的文件
                    $targetpath = "/var/conf/restore_config"; //解压地址
                    if ($zip->Zip_Decompression($pathfile, $targetpath)) {
                        //解压完成
                        if (file_exists('/var/conf/restore_config/config.db')) {
                            //移动config.db 到/var/conf下
                            system('mv /var/conf/restore_config/config.db /var/conf/config.db');
                            //还原openportal
                            if (is_file('/var/conf/restore_config/openportalserver_bak.sql')) {
                                system('mv /var/conf/restore_config/openportalserver_bak.sql /var/conf/openportalserver_bak.sql');
                                exec('mysql openportalserver</var/conf/openportalserver_bak.sql');
                            }
                            //还原ap版本文件
                            if (!is_dir('/var/conf/ap_version')) {
                                mkdir('/var/conf/ap_version', 0777, true);
                            }
                            if (is_dir('/var/conf/restore_config')) {
                                system('cp /var/conf/restore_config/ap_version/* /var/conf/ap_version');
                                system('cp /var/conf/restore_config/ap_version/* /etc/Ap_ver');                                
                            }
                            //移动所有 到/var/conf/images下
                            if (!is_dir('/var/conf/images')) {
                                mkdir('/var/conf/images', 0777, true);
                            }
                            system('cp /var/conf/restore_config/* /var/conf/images/');                            
                        }
                    }
                    system('rm /var/conf/restore_config.zip');
                    system('rm -rf /var/conf/restore_config');
                }
                //exec('/sbin/reboot');
            } else {
                $result = json_encode($result);
            }
        } else {
            /*
            //恢复出厂设置
            if(file_exists('/var/conf/config.db')) {
                unlink('/var/conf/config.db');
            }
            if(file_exists('/var/netmanager/mysql')) {
                delete_files('/var/netmanager/mysql', TRUE);
            }
            exec('sysreset');
            exec('/sbin/reboot');
            */
            axc_set_sysreset();
        }
        return $result;
    }
    //上传
    private function do_upload() {
        $result = null;
        $config['upload_path'] = '/var/conf';
        $config['allowed_types'] = '*';
        $config['overwrite'] = true;
        $config['max_size'] = 0;
        $config['file_name'] = 'restore_config.zip';

        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('filename')) {
            $error = array('error' => $this->upload->display_errors());
            $result = array('state' => array('code' => 4000, 'msg' => $error));
        } else {
            $data = array('upload_data' => $this->upload->data());
            $result = array('state' => array('code' => 2000, 'msg' => 'OK'), 'data' => $data);
        }
        return $result;
    }
}
