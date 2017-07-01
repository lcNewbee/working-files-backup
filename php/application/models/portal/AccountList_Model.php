<?php
class AccountList_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->portalsql = $this->load->database('mysqlportal', TRUE);
		$this->load->helper(array('array', 'db_operation'));
        $this->load->library('PortalSocket');
	}
	function get_account_list($data) {
        $parameter = array(
			'db' => $this->portalsql,
			'columns' => '*',
			'tablenames' => 'portal_account',
			'pageindex' => (int) element('page', $data, 1),
			'pagesize' => (int) element('size', $data, 20000),
			'wheres' => "1=1",
			'joins' => array(),
			'order' => array()
		);
      if(isset($data['search'])){
          $parameter['wheres'] = $parameter['wheres'] . " AND loginName LIKE '%".$data['search']."%'";
      }
      if(isset($data['state']) && $data['state'] != '-100'){
          $parameter['wheres'] = $parameter['wheres'] . " AND state='".$data['state']."'";
      }
      $datalist = help_data_page_all($parameter);
		$arr = array(
			'state'=>array('code'=>2000,'msg'=>'ok'),
			'data'=>array(
				'page'=>$datalist['page'],
				'list' => $datalist['data']
			)
		);
		return json_encode($arr);
	}
    function add_account($data) {
        $result = null;
        $insertary = $this->getDbParam($data);
        $result = $this->portalsql->insert('portal_account', $insertary);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    function del_account($data) {
        $result = null;
        $selectedList = $data['selectedList'];
        if($this->notice_socket($this->get_socket_pramse('delete',$selectedList))) {
            foreach($selectedList as $row){
                $this->portalsql->where('id', $row['id']);
			    $result = $this->portalsql->delete('portal_account');
                if($result){
                    //del portal_accountmacs
                    $this->portalsql->where('accountId', $row['id']);
			        $this->portalsql->delete('portal_accountmacs');
                }
		    }
        }
		$result ? $result = json_ok() : $result = json_no('delete fail');
		return json_encode($result);
    }
    function edit_account($data) {
        $result = null;
        $updata = $this->getDbParam($data);
        $updata['id'] = element('id',$data,0);
        $result = $this->portalsql->replace('portal_account', $updata);
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    function reset($data) {
        $result = null;
        //重置密码
        $upd = array(
            'password' => '123456'
        );
        $this->portalsql->where('id', $data['id']);
        $result = $this->portalsql->update('portal_account', $upd);
        $result ? $result = json_ok() : $result = json_no('reset error');
        return json_encode($result);
    }
    function getDbParam($data){
        $linuxdate = (string)exec('date "+%Y-%m-%d %H:%M:%S"');
        $numtime = $this->get_config_time();
        $arr = array(
            'loginName'=>element('loginName',$data,''),
            'password'=>element('password',$data,''),
            'name'=>element('name',$data,''),
            'gender'=>element('gender',$data,''),
            'phoneNumber'=>element('phoneNumber',$data,''),
            'email'=>element('email',$data,''),
            'description'=>element('description',$data,''),
            'date'=>element('date',$data,$linuxdate),
            'time'=>element('time',$data,$numtime),
            'octets'=>element('octets',$data,''),
            'state'=>element('state',$data,0),
            'idnumber'=>element('idnumber',$data,''),
            'address'=>element('address',$data,''),
            'speed'=>element('speed',$data,''),
            'maclimit'=>element('maclimit',$data,''),
            'maclimitcount'=>element('maclimitcount',$data,1),
            'autologin'=>element('autologin',$data,''),
            'ex1'=>element('ex1',$data,''),
            'ex2'=>element('ex2',$data,''),
            'ex3'=>element('ex3',$data,''),
            'ex4'=>element('ex4',$data,''),
            'ex5'=>element('ex5',$data,''),
            'ex6'=>element('ex6',$data,''),
            'ex7'=>element('ex7',$data,''),
            'ex8'=>element('ex8',$data,''),
            'ex9'=>element('ex9',$data,''),
            'ex10'=>element('ex10',$data,'')
        );
        return $arr;
    }

    //socket portal
    function notice_socket($data){
        $result = null;
        $portal_socket = new PortalSocket();
        $result = $portal_socket->portal_socket(json_encode($data));
        if($result['state']['code'] === 2000){
            return TRUE;
        }
        return FALSE;
    }
    function get_socket_pramse($type,$data) {
         $socketarr = array(
            'action'=>$type,
            'resName'=>'accountuser',
            'data'=>array('list'=>$data)
        );
        return $socketarr;
    }

    function get_config_time(){
        $result = 0;
        $query = $this->portalsql->query("select usertime from config where id=1");
        if($query->row()->usertime){
            $result = $query->row()->usertime;
            $result = $result * 60000;
        }
        return $result;
    }
    //充值
    function Recharge($data){
        $result = FALSE;
        $payTime = 0;

        $cardcategory = $this->portalsql->query('select * from  portal_cardcategory where id='.$data['name']);
        $row = $cardcategory->row();
        if(is_object($row)){
            $time = $row->time;
            switch($row->state){
                case 0 : $payTime = $time*1000*60*60;break;
                case 1 : $payTime = $time*1000*60*60*24;break;
                case 2 : $payTime = $time*1000*60*60*24*31;break;
                case 3 : $payTime = $time*1000*60*60*24*31*12;break;
                case 4 : $payTime = $time*1024*1024;break;
            }
        }

        $payType = $row->state;
        switch($payType){
            case '0' : $payType = 2;
                break;
            case '4' : $payType = 4;
                break;
            default:
                $payType = 3;
                break;
        }

        $insertary = array(
            'name' => $row->name,// 名称
            'description' => $row->description,
            'categoryType' => $row->state,// 分类，0-包时卡，1-日卡，2-月卡，3-年卡，4-流量卡
            'payType' => $payType,// 充值类型，2-计时，3-买断，4-流量，null-错误
            'state' => 1,// 状态，<0-未支付，0-新卡，1-已售出，2-已激活，null-错误
            'accountName'=>'admin',// 充值用户
            'payTime' => $payTime,// 计数
            'cdKey' => uniqid('',true),  // CD-KEY
            'payDate' => (string)exec('date "+%Y-%m-%d %H-%M-%S"'),// 充值日期
            'buyDate' => (string)exec('date "+%Y-%m-%d %H-%M-%S"'),// 下单日期
            'money' => $row->money,// 售价
            'maclimit' => $row->maclimit,// MAC限制
            'maclimitcount' => $row->maclimitcount,// 共享数
            'autologin' => $row->autologin,// 无感知
            'speed' => 1, // 限速设置
            'accountDel' => 0,
            'userDel' =>0,

        );
        $result = $this->portalsql->insert('portal_card', $insertary);
        if($result){
            $this->add_user_recharge($data['id'],$payType,$payTime,$row->state,$row->time);
        }
        $result ? $result = json_ok() : $result = json_no('insert error');
        return json_encode($result);
    }
    private function add_user_recharge($id,$payType,$payTime,$state,$sum){
        /*
        echo '</br>payType:'.$payType;
        echo '</br>payTime:'.$payTime;
        echo '</br>state:'.$state;
        echo '</br>sum:'.$sum;
        */
        $result = 0;
        $time = 0;
        $octets = 0;

        $query = $this->portalsql->query('select time,octets,date from portal_account where id='.$id);
        $row = $query->row();
        if(is_object($row)){
            $time = $row->time;
            $octets = $row->octets;
        }
        if($payType === 2){
            //包时卡
            $this->portalsql->set('time',($time+$payTime));
            //$this->portalsql->set('state','2');
            $this->portalsql->where('id', $id);
            $result = $this->portalsql->update('portal_account');
        }
        if($payType === 4){
            //流量卡
            $this->portalsql->set('octets',($octets+$payTime));
            //$this->portalsql->set('state','4');
            $this->portalsql->where('id', $id);
            $result = $this->portalsql->update('portal_account');
        }
        if($payType === 3){
            //买断
            $arydate = explode('-',str_replace(' ','-',$row->date));
            $year = (int)$arydate[0];
            $moth = (int)$arydate[1];
            $day  = (int)$arydate[2];
            $s    = $arydate[3];
            // 分类，0-包时卡，1-日卡，2-月卡，3-年卡，4-流量卡
            if($state == 1){
                $sumday = $day + $sum;
                if($sumday>=30){
                    $moth = $moth + intval($sumday/30);
                    $day  = $sumday%30;
                }else{
                    $day = $sumday;
                }
                if($moth>12){
                    $year = $year + intval($moth/12);
                    $moth = $moth%12;
                }

                $dbtime = $year."-".$moth."-".$day." ".$s;
                $this->portalsql->set('date',$dbtime);
                //$this->portalsql->set('state','3');
                $this->portalsql->where('id', $id);
                $result = $this->portalsql->update('portal_account');
            }
            if($state == 2){
                //月卡
                if(($sum + $moth) > 12){
                   $year = $year + 1;
                }else{
                    $moth = $moth + $sum;
                }
                $dbtime = $year."-".$moth."-".$day." ".$s;
                $this->portalsql->set('date',$dbtime);
                //$this->portalsql->set('state','3');
                $this->portalsql->where('id', $id);
                $result = $this->portalsql->update('portal_account');
            }
            if($state == 3){
                //年卡
                $year = $year + $sum;
                $dbtime = $year."-".$moth."-".$day." ".$s;
                //$this->portalsql->set('state','3');
                $this->portalsql->set('date',$dbtime);
                $this->portalsql->where('id', $id);
                $result = $this->portalsql->update('portal_account');
            }
        }
        return $result;
    }
}
