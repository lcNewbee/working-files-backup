<?php
class NetworkPortalRules_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
    function get_portal_rul_list(){                        
        $interface_query=$this->db->select('portal_id,portal_name,attr_name,attr_value')
                    ->from('portal_server')
                    ->join('portal_auth','portal_auth.id=portal_server.portal_id')
                    ->join('portalserver_attr','portalserver_attr.id=portalserver_params.attr_id')
                    ->join('portalserver_params','portal_server.id=portalserver_params.portalserver_id')
                    ->where('attr_name','server_ifname')
                    ->get()->result_array();

        $arr = array();
        foreach($interface_query as $row) {
            $sarr['id'] = $row['portal_id'];
            $sarr['interface_bind'] = $row['attr_value'];
            $sarr['template_name'] = $row['portal_name'];
            $sarr['idle_test'] = '';
            $portal_query = $this->db->select('portal_id,portal_name,attr_name,attr_value')
                                        ->from('portal_auth')
                                        ->join('portal_params','portal_auth.id=portal_params.portal_id')
                                        ->join('portal_attr','portal_attr.id=portal_params.attr_id')
                                        ->where('portal_auth.id',$row['portal_id'])
                                        ->get()->result_array();
            foreach($portal_query as $res) {
                switch($res['attr_name']){
                    case 'auth_maxuser':$sarr['max_usernum'] = $res['attr_value'];break;
                    case 'auth_mode':$sarr['auth_mode'] = $res['attr_value'];break;
                    case 'auth_mask':$sarr['auth_mask'] = $res['attr_value'];break;
                    case 'auth_ipaddr':$sarr['auth_ip'] = $res['attr_value'];break;
                    case 'auth_domain':$sarr['auth_domain'] = $res['attr_value'];break;
                    case 'auth_nasid':$sarr['auth_nasid'] = $res['attr_value'];break;
                    case 'vrrrp_id':$sarr['vrrrp_id'] = $res['attr_value'];break;
                    case 'traffic_flag':$sarr['traffic_flag'] = $res['attr_value'];break;
                    case 'acctinterim_flag':$sarr['acctinterim_flag'] = $res['attr_value'];break; 
                    case 'twoauth_exempt_flag':$sarr['idle_test'] = $res['attr_value'];break;
                }               
            }   
            $arr[] = $sarr;
        }       
        $result=array(
            'state'=>array('code'=>2000,'msg'=>'OK'),
            'data'=>array('list'=>$arr)
        );
        return $result;
        
    }  

    function add_portal_rules($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = portal_set_template_attr(json_encode($temp_data));
        return $result;
    }
    function exit_portal_rules($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = portal_set_template_attr(json_encode($temp_data));
        return $result;
    }
    function del_portal_rules($data) {
        $result = null;
        $temp_data = array(
            'portal_list'=>$data['selectedList']
        );        
        $result = portal_del_template_attr(json_encode($temp_data));
        return $result;
    }
    private function getCgiParam($oriData) {
        $retData = array(
            'template_name'=>(string)element('template_name', $oriData,''),
            'interface_bind'=>(string)element('interface_bind', $oriData,''),
            'max_usernum'=>(string)element('max_usernum', $oriData,''),
            'auth_mode'=>(string)element('auth_mode', $oriData,''),
            'auth_ip'=>(string)element('auth_ip', $oriData,''),
            'auth_mask'=>(string)element('auth_mask', $oriData,''),
            'idle_test'=>(string)element('idle_test', $oriData,'')
        );
        return $retData;
    }  
}