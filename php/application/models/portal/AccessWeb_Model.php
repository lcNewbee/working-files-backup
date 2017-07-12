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
            'action'=>'get',
            'resName'=>'web_template',
            'data'=> array(
                $data
            )
        );        
        $ret = $this->getListSocket($socketarr);        
        if(count($ret) > 0){ 
            $ret_data = array();
            $ary = array();                      
            foreach($ret as $row){
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
                    'list' => $ret_data
                )
            ); 
            return json_encode($arr);                      
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
        $config['allowed_types'] = 'gif|png|jpg|jpeg';
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
        $result = json_no('add error !');
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
        $db_ary = array(
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
        $socketarr = array(
            'action'=>'add',
            'resName'=>'web_template',
            'data'=> array(
                $db_ary
            )
        );
        if( $this->noticeSocket($socketarr) ){
            return json_encode(json_ok());
        }    
        return json_encode($result);               
    }
    function Delete($data) {        
        $result = FALSE;
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {
            //send java  
            $socketarr = array(
                'action' => 'delete',
                'resName' => 'web_template',
                'data' => array(
                    array(
                        'id' => element('id', $row),
                        'name' => element('name', $row, ''),
                        'title' => element('title', $row, ''),
                        'subTitle' => element('subTitle', $row, ''),            
                        'authMethod' => element('auths', $row, ''),
                        'logo' => element('logo', $row, ''),
                        'bgImg' => element('backgroundImg', $row, ''),
                        'copyRight' => element('copyright', $row, ''),
                        'copyRightUrl' => element('copyrightUrl', $row, ''),
                        'description' => element('description', $row, ''),
                        'url' => element('url', $row, 'http://'),
                        'sessiontime' => element('sessiontime', $row, 0)
                    )
                )
            );
            if( $this->noticeSocket($socketarr) ){
                //delete file
                unlink('/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/' . $row['logo']);
                unlink('/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/' . $row['backgroundImg']);
                return json_encode(json_ok());
            }            
        }
        return json_encode(json_no('delete error')); 
    }
    function Edit($data){
        date_default_timezone_set("PRC");  
        $logo_name = date('YmdHis') . rand(10000000,99999999) . '.jpg';
        $bg_name = date('YmdHis') . rand(10000000,99999999) . '.jpg'; 
        $db_ary = array(
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
            if(count($query) > 0){
                $dellogo = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/' . $query[0]['logo'];
                if(is_file($dellogo)){
                    unlink($dellogo);
                }                               
            }
        }else{
            //否则将需要修改的logo名字 改回原数据库存储的值
            $db_ary['logo'] = $query[0]['logo'];
        }
        //bg
        $upload_data2 = $this->do_upload_img($bg_name, 'backgroundImg');        
        if($upload_data2['state']['code'] == 2000){
            //上传成功后删除原图片            
            if(count($query) > 0){                
                $delbg = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/' . $query[0]['bg_img'];   
                if(is_file($delbg)){                    
                    unlink($delbg);
                }                              
            }
        }else{
            if(count($query) > 0){
                $db_ary['bgImg'] = $query[0]['bg_img'];                
            }
        }
        //2.操作数据库        
        //send java
        $socketarr = array(
            'action' => 'edit',
            'resName' => 'web_template',
            'data' => array(
                $db_ary
            )
        );
        if( $this->noticeSocket($socketarr) ){
            return json_encode(json_ok());
        }
        return json_encode(json_no('edit error !'));
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
    private function getListSocket($data){
        $result = null;
        $portal_socket = new PortalSocket();
        $result = $portal_socket->portal_socket(json_encode($data));          
        if($result['state']['code'] === 2000){
            return $result['data']['list'];
        }
        return json_no('java server error !');
    }
}
