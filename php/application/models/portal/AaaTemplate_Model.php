<?php
class AaaTemplate_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));
	}
    function get_list() {
        $result = null;
        $query=$this->db->select('domain_id,domain_name,attr_name,attr_value')
                        ->from('domain_params')
                        ->join('domain_list','domain_list.id=domain_params.domain_id')
                        ->join('domain_attr','domain_attr.id=domain_params.attr_id')
                        ->get()->result_array();

        $state=array(
            'code'=>2000,
            'msg'=>'OK'
        );

        $keyname = array(
            'auth_access_type'=>'auth_accesstype',
            'auth_scheme_type'=>'auth_schemetype',
            'template_name'=>'radius_template'
        );
        $interfaces  = array();
        foreach($query as $v){
            $interfaces[$v['domain_id']]['id'] = $v['domain_id'];
            $interfaces[$v['domain_id']]['domain_name'] = $v['domain_name'];
            $interfaces[$v['domain_id']][$v['attr_name']]= $v['attr_value'];
            foreach($keyname as $k1=>$v1){
                if($k1==$v['attr_name']) {
                    unset($interfaces[$v['domain_id']][$v['attr_name']]);
                    $interfaces[$v['domain_id']][$v1]=$v['attr_value'];
                }
            }
        }
        $interfaces_data=array_values($interfaces);
        $result=array(
            'state' => $state,
            'data' => array(
                'list' => $interfaces_data
            )
        );
        return $result;
    }

    function add($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = aaa_add_template_name(json_encode($temp_data));
        return $result;
    }
    function del($data) {
        $result = null;
        $temp_data = array(
            'aaa_list' => $data['selectedList']
        );
        $result = aaa_del_template_name(json_encode($temp_data));
        return $result;
    }
    function edit($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = aaa_edit_template_name(json_encode($temp_data));
        return $result;
    }

    private function getCgiParam($data) {
        $retData = array(
            'template_name'=>element('domain_name', $data),
            'auth_accesstype'=>element('auth_accesstype', $data),
            'auth_schemetype'=>element('auth_schemetype', $data),
            'radius_template'=>element('radius_template', $data)
        );
        return $retData;
    }
}