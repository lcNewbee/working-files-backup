<?php
class DpiMac_Model extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper(array('array', 'my_customfun_helper'));
    }

    function get_list($params){	
        $cgistr = array(
            'mac'=>(string)element('search', $params, ''),
            'time'=>(string)$params['timeType'],
            'pagesize'=>(string)element('size', $params, 20),
            'page'=>(string)element('page', $params, 1)
        );
        $str  = ndpi_send_usermsg(json_encode($cgistr));
        $myAry = json_decode($str,true);
        $total = 0;
        $pagesize = $params['size'];
        $page = $params['page'];
        $datalist = array();
        if($myAry['state']['code'] == 2000){
            $total = $myAry['data']['page']['item_num'];
            $datalist = $myAry['data']['list'];
            //计算总页
            $totalPage = intval($total / $pagesize);
            if (($total % $pagesize) > 0) {
                $totalPage = $totalPage + 1;
            }
            $retdata = array();
            foreach($datalist as $row){
                $mary['mac'] = $row['mac'];
                $mary['ip'] = $row['ip'];            
                $mary['curRate'] = $row['bytes_rate'];
                $mary['trafficPercent'] = $row['flow_account'];
                $mary['application'] = explode("/", $row['proto']);
                $mary['name'] = '--';
                $retdata[] = $mary;                      
            }
            $arrMM = array(
                'state' => array('code'=>2000,'msg'=>'ok'),
                'data' => array(
                    'page' => array(
                        'startline' => 1, 
                        'size' => $pagesize, 
                        'currPage' => $page, 
                        'total' => $total,
                        'totalPage' => $totalPage,                
                        'nextPage' => $page + 1, 
                        'lastline' => $totalPage, // 最后一页
                    ),
                    'list' => $retdata
                )
            );
            return json_encode($arrMM);
        }
        return json_encode(array('state'=>array('code'=>2000,'msg'=>'ok'),'data'=>array('page'=>array(),'list'=>array())));          
    }
}
