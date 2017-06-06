<?php
class DpiProto_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}

	function get_list($data) {
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page' => array(),// 应用信息列表分页信息
				'clientPage' => array(),// 特定应用下客户端列表分页信息
				'list' => array(),
				'protoClientList' => array()
			)
		);
		$page = element('page', $data, 1);
        $pagesize = element('size', $data, 20);
		$cgipar = array(
			'time' => (string)element('timeType', $data, '0'),
			'page' => (string)$page,
			'pagesize' => (string)$pagesize
		);
		//主列表
		$cgiret = ndpi_send_protomsg(json_encode($cgipar));
		$cgiary = json_decode($cgiret, TRUE);
		if($cgiary['state']['code'] === 2000) {
			//总行
            $total = element('item_num', $cgiary['data']['page'], 0);
            //计算总页
            $totalPage = intval($total / $pagesize);
            if (($total % $pagesize) > 0) {
				$totalPage = $totalPage + 1;
			}
			$arr['data']['page'] = array(
                'startline' => 1, 
                'size' => $pagesize, 
                'currPage' => $page, 
                'total' => $total,
                'totalPage' => $totalPage,                
                'nextPage' => $page + 1, 
                'lastline' => $totalPage, // 最后一页
            );
			foreach($cgiary['data']['list'] as $row){
				$arr['data']['list'][] = array(
					'attr_name' => $row['proto'],
					'curRate' => $row['bytes_rate'],
					'userNum' => $row['usernum'],
					'trafficPercent' => $row['flow_account']
				);
			}
		}

		//获取指定数据 ndpi_send_protomsg_usrnum
		$modalPage = element('modalPage', $data, 1);
        $modalSize = element('modalSize', $data, 20);
		$cgipar_user = array(
			'time' => (string)element('timeType', $data, '0'),
			'proto' => (string)element('proto', $data, 'HTTP'),
			'page' => (string)$modalPage,
			'pagesize' => (string)$modalSize
		);
		$cgiret_user = ndpi_send_protomsg_usrnum(json_encode($cgipar_user));
		$cgiary_user = json_decode($cgiret_user, TRUE);
		if($cgiary_user['state']['code'] === 2000){
			//总行
            $total = element('item_num', $cgiary_user['data']['page'], 0);
            //计算总页
            $totalPage = intval($total / $modalSize);
            if (($total % $modalSize) > 0) {
				$totalPage = $totalPage + 1;
			}
			$arr['data']['clientPage'] = array(
                'startline' => 1, 
                'size' => $modalSize, 
                'currPage' => $modalPage, 
                'total' => $total,
                'totalPage' => $totalPage,                
                'nextPage' => $modalPage + 1, 
                'lastline' => $totalPage, // 最后一页
            );
			foreach($cgiary_user['data']['list'] as $row){
				$arr['data']['protoClientList'][] = array(
					'mac' => $row['mac'],
					'ip' => $row['ip'],
					'osType' => '--',
					'ethx_name' => '--',
					'curRate' => $row['bytes_rate'],
					'trafficPercent' => $row['flow_account']
				);
			}			
		}
		return json_encode($arr);		
	}		
}