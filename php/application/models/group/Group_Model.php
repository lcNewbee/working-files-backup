<?php
class Group_Model extends CI_Model {
    protected $mysql;
	public function __construct() {
		parent::__construct();
        $this->load->library('session');
		$this->load->database();
		$this->load->helper(array('array', 'my_customfun_helper'));
	}
    function get_apgroup_info() {
		$apGroups = $this->db->select('ap_group.id,ap_group.group_name,ap_group.remark,wids_template.acltype')
		                          ->from('ap_group')
		                          ->join('wids_template','ap_group.wids_tmp_id=wids_template.id','left')
		                          ->where('ap_group.id >1')
		                          ->get()->result_array();

		$allGroupAps = $this->db->select('id')
		                          ->from('ap_list')
		                          ->get()->result_array();
		$retList = array();
		// 		所有组
		      array_push($retList, array(
		          'groupname' => 'All Group',
		          'remark' => '',
		          'apNum' => sizeof($allGroupAps),
		          'id' => - 100
		          )
		      );
		foreach ($apGroups as $group) {
			$groupItem = array(
			              'groupname' => element('group_name', $group),
			              'remark' => element('remark', $group, ''),
			              'id' => element('id', $group),
			              'aclType'=> element('acltype',$group)
			          );
			$aps = $this->db->select('group_id')
			                          ->from('ap_list')
			                          ->where('group_id', $groupItem['id'])
			                          ->get()->result_array();

			$groupItem['apNum'] = sizeof($aps);
			array_push($retList, $groupItem);
		}
		$result = array('state' => array('code' => 2000, 'msg' => 'OK'), 'data' => array('list' => $retList));
		return $result;
	}
    function add_apgroup($data) {
        $result = null;
        $temp_data = $this->getCgiParam($data);
        $result = axc_add_apgroup(json_encode($temp_data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log
            $logary = array(
                'type'=>'Add',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Add ApGroup ".$temp_data['groupname'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    function up_apgroup($data) {
        $result = null;
        $temp_data= $this->getCgiParam($data);
        $result=axc_modify_apgroup(json_encode($temp_data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log
            $logary = array(
                'type'=>'Update',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Update ApGroup ".$temp_data['groupname'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    function del_apgroup($data) {
        $result = null;
        $result = axc_del_apgroup(json_encode($data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log
            $logary = array(
                'type'=>'Delete',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Delete ApGroup ".$data['groupid'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    function ap_move($data) {
        $result = null;
        $result = axc_aps_move_to_apgroup(json_encode($data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log
            $logary = array(
                'type'=>'Move',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Move AP ID ".$data['groupid']."-->".$data['targetid'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    function del_apgroup_ap($data) {
        $result = null;
        $temp_data = array(
            'aplist'=>element('aplist', $data),
            'groupid'=>(int)element('groupid', $data, -1),
        );
        $result = axc_del_aptogroup(json_encode($temp_data));
        $cgiObj = json_decode($result);
        if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
            //log
            $logary = array(
                'type'=>'Delete',
                'operator'=>element('username',$_SESSION,''),
                'operationCommand'=>"Delete ap ,Target group id=".$temp_data['groupid'],
                'operationResult'=>'ok',
                'description'=>""
            );
            Log_Record($this->db,$logary);
        }
        return $result;
    }
    function add_apgroup_ap($data) {
        $result = null;
        $temp_data = array(
            'apmac'=>element('apmac', $data),
            'name'=>substr(element('name', $data),0,31),
            'model'=>element('model', $data),
            'groupid'=>(int)element('groupid', $data, -1),
        );
        if (element('type', $data) === 'auto') {
            $temp_data = array(
                'groupid'=>(int)element('groupid', $data, -1),
                'autoaplist'=>element('aplist', $data),
            );
        }
        $q = $this->db->select('name')
                        ->from('ap_list')
                        ->where('name', element('name', $data))
                        ->get()->result_array();

        $q_mac = $this->db->select('mac')
                        ->from('ap_list')
                        ->where('mac', element('apmac', $data))
                        ->get()->result_array();

        if(sizeof($q)> 0) {
            $result=array(
                'state'=>array(
                    'code'=>6000,
                    'msg'=>'the apname is not availble!'
                )
            );
            $result = json_encode($result);
        } elseif (sizeof($q_mac) > 0) {
            $result=array(
                'state'=>array(
                    'code'=>6001,
                    'msg'=>'mac is not availble!'
                )
            );
            $result = json_encode($result);
        } else {
            $result = axc_add_aptogroup(json_encode($temp_data));
            $cgiObj = json_decode($result);
            if( is_object($cgiObj) && $cgiObj->state->code === 2000) {
                //log
                $logary = array(
                    'type'=>'Add',
                    'operator'=>element('username',$_SESSION,''),
                    'operationCommand'=>"Add ap Target group id=".$temp_data['groupid'],
                    'operationResult'=>'ok',
                    'description'=>""
                );
                Log_Record($this->db,$logary);
            }
        }
        return $result;
    }
    function getCgiParam($oriData) {
		$retData = array(
			'groupname' => element('groupname', $oriData),
			'remark' => element('remark', $oriData),
			'groupid' => (int)element('id', $oriData, -1),
			'aplist' => element('aplist', $oriData, -1)
		);
		return $retData;
	}
}
