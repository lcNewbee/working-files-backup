<?php
class DpiSettings_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'db_operation'));
	}
	function get_list($data) {
		$result = null; 
        $arr = array(
            'state' => array('code'=>2000,'msg'=>'ok'),
            'data' => array(    
                'settings' => array(
                    'ethNumber' => $this->getPortSum(),
                    'ndpiEnable' => $this->get_ndpi_state()
                ),                            
            )
        );   
        $ethary = $this->get_eth_state();        
        foreach($ethary as $row){            
            $arr['data']['settings'][$row['ifname'].'Enable'] = $row['value'];
        }
        return json_encode($arr);
	}
    function setting($data){
        $ret = null;
        $value = $data['ndpiEnable'] === '0' ? 'off' : 'on';
        $cgiprm = array(
            'onoff'=>$value
        );
        $result = ndpi_set_switch_to_config(json_encode($cgiprm));
        $loginfo = array(
            'type' => 'Setting', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Setting  DPI switch:" . $value, 
            'operationResult' => preg_replace('#\s+#', '',trim($result)),
            'description' => json_encode($cgiprm)
        );
        Log_Record($this->db, $loginfo);
        return $result;
    }
    function active($data){
        $result = null;
		$state = (string)element('active_eth',$data);
		$arr = array('interface'=>$data['ethx_name']);
		if($state === "1"){
        	$result = ndpi_set_interface_to_config(json_encode($arr));
		}
		if($state === "0"){
			$result = ndpi_del_interface_from_config(json_encode($arr));
		}
        $loginfo = array(
            'type' => 'Setting', 
            'operator' => element('username', $_SESSION, ''), 
            'operationCommand' => "Setting  DPI->interface switch:" . $state, 
            'operationResult' => preg_replace('#\s+#', '',trim($result)),
            'description' => json_encode($arr)
        );
        Log_Record($this->db, $loginfo);
        return $result;
    }

    private function get_ndpi_state(){
        $result = 0;
        $query = $this->db->query("select id,attr_value from ndpi_params where attr_id=(select id from ndpi_attr where attr_name='ndpi_enable')");
        if(count($query->result_array()) > 0 ){
            $result = $query->result_array()[0]['attr_value'];
        }
        return $result;
    }
    private function get_eth_state(){
        $query=$this->db->select('attr_name,attr_value')
                        ->from('ndpi_attr')
                        ->join('ndpi_params','ndpi_params.attr_id = ndpi_attr.id')
                        ->get()->result_array();
        $interfaces  = array();
        foreach ($query as $v){
            $interfaces[$v['attr_name']]=$v['attr_value'];
        }
        $arr = array(
                array('ifname'=>'eth0','value'=>0),
                array('ifname'=>'eth1','value'=>0),
                array('ifname'=>'eth2','value'=>0),
                array('ifname'=>'eth3','value'=>0),
                array('ifname'=>'eth4','value'=>0),
                array('ifname'=>'eth5','value'=>0),
                array('ifname'=>'eth6','value'=>0)
            );
        foreach ($interfaces as $k=>$v ){
            for($i = 0; $i < 6; $i++){
                if($arr[$i]['ifname']==$interfaces[$k]){
                    $arr[$i]['value'] = 1;
                }
            }
        }
		return $arr;
	}
    private function getPortSum(){
        $sum = 6;
        $query = $this->db->query('select portid from port_table')
                        ->result_array();
        if(count($query) > 0){
            return count($query);
        }
        return $sum;
    }
}
