<?php
class NetworkInterface extends CI_Controller {
	public function __construct() {
		parent::__construct();

		$this->load->database();
		$this->load->helper('array');
	}

	function fetch() {
		$query=$this->db->select('portid,port_name,port_desc,speed,duplex,ip1,mask1,ip2,mask2,ip3,mask3,ip4,mask4,ip5,mask5,adminstate,mgifname')
						    ->from('port_table')
						    ->get()->result_array();
		$state=array(
		      'code'=>2000,
		      'msg'=>'OK'
		    );
		$interfaces = array();

		foreach($query as $index=>$value) {
			for ($x=1; $x<=5; $x++) {
				$ip = element('ip'.$x, $value);
				$mask = element('mask'.$x, $value);

				if($ip !== '0.0.0.0' && $mask !== '0.0.0.0') {
					$interfaces[$index] = array(
					            'portid'=>element('portid', $value),
					            'name'=>element('port_name', $value),
					            'ip'=>$ip,
					            'mask'=>$mask
					          );
				}
			}
		}
		$result=array(
		      'state'=>$state,
		      'data'=>array(
		        'list'=>$interfaces
		      )
		    );

		return $result;
	}

	function onAction($data) {
		$state=array(
		      'code'=>2000,
		      'msg'=>'OK'
		    );
		$result = null;
		$actionType = element('action', $data);
		$selectList = element('selectedList', $data);

    function getItem($oriData) {
      $retData = array(
        'portname'=>element('name', $oriData),
        'ip'=>element('ip', $oriData),
        'mask'=>element('mask', $oriData)
      );

      return $retData;
    }

		if ($actionType === 'delete') {
			foreach($selectList as $item) {
				$deleteItem=array(
				          'portname'=>element('name', $item),
				          'ip'=>element('ip', $item),
				          'mask'=>element('mask', $item)
				        );
				$result=acnetmg_del_portip(json_encode($deleteItem));
			}
		}
		elseif($actionType === 'add') {
			$addItem=array(
        'portname'=>element('name', $data),
        'ip'=>element('ip', $data),
        'mask'=>element('mask', $data)
      );
      $itemStr = json_encode($addItem);
			$result=acnetmg_add_portip($itemStr);
		}
    elseif($actionType === 'edit') {
      $oldData = element('originalData', $data);
      $deleteItem = getItem($oldData);
      $addItem=getItem($data);
      $result=acnetmg_del_portip(json_encode($deleteItem));

      if (element('code', json_decode($result)) === 2000) {
        $result=acnetmg_add_portip(json_encode($addItem));
      }
    }

		return $result;
	}

	public function index() {
		$result = null;

		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = json_decode(file_get_contents("php://input"), true);
			$result = $this->onAction($data);
			echo $result;
		}
		else if($_SERVER['REQUEST_METHOD'] == 'GET') {
			$result = $this->fetch();
			echo json_encode($result);
		}
	}
}

