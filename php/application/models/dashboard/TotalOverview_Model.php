<?php
date_default_timezone_set("PRC");
class TotalOverview_Model extends CI_Model {
	public function __construct() {
        parent::__construct();
        $this->load->library('session');
		$this->load->database();
        $this->load->helper(array('array', 'db_operation'));    
        $this->mysql = $this->load->database('mysqli', TRUE);  
    }
    
    function get_list($data) {    
        
        $arr = array(
            'state' => array('code' => 2000,'msg' => 'ok'),
            'data' => array(
                'common' => array(
                    'groups' => array(
                        array('id'=>'1','name'=>'name1'),
                        array('id'=>'2','name'=>'name2'),
                        array('id'=>'3','name'=>'name3')
                        
                    ),
                    'onlineAp' => '10',
                    'totalAp' => '20',
                    'clients' => '100',
                    'alarms' => '20'
                ),
                'mapView' => $this->getMapView(),
                'wirelessTrend' => $this->getWirelessTrend(),
                'wiredStatus' => $this->getWiredStatus(),
                'usrAnalysis' => $this->getUsrAnalysis(),
                'ssidAnalysis' => $this->getSsidAnalysis(),
                'alarms' => $this->getAlarms()
            )
        );
        return json_encode($arr);
    }
    
    private function getMapView(){
        $arr = array(
            'clients2g' => '20', // 2.4G关联用户数
            'usr2g' => '10', // 2.4G认证用户数
            'clients5g' => '30', // 5G关联用户数
            'usr5g' => '20', // 5G认证用户数
            'aps' => array(
                array(
                    'status' => '0', // or '1' 表示在线或离线
                    'mac' => '00:11:22:33:44:55',
                    'group' => '1', // 所属组
                    'ip' => '192.168.0.1',
                    'x' => '20%', // 横坐标
                    'y' => '30%', // 纵坐标
                ),
                array(
                    'status' => '1', // or '1' 表示在线或离线
                    'mac' => '22:11:22:33:44:55',
                    'group' => '2', // 所属组
                    'ip' => '192.168.0.2',
                    'x' => '50%', // 横坐标
                    'y' => '60%', // 纵坐标
                )
            )
        );
        return $arr;
    }

    private function getWirelessTrend(){
        $arr = array(
            'flowData' => [814895, 822992, 830798, 839768, 848447, 855089, 863768, 871865, 879671, 888641, 896738, 907522],
            'timeData' => ['2017/6/22 1:46', '2017/6/22 1:48', '2017/6/22 1:50', '2017/6/22 1:52', '2017/6/22 1:54', '2017/6/22 1:56',
            '2017/6/22 1:58', '2017/6/22 2:00', '2017/6/22 2:02', '2017/6/22 2:04', '2017/6/22 2:06', '2017/6/22 2:08']
        );
        return $arr;
    }

    private function getWiredStatus(){
        $arr = array(
            'interfaceList' => array( // 有几个接口，数组就有几项数据
                array(
                    'name' => 'eth1',
                    'enable' => '1',
                    'ip' => '192.168.0.1',
                    'mac' => '00:00:39:38:23:23',
                    'users' => '123',
                    'negoSpeed' => '100',
                    'rate' => '50Mbps',
                    'upRate' => '50Mbps',
                    'downRate' => '50Mbps'
                ),
                array(
                    'name' => 'eth3',
                    'enable' => '1',
                    'ip' => '192.168.0.1',
                    'mac' => '00:00:39:38:23:23',
                    'users' => '123',
                    'negoSpeed' => '100',
                    'rate' => '50Mbps',
                    'upRate' => '50Mbps',
                    'downRate' => '50Mbps'
                ),
            ),
            'flowData' => array( // 返回所请求接口近24小时的上下行数据
                'name' => 'eth0',
                'downloadFlow' => [814895, 822992, 830798, 839768, 848447, 855089, 863768, 871865, 879671, 888641, 896738, 907522], // 过去24小时，每小时统计一次下载量
                'uploadFlow' => [814895, 822992, 830798, 839768, 848447, 855089, 863768, 871865, 879671, 888641, 896738, 907522], // 同downloadFlow
                'timeData' => ['2017/6/22 1:46', '2017/6/22 1:48', '2017/6/22 1:50', '2017/6/22 1:52', '2017/6/22 1:54', '2017/6/22 1:56',
                    '2017/6/22 1:58', '2017/6/22 2:00', '2017/6/22 2:02', '2017/6/22 2:04', '2017/6/22 2:06', '2017/6/22 2:08'] // 
            )
        );
        return $arr;
    }
    private function getUsrAnalysis(){
        $arr = array(
            'apClientsTop7' => array( // AP用户数top 7
                'Axilspot1' => '54',
                'Axilspot2' => '46',
                'Axilspot2' => '43',
                'Axilspot2' => '40',
                'Axilspot2' => '33',
                'Axilspot2' => '29',
                'Axilspot2' => '21',
            ),
            'clientType' => array(
                'HuaWei' => '50',
                'XiaoMi' => '30',
                'iPhone' => '40'
            )
        );
        return $arr;
    }
    private function getSsidAnalysis(){
        $arr = array(
            'ssidFlow' => array( // 每个ssid的流量(ssid名称： 流量)
                'hotspot' => '123456',
                'guest' => '4321',
            ),
            'ssidClients' => array( // 每个ssid的客户端个数
                'hotspot' => '100',
                'guest' => '30',
            )
        );
        return $arr;
    }
    private function getAlarms(){
        $arr = array(
            'alarms' => array(
                'page' => array(
                    'total' => '40',
                    'totalPage' => '4',
                    'currPage' => '3'
                ),
                'list' => array( // 每页返回十条
                    array(
                        'time' => '2017/03/09 00:00:00',
                        'type' => '1',
                        'activities' => '....' // 告警信息
                    )
                    // {..共十条..}
                )                
            )
        );
        return $arr;
    }
}

