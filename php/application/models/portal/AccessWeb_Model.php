<?php
class AccessWeb_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));
        $this->load->library('PHPZip');
        $this->load->library('PortalSocket');
    }
    function get_list($data) {
        $parameter = array(
            'db' => $this->portalsql,
            'columns' => 'portal_web.id,portal_web.name,portal_web.countShow,portal_web.countAuth,portal_web.description,adv_adv.name as adv',
            'tablenames' => 'portal_web',
            'pageindex' => (int) element('page', $data, 1),
            'pagesize' => (int) element('size', $data, 20),
            'wheres' => "1=1",
            'joins' => array(
                array('adv_adv','portal_web.adv=adv_adv.id','left'),
                //array('portal_basauth','portal_web.id=portal_basauth.type','left')
            ),
            'order' => array()
        );
        $portalBasauth = $this->portalsql->query("select url,type,sessiontime from portal_basauth")->result_array();

        if(isset($data['search'])){
            $parameter['wheres'] = $parameter['wheres'] . " AND portal_web.name LIKE '%".$data['search']."%'";
        }
        if(isset($data['adv'])){
            //广告页面搜索
           $parameter['wheres'] = $parameter['wheres']." AND adv_adv.id =".$data['adv'];
        }
        $datalist = help_data_page_all($parameter);

        if(count($datalist['data']) > 0){
            //所有认证 没有rul和    sessiontime
            $datalist['data'][0]['url'] = '';
            $datalist['data'][0]['sessiontime'] = '';
            $datalist['data'][0]['authentication'] = $this->getPortalConfig();
        }
        // if ($name === "One Key Authentication") {
        //   $newType = '0';
        // } else if ($name === "Accessed User Authentication") {
        //   $newType = '1';
        // } else if ($name === "SMS Authentication") {
        //    $newType = '4';
        // } else if ($name === "Wechat Authentication") {
        //    $newType = '5';
        // } else if ($name === "Facebook Authentication") {
        //    $newType = '9';
        // }
        foreach ($portalBasauth as $row) {
          $type = $row['type'];
          $index = 0;

          if($type === '0') {
            $index = 2;
          } elseif ($type === '1') {
            $index = 3;
          } elseif ($type === '4') {
            $index = 4;
          } elseif ($type === '5') {
            $index = 5;
          } elseif ($type === '9') {
            $index = 6;
          }

          if ($index !== 0) {
            $datalist['data'][$index]['url'] = $row['url'];
            $datalist['data'][$index]['sessiontime'] = (int)$row['sessiontime'] >= 60000 ? (int)$row['sessiontime'] / 60000 : $row['sessiontime'];
          }

        }

        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                //'page'=>$datalist['page'],
                'list' => $datalist['data']
            )
        );
        return json_encode($arr);
    }
    function get_web_page(){
        $result = null;
        $query = $this->portalsql->query('select id,name from adv_adv');
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>$query->result_array()
            )
        );
        return json_encode($arr);
    }
    function Add($data) {
        $result = FALSE;
        //1.上传
        if( !is_dir('/var/conf/portalserver') ){
            //创建并赋予权限
            mkdir('/var/conf/portalserver');
            chmod('/var/conf/portalserver',0777);
        }
        $upload_data=$this->do_upload();
        if($upload_data['state']['code']==2000){
            //2.写数据库
            $arr = $this->getPram($data);
            $result = $this->portalsql->insert('portal_web', $arr);
            //3.生产新文件,并解压上传文件
            $add_id = $this->portalsql->insert_id();
            if($add_id > 0){
                $filepath = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/'.$add_id;
                if( !file_exists($filepath) ){
                    mkdir($filepath);
                    chmod($filepath,0777);
                    $zip = new PHPZip();
                    $pathfile = "/var/conf/portalserver/portal_web_tmp.zip"; //需解压文件
                    $targetpath = $filepath;//解压地址
                    if(!$zip->Zip_Decompression($pathfile,$targetpath)){
                        $result = 0;//解压错误
                    }
                }
            }
        }else{
            return json_encode(json_no($this->upload->display_errors(),6204));
        }
        //更改url重定向
        //$this->editPortalBasauth($data['id'], $data['url'], $data['sessiontime']); 暂时屏蔽了add功能
        $result = $result ? json_ok() : json_no($this->upload->display_errors());
        return json_encode($result);
    }
    function Delete($data) {
        $result = FALSE;
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_web');
            //delete file
            if($result) {
                $this->delDir('/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/'.$row['id']);
                //unlink('/var/conf/portalserver/portal_web_tmp.zip');
            }
        }
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }
    function Edit($data) {
        $result = null;
        //1.上传
        if( !is_dir('/var/conf/portalserver') ){
            //创建并赋予权限
            mkdir('/var/conf/portalserver');
            chmod('/var/conf/portalserver',0777);
        }
        $upload_data=$this->do_upload();
        if($upload_data['state']['code']==2000){
            //2.操作数据库
            $arr = $this->getPram($data);
            $arr['id'] = element('id',$data);
            $result = $this->portalsql->replace('portal_web', $arr);
            if($result){
                //解压
                $file_str = (int)element('id', $data, 1);			
				if($file_str == 1 ){
					$file_str = '';						
				}else{
					$file_str = $file_str - 1;						
				}
				$filepath = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/'.$file_str;
                if( file_exists($filepath) ){
                    $zip = new PHPZip();
                    $pathfile = "/var/conf/portalserver/portal_web_tmp.zip"; //需解压文件
                    $targetpath = $filepath;//解压地址
                    if(!$zip->Zip_Decompression($pathfile,$targetpath)){
                        $result = 0;//解压错误
                    }
                }
            }
            //更改url重定向
            if((int)$data['id'] > 1){
                $this->editPortalBasauth($data['id'], $data['url'], $data['sessiontime']);
            }

        // 没有文件上传
        } else {
          //2.操作数据库
          $arr = $this->getPram($data);
          $arr['id'] = element('id',$data);
          $result = $this->portalsql->replace('portal_web', $arr);

          //更改url重定向
          if((int)$data['id'] > 1){
              $this->editPortalBasauth($data['id'], $data['url'], $data['sessiontime'], $data['name']);
          }
        }

        if (element('id',$data) === '1') {
          //修改portal_config
          $this->editPortalConfig($data['auths']);
        }

        $result = $result ? json_ok() : json_no('update error');
        return json_encode($result);
    }
    function web_download($data) {
        $filesum = element('id', $data, 0);
        $copyPath = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/'.$filesum.'/';
        if($filesum == 0){
            $copyPath = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/';
        }
        $path = '/var/conf/portal_web_tmp';//需压缩的目录（文件夹）
        $filename = "/var/conf/portal_web_tmp.zip"; //最终生成的文件名（含路径）

        //1.清空
		if(is_dir($path)){
			system('rm -rf ' . $path);
			mkdir($path,0777,true);
        }else{
			mkdir($path,0777,true);
		}
        //2.复制
        if(!is_dir($copyPath)){
            echo json_encode(json_no('File does not exist ',4000));
            return;
        }
        copy($copyPath.'auth.jsp',$path.'/auth.jsp');
        copy($copyPath.'ok.jsp',$path.'/ok.jsp');
        copy($copyPath.'out.jsp',$path.'/out.jsp');
        $this->copyDir($copyPath.'dist',$path.'/dist');//复制文件夹下所有
        $this->copyDir($copyPath.'weixin',$path.'/weixin');
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
        //3.压缩并下载
        $zip->Zip_CompressDownload($path,$filename);
    }

    //设置portal_basauth的URL 和 上网认证时长
    private function editPortalBasauth($type, $url, $sessiontime, $name) {
        $updata = array(
            'url' => $url,
            'sessiontime'=>(int)$sessiontime * 60000
        );
        $newType = $type;

        if ($name === "One Key Authentication") {
          $newType = '0';
        } else if ($name === "Accessed User Authentication") {
          $newType = '1';
        } else if ($name === "SMS Authentication") {
           $newType = '4';
        } else if ($name === "Wechat Authentication") {
           $newType = '5';
        } else if ($name === "Facebook Authentication") {
           $newType = '9';
        }

        //$this->portalsql->where('type', $type);
        // if( $this->portalsql->update('portal_basauth', $up) ){
        //     return TRUE;
        // }
        if ($this->noticeSocket($this->getSocketPortalAuthParams('edit', $updata, $name))) {
            //up portal_auth
            $this->portalsql->where('type', $newType);
            if($this->portalsql->update('portal_basauth', $updata) ){
                return TRUE;
            }
            return FALSE;
        }

        return FALSE;
    }

    private function do_upload(){
        $config['upload_path'] = '/var/conf/portalserver';
        $config['overwrite']=true;
        $config['max_size'] = 0;
        $config['allowed_types'] = 'zip';
        $config['file_name'] = 'portal_web_tmp.zip';

        $this->load->library('upload', $config);
        if (!$this->upload->do_upload('file')) {
            $error = array('error' => $this->upload->display_errors());
            $result = array(
                'state'=>array(
                    'code'=>4000,
                    'msg'=>$error
                )
            );
        }else {
            $data = array('upload_data' => $this->upload->data());
            $result = array(
                'state'=>array(
                    'code'=>2000,
                    'msg'=>'OK'
                ),
                'data'=>$data
            );
        }
        return $result;
    }
    private function getPram($data){
        $arr = array(
            'name' => element('name', $data),
            'description' => element('description', $data, ''),
            'countShow' => element('countShow', $data, 0),
            'countAuth' => element('countAuth', $data, 0),
            'adv' => element('adv', $data, 0)
        );
        return $arr;
    }
    private function delDir($dir) {
        //先删除目录下的文件：
        $dh = opendir($dir);
        while ($file = readdir($dh)) {
            if ($file != "." && $file != "..") {
                $fullpath = $dir . "/" . $file;
                if (!is_dir($fullpath)) {
                    unlink($fullpath);
                } else {
                    $this->delDir($fullpath);
                }
            }
        }
        closedir($dh);
        //删除当前文件夹：
        if (rmdir($dir)) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 复制文件夹及下所有文件
     * @src 要复制的文件夹
     * @dst 目标文件
    */
    private function copyDir($src, $dst) {
        $dir = opendir($src);
        @mkdir($dst);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    $this->copyDir($src . '/' . $file, $dst . '/' . $file);
                    continue;
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }

    private function editPortalConfig($prams) {
        $arr = array(
            'auth_interface' => $prams
        );
        // $this->portalsql->where('id',1);
        // if($this->portalsql->update('portal_config', $arr)){
        //     return TRUE;
        // }
        $authinface = $prams;
        $query = $this->portalsql->query("select * from portal_config where id=1")->result_array();
        $data = $query[0];
        $updata = $this->getSocketParam($data);
        $updata['authInterface'] = $authinface;
        if ($this->noticeSocket($this->getSocketPortalConfigParams('edit', $updata))) {
            //up portal_config
            $updata = $this->getDbParam($data);
            $updata['id'] = element('id', $data, 0);
            $updata['auth_interface'] = $authinface;
            $result = $this->portalsql->replace('portal_config', $updata);
            return TRUE;
        }

        return FALSE;
    }

    private function getPortalConfig(){
        $query = $this->portalsql->query("select * from portal_config where id=1")->result_array();
        if( count($query) > 0 ){
            return $query[0]['auth_interface'];
        }
        return '';
    }
    private function getDbParam($data){
        $linuxdate = (string)exec('date "+%Y-%m-%d %H:%M:%S"');
        $numtime = $this->getConfigTime();
        $arr = array(
            'bas'=>element('bas',$data,''),
            'basname'=>element('basname',$data,''),
            'bas_ip'=>element('bas_ip',$data,''),
            'bas_port'=>element('bas_port',$data,''),
            'portalVer'=>element('portalVer',$data,''),
            'authType'=>element('authType',$data,''),
            'sharedSecret'=>element('sharedSecret',$data,''),
            'bas_user'=>element('bas_user',$data,$linuxdate),
            'bas_pwd'=>element('bas_pwd',$data,$numtime),
            'timeoutSec'=>element('timeoutSec',$data,''),
            'isPortalCheck'=>element('isPortalCheck',$data,0),
            'isOut'=>element('isOut',$data,''),
            'auth_interface'=>element('auth_interface',$data,''),
            'isComputer'=>element('isComputer',$data,''),
            'web'=>element('web',$data,''),
            'isdebug'=>element('isdebug',$data,1),
            'lateAuth'=>element('lateAuth',$data,''),
            'lateAuthTime'=>element('lateAuthTime',$data,'')
        );
        return $arr;
    }
    private function getSocketParam($data){
        $linuxdate = (string)exec('date "+%Y-%m-%d %H:%M:%S"');
        $numtime = $this->getConfigTime();
        $arr = array(
            'bas'=>element('bas',$data,''),
            'basname'=>element('basname',$data,''),
            'basIp'=>element('bas_ip',$data,''),
            'basPort'=>element('bas_port',$data,''),
            'portalVer'=>element('portalVer',$data,''),
            'authType'=>element('authType',$data,''),
            'sharedSecret'=>element('sharedSecret',$data,''),
            'basUser'=>element('bas_user',$data,$linuxdate),
            'basPwd'=>element('bas_pwd',$data,$numtime),
            'timeoutSec'=>element('timeoutSec',$data,''),
            'isPortalCheck'=>element('isPortalCheck',$data,0),
            'isOut'=>element('isOut',$data,''),
            'authInterface'=>element('auth_interface',$data,''),
            'isComputer'=>element('isComputer',$data,''),
            'web'=>element('web',$data,''),
            'isdebug'=>element('isdebug',$data,1),
            'lateAuth'=>element('lateAuth',$data,''),
            'lateAuthTime'=>element('lateAuthTime',$data,'')
        );
        return $arr;
    }
    private function getConfigTime(){
        $result = 0;
        $query = $this->portalsql->query("select usertime from config where id=1");
        if($query->row()->usertime){
            $result = $query->row()->usertime;
            $result = $result * 60000;
        }
        return $result;
    }
     //socket portal
    private function noticeSocket($data){
        $result = null;
        $portal_socket = new PortalSocket();
        $result = $portal_socket->portal_socket(json_encode($data));
        if($result['state']['code'] === 2000){
            return TRUE;
        }
        return FALSE;
    }
    private function getSocketPortalConfigParams($type, $data) {
         $socketarr = array(
            'action'=>$type,
            'resName'=>'bascfg',
            'data'=>$data
        );
        return $socketarr;
    }
     private function getSocketPortalAuthParams($type, $data, $name) {
        $newData = $data;
        $newData['name'] = $name;
        $socketarr = array(
            'action'=>$type,
            'resName'=>'basauth',
            'data'=>$newData
        );
        return $socketarr;
    }
}
