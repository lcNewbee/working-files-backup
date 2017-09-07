<?php
date_default_timezone_set("PRC");
class Environment_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->load->helper(array('array', 'db_operation'));    
        $this->mysql = $this->load->database('mysqli', TRUE);  
    }
	function get_list($data) {   
        $arr = array(
            'state' => array('code' => 2000,'msg' => 'success'),
            'data' => array(
                'temperature' => '30', // 摄氏度
                'humidity' => '80%',
                'noise' => '30', // 分贝
                'pm25' => '67',
                'waterQuality' => 'III',
                'leatestWeekData' => array(
                    // temperature第一个数据为当日最小温度，第二个为最大值
                    array('date' => '2017-9-2','temperature' => array(25, 33),'pm25' => '63','waterQuality' => '2'),
                    array('date' => '2017-9-3','temperature' => array(26, 29),'pm25' => '61','waterQuality' => '3'),
                    array('date' => '2017-9-4','temperature' => array(25, 32),'pm25' => '70','waterQuality' => '5'),
                    array('date' => '2017-9-5','temperature' => array(26, 29),'pm25' => '59','waterQuality' => '1'),
                    array('date' => '2017-9-6','temperature' => array(27, 33),'pm25' => '66','waterQuality' => '4'),
                    array('date' => '2017-9-7','temperature' => array(28, 31),'pm25' => '72','waterQuality' => '2'),
                    array('date' => '2017-9-8','temperature' => array(26, 30),'pm25' => '74','waterQuality' => '3')
                ),
                'noiseMonitor' => array( // 噪音的三个监测点数据，两小时一个数据，共十二个
                  'monitor1' => array(40, 28, 40, 30, 65, 65, 30, 44, 30, 50, 50, 30),
                  'monitor2' => array(30, 27, 30, 41, 30, 40, 33, 40, 36, 35, 36, 34),
                  'monitor3' => array(29, 40, 34, 26, 49, 47, 32, 38, 29, 47, 43, 44)
                )
            )
        );
        return json_encode($arr);
    }       
}