<?php
class AdvStores_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {        
        $columns = '*';
        $tablenames = 'adv_stores';
        $pageindex = (int)element('page', $data, 1);
        $pagesize = (int)element('size', $data, 20);
        $order = array(array('id','DESC'));	        
        $datalist = help_data_page_order($this->portalsql,$columns,$tablenames,$pageindex,$pagesize,$order);
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'page'=>$datalist['page'],
                'list' => $datalist['data']
            )
        );
        return json_encode($arr);    
    }    
    function Add($data) {
        $result = FALSE;      
        //1.上传
        $upload_path = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/advPic/'.(string)exec('date "+%Y-%m"');        
        $upload_data = $this->file_upload($upload_path,'img');   
        if(is_array($upload_data)){
            $insertary = $this->getPram($data);
            //$filename = $this->upload->data('file_name');
            $filepath = $this->upload->data('full_path');
            $insertary['img'] = $filepath;//图片存放位置全路径
            $result = $this->portalsql->insert('adv_stores', $insertary);            
        }        
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    function Delete($data) {
        $result = FALSE;
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('adv_stores');
            if($result){
                //del file
                unlink($row['img']);
            }
        }
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }
    function Edit($data) {
        $result = null;
        //1.上传
        $upload_path = '/usr/web/apache-tomcat-7.0.73/project/AxilspotPortal/advPic/'.(string)exec('date "+%Y-%m"');        
        $upload_data = $this->file_upload($upload_path,'img');
        if(is_array($upload_data)){            
            $updata = $this->getPram($data);
            //$filename = $this->upload->data('file_name');
            $filepath = $this->upload->data('full_path');            
            $updata ['id'] = element('id',$updata);
            $updata['img'] = $filename;//图片存放位置
            $result = $this->portalsql->replace('portal_message',$updata,array('id'=>$updata['id']));
            if($result){
                unlink($data['img']);
            }
        }
        $result ? $result = json_ok() : $result = json_no('update error');
        return json_encode($result);
    }
    private function getPram($data){  
        $arr = array(                 
            'name' => element('name',$data),//名称
            'description' => element('description',$data),// 详情
            'creatDate' => (string)exec('date "+%Y-%m-%d %H:%M:%S"'),// 创建日期，只在列表页面中显示
            'uid' => 1,
            'address' => element('address',$data),
            'phone' => element('phone',$data),
            /* 门店LOGO，支持.jpeg,jpg,png格式的图片，图片大小是96*96，存储路径默认值为/advPic/1.jpg,
             文件的保存路径是“根目录/advPic/日期/文件名”，例：/advPic/2017-02/uuid.png*/
            'img' => element('img',$data),
            'showInfo' => element('showInfo',$data),// 是否显示，0-不显示，1-显示
            'x' => element('x',$data),
            'y' => element('y',$data)
        );
        return $arr;
    }
    /**
     * @path 上传路径
     * @filename 页面上传文件名
     */
    private function file_upload($path,$filename){
        $result = 0;
        if(!file_exists($path)){
            mkdir($path);
            chmod($path,0777);	
        }
        $config['upload_path'] = $path;
        $config['overwrite'] = true;
        $config['encrypt_name'] = true;
        $config['max_size'] = 0;
        $config['allowed_types'] = 'jpeg|jpg|png';
        $this->load->library('upload', $config);
        if ($this->upload->do_upload($filename)) {
            $result = $this->upload->data();
        }
        return $result;
    }
}
