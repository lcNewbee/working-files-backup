<?php
class DpiEth_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) { 
		$result = null;
		$cgiary = array(
			'page'=>'1',
			'pagesize'=>'20'
		);		
		$ary = array();				
		for($i = 0; $i < 6; $i++){
			$str = "eth".$i;
			$ary[] = $this->gtePram($str);
		}
		$result = ndpi_send_ethx_to_php_db(json_encode($cgiary));
		$cgiary = json_decode($result,true);
		if(is_array($cgiary) && $cgiary['state']['code'] === 2000){
			for($i = 0; $i < 6; $i++){
				foreach($cgiary['data']['list'] as $row){
					if($ary[$i]['ethx_name'] === $row['ethx_name']){
						$row['active_eth'] = 1;
						$ary[$i] = $row;						
					}
				}				
			}	
		}
		$ethstate = $this->get_eth_state();
		for($k = 0; $k < 6; $k++){
			foreach($ary as $res){				
				if($ethstate[$k]['ifname'] === $res['ethx_name']){
					$ary[$k]['active_eth'] = $ethstate[$k]['value'];
					break;
				}
			}
											
		}	
		$retary = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'list'=>$ary
			)			
		);
		return json_encode($retary);	
	}

	function gtePram($ethstr){
		$arr = array(
			'ethx_name'=>$ethstr,
			'eth_bytes'=>'',
			'discarded_bytes'=>'',
			'ip_packets'=>'',
			'ip_bytes'=>'',
			'unique_flows'=>'',
			'tcp_packets'=>'',
			'udp_packets'=>'',
			'vlan_packets'=>'',
			'mpls_packets'=>'',
			'pppoe_packets'=>'',
			'fragmented_packets'=>'',
			'max_packets_size'=>'',
			'packets_size_64'=>'',
			'packets_size_128'=>'',
			'packets_size_256'=>'',
			'packets_size_1024'=>'',
			'packets_size_1500'=>'',
			'packets_size_other'=>'',
			'ndpi_throughput'=>'',
			'guessed_flow_protos'=>'',
			'active_eth'=>0
		);
		return $arr;		
	}

	function get_eth_state(){
		$arr = array(
			array('ifname'=>'eth0','value'=>0),
			array('ifname'=>'eth1','value'=>0),
			array('ifname'=>'eth2','value'=>0),
			array('ifname'=>'eth3','value'=>0),
			array('ifname'=>'eth4','value'=>0),
			array('ifname'=>'eth5','value'=>0),
			array('ifname'=>'eth6','value'=>0)
		);
		$query = $this->db->query('select ndpi_attr.attr_name from ndpi_params left join ndpi_attr on ndpi_params.attr_id = ndpi_attr.id');
		foreach($query->result_array() as $row){
			switch($row['attr_name']){
				case 'ndpi_ifname0' : $arr[0]['value'] = 1;break;
				case 'ndpi_ifname1' : $arr[1]['value'] = 1;break;
				case 'ndpi_ifname2' : $arr[2]['value'] = 1;break;
				case 'ndpi_ifname3' : $arr[3]['value'] = 1;break;
				case 'ndpi_ifname4' : $arr[4]['value'] = 1;break;
				case 'ndpi_ifname5' : $arr[5]['value'] = 1;break;
			}
		}
		return $arr;
	}
	function set_eth($data){
        $result = null;
		$state = (int)element('active_eth',$data);
		$arr = array('interface'=>$data['ethx_name']);
		if($state === 1){			
        	$result = ndpi_set_interface_to_config(json_encode($arr));
		}
		if($state === 0){
			$result = ndpi_del_interface_from_config(json_encode($arr));
		}
        return $result;
    }
}