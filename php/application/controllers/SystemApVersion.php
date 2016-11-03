<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemApVersion extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$query=$this->db->select('id,model,subversion')
              ->from('ap_firmware')
              ->get()->result_array();
   $keys = array(
      'id'=>'id',
      'model'=> 'model',
      'subversion'=>'softVersion'
    );
    $newArray = array();
    foreach($query as $key=>$val) {
      $newArray[$key] = array();
      foreach($val as $k=>$v) {
        $newArray[$key][$keys[$k]] = $v;
      }
    }
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
						      'list'=>$newArray
						      )
						    );
		return $result;
	}
   public function do_upload()
    {
    $config['upload_path'] = '/etc/Ap_ver';
    $config['overwrite']=true;
    $config['max_size'] = 0;
    $config['allowed_types'] = '*';

    $this->load->library('upload', $config);

    if (!$this->upload->do_upload('versionFile')) {
      $error = array('error' => $this->upload->display_errors());
      $result = array(
        'state'=>array(
          'code'=>4000,
          'msg'=>$error
        )
      );
    } else {
      $data = array('upload_data' => $this->upload->data());
      $result = array(
        'state'=>array(
          'code'=>2000,
          'msg'=>'OK'
        ),
        'data'=>$data
      );
    }
		return $result;
    }
	function onAction($data) {
    if (!$data) {
      $data = $_POST;
    }
		$result = null;
		$actionType = element('action', $data);
    $selectList = element('selectedList', $data);
    // function getCgiParam($oriData) {
    //   $retData = array(
    //     'vendor'=>element('vendor',$oriData, 48208),
    //     'model'=>element('model', $oriData),
    //     'sfver'=>element('softVersion', $oriData),
    //     'fmname'=>$filename,
    //     'filepath'=>$filepath,
    //     'active'=>element('active', $oriData)
    //   );
    //   return $retData;
    // }
		if ($actionType === 'add') {
      $upload_data=$this->do_upload();
      if($upload_data['state']['code']==2000){
        $filename=$this->upload->data('file_name');
        $filepath=$this->upload->data('full_path');
         $retData = array(
        'vendor'=>element('vendor',$data, 48208),
        'model'=>element('model', $data),
        'sfver'=>element('softVersion', $data),
        'fmname'=>$filename,
        'filepath'=>$filepath,
        'active'=>element('active', $data)
      );
      }
      $result=axc_add_apfirmware(json_encode($retData ));
		}
    elseif($actionType === 'active'){
    $upload_data=$this->do_upload();
      if($upload_data['state']['code']==2000){
        $filename=$this->upload->data('file_name');
        $filepath=$this->upload->data('full_path');
         $retData = array(
        'vendor'=>element('vendor',$data, 48208),
        'model'=>element('model', $data),
        'sfver'=>element('softVersion', $data),
        'fmname'=>$filename,
        'filepath'=>$filepath,
        'active'=>element('active', $data)
      );
      }
     $result=axc_active_apfirmware(json_encode($retData));
    }
    elseif($actionType === 'edit'){
      $upload_data=$this->do_upload();
      if($upload_data['state']['code']==2000){
        $filename=$this->upload->data('file_name');
        $filepath=$this->upload->data('full_path');
         $retData = array(
        'vendor'=>element('vendor',$data, 48208),
        'model'=>element('model', $data),
        'sfver'=>element('softVersion', $data),
        'fmname'=>$filename,
        'filepath'=>$filepath,
        'active'=>element('active', $data)
      );
      }
      $result=axc_modify_apfirmware(json_encode($retData));
    }
    elseif($actionType === 'delete'){
      foreach($selectList as $item) {
          $deleteItem = array(
            'model'=>element('model', $item),
            'sfver'=>element('softVersion', $item),
          );
        $result=axc_del_apfirmware(json_encode($deleteItem));
      }
	  }

    return $result;
  }
	public function index(){
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
