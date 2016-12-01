<?php
class SystemAdmin_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
		$this->load->library('SqlPage');
	}
	public function get_account_list($data) {
		$sqlpage = new SqlPage();
		$columns = 'id,username as userName,usertype as userType,purview';
		$tablenames = 'admininfo';
		$pageindex = (int)element('page', $data, 1);
		$pagesize = (int)element('size', $data, 20);
		$datalist = $sqlpage->sql_data_page($columns,$tablenames,$pageindex,$pagesize);
		$arr['state'] = array('code' => 2000, 'msg' => 'ok');
		$arr['data'] = array("list" => $datalist['data']);
		return json_encode($arr);
	}
	public function add_account($data) {
        $result = null;
        $colums = 'id';
        $tablename = 'admininfo';
        $wheres = " where username='" . $data['userName'] . "'";
        if (is_columns($this->db, $colums, $tablename, $wheres)) {
            $result = json_no(' User name already exists !');
        } else {
            $insertdata = array();
            $insertdata['username'] = $data['userName'];
            $insertdata['userpwd'] = MD5($data['userPassword']);
            $insertdata['usertype'] = $data['userType'];
            $insertdata['purview'] = $data['purview'];
            $result = $this->db->insert('admininfo', $insertdata);
            if ($result) {
                $result = json_ok();
            } else {
                $result = json_no('data base busy');
            }
        }
        return json_encode($result);
    }
	public function up_account($data) {
		$result = null;
        $colums = 'id';
        $tablename = 'admininfo';
        $wheres = " where username='" . $data['userName'] . "' and id !=" . $data['id'];                
        if (is_columns($this->db, $colums, $tablename, $wheres)) {
            $result = json_no(' User name already exists !');
        } else {
            $updata = array();
            $updata['id'] = $data['id'];
            $updata['username'] = $data['userName'];
            $updata['userpwd'] = MD5($data['userPassword']);
            $updata['usertype'] = $data['userType'];
            $updata['purview'] = $data['purview'];
            $result = $this->db->replace('admininfo', $updata);
            if ($result) {
                $result = json_ok();
            } else {
                $result = json_no('data base busy');
            }
        }        
		return json_encode($result);
	}
	public function del_account($data) {
		$result = null;
		$this->db->where('id', $data['id']);
		$result = $this->db->delete('admininfo');
		if ($result) {
			$result = json_ok();
		} else {
			$result = json_no('data base busy');
		}
		return json_encode($result);
	}
}
