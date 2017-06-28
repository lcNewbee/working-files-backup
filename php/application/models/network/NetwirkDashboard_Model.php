<?php
class NetwirkDashboard_Model extends CI_Model {
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
        $arr = array(
            'state' => array('code' => 2000, 'msg' => 'ok'),
            'data' => array(
                'dhcpTotal' => 100,//dhcp地址池总数
                'dhcpUsed' => 52,//已经分配的dhcp
                'dhcpPool' => $this->getDhcpSum(),// dhcp地址池数量（注意不是可分配地址个数）
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
    private function getDhcpSum(){
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
                $state = 0;
                $mac = '';
                $negoSpeed = 0;
                $inbound = 0;
                $outbound = 0;
                //对比得到接口状态
                foreach($open_ary as $rowst){
                    if($row['port_name'] == $rowst['Description']){
                        $state = 1;
                        $mac = $rowst['Mac_Address'];
                        $negoSpeed = $rowst['Speed'];
                        $inbound = $rowst['Inbound'];
                        $outbound = $rowst['Outbound'];
                    }
                }
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
        return $arr;
    }

    private function getSpecifiedInfo($portName, $timeRange){
        $ifIndex = null;
        $arr = array(
            'timeInterval' => 0,
            'flowData' => array(),
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
                /*
                array_push($arr['flowData'], $row['InBytes']);
                array_push($arr['timeData'], $row['Timer']);
                */
                $arr['flowData'][] = $row['InBytes'];
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
                $sqlcmd  = "select SUM(InBytes) as upFlow,SUM(OutBytes) as downFlow from ac_interface_information";
                $sqlcmd .= " where IfIndex=(select IfIndex from ac_interface_description";
                $sqlcmd .= " where Timer=(select MAX(Timer) from ac_interface_description)";
                $sqlcmd .= " and Description='{$row['pubifname']}' group by Mac_Address)";

                $data = $this->mysql->query($sqlcmd)->result_array();
                foreach($data as $nrow){
                    $upFlow = $upFlow + (int)$nrow['upFlow'];
                    $downFlow = $downFlow + (int)$nrow['downFlow'];
                }
            }
        }
        return array('upFlow' => $upFlow, 'downFlow' => $downFlow);
    }
}
