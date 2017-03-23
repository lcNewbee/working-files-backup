<?php
/**
 * 用于对数组array 的分页
*/
    
    
    /**
	 * 对数组集合分页
	 * @data 数组集合
	 * @pageindex 页码
	 * @pagesize 页大小
	 * @where 搜索  array_search() 格式  array('name','admin')
	 * return array()
	*/
    function array_page($data,$pageindex,$pagesize,$where = array()){
        if(count($where) > 0){
			$colmos = $where[0];			
			$svalue = $where[1];
			if($svalue != "" && $svalue != null){
				$datas = array();
				foreach($data as $row) {
					if($row[$colmos] == $svalue) {
						$datas[] = $row;
					}
				}
				$data = $datas;	
			}
		}
		//总行数
		$total_row = count($data);
        if($total_row <= $pagesize){
			$pageindex = 1;
		}
		//总页 默认1
		$total_page = 1;
		$total_page = intval($total_row / $pagesize);
		if( ($total_row % $pagesize) > 0) {
			$total_page = $total_page + 1;
		}
		//用array_slice(array,offset,length) 函数在数组中根据条件取出一段值;array(数组),offset(元素的开始位置),length(组的长度)
		$newarr = array_slice($data, ($pageindex-1)*$pagesize, $pagesize);

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
		$arr['data'] = $newarr;

		return $arr;
	}