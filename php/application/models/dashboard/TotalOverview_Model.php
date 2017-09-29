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
            'data' => array()
        );
        $section = element('section', $data, 'all');
        switch($section){
            case 'mapView' : $arr['data']['mapView'] =  $this->getMapView($data);
                break;
            case 'wirelessTrend' : $arr['data']['wirelessTrend'] =  $this->getWirelessTrend($data);
                break;
            case 'wiredStatus' : $arr['data']['wiredStatus'] =  $this->getWiredStatus($data);
                break;
            case 'clientAnalysis' : $arr['data']['usrAnalysis'] =  $this->getUsrAnalysis($data);
                break;
            case 'ssidAnalysis' : $arr['data']['ssidAnalysis'] =  $this->getSsidAnalysis($data);
                break;
            case 'alarms' : $arr['data']['alarms'] =  $this->getAlarms($data);
                break;
            default :
                $arr['data']['common'] = $this->getCommon($data);
                $arr['data']['mapView'] = $this->getMapView($data);
                $arr['data']['wirelessTrend'] = $this->getWirelessTrend($data);
                $arr['data']['wiredStatus'] = $this->getWiredStatus($data);
                $arr['data']['usrAnalysis'] = $this->getUsrAnalysis($data);
                $arr['data']['ssidAnalysis'] = $this->getSsidAnalysis($data);
                $arr['data']['alarms'] = $this->getAlarms($data);
                break;
        }
        
        return json_encode($arr);
    }

    private function getCommon($data){
        $arr = array(
            'groups' => array(
                array('id'=>'1','name'=>'大族创新大厦A栋'),
                array('id'=>'2','name'=>'龙岗冈贝小区'),
                array('id'=>'3','name'=>'仙湖植物园')                        
            ),
            'onlineAp' => ''.rand(16,23),
            'totalAp' => '26',
            'clients' => ''.rand(150,300),
            'alarms' => ''.rand(7,25)
        );
        return $arr;
    }

    private function getMapView($data){
        $arr = array(
            'clients2g' => '79', // 2.4G关联用户数
            'usr2g' => '36', // 2.4G认证用户数
            'clients5g' => '56', // 5G关联用户数
            'usr5g' => '29', // 5G认证用户数
            'aps' => array(
                array(
                    'status' => '1', // or '1' 表示在线或离线
                    'mac' => '00:11:22:33:44:55',
                    'group' => '1', // 所属组
                    'ip' => '192.168.10.1',
                    'x' => '20%', // 横坐标
                    'y' => '30%', // 纵坐标
                ),
                array(
                    'status' => '1', // or '1' 表示在线或离线
                    'mac' => 'e2:45:21:bd:3a:b9',
                    'group' => '1', // 所属组
                    'ip' => '192.168.10.2',
                    'x' => '50%', // 横坐标
                    'y' => '55%', // 纵坐标
                ),
                array(
                    'status' => '1', // or '1' 表示在线或离线
                    'mac' => 'ac:11:b3:33:4f:55',
                    'group' => '1', // 所属组
                    'ip' => '192.168.10.3',
                    'x' => '40%', // 横坐标
                    'y' => '20%', // 纵坐标
                ),
                array(
                    'status' => '0', // or '1' 表示在线或离线
                    'mac' => '6c:21:b5:b3:bf:55',
                    'group' => '1', // 所属组
                    'ip' => '192.168.10.23',
                    'x' => '64%', // 横坐标
                    'y' => '40%', // 纵坐标
                )        
            )
            
        );
        /*
        $index = rand(5,8);
        while($index > 0){
            $arr['aps'][] = array(
                'status' => ''.rand(0,1), // or '1' 表示在线或离线
                'mac' => rand(0,99).':'.rand(0,99).':c5:34:b5:'.rand(0,99),
                'group' => '1', // 所属组
                'ip' => '192.168.100.'.rand(1,255),
                'x' => rand(0,99) . '%',
                'y' => rand(0,99) . '%'
            );
            $index--;
        }
        */
        return $arr;
    }

    private function getWirelessTrend($data){
        //上下行
        $direction = element('direction', $data, 'tx');        
        //时间段 默认1小时
        $timeRange = element('timeRange', $data, 1);
        $timeRange = $timeRange == 1 ? 20 : $timeRange;
        $arr = array(
            'flowData' => array(),
            'timeData' => array()
        );

        $str = 5000;
        $end = 8000;
        if($direction === 'rx'){
            $str = 2000;
            $end = 3000;
        }else if( $direction === 'tx+rx'){
            $str = 8000;
            $end = 15000;
        }

        $index = 0;        
        while($index < $timeRange){
            if($timeRange == 20){
                $j = ($timeRange - $index) * 3;
                $arr['flowData'][] = ''.rand($str,$end);
                $arr['timeData'][] = ''.date("Y-m-d H:i:s",strtotime("-{$j} minute"));
            }else{
                $j = $timeRange - $index;
                $arr['flowData'][] = ''.rand($str,$end);
                $arr['timeData'][] = ''.date("Y-m-d H:i:s",strtotime("-{$j} hour"));
            }
            $index++;            
        }        
        return $arr;
    }

    private function getWiredStatus($data){
        $interfaceName = element('interfaceName', $data, 'eth0');
        $arr = array(
            'interfaceList' => array( // 有几个接口，数组就有几项数据
                array(
                    'name' => 'eth0',
                    'enable' => '1',
                    'ip' => '192.168.100.16',
                    'mac' => 'c2:B4:15:3A:F7:C5',
                    'users' => ''.rand(80,200),
                    'negoSpeed' => '1000',
                    'rate' => '50Mbps',
                    'upRate' => rand(5000,15000).'Mbps',
                    'downRate' => rand(15000,50000).'Mbps',
                ),
                array(
                    'name' => 'eth1',
                    'enable' => '1',
                    'ip' => '192.168.200.16',
                    'mac' => 'b4:c5:ab:45:4e:0c',
                    'users' => ''.rand(80,200),
                    'negoSpeed' => '1000',
                    'rate' => '50Mbps',
                    'upRate' => rand(5000,15000).'Mbps',
                    'downRate' => rand(15000,50000).'Mbps',
                ),
                array(
                    'name' => 'eth2',
                    'enable' => '1',
                    'ip' => '192.168.86.11',
                    'mac' => 'C7:10:7A:F1:78:70',
                    'users' => ''.rand(80,200),
                    'negoSpeed' => '1000',
                    'rate' => '50Mbps',
                    'upRate' => rand(5000,15000).'Mbps',
                    'downRate' => rand(15000,50000).'Mbps',
                ),
                array(
                    'name' => 'eth3',
                    'enable' => '1',
                    'ip' => '192.168.26.100',
                    'mac' => '17:D9:18:6F:56:EF',
                    'users' => ''.rand(80,200),
                    'negoSpeed' => '1000',
                    'rate' => '50Mbps',
                    'upRate' => rand(5000,15000).'Mbps',
                    'downRate' => rand(15000,50000).'Mbps',
                ),
                array(
                    'name' => 'eth4',
                    'enable' => '1',
                    'ip' => '192.168.214.19',
                    'mac' => 'DA:85:27:0A:28:10',
                    'users' => ''.rand(80,200),
                    'negoSpeed' => '1000',
                    'rate' => '50Mbps',
                    'upRate' => rand(5000,15000).'Mbps',
                    'downRate' => rand(15000,50000).'Mbps',
                ),
                array(
                    'name' => 'eth5',
                    'enable' => '',
                    'ip' => '192.168.59.15',
                    'mac' => 'EC:C4:EE:B4:77:59',
                    'users' => ''.rand(80,200),
                    'negoSpeed' => '1000',
                    'rate' => '50Mbps',
                    'upRate' => rand(5000,15000).'Mbps',
                    'downRate' => rand(15000,50000).'Mbps',
                ),
            ),
            'flowData' => array( // 返回所请求接口近24小时的上下行数据
                'name' => $interfaceName,
                'downloadFlow' => array(), // 过去24小时，每小时统计一次下载量
                'uploadFlow' => array(), // 同downloadFlow
                'timeData' => array()
            )
        );
        $index = 0;
        while($index < 24){
            $j = 24 - $index;
            $arr['flowData']['downloadFlow'][] = rand(20000,50000);
            $arr['flowData']['uploadFlow'][] = rand(10000,30000);
            $arr['flowData']['timeData'][] = date('Y-m-d H:i:s',strtotime("-{$j} hour"));
            $index++;
        }
        return $arr;
    }
    private function getUsrAnalysis($data){
        $arr = array(
            'clientsNumber' => 12,
			'online' => 121,
			'offline' => 29,
			'apClientsTop7' => array( // AP用户数top 7
                'A栋-1区' => rand(3,16),
                'A栋-2区' => rand(3,16),
                'A栋-10区' => rand(3,16),
                'A栋-4区' => rand(3,16),
                'A栋-8区' => rand(3,16),
                'A栋-展览区' => rand(3,16),
                'A栋-大厅' => rand(3,16),
            ),
			'clientType' => array(
				'HuaWei' => 24,
				'XiaoMi' => 19,
                'iPhone' => 36,
                'VoVi'	 => 12,
                'OPPO'	 => 14,
                'ZET'	 => 7,
                'MEIZU'	 => 8,
                'Lenovo' => 1
            )
        );
        return $arr;
    }
    private function getSsidAnalysis($data){
        $arr = array(
            'ssidFlow' => array( // 每个ssid的流量(ssid名称： 流量)
                'hotspot' => rand(20000,50000),
                'guest' => rand(20000,50000),
                'asc2.4' => rand(20000,50000),
                'AIP3.0-5.8' => rand(20000,50000),
                'wwv' => rand(20000,50000),
                'rst' => rand(20000,50000)
            ),
            'ssidClients' => array( // 每个ssid的客户端个数
                'hotspot' => rand(5,20),
                'guest' => rand(5,20),
                'asc2.4' => rand(5,20),
                'AIP3.0-5.8' => rand(5,20),
                'wwv' => rand(5,20),
                'rst' => rand(5,20)
            )
        );
        return $arr;
    }
    private function getAlarms($data){
        /*
        MAC-spoofing AP Detected 3	High	Rogue AP [mac] with SSID [Corporate-TY] is identified as MAC-spoofing
        //Honeypot AP Detected 		High	Rogue AP [mac] with SSID [Guest-TY] id identified as Evil-twin AP
        Rogue Device Detected 1		Medium	A new ad-hoc network [mac] with SSID[home] is detected on channe[11]
        Rogue AP Detected 2		    Medium  A new Rogue[mac] with SSID[Guest-TY] is detected on channe[1]
        Rogue AP Detected 2		    Medium  A new Rogue[mac] with SSID[Corporate-TY] is detected on channe[1]
        Rogue Device Detected 1		Medium	A new ad-hoc network[mac] with SSid[hpsetup] is detected on channel[1]
        Rogue AP Detected 2		    Medium  A new Rogue[mac] with SSID[ASP-QA-gues] is detected on channe[157]
        Rogue AP Detected 2		    Medium  A new Rogue[mac] with SSID[ASP_QA-corp] is detected on channe[1]
        Rogue AP Detected 2		    Medium  A new Rogue[mac] with SSID[bizcom-guest] is detected on channe[7]
        */
        $arr = array(
            'page' => array(
                'total' => '40',
                'totalPage' => '4',
                'currPage' => '3'
            ),
            'list' => array( // 每页返回十条
                array(
                    'time' => date("Y-m-d H:i:s",strtotime("-4 hour")),
                    'type' => '3',
                    'activities' => 'Rogue AP [90:E9:A4:C3:69:66] with SSID [Corporate-TY] is identified as MAC-spoofing' // 告警信息
                ),
                array(
                    'time' => date("Y-m-d H:i:s",strtotime("-3 hour")),
                    'type' => '1',
                    'activities' => 'A new ad-hoc network [75:68:51:67:28:A4] with SSID[home] is detected on channe[11]'
                ),
                array(
                    'time' => date("Y-m-d H:i:s",strtotime("-2 hour")),
                    'type' => '2',
                    'activities' => 'A new Rogue[80:1F:BF:68:18:EF] with SSID[Guest-TY] is detected on channe[1]'
                ),
                array(
                    'time' => date("Y-m-d H:i:s",strtotime("-1 hour")),
                    'type' => '2',
                    'activities' => 'A new Rogue[08:C2:85:1F:C2:61] with SSID[Corporate-TY] is detected on channe[1]'
                ),
                array(
                    'time' => date("Y-m-d H:i:s",strtotime("-1 hour")),
                    'type' => '1',
                    'activities' => 'A new ad-hoc network[D3:EC:3B:18:D8:6E] with SSid[hpsetup] is detected on channel[1]'
                ),
                array(
                    'time' => date("Y-m-d H:i:s",strtotime("-1 hour")),
                    'type' => '2',
                    'activities' => 'Medium  A new Rogue[E5:6C:20:7F:2B:D0] with SSID[ASP-QA-gues] is detected on channe[157]'
                ),
                array(
                    'time' => date("Y-m-d H:i:s",strtotime("-1 hour")),
                    'type' => '2',
                    'activities' => 'A new Rogue[28:78:A3:A4:48:9E] with SSID[ASP_QA-corp] is detected on channe[1]'
                ),
                array(
                    'time' => date("Y-m-d H:i:s",strtotime("-1 hour")),
                    'type' => '2',
                    'activities' => 'A new Rogue[B6:B3:0E:B8:D1:F8] with SSID[bizcom-guest] is detected on channe[7]'
                )
            )                            
        );
        return $arr;
    }
}

