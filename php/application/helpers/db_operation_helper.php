<?php
    function json_ok($msg = 'ok',$code=2000) {
        $arr = array('state' => array('code' => $code, 'msg' => $msg));
        return $arr;
    }
    function json_no($msg = 'error',$code=4000) {
        $arr = array('state' => array('code' => $code, 'msg' => $msg));
        return $arr;
    }
    /**
     *  判断某列值是否存在
     *  @db 数据库对象
     *  @colums 列
     *  @tablename 表名
     *  @wheres 条件带where
    */
    function is_columns($db, $colums, $tablename, $wheres=' where 1=1') {
        $result = 0;
        $sqlcmd = "select " . $colums . " from " . $tablename . " " . $wheres;
        $queryda = $db->query($sqlcmd);
        $datarow = $queryda->row();
        if (is_object($datarow)) {
            $result = 1;
        }
        return $result;
    }
    /**
    * 日志记录
    * @db 数据库对象
    * @data 熟悉
    *  $data = array(
    *       'log_type'=>'add',
    *       'operation_name'=>'admin',
    *       'operation_obj'=>'ssid',
    *       'outcome' =>'OK',
    *       'description'=>'add ssid'
    *  );
    */
    function Log_Record($db,$data) {
        $result = FALSE;
        $result = $db->insert('web_log', $data);
        if ($result) {
            $result = TRUE;
        } 
        return $result;
    }
    /*
    $parameter = array(
        'db' => $this->portalsql, 
        'columns' => '*', 
        'tablenames' => 'portal_weixin_wifi', 
        'pageindex' => (int) element('page', $data, 1), 
        'pagesize' => (int) element('size', $data, 20), 
        'wheres' => "basip LIKE '%".$data['search']."%' or ssid Like '%".$data['search']."%'", 
        'joins' => array(), 
        'order' => array()
    );
    */
    /**
	 *	data page 完整版（分页+联合+条件+排序）
     *  @db 数据库
	 *	@columns 列
	 *	@tablenames 表名
	 *	@pageindex 页码
	 *	@pagesize 页容量	 
	 *	@wheres 条件语句 "name='Joe' AND status='boss' OR status='active'"	  
	 *	@joins 联合查询集合
     *	@order 排序集合	
	 *	return 总行、总页、结果集、sql语句
	 */
	function help_data_page_all($parameter) {
        $db = array_key_exists('db',$parameter) ? $parameter['db'] : 0;
        $columns = array_key_exists('columns',$parameter) ? $parameter['columns'] : '*';
        $tablenames = array_key_exists('tablenames',$parameter) ? $parameter['tablenames'] : 0;
        $joins = array_key_exists('joins',$parameter) ? $parameter['joins'] : array();        
        $wheres = array_key_exists('wheres',$parameter) ? $parameter['wheres'] : '1=1';        
        $order = array_key_exists('order',$parameter) ? $parameter['order'] : array();
        $pageindex = array_key_exists('pageindex',$parameter) ? $parameter['pageindex'] : 1;
        $pagesize = array_key_exists('pagesize',$parameter) ? $parameter['pagesize'] : 20;
        if($pageindex < 1) {
            $pageindex = 1;
        }
        if($pagesize < 1) {
            $pagesize = 20;
        }

        //检查数据库和表名
        if($db === 0 || $tablenames === 0){
			echo 'error';
            return false;
        }
		//得到总行
		$total_row = 0;
		$db->select($columns);
		$db->from($tablenames);
		if (count($joins) > 0) {
			foreach ($joins as $row) {
				$db->join($row[0], $row[1], $row[2]);
			}
		}
        $db->where($wheres);
		$total_row = $db->count_all_results();
		//2,计算总页
		$total_page = 1;
		if($pagesize > 0) {
			$total_page = intval($total_row / $pagesize);
			if (($total_row % $pagesize) > 0) {
				$total_page = $total_page + 1;
			}
		}
		//结果集
		$db->select($columns);
		$db->from($tablenames);
        //联合表 join
		if (count($joins) > 0) {
			foreach ($joins as $row) {
				$db->join($row[0], $row[1], $row[2]);
			}
		}
        // 条件语句 where
		$db->where($wheres);	
        //排序 order_by
		if (count($order) > 0) {
			foreach ($order as $row){
				$db->order_by($row[0], $row[1]);
			}
		}
        //分页 limit        
		$db->limit($pagesize, ($pageindex - 1) * $pagesize);
		$sqldata = $db->get()->result_array();
		$arr['page'] = array(
			'start'=>1,/*第一页固定=1*/
			'size'=>$pagesize,/*每页大小*/
			'currPage'=>$pageindex,/*当前页码*/
			'totalPage'=>$total_page,/*总页*/
			'total'=>$total_row,/*总行*/
			'nextPage'=>($pageindex + 1) === $total_page ? ($pageindex + 1) : -1,/*下一页 -1为组后一页*/
			'lastPage'=>$total_page/*最后一页*/
		);
		$arr['total_row'] = $total_row;
		$arr['total_page'] = $total_page;
		$arr['data'] = $sqldata;
        $arr['sqlcmd'] = $db->last_query();		
		return $arr;
	}