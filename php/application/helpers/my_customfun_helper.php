<?php

    function json_ok($msg = 'ok') {
        $arr = array('state' => array('code' => 2000, 'msg' => $msg));
        return $arr;
    }
    function json_no($msg = 'error') {
        $arr = array('state' => array('code' => 4000, 'msg' => $msg));
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

    /**
	 *	data page
     *  @db 数据库
	 *	@columns 列
	 *	@tablenames 表名
	 *	@pageindex 页码
	 *	@pagesize 页容量	
	 *	@wheres 条件集合	  
	 *	@joins 联合查询集合
	 *	return 总行、总页、结果集
	 */
	function help_data_page($db,$columns, $tablenames, $pageindex=1, $pagesize=20, $wheres=array(), $joins=array()) {
		//得到总行
		$total_row = 0;
		$db->select($columns);
		$db->from($tablenames);
		if (count($joins) > 0) {
			foreach ($joins as $row) {
				$db->join($row[0], $row[1], $row[2]);
			}
		}
		if (count($wheres) > 0) {
			foreach ($wheres as $row) {
				$db->where($row[0], $row[1]);
			}
		}
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
		if (count($joins) > 0) {
			foreach ($joins as $row) {
				$db->join($row[0], $row[1], $row[2]);
			}
		}
		if (count($wheres) > 0) {
			foreach ($wheres as $row) {
				$db->where($row[0], $row[1]);
			}
		}
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
		/*
		$this->CI->db->select('ssid_template.id,ssid_template.name,ssid_template.remark,ssid_group.group_name');
		$this->CI->db->from('ssid_template');				
		$this->CI->db->join('ssid_group','ssid_group.id = ssid_template.id','left');
		$this->CI->db->where('ssid_template.id >',0);
		echo $this->CI->db->count_all_results();
		$this->CI->db->limit(2,1);
		*/
	}
	/**
	 *	data page 带排序
     *  @db 数据库
	 *	@columns 列
	 *	@tablenames 表名
	 *	@pageindex 页码
	 *	@pagesize 页容量
	 *	@order 排序集合	
	 *	@wheres 条件集合	  
	 *	@joins 联合查询集合
	 *	return 总行、总页、结果集
	 */
	function help_data_page_order($db,$columns, $tablenames, $pageindex=1, $pagesize=20, $order=array(),$wheres=array(), $joins=array()) {
		//得到总行
		$total_row = 0;
		$db->select($columns);
		$db->from($tablenames);
		if (count($joins) > 0) {
			foreach ($joins as $row) {
				$db->join($row[0], $row[1], $row[2]);
			}
		}
		if (count($wheres) > 0) {
			foreach ($wheres as $row) {
				$db->where($row[0], $row[1]);
			}
		}
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
		if (count($joins) > 0) {
			foreach ($joins as $row) {
				$db->join($row[0], $row[1], $row[2]);
			}
		}
		if (count($wheres) > 0) {
			foreach ($wheres as $row) {
				$db->where($row[0], $row[1]);
			}
		}	
		if (count($order) > 0) {
			foreach ($order as $row){
				$db->order_by($row[0], $row[1]);
			}
		}
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
		return $arr;
	}

