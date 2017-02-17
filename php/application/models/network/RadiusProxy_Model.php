<?php
class RadiusProxy_Model extends CI_Model {
    public function __construct() {
        parent::__construct();		
        $this->load->helper(array('array', 'my_customfun_helper'));
    }
    function get_list($data) {   
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'settings'=>array(
                    'enable'=>'1',
                    'temlate_name'=>'radius_test_server'
                )
            )            
        );
        return json_encode($arr);
    }
    function setting($data) {
        $result = null;
        $cgiary = array(
            'radsec_enable'=>(string)element('enable',$data,1),
            'radius_template'=>element('nasip',$data)
        );
        $result = radsec_set_radsecproxy_info(json_encode($cgiary));
        return $result;
    }
}