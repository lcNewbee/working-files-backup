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
						$row['active_eth'] = "1";
						$ary[$i] = $row;
					}
				}
			}
		}
		$ethstate = $this->get_eth_state();
		for($k = 0; $k < 6; $k++){
			foreach($ary as $res){
				if($ethstate[$k]['ifname'] === $res['ethx_name']){
					$ary[$k]['active_eth'] =(string)$ethstate[$k]['value'];
					break;
				}
			}

		}

    // 获取历史数据
    $cgiprm = array(
        'ethx'=>(string)element('ethx',$data,'eth0'),
        "set_interval_times" =>(string)element('set_interval_times',$data,0),
        'days'=> (string)element('timeType',$data,0)
    );
    $ethx_history_result = ndpi_send_ethx_history_statistics(json_encode($cgiprm));
    $ethx_history_result_array = json_decode($ethx_history_result,true);
    $upFlowList = array();
    if($ethx_history_result_array['state']['code'] === 2000){
      foreach ($ethx_history_result_array as $key => $val){
        for($i=0;$i< sizeof($ethx_history_result_array['data']['list']);$i++){
          $upFlowList[$i]=$ethx_history_result_array['data']['list'][$i]['throughput'];
        }
      }
    } else{
        $j=(int)$data['timeType'];
        if($j==0||$j==1){
          for($i=0;$i<=24;$i++){
          $upFlowList[$i]=0;
          }
        }
        else{
          for($i=0;$i<=$j;$i++){
            $upFlowList[$i]=0;
          }
        }
    }
		$retary = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'list'=>$ary,
        'upFlowList'=> $upFlowList
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


	function set_eth($data){
        $result = null;
		$state = (string)element('active_eth',$data);
		$arr = array('interface'=>$data['ethx_name']);
		if($state === "1"){
        	$result = ndpi_set_interface_to_config(json_encode($arr));
		}
		if($state === "0"){
			$result = ndpi_del_interface_from_config(json_encode($arr));
		}
        return $result;
    }
}
