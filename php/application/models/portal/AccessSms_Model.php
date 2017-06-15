<?php
class AccessSms_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_list($data) {
        $parameter = array(
            'db' => $this->portalsql,
            'columns' => '*',
            'tablenames' => 'portal_smsapi',
            'pageindex' => (int) element('page', $data, 1),
            'pagesize' => (int) element('size', $data, 20),
            'wheres' => "1=1",
            'joins' => array(),
            'order' => array(array('id','DESC'))
        );
        if(isset($data['search'])){
            $parameter['wheres'] = $parameter['wheres'] . " AND name LIKE '%".$data['search']."%'";
        }
        if(isset($data['gateway_type']) && $data['gateway_type'] != '-100'){
            $parameter['wheres'] = $parameter['wheres']." AND type='".$data['gateway_type']."'";
        }
        $datalist = help_data_page_all($parameter);
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page'=>$datalist['page'],
				'list' =>$datalist['data']
			)
		);
		return json_encode($arr);
	}
    function Add($data){
        $result = 0;
        $arr = $this->params($data);
        $result = $this->portalsql->insert('portal_smsapi',$arr);
        if($result == 1 && $data['state'] == 1){
            //关闭其他网关
            $this->close_sms($this->portalsql->insert_id());
        }
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }
    function Delete($data){
        $result = FALSE;
        $dellist = $data['selectedList'];
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_smsapi');
        }
        $result = $result ? json_ok() : json_on('delete error');
        return json_encode($result);
    }
    function Edit($data){
        $result = 0;
        $arr = $this->params($data);
        $this->portalsql->where('id', $data['id']);
        $result = $this->portalsql->update('portal_smsapi', $arr);
        if($result == 1 && $data['state'] == 1){
            //关闭其他网关
            $this->close_sms($data['id']);
        }
        $result = $result ? json_ok() : json_no('edit error');
        return json_encode($result);
    }
    private function params($data){
        $arr = array(
            'name'=>element('name',$data),
            'url'=>element('url',$data,''),
            'count'=>element('count',$data),//已使用次数
            'state'=>element('state',$data),//状态，启用/停用
            'type'=>element('type',$data),//类型，1-虚拟网关 2-前海智讯
            'more'=>element('more',$data),//多终端登录 0-允许 1-禁止
            'time'=>element('time',$data),//验证码过期时长 分钟
            'text'=>element('text',$data),//短信内容
            'appkey'=>element('appkey',$data),// 短信网关用户名
            'appsecret'=>element('appsecret',$data),// 短信网关密码
            'smssign'=>element('smssign',$data),//签名
            'smstemplate'=>element('smstemplate',$data),//模板ID
            'company'=>element('company',$data)//公司名称
        );
        return $arr;
    }
    private function close_sms($id){
        $this->portalsql->set('state',0);
        $this->portalsql->where('id !=',$id);
        if($this->portalsql->update('portal_smsapi')){
            return 1;
        }
        return 0;
    }
}
