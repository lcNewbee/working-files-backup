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
            'time' => (string)element('timeType', $data, 0)
        );
        $ary = array();
        $port_list = $this->db->query("select portid,port_name from port_table")->result_array();
        $port_sum = count($port_list);
        for ($i = 0;$i < $port_sum;$i++) {
            $str = "eth" . $i;
            $ary[] = $this->gtePram($str);
        }
        $result = ndpi_send_ethxmsg(json_encode($cgiary));
        $cgiary = json_decode($result, true);
        if (is_array($cgiary) && $cgiary['state']['code'] === 2000) {
            for ($i = 0;$i < $port_sum;$i++) {
                foreach ($cgiary['data']['list'] as $row) {
                    if ($ary[$i]['ethx_name'] === $row['ethx']) {
                        $tary['active_eth'] = "1";
                        $tary['ethx_name'] = $row['ethx'];
                        $tary['userNum'] = $row['usernum'];
                        $tary['application'] = $row['protos'] === 'null' ? array() : explode("/", $row['protos']);
                        $tary['curRate'] = $row['bytes_rate'];
                        $ary[$i] = $tary;
                    }
                }
            }
        }
        //获取网卡状态
        $ethstate = $this->getEthState();
        for ($k = 0;$k < $port_sum;$k++) {
            foreach ($ary as $res) {
                if ($ethstate[$k]['ifname'] === $res['ethx_name']) {
                    $ary[$k]['active_eth'] = (string)$ethstate[$k]['value'];
                    break;
                }
            }
        }
        //获取点击后数据
        $ethmac = $this->getEthAllMac($data);
        $retary = array(
            'state' => array('code' => 2000, 'msg' => 'ok'), 
            'data' => array(
                'page' => $ethmac['page'], 
                'list' => $ary, 
                'ethxClientList' => $ethmac['data']
            )
        );
        return json_encode($retary);
    }
    //获取网卡状态
	private function getEthState(){
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
    //获取指定端口信息    ndpi_send_ethxmsg_usrnum 
    private function getEthAllMac($data){
        $result = array(
            'page'=>array(),
            'data'=>array()
        );

        $page = element('page', $data, 1);
        $pagesize = element('size', $data, 20);
        $cgiarr = array(
            'time'=>(string)element('timeType',$data),
            'page'=>(string)$page,
            'pagesize'=>(string)$pagesize,
            'ethx'=>(string)element('ethx',$data,'eth0'),
        );
        $cgidata = ndpi_send_ethxmsg_usrnum(json_encode($cgiarr));
        $dataary = json_decode($cgidata,TRUE);
        if(is_array($dataary) && $dataary['state']['code'] === 2000){
            //总行
            $total = element('item_num', $dataary['data']['page'], 0);
            //计算总页
            $totalPage = intval($total / $pagesize);
            if (($total % $pagesize) > 0) {
				$totalPage = $totalPage + 1;
			}
            $result['page'] = array(
                'startline' => 1, 
                'size' => $pagesize, 
                'currPage' => $page, 
                'total' => $total,
                'totalPage' => $totalPage,                
                'nextPage' => $page + 1, 
                'lastline' => $totalPage, // 最后一页
            );

            $macAry = array();
            foreach($dataary['data']['list'] as $row){
                $row['application'] =  explode('/',$row['proto']);
                $row['trafficPercent'] = $row['flow_account'];
                $row['curRate'] = $row['bytes_rate'];
                $row['mac'] = $row['mac'];
                $row['ip'] = $row['ip'];
                $macAry[] = $row;
            }
            $result['data'] = $macAry;
        }
        return $result;
    }
    private function gtePram($ethstr){
		$arr = array(
            'ethx_name'=>$ethstr,
            'userNum'=>0,
            'application'=>array(),
            'curRate'=>'',
            'active_eth'=>''
        );
		return $arr;
	}
}
