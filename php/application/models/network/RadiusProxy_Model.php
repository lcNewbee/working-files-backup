<?php
class RadiusProxy_Model extends CI_Model {
    public function __construct() {
        parent::__construct();		
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {  
        $enable = 0; 
        $temlate_name = '';        
        $datacfg = $this->db->select('radsec_params.attr_value,radsec_attr.attr_name')
                            ->from('radsec_list')
                            ->join('radsec_params','radsec_list.id=radsec_params.radsec_id','left')
                            ->join('radsec_attr','radsec_params.attr_id=radsec_attr.id','left')
                            ->get()->result_array();

        if(count($datacfg) > 0){
            foreach($datacfg as $row){
                if($row['attr_name'] === 'radsec_enable'){
                    $enable = $row['attr_value'];
                }
                if($row['attr_name'] === 'radiustemplate'){
                    $temlate_name = $row['attr_value'];
                }
            }
        }
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'settings'=>array(
                    'enable'=>$enable,
                    'template_name'=>$temlate_name
                )
            )            
        );
        return json_encode($arr);
    }
    function setting($data) {
        $result = null;
        $cgiary = array(
            'radsec_enable'=>(string)element('radsec_enable',$data,1),
            'radius_template'=>(string)element('radius_template',$data)
        );
        $result = radsec_set_radsecproxy_info(json_encode($cgiary));
        return $result;
    }
}