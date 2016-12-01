<?php
class SqlPage {
	protected $CI;
	public function __construct() {
		$this->CI =& get_instance();
		$this->CI->load->database();
		/*
		$this->load->database();
		$this->load->helper('array');
		*/

	}
	/**
	 *	data page
	 *	@columns 列
	 *	@tablenames 表名
	 *	@pageindex 页码
	 *	@pagesize 页容量	
	 *	@wheres 条件集合	  
	 *	@joins 联合查询集合
	 *	return 总行、总页、结果集
	 */
	public function sql_data_page($columns, $tablenames, $pageindex=1, $pagesize=20, $wheres=array(), $joins=array()) {
		//得到总行
		$total_row = 0;
		$this->CI->db->select($columns);
		$this->CI->db->from($tablenames);
		if (count($joins) > 0) {
			foreach ($joins as $row) {
				$this->CI->db->join($row[0], $row[1], $row[2]);
			}
		}
		if (count($wheres) > 0) {
			foreach ($wheres as $row) {
				$this->CI->db->where($row[0], $row[1]);
			}
		}
		$total_row = $this->CI->db->count_all_results();
		//2,计算总页
		$total_page = 1;
		$total_page = intval($total_row / $pagesize);
		if (($total_row % $pagesize) > 0) {
			$total_page = $total_page + 1;
		}
		//结果集
		$this->CI->db->select($columns);
		$this->CI->db->from($tablenames);
		if (count($joins) > 0) {
			foreach ($joins as $row) {
				$this->CI->db->join($row[0], $row[1], $row[2]);
			}
		}
		if (count($wheres) > 0) {
			foreach ($wheres as $row) {
				$this->CI->db->where($row[0], $row[1]);
			}
		}
		$this->CI->db->limit($pagesize, ($pageindex - 1) * $pagesize);
		$sqldata = $this->CI->db->get()->result_array();
		$arr['total_row'] = $total_row;
		$arr['total_page'] = $total_page;
		$arr['data'] = $sqldata;
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
}
