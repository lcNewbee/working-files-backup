<?php
class AccessSsid_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->database();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_list($data) {  
        $parameter = array(
            'db' => $this->portalsql, 
            'columns' => '*', 
            'tablenames' => 'portal_ssid', 
            'pageindex' => (int) element('page', $data, 1), 
            'pagesize' => (int) element('size', $data, 20), 
            'wheres' => "name LIKE '%".$data['search']."%'", 
            'joins' => array(), 
            'order' => array()
        );
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
        $result = $this->portalsql->insert('portal_ssid',$arr);
        $result = $result ? json_ok() : json_no('delete error');
        return json_encode($result);
    }    
    function Delete($data){
        $result = FALSE;
        $dellist = $data['selectedList'];       
        foreach($dellist as $row) {
            $this->portalsql->where('id', $row['id']);
            $result = $this->portalsql->delete('portal_ssid');
        }     
        $result = $result ? json_ok() : json_on('delete error');
        return json_encode($result);
    }
    function Edit($data){
        $result = 0;
        $arr = $this->params($data);        
        $this->portalsql->where('id', $data['id']);
        $result = $this->portalsql->update('portal_ssid', $arr);
        $result = $result ? json_ok() : json_no('edit error');
        return json_encode($result);
    }    
    private function params($data){
        $arr = array(
            'name'=>element('name',$data),
            'address'=>element('address',$data,''),//地址
            'basip'=>element('basip',$data),
            'web'=>element('web',$data),//页面模版
            'des'=>element('des',$data),//描述
            'ssid'=>element('ssid',$data),
            'apmac'=>element('apmac',$data)
        );
        return $arr;
    }
    function get_apinfo(){
        $result = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>array()
            )
        );
        $query = $this->db->query('select id,mac from ap_list');
        if( count($query->result_array()) > 0 ){            
            //获取已设置的apmac
            $macdata = $this->portalsql->query("select id,apmac from portal_ssid");
            if( count($macdata->result_array()) > 0 ){
                $arr = $query->result_array();
                for($i=0; $i< count($arr); $i++){					
                    foreach($macdata->result_array() as $rows) {
                        if( $arr[$i]['mac'] === $rows['apmac']){
							unset($arr[$i]); //去除添加过的mac							
                            break;							
                        }						
                    }					
                }
				$lary = array();
				foreach($arr as $res){
					$lary[] = $res;
				}
                $result['data']['list'] = $lary;
            }else{
                $result['data']['list'] = $query->result_array();
            }
        }       
        return json_encode($result);
    }
}