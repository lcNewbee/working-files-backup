<?php
/**
 * DPI 客户端列表
*/
class DpiMac_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));
    }

    function get_list($data) {
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'), 
            'data' => array(
                'page' => array(), 
                'list' => array()
            )
        );

        $page = element('page', $data, '1');
        $pagesize = element('size', $data, '20');
                
        $cgipar = array(
            'mac' => (string)element('search', $data, ''), 
            'time' => (string)element('timeType', $data, '0'), 
            'pagesize' => (string)$pagesize,
            'page' => (string)$page
        );
        $cgiret = ndpi_send_usermsg(json_encode($cgipar));
        $ary = json_decode($cgiret, TRUE);
        if ($ary['state']['code'] === 2000) {
            //总行
            $total = element('item_num', $ary['data']['page'], 0);
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
            foreach ($ary['data']['list'] as $row) {
                $arr['data']['list'][] = array(
                    'mac' => $row['mac'], 
                    'ip' => $row['ip'], 
                    'name' => '--', 
                    'curRate' => $row['bytes_rate'], //速率
                    'trafficPercent' => $row['flow_account'], //流量百分比
                    'application' => explode("/", $row['proto']), 'ethx' => $row['ethx']
                );
            }
        }
        return json_encode($arr);
    }
}
