<?php
class NetworkDhcpRelay_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_dhcp_relay_list() {
        $result = null;
        $arr = array();
        $querydata = $this->db->select('dhcprelay_params.attr_value,dhcprelay_attr.attr_name')
                                ->from('dhcprelay_params')
                                ->join('dhcprelay_attr','dhcprelay_params.dhcprelay_attr_id=dhcprelay_attr.id','left')
                                ->get()->result_array();
        
        foreach( $querydata as $row ) {   
            switch($row['attr_name']) {
                case 'switch' : $arr['relay_enable'] = $row['attr_value'];break;
                case 'server_name' : $arr['dhcp_server'] = $row['attr_value'];break;
                case 'reserver_server' : $arr['referral_server'] = $row['attr_value'];break;
                case 'op82_sub1' : $arr['option82_1'] = trim($row['attr_value']);break;
                case 'op82_sub2' : $arr['option82_2'] = $row['attr_value'];break;                    
            }     
        }            
        $result = array(
            'state' => array('code' => 2000,'msg' => 'ok'),
            'data' => array(
                'settings' => $arr
            )
        );
        return $result;
    }

    function set_dhcp_relay($data) {
        $result = null;
        $cgiary = array(
            'switch' => $data['relay_enable'] == '1' ? "on" : "off",
            'server_name' => (string)element('dhcp_server',$data,''),
            'reserver_server' => (string)element('referral_server',$data,''),
            'op82_sbu1' => (string)element('option82_1',$data,''),
            'op82_sbu2' => (string)element('option82_2',$data,'')
        );
        $result = dhcprelay_msg_from_web(json_encode($cgiary));
        //log
        $cgiObj = json_decode($result);			
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            $logary = array(
                'type'=>'Setting',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Setting DHCP Relay".$cgiary['server_name'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
}
