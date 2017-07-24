<?php
class AccessWeb_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));
        $this->load->library('PortalSocket');
    }
    function get_list($data) {            
        //send java   
        $socketarr = array(
            'action' => 'get', 
            'resName' => 'web_template', 
            'data' => array(
                'page' => array(
                    'currPage' => element('page', $data, 1),
                    'size' => element('size', $data, 20)
                ),
                'list' => array()
            )
        );
        $portal_socket = new PortalSocket();
        $ret_ary = $portal_socket->portal_socket(json_encode($socketarr));
        if($ret_ary['state']['code'] === 2000) {
            if(count($ret_ary['data']['list']) > 0){ 
                $ret_data = array();
                $ary = array();                      
                foreach($ret_ary['data']['list'] as $row){
                    $ary['id'] = $row['id'];
                    $ary['name'] = $row['name'];
                    $ary['title'] = $row['title'];
                    $ary['subTitle'] = $row['subTitle'];
                    $ary['authentication'] = $row['authMethod'];
                    $ary['auths'] = $row['authMethod'];
                    $ary['logo'] = $row['logo'];
                    $ary['backgroundImg'] = $row['bgImg'];
                    $ary['copyright'] = $row['copyRight'];
                    $ary['copyrightUrl'] = $row['copyRightUrl'];
                    $ary['pageStyle'] = $row['pageStyle'];
                    $ary['description'] = $row['description'];
                    $ary['url'] = $row['url'];
                    $ary['sessiontime'] = $row['sessiontime'];
                    $ret_data[] = $ary;
                } 
                $arr = array(
                    'state' => array('code'=>2000, 'msg'=>'ok'),
                    'data' => array(
                        'page' => $ret_ary['data']['page'],
                        'list' => $ret_data
                    )
                ); 
                return json_encode($arr);                      
            }
        }    
        return json_encode(json_no('error'));
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
    private function do_upload_img($file_name, $upload_name){        
        $config['upload_path'] = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/dist/css/img';
        $config['overwrite'] = true;
        $config['max_size'] = 0;
        $config['allowed_types'] = 'gif|jpg|png';
        $config['file_name'] = $file_name;
        //$this->load->library('upload', $config);        
        //上传多张时采用以下写法
        $this->load->library('upload');
        $this->upload->initialize($config);
        
        if (!$this->upload->do_upload($upload_name)) {
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
    function Add($data){  
        date_default_timezone_set("PRC");          
        $logo_name = date('YmdHis') . rand(10000000,99999999) . '.jpg';
        $bg_name = date('YmdHis') . rand(10000000,99999999) . '.jpg';    
        $logo_img = '';
        $bg_img = '';
        //1.上传图片
        $upload_data = $this->do_upload_img($logo_name, 'logo');        
        $upload_data2 = $this->do_upload_img($bg_name, 'backgroundImg');        
        if($upload_data['state']['code'] == 2000){
            $logo_img = 'dist/css/img/' . $logo_name;
        }
        if($upload_data2['state']['code'] == 2000){
            $bg_img = 'dist/css/img/' . $bg_name;
        }        
        //2.操作数据库
        $socketarr = array(
            'name' => element('name', $data, ''),
            'title' => element('title', $data, ''),
            'subTitle' => element('subTitle', $data, ''),            
            'authMethod' => element('auths', $data, ''),
            'logo' => $logo_img,
            'bgImg' => $bg_img,
            'copyRight' => element('copyright', $data, ''),
            'copyRightUrl' => element('copyrightUrl', $data, ''),
            'description' => element('description', $data, ''),
            'url' => element('url', $data, 'http://'),
            'sessiontime' => element('sessiontime', $data, 0)
        );
        //send java
        if ($this->noticeSocket($this->getSocketPramse('add', array($socketarr)))) {
            $this->DirectorySave();
            return json_encode(json_ok());
        }           
        return json_encode(json_no('add error !'));               
    }
    function Delete($data) {        
        $result = FALSE;
        $dellist = $data['selectedList'];
        $failure_name = '';//记录删除失败的模版名称
        $del_switch = true;//默认可以删除
        foreach($dellist as $row) {
            if($this->isSsidEmploy($row['id'])){
                $del_switch = false;
                $failure_name = $failure_name .''.$row['name'].'/';
                continue;
            }                        
        }
        if($del_switch){
            foreach($dellist as $drow){
                //send java  
                $socketarr = array(
                    'id' => element('id', $drow),
                    'name' => element('name', $drow, ''),
                    'title' => element('title', $drow, ''),
                    'subTitle' => element('subTitle', $drow, ''),            
                    'authMethod' => element('auths', $drow, ''),
                    'logo' => element('logo', $drow, ''),
                    'bgImg' => element('backgroundImg', $drow, ''),
                    'copyRight' => element('copyright', $drow, ''),
                    'copyRightUrl' => element('copyrightUrl', $drow, ''),
                    'description' => element('description', $drow, ''),
                    'url' => element('url', $drow, 'http://'),
                    'sessiontime' => element('sessiontime', $drow, 0)
                );
                if ($this->noticeSocket($this->getSocketPramse('delete', array($socketarr)))) {
                    //delete file
                    $logo_path = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/' . $drow['logo'];
                    $bgm_path = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/' . $drow['backgroundImg'];
                    if(is_file($logo_path)){
                        unlink($logo_path);
                    }
                    if(is_file($bgm_path)){
                        unlink($bgm_path);
                    }
                }
            }
            $this->DirectorySave();
            return json_encode(json_ok()); 
        }     
           
        return json_encode(json_no(rtrim($failure_name,"/"))); 
    }
    function Edit($data){
        date_default_timezone_set("PRC");  
        $logo_name = date('YmdHis') . rand(10000000,99999999) . '.jpg';
        $bg_name = date('YmdHis') . rand(10000000,99999999) . '.jpg'; 
        $socketarr = array(
            'id' => element('id', $data),
            'name' => element('name', $data, ''),
            'title' => element('title', $data, ''),
            'subTitle' => element('subTitle', $data, ''),            
            'authMethod' => element('auths', $data, ''),
            'logo' => 'dist/css/img/' . $logo_name,
            'bgImg' => 'dist/css/img/' . $bg_name,
            'copyRight' => element('copyright', $data, ''),
            'copyRightUrl' => element('copyrightUrl', $data, ''),
            'description' => element('description', $data, ''),
            'url' => element('url', $data, 'http://'),
            'sessiontime' => element('sessiontime', $data, 0)         
        ); 
        $query = $this->portalsql->query('select id,name,logo,bg_img from portal_web where id=' . $data['id'])->result_array();
        //1.上传图片
        //logo
        $upload_data = $this->do_upload_img($logo_name, 'logo');        
        if($upload_data['state']['code'] == 2000){            
            //上传成功后删除原图片            
            if(count($query) > 0 && $query[0]['logo'] != 'dist/css/img/logo.png'){
                $dellogo = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/' . $query[0]['logo'];
                if(is_file($dellogo)){
                    unlink($dellogo);
                }                               
            }
        }else{
            //否则将需要修改的logo名字 改回原数据库存储的值
            $socketarr['logo'] = $query[0]['logo'];
        }
        //bg
        $upload_data2 = $this->do_upload_img($bg_name, 'backgroundImg');        
        if($upload_data2['state']['code'] == 2000){
            //上传成功后删除原图片            
            if(count($query) > 0 && $query[0]['bg_img'] != 'dist/css/img/bg.jpg'){                
                $delbg = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/' . $query[0]['bg_img'];   
                if(is_file($delbg)){                    
                    unlink($delbg);
                }                              
            }
        }else{
            if(count($query) > 0){
                $socketarr['bgImg'] = $query[0]['bg_img'];                
            }
        }
        //2.操作数据库        
        //send java
        if ($this->noticeSocket($this->getSocketPramse('edit', array($socketarr)))) {
            $this->DirectorySave();
            return json_encode(json_ok());
        } 
        return json_encode(json_no('edit error !'));
    }
    //检测ssid是否使用中
    private function isSsidEmploy($id){
        $query = $this->portalsql->query('select id from portal_ssid where web=' . $id)->result_array();
        if(count($query) > 0){
            return true;
        }
        return false;
    }
    //socket portal
    private function getDbParams($data){
    }
    private function noticeSocket($data){
        $result = null;
        $portal_socket = new PortalSocket();
        $result = $portal_socket->portal_socket(json_encode($data));
        if($result['state']['code'] === 2000){
            return TRUE;
        }
        return FALSE;
    }
    private function getSocketPramse($type, $data) {
         $socketarr = array(
            'action' => $type,
            'resName' => 'web_template',
            'data' => array(
                'page' => array('currPage' => 1,'size' => 20),
                'list' => $data
            )
        );
        return $socketarr;
    }

    private function DirectorySave(){
        if(!is_dir('/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/dist/css/img')){
            return;
        }
        if(!is_dir('/var/netmanager/img')){
            mkdir('/var/netmanager/img', 0777, true);
        }
        //清空
        exec('rm -rf /var/netmanager/img/*');
        exec('cp /usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/dist/css/img/* /var/netmanager/img');
    }
}
