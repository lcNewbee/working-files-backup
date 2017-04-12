<?php
class DbSqlite {
	public $filepath = "";
	public $db;
	//构造函数
	public function __construct($path='/var/run/config.db') {
		$this->filepath = $path;
		$this->db = new SQLite3($this->filepath);
	}
	/******************************************************
	 **	sqlite3 增删改
	 ** $sql 语句
	 ******************************************************/
	public function exec($sql) {
		$request = $this->db->exec($sql);
		if ($request) {
			return $this->db->changes();
			//return sqlite_last_insert_rowid($this->db);//得到最近insert (这貌似用不了)			
		}
	}
	/******************************************************
	 **	sqlite3 查询
	 ** $sql 语句
	 ******************************************************/
	public function query($sql) {
		$data = array();
		$request = $this->db->query($sql);
		while ($res = $request->fetchArray(SQLITE3_ASSOC)) {
			$data[] = $res;
		}
		$request->finalize();
		return $data;
	}
	/*
	       public function  prepare($sql){          
	           $stmt = $this->db->prepare($sql);        
	           $request  = $stmt->execute();        
	           return $request;       
	       }
	*/
	/******************************************************
	 **	条件查询（查询一条数据）
	 **	$sql 查询语句
	 **	$entire_row  true/false   true 返回整条(数组形式) false 返回第一行第一列（貌似是字符串）
	 ****************************************************/
	public function querySingle($sql, $entire_row=false) {
		return $this->db->querySingle($sql, $entire_row);
	}
	/******************************************************
	 **	sqlite3 分页查询
	 ** $sql 查询语句 可带条件   (select * from userinfo where id>19)
	 ** $sqlcount 总行数查询语句 (select count(id) as count from userinfo)
	 ** $PageSize 页容量
	 ** $PageIndex 页码
	 ******************************************************/
	function pageselect($sql, $sqlcount, $PageSize, $PageIndex) {
		$pagedata = array();
		//1.得到总行数
		$sumrow = $this->db->querySingle($sqlcount, false);
		//2,计算总页
		$sumpage = intval($sumrow / $PageSize);
		if (($sumrow % $PageSize) > 0) {
			$sumpage = $sumpage + 1;
		}
		//3.组织查询分片语句
		$sql = $sql . " limit " . ($PageIndex - 1) * $PageSize . "," . $PageSize;
		//4.查询
		$dataary = array();
		$request = $this->db->query($sql);
		while ($res = $request->fetchArray(SQLITE3_ASSOC)) {
			$dataary[] = $res;
		}
		$pagedata['result'] = $dataary; //结果集
		$pagedata['sumrow'] = $sumrow; //总行数
		$pagedata['sumpage'] = $sumpage; //总页
		return $pagedata;
	}
	//析构函数
	function __destruct() {
		//关闭连接
		$this->db->close();
	}
}