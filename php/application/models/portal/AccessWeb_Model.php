<?php
class AccessWeb_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'my_customfun_helper'));		
    }
    function get_list($data) {   		
        $columns = 'portal_web.id,portal_web.name,portal_web.countShow,portal_web.countAuth,portal_web.description,adv_adv.name as adv';
        $tablenames = 'portal_web';
        $pageindex = (int)element('page', $data, 1);
        $pagesize = (int)element('size', $data, 20);	
        $where = array(array('portal_web.id>','0'));
        $join = array(array('adv_adv','portal_web.adv=adv_adv.id','left'));	
        $datalist = help_data_page($this->portalsql,$columns,$tablenames,$pageindex,$pagesize,$where,$join);
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
        $config['allowed_types'] = '*';
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
        //上传        
        if( !is_dir('/var/conf/portalserver') ){
            //创建并赋予权限
            mkdir('/var/conf/portalserver');
            chmod('/var/conf/portalserver',0777);														
        }        
        $upload_data=$this->do_upload();
        if($upload_data['state']['code']==2000){
            $arr = $this->getPram($data);
            $result = $this->portalsql->insert('portal_web', $arr);
        }             
        $result = $result ? json_ok() : json_no('insert error');
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
                unlink('/var/conf/portalserver/portal_web_tmp.zip');				
            }
        }     
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }
    function Edit($data) {
        $result = null;
         $upload_data=$this->do_upload();
        if($upload_data['state']['code']==2000){
            $arr = $this->getPram($data);
            $arr['id'] = element('id',$data);
            $result = $this->portalsql->replace('portal_web', $arr);
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
}