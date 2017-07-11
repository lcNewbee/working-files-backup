<?php
class NetworkDashboard_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
		$this->mysql = $this->load->database('mysqli', TRUE); //netmanager
		$this->load->helper(array('array', 'db_operation'));
	}
	public function get_list($data) {
		$portName = element('portName', $data, 'eth0');
		$timeRange = element('timeRange', $data, 1);

        $interfaceList = $this->getInterfaceState();
        $flowary = $this->getNetworkFlow();
        $dhcpary = $this->getAllDhcp();
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'dhcpTotal' => $dhcpary['all'],//dhcp地址池总数
                'dhcpUsed' => $dhcpary['use'],//已经分配的dhcp
                'dhcpPool' => $this->getDhcpNumber(),// dhcp地址池数量（注意不是可分配地址个数）
                'upFlow' => $flowary['upFlow'],//外部网络数据上传总量，单位：B（字节）
                'downFlow' => $flowary['downFlow'],// 外部网络数据下载总量，单位：B（字节）
                'natNum' => $this->getNatSum(),
                'interfaceList' => $interfaceList,
                'rateHis' => $this->getSpecifiedInfo($portName, $timeRange)
            )
        );
        return json_encode($arr);
	}
    //获取dhcp个数
    private function getDhcpNumber(){
        $query = $this->db->query('select id from pool_list')->result_array();
        if(count($query) > 0){
            return count($query);
        }
        return 0;
    }
    private function getInterfaceState(){        
        $arr = array();
        $query = $this->db->query('select portid,port_name,ip1,adminstate,mgifname from port_table')->result_array();
        if(count($query) > 0){      
            $sqlcmd  = "select a.Description,a.Mac_Address,b.Speed,b.Inbound,b.Outbound"; 
            $sqlcmd .= " from ac_interface_description a";
            $sqlcmd .= " left join (select * from ac_interface_information where Timer=(select MAX(Timer) from ac_interface_information) ) as b on a.IfIndex=b.IfIndex";
            $sqlcmd .= " where a.Timer=(select MAX(ac_interface_description.Timer) from ac_interface_description)";  
            $sqlcmd .= " group by a.Mac_Address";
            $open_ary = $this->mysql->query($sqlcmd)->result_array();
            foreach($query as $row){                                
                $mac = '';
                $negoSpeed = 0;
                $inbound = 0;
                $outbound = 0;
                //对比得到接口状态
                foreach($open_ary as $rowst){
                    if($row['port_name'] == $rowst['Description']){
                        $mac = $rowst['Mac_Address'];
                        $negoSpeed = $rowst['Speed'];
                        $inbound = $rowst['Inbound'];
                        $outbound = $rowst['Outbound'];
                    }
                }
                $state = $this->getNetworkState($row['port_name']);
                $arr[] = array(
                    'name' => $row['port_name'],
                    'enable' => (string)$state,
                    'ip' => $row['ip1'],
                    'mac' => $mac,
                    'users' => 0,
                    'negoSpeed' => 0,
                    'downRate' => $inbound,
                    'upRate' => $outbound
                );                                
            }
        }

        //获取用户数
        $result = array();
        $dhcpary = $this->getAllDhcp();        
        foreach($arr as $row){            
            foreach($dhcpary['data'] as $nrow){
                if($row['ip'] == $nrow['ippoolnet']){
                    $row['users'] = $row['users'] + $nrow['ippooluse'];
                }
            }
            $result[] = $row;
        }

        return $result;
    }

    private function getSpecifiedInfo($portName, $timeRange){
        $ifIndex = null;
        $arr = array(
            'timeInterval' => 0,
            'uploadRateData' => array(),//上行速率
            'downRateData' => array(),//下行速率
            'timeData' => array()
        );
        //获取扫描周期
        $cycle = $this->db->query('select acstatistime from capwap')->result_array();
        if(count($cycle) > 0){
            $arr['timeInterval'] = $cycle[0]['acstatistime'];
        }        
        //获取流量集合        
        $sqlcmd  = "select IfIndex from ac_interface_description where Timer=(select MAX(Timer) from ac_interface_description)";
        $sqlcmd .= "  and Description='{$portName}' group by Mac_Address";
        
        $query = $this->mysql->query($sqlcmd)->result_array();        
        if(count($query) > 0){
            $ifIndex = $query[0]['IfIndex'];
        }             
        if($ifIndex > 0){
            $sql_fow  = "select * from ac_interface_information";
            $sql_fow .= " where Timer>=date_sub((select MAX(Timer) from ac_interface_description),interval {$timeRange}  HOUR)";
            $sql_fow .= " and IfIndex={$ifIndex}";
            $fow_ary = $this->mysql->query($sql_fow)->result_array();
            foreach($fow_ary as $row){
                $arr['uploadRateData'][] = $row['Outbound'];
                $arr['downRateData'][] = $row['Inbound'];
                $arr['timeData'][] = $row['Timer'];
            }
        }
        return $arr;
    }

    private function getNatSum(){
        $query = $this->db->query('select id from nat_table')->result_array();
        if(count($query) > 0){
            return count($query);
        }
        return 0;
    }

    private function getNetworkFlow(){
        $upFlow = 0;
        $downFlow = 0;
        //获取所有net
        $query = $this->db->query('select * from nat_table')->result_array();
        foreach($query as $row){
            if($row['pubifname'] != null && $row['pubifname'] != ''){
                //{$row['pubifname']}
                /*
                $sqlcmd  = "select * from (select * from ac_interface_information order by Id desc) as t1";
                $sqlcmd .= " where IfIndex=(select MAX(IfIndex) from ac_interface_description where Timer=(";
                $sqlcmd .= " select Timer from ac_interface_description where id=(select MAX(Id) from ac_interface_description)";
                $sqlcmd .= " ) and Description='{$row['pubifname']}')  group by IfIndex";
                */
                $sqlcmd  = "select * from (select * from ac_interface_information order by Id desc) as t1";
                $sqlcmd .= " where IfIndex=(";
                $sqlcmd .= "select MAX(IfIndex) from ac_interface_description where  Description='{$row['pubifname']}'";
                $sqlcmd .= ") group by IfIndex";

                $data = $this->mysql->query($sqlcmd)->result_array();
                if(count($data) > 0){
                    $downFlow = $downFlow + $data[0]['InBytes'];
                    $upFlow = $upFlow + $data[0]['OutBytes'];                    
                }
            }
        }
        return array('upFlow' => $upFlow, 'downFlow' => $downFlow);
    }

    //获取dhcp总数和分配出去的数量
    private function getAllDhcp() { 
        $data = array();       
        $dhcp_sum = 0;
        $dhcp_use = 0;
        $str = dhcpd_get_ippool_info();
        $ary = json_decode($str, true);
        if($ary['state']['code'] == 2000){
            $data = $ary['data']['list'];
            foreach ($ary['data']['list'] as $row) {
                $dhcp_sum = $dhcp_sum + $row['ippoolall'];
                $dhcp_use = $dhcp_use + $row['ippooluse'];
            }            
        }
        return array('data' => $data, 'all' => $dhcp_sum, 'use' => $dhcp_use);
    }

    //判断网卡连接状态ethtool eth4|grep detected
    private function getNetworkState($name){
        $ret = exec("ethtool {$name}|grep detected");
        if(strstr($ret, 'yes')){
            return true;
        }
        return false;
    }
}
