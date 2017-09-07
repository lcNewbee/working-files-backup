<?php
date_default_timezone_set("PRC");
class Overview_Model extends CI_Model {
	public function __construct() {
        parent::__construct();
        $this->load->library('session');
		$this->load->database();
        $this->load->helper(array('array', 'db_operation'));    
        $this->mysql = $this->load->database('mysqli', TRUE);  
    }
    /* 
        国家气象局提供的天气预报接口 http://blog.csdn.net/wmqi10/article/details/29566301
        接口地址：
        http://www.weather.com.cn/data/sk/101280601.html
        http://www.weather.com.cn/data/cityinfo/101280601.html
        http://m.weather.com.cn/data/101280601.html
        北京：101010100
        深圳：101280601
        深圳气象网:https://data.szmb.gov.cn/szmbdata/view/alarmForecast/hjqxyb.jsp
        --温度信息 temperature (浮点型)
        --湿度 humidity (整形 相对湿度0-100)
        --噪音 noise   (整形 好像是0-100)
        --空气 air  (整形 0-300 300以上就属 6级 严重污染) 
        --水质 water_quality (整形)
        检测自来水、纯净水、矿泉水的水质是否符合国家制订的饮用水标准：
        自来水300PPM以下，纯水50PPM（国家标准）以下，矿泉水100-200PPM之间。
    */
    function get_list($data) {    
        if(isset($_SESSION['RequestNumber']) && $_SESSION['RequestNumber'] < 5){
            $_SESSION['RequestNumber'] = $_SESSION['RequestNumber'] + 1;
        }else{
            $_SESSION['RequestNumber'] = 0;
        }
        $index = $_SESSION['RequestNumber'];
        $total = 6018;//当日客流总数
        $online = 4603;//在线
        $offline = $total - $online;//离线
        //24小时之内没小时的在线人数
        $today = [1045, 1026, 1423, 942, 1423, 1689, 1845, 1779, 1842, 1749, 3120, 5000,3589, 3541, 4121, 4100, 
        3120, 2546, 2588, 2136, 2201, 1589, 1420, 1211];        
        //环境数据
        $arr = array(
            'number' => $_SESSION['RequestNumber'],
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'regionlist' => $this->getCcenicList(),
                'build' => '',
                'floor' => '龙岗岗贝社区',
                'environment' => $this->simulation()[$index],
                //停车位
                'parking' => $this->parking()[$index],
                //客流
                'clients' => array(
                    'total' =>  $total,//当天客流总数
                    'online' =>  $online,
                    'offline' =>  $offline,
                    'today' => $today,
                    'retentionTime' => $this->retentionTime()[$index]
                ),
                'clientsAnalysis' => array(
                    array(
                        'location' => '休闲广场',//分区名称
                        'live' =>  '289',//实时游客量（最新一个周期内）
                        'total' => '1289',//总游客数 当天
                        'new' => 703,// 当日新增游客
                        'newRate' => round((703/1289),2),//当日 新增游客占比
                        'retentionTime' => 29//当日所有游客平均停留时间
                    ),
                    array('location'=>'社区购物中心','live' => '375','total' => '1243','new' => '874','newRate' => round((874/1243),2),'retentionTime' => 38),
                    array('location'=>'文化广场','live' => '231','total' => '866','new' => '156','newRate' => round((156/866),2),'retentionTime' => 22),
                    array('location'=>'体育馆','live' => '116','total' => '236','new' => '23','newRate' => round((23/236),2),'retentionTime' => 31),
                    array('location'=>'美食街','live' => '466','total' => '2156','new' => '1486','newRate' => round((1486/2156),2),'retentionTime' => 42),
                    array('location'=>'西大门','live' => '300','total' => '233','new' => '185','newRate' => round((185/233),2),'retentionTime' => 11)                
                )
            )
        );
        return json_encode($arr);
    }
    //模拟气象
    private function simulation(){       
        $arr[] = array('temperature' => '26','rainfall' => '0','humidity' => '65','ph' => '66','water' => '116', 'noise' => '64');//0-4
        $arr[] = array('temperature' => '27','rainfall' => '2','humidity' => '65','ph' => '71','water' => '105', 'noise' => '59');//4-8
        $arr[] = array('temperature' => '29','rainfall' => '44','humidity' => '42','ph' => '68','water' => '99', 'noise' => '54');//8-12
        $arr[] = array('temperature' => '30','rainfall' => '56','humidity' => '39','ph' => '73','water' => '108', 'noise' => '51');//12-16
        $arr[] = array('temperature' => '29','rainfall' => '78','humidity' => '50','ph' => '67','water' => '97', 'noise' => '60');//16-20
        $arr[] = array('temperature' => '28','rainfall' => '0','humidity' => '65','ph' => '69','water' => '113', 'noise' => '63');//20-23
        return $arr;
    }
    //车位
    private function parking(){
        $arr[] = array(
            'total' =>'1267','booked'=>'234','used'=>'924','list' => array(
                array('name' => '西门停车场','total' => '426','free' => '123','used' => '215','booked' => '48'),
                array('name' => '东门停车场','total' => '678','free' => '229','used' => '312','booked' => '63'),
                array('name' => '南门停车场','total' => '345','free' => '121','used' => '141','booked' => '34'),
                array('name' => '北门停车场','total' => '589','free' => '234','used' => '256','booked' => '89')
            )
        );
        $arr[] = array(
            'total' =>'2186','booked'=>'455','used'=>'932','list' => array(
                array('name' => '西门停车场','total' => '551','free' => '213','used' => '221','booked' => '148'),
                array('name' => '东门停车场','total' => '642','free' => '185','used' => '210','booked' => '163'),
                array('name' => '南门停车场','total' => '312','free' => '230','used' => '89','booked' => '98'),
                array('name' => '北门停车场','total' => '681','free' => '98','used' => '412','booked' => '46')
            )
        );
        $arr[] = array(
            'total' =>'2186','booked'=>'455','used'=>'722','list' => array(
                array('name' => '西门停车场','total' => '456','free' => '113','used' => '98','booked' => '143'),
                array('name' => '东门停车场','total' => '412','free' => '98','used' => '123','booked' => '222'),
                array('name' => '南门停车场','total' => '523','free' => '230','used' => '89','booked' => '98'),
                array('name' => '北门停车场','total' => '352','free' => '75','used' => '412','booked' => '38')
            )
        );
        $arr[] = array(
            'total' =>'2020','booked'=>'469','used'=>'932','list' => array(
                array('name' => '西门停车场','total' => '732','free' => '213','used' => '221','booked' => '148'),
                array('name' => '东门停车场','total' => '423','free' => '185','used' => '210','booked' => '177'),
                array('name' => '南门停车场','total' => '544','free' => '230','used' => '89','booked' => '98'),
                array('name' => '北门停车场','total' => '321','free' => '98','used' => '412','booked' => '46')
            )
        );
        $arr[] = array(
            'total' =>'1619','booked'=>'548','used'=>'520','list' => array(
                array('name' => '西门停车场','total' => '441','free' => '213','used' => '221','booked' => '148'),
                array('name' => '东门停车场','total' => '234','free' => '76','used' => '23','booked' => '76'),
                array('name' => '南门停车场','total' => '523','free' => '230','used' => '111','booked' => '231'),
                array('name' => '北门停车场','total' => '421','free' => '98','used' => '165','booked' => '93')
            )
        );
        $arr[] = array(
            'total' =>'1802','booked'=>'363','used'=>'525','list' => array(
                array('name' => '西门停车场','total' => '310','free' => '123','used' => '102','booked' => '56'),
                array('name' => '东门停车场','total' => '756','free' => '321','used' => '215','booked' => '163'),
                array('name' => '南门停车场','total' => '422','free' => '56','used' => '189','booked' => '79'),
                array('name' => '北门停车场','total' => '314','free' => '77','used' => '19','booked' => '65')
            )
        );        
        return $arr;
    }
    //客流滞留信息
    private function retentionTime(){
        $arr[] = array('30'=>'84','40'=>'204','50'=>'185','60'=>'125','70'=>'216', '80'=> '196','90'=>'253','120'=>'14','150'=>'56','180'=>'121','240'=>'110');
        $arr[] = array('30'=>'125','40'=>'246','50'=>'256','60'=>'623','70'=>'223','80'=>'556','90'=>'384','120'=>'77','150'=>'14','180'=>'89','240'=>'89');
        $arr[] = array('30'=>'234','40'=>'312','50'=>'320','60'=>'512','70'=>'456','80'=>'412','90'=>'621','120'=>'245','150'=>'99','180'=>'234','240'=>'63');
        $arr[] = array('30'=>'189','40'=>'113','50'=>'236','60'=>'441','70'=>'612','80'=>'312','90'=>'731','120'=>'156','150'=>'41','180'=>'314','240'=>'79');
        $arr[] = array('30'=>'206','40'=>'256','50'=>'313','60'=>'339','70'=>'424','80'=>'326','90'=>'545','120'=>'67','150'=>'98','180'=>'98','240'=>'86');
        $arr[] = array('30'=>'76','40'=>'310','50'=>'333','60'=>'210','70'=>'106', '80'=> '269','90'=>'121','120'=>'35','150'=>'32','180'=>'41','240'=>'19');                
        return $arr;
    }

    //获取景区配置
    private function getCcenicList(){
        $arr = array();
        $query = $this->mysql->query("select id,name from region where parent_id=0")->result_array();
        if(count($query) > 0){
            $arr = $query;
        }
        return $arr;
    }

    /*
	function get_list_bak($data) {    
        $region_id = 1;//弘法寺

        $total = $this->getTodayFlowSum();
        $online = $this->getOnlineOSum(300);//周期默认300秒即5分钟
        $offline = $total - $online;
        //24小时之内没小时的在线人数
        $today = $this->getTodayHourFlow();
        //停留时间 一定时间内 人员停留数
        $retentionTime = $this->getStayInfo();
        //环境数据
        $environment = $this->setData();
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'regionlist' => $this->getCcenicList(),
                'build' => '',
                'floor' => '龙岗岗贝社区',
                'environment' => array(
                    'temperature' => $environment['temperature'],
                    'rainfall' => $environment['rainfall'],
                    'humidity' => $environment['humidity'],
                    'ph' => $environment['ph'],
                    'water' => $environment['water'], 
                    'noise' => '54'
                ),
                //停车位
                'parking' => array(
                    'total' => '1256',
                    'used' => '324',
                    'booked' => '12'
                ),
                //客流
                'clients' => array(
                    'total' =>  $total,//当天客流总数
                    'online' =>  $online,
                    'offline' =>  $offline,
                    'today' => $today,
                    'retentionTime' => $retentionTime
                ),
                'clientsAnalysis' => $this->getPartition($region_id)
            )
        );


        return json_encode($arr);
    }
    //给 environmental_monitoring 表写模拟数据
    private function setData(){
        //温度
        $temperature = array(
            '0' => rand(25,29),
            '1' => rand(25,29),
            '2' => rand(25,29),
            '3' => rand(25,29),
            '4' => rand(25,29),
            '5' => rand(26,29),
            '6' => rand(26,29),
            '7' => rand(26,29),
            '8' => rand(26,31),
            '9' => rand(27,29),
            '10' => rand(27,30),
            '11' => rand(28,30),
            '12' => rand(28,32),
            '13' => rand(28,33),
            '14' => rand(27,33),
            '15' => rand(27,33),
            '16' => rand(27,32),
            '17' => rand(26,32),
            '18' => rand(26,31),
            '19' => rand(26,29),
            '20' => rand(25,29),
            '21' => rand(25,29),
            '22' => rand(25,28),
            '23' => rand(25,28)
        );  
        //降水
        $rainfall = rand(40,180);
        //湿度      
        $humidity = array(
            '0' => rand(80,95),
            '1' => rand(80,95),
            '2' => rand(80,95),
            '3' => rand(80,95),
            '4' => rand(80,95),
            '5' => rand(80,95),
            '6' => rand(80,95),
            '7' => rand(75,80),
            '8' => rand(75,80),
            '9' => rand(75,80),
            '10' => rand(75,80),
            '11' => rand(75,80),
            '12' => rand(75,78),
            '13' => rand(75,78),
            '14' => rand(75,79),
            '15' => rand(75,79),
            '16' => rand(75,80),
            '17' => rand(80,90),
            '18' => rand(80,90),
            '19' => rand(80,90),
            '20' => rand(80,90),
            '21' => rand(80,95),
            '22' => rand(85,95),
            '23' => rand(85,95)
        );
        //噪音
        $noise = rand(30,70);
        //空气
        $ph = rand(40,78);
        //水质
        $water_quality = rand(80,300);
    
        $arr = array(
            'temperature' => $temperature['21'],
            'rainfall' => $rainfall,
            'humidity' => $humidity['21'],
            'ph' => $ph,
            'water' => $water_quality                   
        );
        return $arr;
    }   
    
    //获取当天客流总数
    private function getTodayFlowSum(){
        $sqlcmd = "select count(id) as count  from passenger_flow where timer>=(select CURDATE())";
        $ret = $this->mysql->query($sqlcmd);
        if(count($ret) > 0){
            return $ret->row()->count;
        }
        return 0;
    }
    //获取在线客流（在线客流 意思是最近一次周期的客流）
    private function getOnlineOSum($cycle = 300){
        $sqlcmd = "select count(id) as count from passenger_flow where timer>=(select date_add((select MAX(timer) from passenger_flow), interval -{$cycle} second))";
        $ret = $this->mysql->query($sqlcmd);
        if(count($ret) > 0){
            return $ret->row()->count;
        }
        return 0;
    }
    //获取今天每个个小时的流量
    private function getTodayHourFlow(){
        $arr = array();        
        $today_data = $this->mysql->query("select CURDATE() today")->result_array();//得到今天日期
        $hour_data = $this->mysql->query("select timestampdiff(hour,CURDATE(),now()) hour")->result_array();//得到当前时间离凌晨小时数
        if(count($today_data) > 0 && count($hour_data) > 0){
            $today_value = $today_data[0]['today'];
            $hour_sum = $hour_data[0]['hour'];
            for($i = 0; $i <= $hour_sum; $i++){
                $j = $i + 1;
                $sqlcmd  = "select count(id) as count from passenger_flow where timer>=(select date_add(CURDATE(), interval {$i} hour))";
                $sqlcmd .= " and timer<(select date_add(CURDATE(), interval {$j} hour))";
                $hour_flow_data = $this->mysql->query($sqlcmd)->result_array();
                if(count($hour_flow_data) > 0){
                    $arr[] = $hour_flow_data[0]['count'];
                }
            }
        }
        return $arr;
    }
    //获取停留时间信息
    private function getStayInfo(){
        $arr = array();
        $timercfg = [0,5,10,15,20,25,30,35,40,45,50,55,60];
        foreach($timercfg as $res){
            $endtime = $res + 5;
            $sqlcmd = "select count(id) as count from passenger_statistics where staytimer>{$res} and staytimer<={$endtime}";
            if($res > 60){
                $sqlcmd = "select count(id) as count from passenger_statistics where staytimer>{$res}";
            }
            $query = $this->mysql->query($sqlcmd);
            if(count($query) > 0 && $query->row()->count > 0){
                $arr[$endtime] = $query->row()->count;
            }          
        }
        return $arr;
    }

    //获取大区下的分区信息
    private function getPartition($region_id){
        $arr = array();
        //1.获取大区下所有分区
        $query = $this->mysql->query("select * from region where parent_id={$region_id}")->result_array();
        $newsum = 0;
        foreach($query as $row){
            //将大区下所有分区新增游客加在一起
            $newsum = $newsum + $this->getNewTourists($row['id']);
        }
        foreach($query as $row){
            //$new = $this->getNewTourists($row['id']);
            //$new = $this->getNewTourists(1);
            //$newRate = $newsum === 0 ? $new : $new / $newsum;
            $arr[] = array(
                'location' => $row['name'],//分区名称
                'live' => $this->getOnlineOSum(),//实时游客量（最新一个周期内）
                'total' => $this->getTodayFlowSum(),//总游客数 当天
                'new' => rand(0,$this->getTodayFlowSum()),// 当日新增游客
                'newRate' => rand(1,100) / 100,//当日 新增游客占比
                'retentionTime' => $this->getTodatStayTimer(1)//当日所有游客平均停留时间
            );
        }
        return $arr;
    }
     
    // 获取新增游客数量(针对分区)
    // 拿当日游客和过去（一定时间内）对比，没有则视为新增游客
    // @region_id 分区ID
    // @overdue 过期时间默认1天        
    private function getNewTourists($region_id,$overdue=1){
        $result = 0;
        $sqlcmd1 = "select mac from passenger_flow where region_id={$region_id} and timer>=(select CURDATE())";
        $todayTourists = $this->mysql->query($sqlcmd1)->result_array();
        //2.获取历史记录
        $sqlcmd2 = "select mac from passenger_flow where region_id={$region_id} and timer>=(select date_add(CURDATE(),interval -{$overdue} day)) and timer<CURDATE()";
        $query = $this->mysql->query($sqlcmd2)->result_array();
        foreach($todayTourists as $row){
            foreach($query as $noew){
                if($row['mac'] === $noew['mac']){
                    $result++;
                    continue;
                }                
            }            
        }
        $result = count($todayTourists);// - $result;
        return $result;
    }

    //获取当日分区内所有游客平均停留时间
    //@region_id 分区ID    
    private function getTodatStayTimer($region_id){
        $result = 0;
        //$sqlcmd = "select SUM(staytimer) as total,count(id) as count from passenger_statistics where region_id={$region_id} and staytimer>0 and timer>=(select CURDATE())";
        $sqlcmd = "select SUM(staytimer)/count(id) as value from passenger_statistics where region_id={$region_id} and staytimer>0 and timer>=(select CURDATE())";
        $query = $this->mysql->query($sqlcmd);
        $row = $query->row();        
        if(isset($row)){
            $result = $row->value;
        }
        return $result;
    }
    */
}