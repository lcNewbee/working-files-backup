<?php
class Login_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
	public function user_load($data) {
		$result = null;
		$username = element('username', $data, 'root');
		$password = element('password', $data, '');
		$sqlcmd = "select userpwd,purview from admininfo where username='" . $username . "'";
		$queryda = $this->db->query($sqlcmd);
		$datarow = $queryda->row();
		if ($datarow->userpwd === MD5($password)) {
			$result = json_ok();
			$result['data'] = array('purview'=>$datarow->purview);
		} else {
			$result = json_no('Username or Password Error');
		}
		return $result;
	}
}
