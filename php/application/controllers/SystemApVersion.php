<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class SystemApVersion extends CI_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->load->helper('array');
	}
	function fetch(){
		$query=$this->db->select('id,model,subversion,fm_name,upd_path,active')
              ->from('ap_firmware')
              ->get()->result_array();
   $keys = array(
      'id'=>'id',
      'model'=> 'model',
      'subversion'=>'softVersion',
      'fm_name'=>'fileName',
      'upd_path'=>'uploadPath',
      'active'=>'active'
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
        'active'=>(int)element('active', $data,0)
      );
      }
      $result=axc_add_apfirmware(json_encode($retData ));
		}
    elseif($actionType === 'active'){
      $retData = array(
        'vendor'=>element('vendor',$data, 48208),
        'model'=>element('model', $data),
        'sfver'=>element('softVersion', $data),
        'fmname'=>element('fileName', $data),
        'filepath'=>element('uploadPath', $data),
        'active'=>(int)element('active', $data,0)
      );
      $query_active=$this->db->select('id,active')
          ->from('ap_firmware')
          ->where('id',$item['id'])
          ->get()->result_array();
        if($query_active['0']['active']==0){
          $result=axc_active_apfirmware(json_encode($retData));
        }
        else{
         $state=array(
				      'code'=>6000,
				      'msg'=>"The version of the related model you select is actived, cancellation  option doesn't work!you should active another version when you want to  cancel the current version!"
				    );
            $result=$state;
        }
    }
    elseif($actionType === 'edit'){
      $upload_data=$this->do_upload();
      if($upload_data['state']['code']==2000){
        $filename=$this->upload->data('file_name');
        $filepath=$this->upload->data('full_path');
         $retData = array(
        'vendor'=>element('vendor',$data, 48208),
        'model'=>element('model', $data,''),
        'sfver'=>element('softVersion', $data,''),
        'fmname'=>$filename,
        'filepath'=>$filepath,
        'active'=>(int)element('active', $data,0)
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
          $query_active=$this->db->select('id,active')
            ->from('ap_firmware')
            ->where('id',$item['id'])
            ->get()->result_array();
          if($query_active['0']['active']==1){
            $state=array(
				      'code'=>6000,
				      'msg'=>"The current version is actived,you can't delete it. If you want to delete it,please active another version!"
				    );
            $result=$state;
          }
          else{
            $del_result=axc_del_apfirmware(json_encode($deleteItem));
            $del_result_array=json_decode($del_result,true);
            if ($del_result_array['state']['code']==2000){
               $file=$item['uploadPath'];
                $delete_file=@unlink ($file);
                if($delete_file == true){
                 $result=$del_result;
                }
                else{
                   $state=array(
                      'code'=>6000,
				              'msg'=>'fail to delete the file in the folder!'
                   );
                   $result=$state;
                }
            }
            else{
                $result=$del_result;
                }
            }
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
