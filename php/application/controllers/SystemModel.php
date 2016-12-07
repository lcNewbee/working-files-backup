<?php
defined('BASEPATH') OR exit('No direct script access allowed');
// require_once('/libraries/Response.php');
class SystemModel extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$query=$this->db->select('id,name,radio_num as radionum,vender')
              ->from('ap_model')
              ->get()->result_array();

        $state=array(
            'code'=>2000,
            'msg'=>'OK'
        );
        $page=array(
            "start"=>(int) element('start',$_GET,1),
            "size"=> (int)element('size',$_GET,20),
            "currPage"=>(int)element('currPage',$_GET,1),
            "totalPage"=>(int)element('totalPage',$_GET,1),
            "total"=>(int)element('total',$_GET,11),
            "pageCount"=>(int)element('pageCount',$_GET,11),
            "nextPage"=>(int)element('nextPage',$_GET,-1),
            "lastPage"=>(int)element('lastPage',$_GET,1)
        );

        $result=array(
            'state'=>$state,
            'data'=>array(
                'page'=>$page,
                'list'=>$query
            )
        );
		return $result;
	}
    
    function onAction($data) {
        $result = null;
        $actionType = element('action', $data);
        $selectList = element('selectedList', $data);
        if ($actionType === 'add') {
            $temp_data = $this->getCgiParam($data);
            $result = axc_add_apmodel(json_encode($temp_data));
        } elseif ($actionType === 'edit') {
            $temp_data = $this->getCgiParam($data);
            $result = axc_modify_apmodel(json_encode($temp_data));
        } elseif ($actionType === 'delete') {
            foreach ($selectList as $item) {
                $deleteItem = array('name' => element('name', $item));
                $result = axc_del_apmodel(json_encode($deleteItem));
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
        } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $result = $this->fetch();
            echo json_encode($result);
        }
    }
    function getCgiParam($oriData) {
        $retData = array(
            'name'=>element('name', $oriData),
            'hardware'=>element('hardware', $oriData,''),
            'radionum'=>(int)element('radionum', $oriData),
            'vendor'=>(int)element('vendor', $oriData),
        );
        return $retData;
    }
}
