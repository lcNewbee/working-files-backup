<?php
date_default_timezone_set("PRC");
class Apbackup_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
        $this->load->helper(array('array', 'db_operation'));
        $this->load->library('DbSqlite');        
    }
    //excel下载
	function get_list($data) {        	
        $this->setApDb();
        
        $path = '/var/run/ap_config.db';
        if(!is_file($path)){
            return json_no('file null!');
        }
        $db_info = $this->getAllTable($path);
        $this->getApConfig($db_info);
	}
    
    private function setApDb(){
        axc_download_ap_radio();
    }
    private function getApConfig($data){
        include '/usr/web/application/libraries/PHPExcel.php';
        include '/usr/web/application/libraries/PHPExcel/Writer/Excel2007.php';
        //或者include 'PHPExcel/Writer/Excel5.php'; 用于输出.xls的
        $objPHPExcel = new PHPExcel(); //创建一个实例
        //创建人
        $objPHPExcel->getProperties()->setCreator("Axilspot");
        //最后修改人
        $objPHPExcel->getProperties()->setLastModifiedBy("Axilspot");
        //标题
        $objPHPExcel->getProperties()->setTitle("Office 2007 XLSX Test Document");
        //题目
        $objPHPExcel->getProperties()->setSubject("Office 2007 XLSX Test Document");
        //描述
        $objPHPExcel->getProperties()->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.");
        //关键字
        $objPHPExcel->getProperties()->setKeywords("office 2007 openxml php");
        //种类
        $objPHPExcel->getProperties()->setCategory("Test result file");
        
        //数据写入
        $ABC = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
        'AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ',
        'BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','BY','BZ'];
        $tabl_id = 0;
        foreach($data as $row){
            if($tabl_id > 0){
                //创建一个新的工作空间(sheet)
                $objPHPExcel->createSheet();
            }
            $objPHPExcel->setActiveSheetIndex($tabl_id);
            //设置table的名称
            $objPHPExcel->getActiveSheet()->setTitle($row['table_name']);
            $k = 1;    
            foreach($row['data'] as $nrow){
                //没条记录列数
                $j = count($nrow);
                for($i = 0; $i < $j; $i++){       
                    //echo $ABC[$i] . $k.'---'.$nrow[$i];   
                    //$objPHPExcel->getactivesheet()->setcellvalue('A'.$k, $v[0]);
                    //$objPHPExcel->getactivesheet()->setcellvalue('B'.$k, $v[1]);
                    //$objPHPExcel->getactivesheet()->setcellvalue('C'.$k, $v[2]); 
                    $objPHPExcel->getactivesheet()->setcellvalue($ABC[$i] . $k, $nrow[$i]);
                }
                $k = $k+1;
            }
            $tabl_id++;
        }
       
        $savename = 'ap_config';
        $ua = $_SERVER["HTTP_USER_AGENT"];
        $datetime = date('Y-m-d', time());        
        if (preg_match("/MSIE/", $ua)) {
            $savename = urlencode($savename); //处理IE导出名称乱码
        } 
        
        // excel头参数  
        header('Content-Type: application/vnd.ms-excel');  
        header('Content-Disposition: attachment;filename="'.$savename.'.xls"');  //日期为文件名后缀  
        header('Cache-Control: max-age=0'); 
        $objWriter = \PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');  //excel5为xls格式，excel2007为xlsx格式  
        $objWriter->save('php://output');
    }
    //获取所有
    private function getAllTable($path){
        $arr = array();
        $dbite = new DbSqlite($path);
        $table_list = $dbite->query("SELECT name FROM sqlite_master WHERE type='table' order by name");
        
        foreach($table_list as $row){
            $ary = array();
            $tab_data = $dbite->query_index("select * from {$row['name']}");//注：query_index返回的索引数组
            $column = $dbite->query("PRAGMA table_info('{$row['name']}')");
            foreach($column as $nrow){
                $ary[] = $nrow['name'];
            }
            array_unshift($tab_data,$ary);
            $arr[] = array(
                'table_name' => $row['name'],
                'data' => $tab_data
            );
        }        
        return $arr;
    }
    
}