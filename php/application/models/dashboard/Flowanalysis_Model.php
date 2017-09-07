<?php
date_default_timezone_set("PRC");
class Flowanalysis_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->load->helper(array('array', 'db_operation'));    
        $this->mysql = $this->load->database('mysqli', TRUE);  
    }
    function get_list($data) {   
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'curFlow' => '312',//当前一个周期数量
                'curFlowDiff' => '56',//与昨天同时间对比,正数表示增加，负数表示减少
                'totalFlow' => '6018',// 今日到店总数
                'totalFlowDiff' => '123',//到店总数对比昨天
                'flowPeak' => '1104', // 人流峰值
                'flowPeakDiff' => '-120',//峰值对比
                'newFlow' => '3139', // 新增用户量
                'newFlowDiff' => '2245',//新增对比
                'averageStayTime' => '60',//平均停留时长
                'averageStayTimeDiff' => '12',//对比
                'flowRank' => array(//流量排行前四
                    array(
                        'zoneName' => '休闲广场',//区域名称
                        'flowPercent' => '21.42%',//占比 和所有区域总流量对比
                        'flowDiff' => '8.2%' // 与昨天对比，正数表示增长，负数表示减少
                    ),
                    array('zoneName' => '社区购物中心','flowPercent' => '20.65%','flowDiff' => '4.2%'),
                    array('zoneName' => '文化广场','flowPercent' => '14.39%','flowDiff' => '3.1%'),
                    array('zoneName' => '体育馆','flowPercent' => '3.92%','flowDiff' => '3.8%'),
                    array('zoneName' => '美食街','flowPercent' => '35.83%','flowDiff' => '9.2%'),
                    array('zoneName' => '西大门','flowPercent' => '3.97%','flowDiff' => '0.8%')
                ),
                // 流量变化曲线
                'flowChange' => array(
                    array('time' => '0','tdFlow'  => rand(10,20),'ystdFlow' => rand(10,20)),
                    array('time' => '1','tdFlow'  => rand(10,20),'ystdFlow' => rand(10,20)),
                    array('time' => '2','tdFlow'  => rand(10,20),'ystdFlow' => rand(10,20)),
                    array('time' => '3','tdFlow'  => rand(10,20),'ystdFlow' => rand(10,20)),
                    array('time' => '4','tdFlow'  => rand(10,20),'ystdFlow' => rand(10,20)),
                    array('time' => '5','tdFlow'  => rand(10,20),'ystdFlow' => rand(10,20)),
                    array('time' => '6','tdFlow'  => rand(100,150),'ystdFlow' => rand(100,150)),
                    array('time' => '7','tdFlow'  => rand(100,150),'ystdFlow' => rand(100,150)),
                    array('time' => '8','tdFlow'  => rand(200,250),'ystdFlow' => rand(200,250)),
                    array('time' => '9','tdFlow'  => rand(200,300),'ystdFlow' => rand(200,300)),
                    array('time' => '10','tdFlow' => rand(200,300),'ystdFlow' => rand(200,300)),
                    array('time' => '11','tdFlow' => rand(200,300),'ystdFlow' => rand(200,300)),
                    array('time' => '12','tdFlow' => rand(200,250),'ystdFlow' => rand(200,250)),
                    array('time' => '13','tdFlow' => rand(200,250),'ystdFlow' => rand(200,250)),
                    array('time' => '14','tdFlow' => rand(200,300),'ystdFlow' => rand(200,300)),
                    array('time' => '15','tdFlow' => rand(200,300),'ystdFlow' => rand(200,300)),
                    array('time' => '16','tdFlow' => rand(200,300),'ystdFlow' => rand(200,300)),
                    array('time' => '17','tdFlow' => rand(200,300),'ystdFlow' => rand(200,300)),
                    array('time' => '18','tdFlow' => rand(200,300),'ystdFlow' => rand(200,300)),
                    array('time' => '19','tdFlow' => rand(200,250),'ystdFlow' => rand(200,250)),
                    array('time' => '20','tdFlow' => rand(50,70),'ystdFlow' => rand(50,70)),
                    array('time' => '21','tdFlow' => rand(50,70),'ystdFlow' => rand(50,70)),
                    array('time' => '22','tdFlow' => rand(10,20),'ystdFlow' => rand(10,20)),
                    array('time' => '23','tdFlow' => rand(10,20),'ystdFlow' => rand(10,20))                                        
                ),
                'stayTime' => array(
                    'averageTime' => '132', // 平均停留时间，分钟
                    'beyound4' => '30%', // 停留时间超过5小时
                    'between1and4' => '60%', //介于1到4小时
                    'bellow1' => '10%' // 小于一个小时
                ),
                'visitTimes' => array(
                    'averageTimes' => '1.8', // 历史到访平均次数
                    'beyound10' => '20%', // 超过十次
                    'between3and10' => '13.5%', // 介于三次到十次
                    'bellow3' => '66.5%' // 低于三次
                )
            )
        );
        return json_encode($arr);
    }
    /*
	function get_list_bak($data) {   
        $today_cycle_flow = $this->getTodayCycleFlow(300);//今日周期流量 周期默认300秒即5分钟
        $yesterday_cycle_flow = $this->getYesterdayCycleFlow();//对比今日昨日周期流量
        $today_total_flow = $this->getTodayTotalFlow();
        $yesterday_total_flow = $this->getYesterdayTotalFlow();
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'curFlow' => ''.$today_cycle_flow,//当前一个周期数量
                'curFlowDiff' => ''.($today_cycle_flow - $yesterday_cycle_flow),//与昨天同时间对比,正数表示增加，负数表示减少
                'totalFlow' => ''.$today_total_flow,// 今日到店总数
                'totalFlowDiff' => ''.($today_total_flow - $yesterday_total_flow),////到店总数对比昨天
                'flowPeak' => '1104', // 人流峰值
                'flowPeakDiff' => '-120',//峰值对比
                'newFlow' => '3139', // 新增用户量
                'newFlowDiff' => '2245',//新增对比
                'averageStayTime' => '60',//平均停留时长
                'averageStayTimeDiff' => '12',//对比
                'flowRank' => array(//流量排行前四
                    array(
                        'zoneName' => 'zone1',//区域名称
                        'flowPercent' => '90.1%',//占比 和所有区域总流量对比
                        'flowDiff' => '4.2%' // 与昨天对比，正数表示增长，负数表示减少
                    )
                ),
                // 流量变化曲线
                'flowChange' => array(
                    array(
                        'time' => '7:00',
                        'tdFlow' => '400',// 今日流量
                        'ystdFlow' => '580'// 昨日流量
                    ),
                    array(
                        'time' => '8:00',
                        'tdFlow' => '500',// 今日流量
                        'ystdFlow' => '580'// 昨日流量
                    ),
                    array(
                        'time' => '9:00',
                        'tdFlow' => '200',// 今日流量
                        'ystdFlow' => '150'// 昨日流量
                    )
                ),
                'stayTime' => array(
                    'averageTime' => '93', // 平均停留时间，分钟
                    'beyound4' => '20%', // 停留时间超过5小时
                    'between1and4' => '50%', //介于1到4小时
                    'bellow1' => '30%' // 小于一个小时
                ),
                'visitTimes' => array(
                    'averageTimes' => '1.2', // 历史到访平均次数
                    'beyound10' => '1.5%', // 超过十次
                    'between3and10' => '13.5%', // 介于三次到十次
                    'bellow3' => '84%' // 低于三次
                )
            )
        );
        return json_encode($arr);
    }   
    //获取今日最近一个周期的用户量
    private function getTodayCycleFlow($cycle = 300){
        $sqlcmd = "select count(id) as count from passenger_flow where timer>=(select date_add((select MAX(timer) from passenger_flow), interval -{$cycle} second))";
        $ret = $this->mysql->query($sqlcmd);
        if(count($ret) > 0){
            return $ret->row()->count;
        }
        return 0;
    }
    //获取今日当前周期与昨天同时间流量
    private function getYesterdayCycleFlow($cycle = 60){
        $cycle = 3600*24+$cycle;
        $sqlcmd  = "select count(id) as count from passenger_flow";
        $sqlcmd .= " where timer>=(select date_add((select MAX(timer) from passenger_flow), interval -{$cycle} second))";
        $sqlcmd .= " and timer<(select date_add((select MAX(timer) from passenger_flow), interval -1 day))";
        $ret = $this->mysql->query($sqlcmd);
        if(count($ret) > 0){
            return $ret->row()->count;
        }
        return 0;
    }
    //获取今天的总用户量
    private function getTodayTotalFlow(){
        $sqlcmd = "select count(id) as count  from passenger_flow where timer>=(select CURDATE())";
        $ret = $this->mysql->query($sqlcmd);
        if(count($ret) > 0){
            return $ret->row()->count;
        }
        return 0;
    }
    //获取昨天一天总用户量
    private function getYesterdayTotalFlow(){
        $sqlcmd = "select count(id) as count from passenger_flow where timer>=(select date_add(CURDATE(), interval -1 day)) and timer<(select CURDATE())";
        $ret = $this->mysql->query($sqlcmd);
        if(count($ret) > 0){
            return $ret->row()->count;
        }
        return 0;
    }
    */
}