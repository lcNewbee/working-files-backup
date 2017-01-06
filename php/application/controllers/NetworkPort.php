
<?php
class NetworkPort extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $this->load->helper('array');
        $this->load->model('network/NetworkPort_Model');
    }
    public function index() {
        $result = null;
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $this->onAction($data);
            echo $result;
        } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo json_encode($result);
        }
    }

    function fetch() {
		return $this->NetworkPort_Model->get_port_list();
	}

	function onAction($data) {
		$result = null;
		$actionType = element('action', $data);
		if ($actionType === 'edit') {
			$result = $this->NetworkPort_Model->add_port($data);			
		} elseif ($actionType === 'delete') {
            /*
			$keys = array("portname");
			$a1 = array_fill_keys($keys, '0');
			$a1['portname'] = $data['name'];
			$result = acnetmg_del_port(json_encode($temp_data));
            */
		}
		return $result;
	}
}

