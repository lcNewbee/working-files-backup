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
    function config_import($data){     
        $up_ret = $this->fileUpload('/var/run','filename','ap_config.xls','xls');
        if($up_ret['state']['code'] === 4000){
            return json_encode($up_ret);
        }             
        $file = '/var/run/ap_config.xls';
        if(is_file($file)){
            $sql_data =  $this->excelImport($file);
            $db = new DbSqlite('/var/run/ap_config.db');            
            foreach($sql_data as $key=>$value){
                //1.删除表
                $db->exec("delete from {$key}");
                //2.添加
                $db->exec($value);
            }
            exec('cfgmng -m apconf');
            exec('rm /var/run/ap_config.xls');
        }        
        return json_encode(json_ok());        
    }
    private function fileUpload($upload_path, $file_name, $save_name, $allowed_types = '*') {
        $result = json_no();
        $config['upload_path'] = $upload_path;//保存路径
        $config['overwrite'] = true;//是否替换
        $config['file_name'] = $save_name;//上传后文件名称
        $config['max_size'] = 0;
        $config['allowed_types'] = $allowed_types;
        $this->load->library('upload', $config);
        if (!$this->upload->do_upload($file_name)) {
            $result = array(
                'state' => array(
                    'code' => 4000,
                    'msg' => $this->upload->display_errors()
                )
            );
        } else {
            $result = array(
                'state' => array(
                    'code' => 2000,
                    'msg' => 'OK'
                ) ,
                'data' => array(
                    'upload_data' => $this->upload->data()
                )
            );
        }
        return $result;
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
    private function excelImport($file_path){
        include '/usr/web/application/libraries/PHPExcel.php';
        include '/usr/web/application/libraries/PHPExcel/IOFactory.php'; 
        include '/usr/web/application/libraries/PHPExcel/Reader/Excel2007.php';

        $arr = array();
        $objReader = PHPExcel_IOFactory::createReader('Excel5');
        //$file_path 可以是上传的表格，或者是指定的表格
        $objPHPExcel = $objReader->load($file_path); 
        //获取工作表的数目
        $sheetCount = $objPHPExcel->getSheetCount();
        //获取所有工作表名称
        $sheet_name = $objPHPExcel->getSheetNames();
        
        foreach($sheet_name as $key=>$value){
            $sql = "insert into {$value} select ";
            $_currentSheet  = $objPHPExcel->getSheet($key); 
            //获取Excel中信息的行数
            $_allRow = $_currentSheet->getHighestRow(); 
            //获取Excel的列数
            $_allColumn = $_currentSheet->getHighestColumn();
            $highestRow = intval($_allRow );
            $highestColumn = PHPExcel_Cell::columnIndexFromString($_allColumn);//有效总列数
            if($value === 'ap_list' && $highestRow > 1){
                for($row = 2;$row <= $highestRow; $row++){                    
                    if($row > 2){
                        $sql .= ' union all select ';
                    }
                    //第一个字段id 为整形
                    $sql .= $_currentSheet->getCellByColumnAndRow(0, $row)->getValue() . ',';                    
                    for($j = 1; $j < $highestColumn; $j++){
                        $sql .= "'" . $_currentSheet->getCellByColumnAndRow($j, $row)->getValue() . "',";
                    }
                    $sql = rtrim($sql, ",");
                    
                }                
                $arr['ap_list'] = $sql;                
            }
            if($value === 'radio_conf'  && $highestRow > 1){
                for($row = 2;$row <= $highestRow; $row++){
                    if($row > 2){
                        $sql .= ' union all select ';
                    }                                                                             
                    for($j = 0; $j < $highestColumn; $j++){
                        //第二个字段radio_id 为整形
                        if($j == 1){
                            $sql .= $_currentSheet->getCellByColumnAndRow(1, $row)->getValue() . ",";
                        }else{
                            $sql .= "'" . $_currentSheet->getCellByColumnAndRow($j, $row)->getValue() . "',";
                        }
                    }
                    $sql = rtrim($sql, ",");              
                }
                $arr['radio_conf'] = $sql;
            }                        
        }  
        return $arr;   
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