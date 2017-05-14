<?php
class DpiProto_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	function get_list($data) {   
		$result = null;
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'list'=>array(),
				'protoClientList'=>array()
			)
		); 
		$cgiary = array(
			'page'=>(string)element('page',$data,1),
			'time'=>(string)element('timeType',$data,0),
			'pagesize'=>(string)element('size',$data,20)
		);		
		$result = ndpi_send_proto_to_php_db(json_encode($cgiary));	 
		$cgiobj = json_decode($result);			
		if(is_object($cgiobj) && $cgiobj->state->code === 2000){
			$htmdata = array();
			$sumbts = 0.01;//总流量
			$lsary = array();
			foreach($cgiobj->data->list as $res){
				$sumbts = $sumbts + (int)$res->bytes;
			}
			foreach($cgiobj->data->list as $row){
				$lsary['attr_name'] = $row->attr_name;
				$lsary['curRate'] = $row->bytes_speed;
				$lsary['userNum'] = $row->user_num;
				$lsary['trafficPercent'] = round(($row->bytes / $sumbts)*100,2).'%';
				$htmdata[] = $lsary;
			}
			$htmdata = $this->sigcol_arrsort($htmdata,'trafficPercent',SORT_DESC);
			$arr['data']['list'] = $htmdata;
			$arr['data']['protoClientList'] = $this->get_detailed($data);
		}else{
			return json_no($cgiobj->state->msg);
		}		     	
		return json_encode($arr);			
	}
	private function get_detailed($data){
		$result = array();
		$cgiary = array(
			'page'=>(string)element('page',$data,1),
			'time'=>(string)element('timeType',$data,0),
			'proto_type'=>(string)element('proto',$data),
			'pagesize'=>(string)element('size',$data,20)
		);
		$cgiret = ndpi_send_one_proto_all_macMsg_to_php(json_encode($cgiary));
		$arr = json_decode($cgiret,true);
		if(is_array($arr) && $arr['state']['code'] === 2000){
			$htmdata = array();
			$sumbts = $arr['data']['total_msg']['sum_all_mac_bytes'];
			foreach($arr['data']['list'] as $row){
				$htmdata['mac'] = $row['mac'];
				$htmdata['ip'] = $row['ip'];
				$htmdata['osType'] = '--';
				$htmdata['ethx_name'] = '--'; // 该客户端所在端口
				$htmdata['curRate'] = $row['mac_speed'];
				$htmdata['traffic'] = $row['mac_sum_bytes']; // 该客户端使用当前应用的流量
				$htmdata['trafficPercent'] = round((($row['mac_sum_bytes'] / $sumbts)*100),2).'%';
				$result[] = $htmdata;
			}
			if($result){
				$result = $this->sigcol_arrsort($result,'trafficPercent',SORT_DESC);
			}
		}
		return $result;
	}
	/**
	 * 排序
	 * @data 二维数组
	 * @col 排序列
	 * @type SORT_DESC/SORT_ASC
	 */
	function sigcol_arrsort($data,$col,$type=SORT_DESC){
		if(is_array($data)){
			$i=0;
			foreach($data as $k=>$v){
				if(key_exists($col,$v)){
					$arr[$i] = $v[$col];
					$i++;
				}else{
					continue;
				}
			}
		}else{
			return false;
		}
		array_multisort($arr,$type,$data);
		return $data;
	}	
}