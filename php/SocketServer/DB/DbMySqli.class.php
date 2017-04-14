<?php
header('content-type:text/html;charset=utf-8');
class DbMySqli {
	private $db;
	
	public function __construct($db_name='netmanager') {
		$this->db = new mysqli('localhost','root','',$db_name);
		$this->db->query("set names utf8");
	}
	
	public function query($sql){
		$arr = array();
		$result = $this->db->query($sql);
		while($res = $result->fetch_array(MYSQLI_ASSOC)){
			$arr[] = $res;
		}		
		return $arr;
	}
	/**
	 *	获取单行 或者 单个字段值
	 * @sql
     * @entire_row  默认true 获取当个字段值，
	*/
	public function querySingle($sql,$entire_row = true){				
		$result = $this->db->query($sql);
		if($entire_row){
			return $result->fetch_array(MYSQLI_NUM)[0];
		}else{			
			return $result->fetch_array(MYSQLI_ASSOC);
		}
	}

	function __destruct() {
		//关闭连接
		$this->db->close();
	}
}