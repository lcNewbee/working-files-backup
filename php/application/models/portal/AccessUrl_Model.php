<?php
class AccessUrl_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
        $this->load->library('PortalSocket');
	}
	function get_list($data) {   
		$query = $this->portalsql->query('select * from portal_urlparameter');
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'settings'=>$query->row_array()
			)
		);       
		return json_encode($arr);
	}
    function edit_url($data) {
        $result = null;
        $arr = array(
            'id'=>element('id',$data,1),
            'basname'=>element('basname',$data,''),
            'userip'=>element('userip',$data,''),
            'usermac'=>element('usermac',$data,''),
            'url'=>element('url',$data,''),
            'basip'=>element('basip',$data,''),
            'ssid'=>element('ssid',$data,''),
            'apmac'=>element('apmac',$data,'')
        );
        $result = $this->portalsql->replace('portal_urlparameter', $arr);
        $result = $result ? json_ok() : json_on('update error');
        return json_encode($result);
    }
}