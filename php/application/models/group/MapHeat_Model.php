<?php
class MapHeat_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->mysql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {       
        $arr = array(
            'state'=>array('code'=>2000,'msg'=>'ok'),
            'data'=>array(
                'list'=>array(
                    array('lat'=>113.955023,'lng'=>22.556115,'value'=>3),
                    array('lat'=>113.955029,'lng'=>22.556119,'value'=>3),
                    array('lat'=>113.955033,'lng'=>22.556125,'value'=>3),
                    array('lat'=>113.955043,'lng'=>22.556131,'value'=>3),
                    array('lat'=>113.955053,'lng'=>22.556145,'value'=>3),
                    array('lat'=>113.955063,'lng'=>22.558187,'value'=>3),
                    array('lat'=>113.955063,'lng'=>22.557187,'value'=>3),
                    array('lat'=>113.955163,'lng'=>22.556187,'value'=>3),
                    array('lat'=>113.955163,'lng'=>22.559187,'value'=>3),
                    array('lat'=>113.955063,'lng'=>22.556187,'value'=>3),
                    array('lat'=>113.955063,'lng'=>22.556129,'value'=>3),
                    array('lat'=>113.955063,'lng'=>22.556117,'value'=>3),
                    array('lat'=>113.955063,'lng'=>22.556137,'value'=>3),
                    array('lat'=>113.955163,'lng'=>22.556156,'value'=>3),
                    array('lat'=>113.955093,'lng'=>22.559135,'value'=>3),
                    array('lat'=>113.955053,'lng'=>22.556384,'value'=>3),
                    array('lat'=>113.955033,'lng'=>22.556193,'value'=>3),
                    array('lat'=>113.955123,'lng'=>22.559202,'value'=>3),
                    array('lat'=>113.955063,'lng'=>22.556181,'value'=>3),
                    array('lat'=>113.955063,'lng'=>22.558180,'value'=>3)                  
                )
            )   
        );
        return json_encode($arr);
	}           
}