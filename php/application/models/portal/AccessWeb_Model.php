<?php
class AccessWeb_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));
        $this->load->library('PHPZip');        	
    }
    function get_list($data) {           
        $parameter = array(
            'db' => $this->portalsql, 
            'columns' => 'portal_web.id,portal_web.name,portal_web.countShow,portal_web.countAuth,portal_web.description,adv_adv.name as adv', 
            'tablenames' => 'portal_web', 
            'pageindex' => (int) element('page', $data, 1), 
            'pagesize' => (int) element('size', $data, 20), 
            'wheres' => "1=1",
            'joins' => array(array('adv_adv','portal_web.adv=adv_adv.id','left')), 
            'order' => array()
        );
        if(isset($data['search'])){
            $parameter['wheres'] = $parameter['wheres'] . " AND portal_web.name LIKE '%".$data['search']."%'";
        }
        if(isset($data['adv'])){
            //广告页面搜索
           $parameter['wheres'] = $parameter['wheres']." AND adv_adv.id =".$data['adv'];
        } 
        $datalist = help_data_page_all($parameter);
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'page'=>$datalist['page'],
                'list' => $datalist['data']
            )
        );       
        return json_encode($arr);
    }
    function do_upload(){
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
                $this->deldir('/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/'.$row['id']);
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
                $filepath = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/'.$data['id'];
                if( file_exists($filepath) ){                    
                    $zip = new PHPZip();                
                    $pathfile = "/var/conf/portalserver/portal_web_tmp.zip"; //需解压文件
                    $targetpath = $filepath;//解压地址                                               
                    if(!$zip->Zip_Decompression($pathfile,$targetpath)){
                        $result = 0;//解压错误
                    }
                }
            }
        }        
        $result = $result ? json_ok() : json_no('update error');
        return json_encode($result);
    }
    function getPram($data){
        $arr = array(
            'name' => element('name',$data),
            'description' => element('description',$data),
            'countShow' => element('countShow',$data),
            'countAuth' => element('countAuth',$data),
            'adv' => element('adv',$data,'0')
        );
        return $arr;
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
    function deldir($dir) {
        //先删除目录下的文件：
        $dh=opendir($dir);
        while ($file=readdir($dh)) {
            if($file!="." && $file!="..") {
                $fullpath=$dir."/".$file;
                if(!is_dir($fullpath)) {
                    unlink($fullpath);
                } else {
                    $this->deldir($fullpath);
                }
            }
        }        
        closedir($dh);
        //删除当前文件夹：
        if(rmdir($dir)) {
            return true;
        } else {
            return false;
        }
    }
}