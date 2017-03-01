<?php
class AdvManagement_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {        
        $columns = '*';
        $tablenames = 'adv_adv';
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
            $filepath = $this->upload->data('full_path');
            $insertary['img'] = $filepath;//图片存放位置            
            $result = $this->portalsql->insert('adv_adv', $insertary);            
        }        
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);        
    }
    function Delete($data) {
        $result = FALSE;
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('adv_adv');
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
            $filepath = $this->upload->data('full_path');            
            
            $updata ['id'] = element('id',$updata);
            $updata['img'] = $filepath;//图片存放位置
            $result = $this->portalsql->replace('adv_adv',$updata,array('id'=>$updata['id']));
            if($result){
                unlink($data['img']);
            }
        }
        $result ? $result = json_ok() : $result = json_no('update error');
        return json_encode($result);        
    }
    private function getPram($data){  
        $arr = array(                 
            'img'        => element('img',$data),  // 广告导图
            'name'       => element('name',$data),  // 名称
            'creatDate'  => element('creatDate',$data),  // 创建日期
            'showDate'   => element('showDate',$data),  // 投放日期
            'endDate'    => element('endDate',$data),  // 结束日期
            'state'      => element('state',$data),  // 投放,0-否，1-是
            'showName'   => element('showName',$data),  // 显示名称，0-不显示，1-显示
            'showImg'    => element('showImage',$data),  // 显示导图，0-不显示，1-显示
            'showInfo'   => element('showInfo',$data),   // 显示备注，0-不显示，1-显示
            'sid'        => element('userName',$data),
            'showCount'  => element('showCount',$data),   // 展示
            'clickCount' => element('clickCount',$data),   // 点击
            'lockTime'   => element('lockTime',$data),   // 倒计时
            'pos'        => element('pos',$data)   // 排序
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
