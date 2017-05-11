<?php
class AaaServer_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));
	}

    function get_list() {    
        $arr = array(
            'state' => array('code' => 2000,'msg' => 'ok'),
            'data' => array(
                'list' => array()
            )
        );


        $retAry = array();
        $datalist = $this->db->select('id,domain_name')
                        ->from('domain_list')                        
                        ->get()->result_array();

        foreach( $datalist as $row) {          
            $query = $this->db->select('domain_params.attr_value,domain_attr.attr_name')
                                ->from('domain_params')
                                ->join('domain_attr','domain_params.attr_id=domain_attr.id ','left')
                                ->where('domain_params.domain_id', $row['id'])
                                ->get()
                                ->result_array();
            foreach($query as $nrow) {
                switch($nrow['attr_name']){
                    case 'template_name' : 
                        $row['radius_server_type'] = 'local';
                        $row['radius_template_name'] = $nrow['attr_value']; //radius
                        if($nrow['attr_value'] != 'local'){
                            $row['radius_server_type'] = 'remote';
                        }
                        $row['radius'] = $this->getRadius($nrow['attr_value']);//获取radius属性
                        break;                        
                    case 'auth_access_type' : $row['auth_accesstype']  = $nrow['attr_value']; 
                        break;
                    case 'auth_scheme_type' : $row['auth_schemetype']  = $nrow['attr_value']; 
                        break;
                }
                $sql  = "select portal_auth.portal_name,portal_params.attr_value,portal_attr.attr_name";
                $sql .= " from portal_auth";
                $sql .= " left join portal_params on portal_auth.id=portal_params.portal_id";
                $sql .= " left join portal_attr on portal_params.attr_id=portal_attr.id";
                $sql .= " where portal_params.attr_value='{$row['domain_name']}'";
                $portal_data = $this->db->query($sql)->result_array();                              
                if(count($portal_data) > 0){
                    $row['portal_template_name'] = $portal_data[0]['portal_name'];//portal
                    $row['portal_server_type'] = 'local';
                    if( $portal_data[0]['portal_name'] != 'local'){                    
                        $row['portal_server_type'] = 'remote';                    
                    }
                    $row['portalServer'] = $this->getPortal($row['portal_template_name']);//获取portal属性
                    $row['portalRule'] = $this->getPortalRule($row['portal_template_name'], $row['portalServer']['interface_bind']);//获取portal 规则
                }else{
                    $sqllocal  = "select portal_auth.portal_name,portal_params.attr_value,portal_attr.attr_name";
                    $sqllocal .= " from portal_auth";
                    $sqllocal .= " left join portal_params on portal_auth.id=portal_params.portal_id";
                    $sqllocal .= " left join portal_attr on portal_params.attr_id=portal_attr.id";
                    $sqllocal .= " where portal_params.attr_value='local'";
                    $portal_data_local = $this->db->query($sqllocal)->result_array();  
                    if(count($portal_data_local) > 0){
                        $row['portal_template_name'] = $portal_data_local[0]['portal_name'];//portal
                        $row['portal_server_type'] = 'local';
                        if( $portal_data_local[0]['portal_name'] != 'local'){                    
                            $row['portal_server_type'] = 'remote';                    
                        }
                        $row['portalServer'] = $this->getPortal($row['portal_template_name']);//获取portal属性
                        $row['portalRule'] = $this->getPortalRule($row['portal_template_name'], $row['portalServer']['interface_bind']);//获取portal 规则
                        //$row['portalRule'] = array('interface_bind'=>'');
                    }  
                }

                //ssid web
                if($row['portal_server_type'] === 'local') {
                    $portal_ssid = 'local_ssid_' . $row['domain_name'];
                    if($row['domain_name'] == 'local'){
                            $portal_ssid = 'local_ssid_local';
                    }
                    $webquery = $this->portalsql->query("select id,apmac as mac,ssid,address,web from portal_ssid where name='{$portal_ssid}'")->result_array();
                    if(count($webquery) > 0) {
                        $row['portalTemplate'] = $webquery[0];
                    }
                    
                }
            }                        
            $retAry[] = $row;
        }

        $arr['data']['list'] = $retAry;        
        return $arr;
    }

    function add($data){
        $auth_type   = element('auth_accesstype', $data, NULL);
        $radius_type = element('radius_server_type', $data, NULL);
        $portal_type = element('portal_server_type', $data, NULL);        
        
        if($auth_type === '8021x-access'){
            //802.1x 认证

            //802.1x 认证 -> 本地Radius服务器
            if( $radius_type === 'local' ) {                
                //1.创建 Radius 模板
                //2.创建 AAA
                $aaa_ary = array(
                    'radius_template'=> $radius_type,
                    'template_name'=>element('domain_name', $data),
                    'auth_accesstype'=>element('auth_accesstype', $data),
                    'auth_schemetype'=>element('auth_schemetype', $data)                
                );
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
                //3.创建 Portal 模板
                //4.创建 Portal 规则
                //5.创建 Portal 认证 ssid和网页模板  
            }   
            //802.1x 认证 -> 远程Radius服务器
            if( $radius_type === 'remote' ) { 
                //1.创建 Radius 模板
                $radius_ary = array(
                    'template_name' => 'remote_radius_' . $data['domain_name'], 
                    'authpri_ipaddr' => element('authpri_ipaddr', $data['radius'], ''),
                    'authpri_port' => element('authpri_port', $data['radius'], ''), 
                    'authpri_key' => element('authpri_key', $data['radius'], ''),
                    'authsecond_ipaddr' => element('authsecond_ipaddr', $data['radius'], ''), 
                    'authsecond_port' => element('authsecond_port', $data['radius'], ''),
                    'authsecond_key' => element('authsecond_key', $data['radius'], ''),
                    'acctpri_ipaddr' => element('acctpri_ipaddr', $data['radius'], ''),
                    'acctpri_port' => element('acctpri_port', $data['radius'], ''),
                    'acctpri_key' => element('acctpri_key', $data['radius'], ''),
                    'acctsecond_ipaddr' => element('acctsecond_ipaddr', $data['radius'], ''), 
                    'acctsecond_port' => element('acctsecond_port', $data['radius'], ''),
                    'acctsecond_key' => element('acctsecond_key', $data['radius'], ''),
                    'accton_enable' => element('accton_enable', $data['radius'], ''),
                    'accton_sendtimes' => element('accton_sendtimes', $data['radius'], ''),
                    'accton_sendinterval' => element('accton_sendinterval', $data['radius'], ''),
                    'quiet_time' => element('quiet_time', $data['radius'], ''),
                    'resp_time' => element('resp_time', $data['radius'], ''),
                    'retry_times' => element('retry_times', $data['radius'], ''),
                    'acct_interim_interval' => element('acct_interim_interval', $data['radius'], ''),
                    'realretrytimes' => element('realretrytimes', $data['radius']),
                    'nasip' => element('acctpri_ipaddr', $data['radius'], ''),
                    'username_format' => element('username_format', $data['radius'], '')
                ); 
                if(!$this->addRadiusTemplate($radius_ary)){
                    return json_encode(json_no('add 802.1x && remote Radius error!'));
                }
                //2.创建 AAA
                $aaa_ary = array(
                    'radius_template'=> 'remote_radius_' . $data['domain_name'],
                    'template_name'=>element('domain_name', $data),
                    'auth_accesstype'=>element('auth_accesstype', $data),
                    'auth_schemetype'=>element('auth_schemetype', $data)                
                );
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
                //3.创建 Portal 模板
                //4.创建 Portal 规则
                //5.创建 Portal 认证 ssid和网页模板                                 
            }
        }else if($auth_type === 'portal') {
            //portal认证

            //portal认证 -> 本地radius服务器 + 本地Portal服务器
            if($radius_type === 'local' && $portal_type === 'local'){
                //1.创建 Radius 模板 
                //2.创建 AAA
                $aaa_ary = array(
                    'radius_template'=> $radius_type,
                    'template_name'=>element('domain_name', $data),
                    'auth_accesstype'=>element('auth_accesstype', $data),
                    'auth_schemetype'=>element('auth_schemetype', $data)                
                );
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
                
                //3.创建 Portal 模板 

                //4.创建 Portal 规则
                $portal_rule_ary = array(
                    'template_name'=> 'local',
                    'interface_bind'=>(string)element('interface_bind', $data['portalRule'],''),
                    'max_usernum'=>(string)element('max_usernum', $data['portalRule'],'4096'),
                    'auth_mode'=>(string)element('auth_mode', $data['portalRule'],'1'),
                    'auth_ip'=>(string)element('auth_ip', $data['portalRule'],''),
                    'auth_mask'=>(string)element('auth_mask', $data['portalRule'],''),
                    'idle_test'=>(string)element('idle_test', $data['portalRule'],'0')
                );
                if(!$this->addPortalRule($portal_rule_ary)){
                    return json_encode(json_no('add portal rule error!'));
                }
                //5.创建 Portal 认证 ssid和网页模板
                $web_ary = array(
                    'name' => 'local_ssid_' . element('domain_name', $data),
                    'address' => '',//地址
                    'basip' => $this->getInterface(),
                    'web' => element('web',$data['portalTemplate']),//页面模版
                    'des' => element('des',$data['portalTemplate']),//描述
                    'ssid' => element('ssid',$data['portalTemplate']),
                    'apmac' => element('apmac',$data['portalTemplate'], '')
                );            
                if( !$this->portalsql->insert('portal_ssid',$web_ary) ) {
                    return json_encode(json_no('add portal web error!'));
                }
            }

            //portal认证 -> 本地radius服务器 + 远程Portal服务器
            if($radius_type === 'local' && $portal_type === 'remote'){                                
                //1.创建 Radius 模板 
                //2.创建 AAA              
                $aaa_ary = array(
                    'radius_template'=> $radius_type,
                    'template_name'=>element('domain_name', $data),
                    'auth_accesstype'=>element('auth_accesstype', $data),
                    'auth_schemetype'=>element('auth_schemetype', $data)                
                );
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }      
                //3.创建 Portal 模板 
                $portal_tp = array(
                    'ac_ip' => element('ac_ip', $data['portalServer']),
                    'server_ipaddr' => element('server_ipaddr', $data['portalServer']), 
                    'server_key' => element('server_key', $data['portalServer']), 
                    'server_port' => element('server_port', $data['portalServer']),                     
                    'server_url' => element('server_url', $data['portalServer']),                    
                    'template_name' => 'remote_portal_' . $data['domain_name'],
                    'auth_domain' => element('domain_name', $data)
                );
                if(!$this->addPortalTemplate($portal_tp)){
                    return json_encode(json_no('add portal template errot!'));
                }             
                //4.创建 Portal 规则
                $portal_rule_ary = array(
                    'template_name'=> 'remote_portal_' . $data['domain_name'],//
                    'interface_bind'=>(string)element('interface_bind', $data['portalRule'],''),
                    'max_usernum'=>(string)element('max_usernum', $data['portalRule'],'4096'),
                    'auth_mode'=>(string)element('auth_mode', $data['portalRule'],'1'),
                    'auth_ip'=>(string)element('auth_ip', $data['portalRule'],''),
                    'auth_mask'=>(string)element('auth_mask', $data['portalRule'],''),
                    'idle_test'=>(string)element('idle_test', $data['portalRule'],'0')
                );
                if(!$this->addPortalRule($portal_rule_ary)){
                    return json_encode(json_no('add portal rule error!'));
                }
                //5.创建 Portal 认证 ssid和网页模板
            }
            
            //portal认证 -> 远程radius服务器 + 本地Portal服务器
            if($radius_type === 'remote' && $portal_type === 'local'){                
                //1.创建 Radius 模板 
                $radius_ary = array(
                    'template_name' => 'remote_radius_' . $data['domain_name'], 
                    'authpri_ipaddr' => element('authpri_ipaddr', $data['radius'], ''),
                    'authpri_port' => element('authpri_port', $data['radius'], ''), 
                    'authpri_key' => element('authpri_key', $data['radius'], ''),
                    'authsecond_ipaddr' => element('authsecond_ipaddr', $data['radius'], ''), 
                    'authsecond_port' => element('authsecond_port', $data['radius'], ''),
                    'authsecond_key' => element('authsecond_key', $data['radius'], ''),
                    'acctpri_ipaddr' => element('acctpri_ipaddr', $data['radius'], ''),
                    'acctpri_port' => element('acctpri_port', $data['radius'], ''),
                    'acctpri_key' => element('acctpri_key', $data['radius'], ''),
                    'acctsecond_ipaddr' => element('acctsecond_ipaddr', $data['radius'], ''), 
                    'acctsecond_port' => element('acctsecond_port', $data['radius'], ''),
                    'acctsecond_key' => element('acctsecond_key', $data['radius'], ''),
                    'accton_enable' => element('accton_enable', $data['radius'], ''),
                    'accton_sendtimes' => element('accton_sendtimes', $data['radius'], ''),
                    'accton_sendinterval' => element('accton_sendinterval', $data['radius'], ''),
                    'quiet_time' => element('quiet_time', $data['radius'], ''),
                    'resp_time' => element('resp_time', $data['radius'], ''),
                    'retry_times' => element('retry_times', $data['radius'], ''),
                    'acct_interim_interval' => element('acct_interim_interval', $data['radius'], ''),
                    'realretrytimes' => element('realretrytimes', $data['radius']),
                    'nasip' => element('acctpri_ipaddr', $data['radius'], ''),
                    'username_format' => element('username_format', $data['radius'], '')
                );                                                              
                if(!$this->addRadiusTemplate($radius_ary)){                                        
                    return json_encode(json_no('add remote Radius error!'));
                }            
                //2.创建 AAA
                $aaa_ary = array(
                    'radius_template' => 'remote_radius_' . $data['domain_name'], 
                    'template_name'=>element('domain_name', $data),
                    'auth_accesstype'=>element('auth_accesstype', $data),
                    'auth_schemetype'=>element('auth_schemetype', $data)                
                );
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }                
                //3.创建 Portal 模板                                
                //4.创建 Portal 规则
                $portal_rule_ary = array(
                    'template_name'=> 'local',
                    'interface_bind'=>(string)element('interface_bind', $data['portalRule'],''),
                    'max_usernum'=>(string)element('max_usernum', $data['portalRule'],'4096'),
                    'auth_mode'=>(string)element('auth_mode', $data['portalRule'],'1'),
                    'auth_ip'=>(string)element('auth_ip', $data['portalRule'],''),
                    'auth_mask'=>(string)element('auth_mask', $data['portalRule'],''),
                    'idle_test'=>(string)element('idle_test', $data['portalRule'],'0')
                );
                if(!$this->addPortalRule($portal_rule_ary)){
                    return json_encode(json_no('add portal rule error!'));
                }
                //5.创建 Portal 认证 ssid和网页模板
                $web_ary = array(
                    'name' => 'local_ssid_' . element('domain_name', $data),
                    'address' => '',//地址
                    'basip' => $this->getInterface(),
                    'web' => element('web',$data['portalTemplate']),//页面模版
                    'des' => element('des',$data['portalTemplate']),//描述
                    'ssid' => element('ssid',$data['portalTemplate']),
                    'apmac' => element('apmac',$data['portalTemplate'], '')
                );            
                if( !$this->portalsql->insert('portal_ssid',$web_ary) ) {
                    return json_encode(json_no('add portal web error!'));
                }
            }

            //portal认证 -> 远程radius服务器 + 远程Portal服务器
            if($radius_type === 'remote' && $portal_type === 'remote'){
                //1.创建 Radius 模板 
                $radius_ary = array(
                    'template_name' => 'remote_radius_' . $data['domain_name'], 
                    'authpri_ipaddr' => element('authpri_ipaddr', $data['radius'], ''),
                    'authpri_port' => element('authpri_port', $data['radius'], ''), 
                    'authpri_key' => element('authpri_key', $data['radius'], ''),
                    'authsecond_ipaddr' => element('authsecond_ipaddr', $data['radius'], ''), 
                    'authsecond_port' => element('authsecond_port', $data['radius'], ''),
                    'authsecond_key' => element('authsecond_key', $data['radius'], ''),
                    'acctpri_ipaddr' => element('acctpri_ipaddr', $data['radius'], ''),
                    'acctpri_port' => element('acctpri_port', $data['radius'], ''),
                    'acctpri_key' => element('acctpri_key', $data['radius'], ''),
                    'acctsecond_ipaddr' => element('acctsecond_ipaddr', $data['radius'], ''), 
                    'acctsecond_port' => element('acctsecond_port', $data['radius'], ''),
                    'acctsecond_key' => element('acctsecond_key', $data['radius'], ''),
                    'accton_enable' => element('accton_enable', $data['radius'], ''),
                    'accton_sendtimes' => element('accton_sendtimes', $data['radius'], ''),
                    'accton_sendinterval' => element('accton_sendinterval', $data['radius'], ''),
                    'quiet_time' => element('quiet_time', $data['radius'], ''),
                    'resp_time' => element('resp_time', $data['radius'], ''),
                    'retry_times' => element('retry_times', $data['radius'], ''),
                    'acct_interim_interval' => element('acct_interim_interval', $data['radius'], ''),
                    'realretrytimes' => element('realretrytimes', $data['radius']),
                    'nasip' => element('acctpri_ipaddr', $data['radius'], ''),
                    'username_format' => element('username_format', $data['radius'], '')
                );
                if(!$this->addRadiusTemplate($radius_ary)){                    
                    return json_encode(json_no('add remote Radius error!'));
                }            
                //2.创建 AAA
                $aaa_ary = array(
                    'radius_template'=> 'remote_radius_' . $data['domain_name'],
                    'template_name'=> element('domain_name',$data),
                    'auth_accesstype'=>element('auth_accesstype', $data),
                    'auth_schemetype'=>element('auth_schemetype', $data)                
                );
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }                
                //3.创建 Portal 模板
                $portal_tp = array(
                    'ac_ip' => element('ac_ip', $data['portalServer']),
                    'server_ipaddr' => element('server_ipaddr', $data['portalServer']), 
                    'server_key' => element('server_key', $data['portalServer']), 
                    'server_port' => element('server_port', $data['portalServer']),                     
                    'server_url' => element('server_url', $data['portalServer']),                    
                    'template_name' => 'remote_portal_' . $data['domain_name'],
                    'auth_domain' => element('domain_name', $data)
                );
                if(!$this->addPortalTemplate($portal_tp)){
                    return json_encode(json_no('add portal template errot!'));
                }                                 
                //4.创建 Portal 规则
                $portal_rule_ary = array(
                    'template_name'=> 'remote_portal_' . $data['domain_name'],
                    'interface_bind'=>(string)element('interface_bind', $data['portalRule'],''),
                    'max_usernum'=>(string)element('max_usernum', $data['portalRule'],'4096'),
                    'auth_mode'=>(string)element('auth_mode', $data['portalRule'],'1'),
                    'auth_ip'=>(string)element('auth_ip', $data['portalRule'],''),
                    'auth_mask'=>(string)element('auth_mask', $data['portalRule'],''),
                    'idle_test'=>(string)element('idle_test', $data['portalRule'],'0')
                );
                if(!$this->addPortalRule($portal_rule_ary)){
                    return json_encode(json_no('add portal rule error!'));
                } 
                //web                
            }
        }
        return json_encode(json_ok());
    }
    function edit($data) {
        $auth_type   = element('auth_accesstype', $data, NULL);
        $radius_type = element('radius_server_type', $data, NULL);
        $portal_type = element('portal_server_type', $data, NULL); 
        $domain_name = element('domain_name', $data, NULL);

        if($domain_name === 'local') {
            //修改本地aaa模板只能修改端口和 web模板
            //修改 rule
            $ruleda = $this->getPortal('local');
            if( $ruleda['interface_bind'] != ''){
                $portal_rule_ary = array(
                    'template_name'=> 'local',
                    'interface_bind'=>(string)element('interface_bind', $data['portalRule'],''),
                    'max_usernum'=>(string)element('max_usernum', $data['portalRule'],'4096'),
                    'auth_mode'=>(string)element('auth_mode', $data['portalRule'],'1'),
                    'auth_ip'=>(string)element('auth_ip', $data['portalRule'],''),
                    'auth_mask'=>(string)element('auth_mask', $data['portalRule'],''),
                    'idle_test'=>(string)element('idle_test', $data['portalRule'],'0')
                );                
                if(!$this->editPortalRule($portal_rule_ary)){
                    return json_encode(json_no('edit portal rule error!'));
                }
            }     
            //判断web模板是否存在，才修改否则 创建
            if($this->isWebTemplate('local_ssid_' . $domain_name)) {
                //修改web
                $web_ary = array(                
                    'basip' => $this->getInterface(),
                    'web' => element('web',$data['portalTemplate']),//页面模版
                    'des' => element('des',$data['portalTemplate']),//描述
                    'ssid' => element('ssid',$data['portalTemplate']),
                    'apmac' => element('apmac',$data['portalTemplate'], '')
                );
                $this->portalsql->where('name', 'local_ssid_' . $domain_name);
                if( ! $this->portalsql->update('portal_ssid', $web_ary) ) {
                    return json_encode(json_no('edit web Template error'));
                }
            } else {
                //add web
                $web_ary = array(
                    'name' => 'local_ssid_' . $domain_name,
                    'address' => '',//地址
                    'basip' => $this->getInterface(),
                    'web' => element('web',$data['portalTemplate']),//页面模版
                    'des' => element('des',$data['portalTemplate']),//描述
                    'ssid' => element('ssid',$data['portalTemplate']),
                    'apmac' => element('apmac',$data['portalTemplate'],'')
                );            
                if( !$this->portalsql->insert('portal_ssid',$web_ary) ) {
                    return json_encode(json_no('edit -> add portal web error!'));
                }
            }          

        }else{
            //全删除
            //1.删除 Radius 模板
            if( $this->isRadiusTemplate('remote_radius_' . $domain_name) ) {               
                $this->delRadiusTemplate( array('radius_list'=>array('remote_radius_' . $domain_name)) );                    
            }
            //2.删除aaa
            if( $this->isAaaaTemplate($domain_name) ) {
                $this->delAaaTemplate(array('aaa_list'=>array($domain_name)));
            }
            //3.删除Portal 模板
            if( $this->isPortalTemplate('remote_portal_' . $domain_name) ) {
                $this->delPortalTemplate( array('portal_list'=>array('remote_portal_' . $domain_name)) );
            }
            //4.删除Portal 规则
            $data_rule = $this->getPortal('remote_portal_' . $domain_name);
            if($data_rule['interface_bind'] != '') {
                $this->delPortalRule( array('portal_list'=>array($data_rule['interface_bind']))  );
            }
            //5.删除web 网页模板
            $this->delWebTemplate('local_ssid_' . $domain_name);

            //重新添加
            return $this->add($data);
        }
        return json_encode(json_ok());
    }
    function del($data) {
        $del_ary = $data['selectedList'];
        foreach($del_ary as $res) {
            if($res === 'local'){
                continue;
            }
            //1.删除 Radius 模板
            if( $this->isRadiusTemplate('remote_radius_' . $res) ) {               
                $this->delRadiusTemplate( array('radius_list'=>array('remote_radius_' . $res)) );                    
            }
            //2.删除aaa
            if( $this->isAaaaTemplate($res) ) {
                $this->delAaaTemplate(array('aaa_list'=>array($res)));
            }
            //3.删除Portal 模板
            if( $this->isPortalTemplate('remote_portal_' . $res) ) {
                $this->delPortalTemplate( array('portal_list'=>array('remote_portal_' . $res)) );
            }
            //4.删除Portal 规则
            $data_rule = $this->getPortal('remote_portal_' . $res);
            if($data_rule['interface_bind'] != '') {
                $this->delPortalRule( array('portal_list'=>array($data_rule['interface_bind']))  );
            }
            //5.删除web 网页模板
            $this->delWebTemplate('local_ssid_' . $res);
        }
        return json_encode(json_ok());
    }
/*======================================  GET  ========================================*/
    private function getRadius($name) {
        $arr = array(
            'radius_template' => $name
        );
        //server_type 0认证/1计费   server_pri  0主/1备
        $sql  = "select radius_template.template_name,radius_server.server_type,radius_server.server_pri,server_params.attr_value,server_attr.attr_name";
        $sql .= " from radius_template";
        $sql .= " left join radius_server on radius_template.id=radius_server.template_id";
        $sql .= " left join server_params on radius_server.id=server_params.server_id";
        $sql .= " left join server_attr   on server_params.attr_id=server_attr.id";
        $sql .= " where radius_template.template_name='{$name}'";
        $data = $this->db->query($sql)->result_array();
        foreach($data as $row){
            //认证  主
            if($row['server_type'] == 0 && $row['server_pri'] == 0){
                switch($row['attr_name']){
                    case 'server_ip' : $arr['authpri_ipaddr'] = $row['attr_value'];
                        break;
                    case 'server_port' : $arr['authpri_port'] = $row['attr_value'];
                        break;
                    case 'server_key' : $arr['authpri_key'] = $row['attr_value'];
                        break;
                }
            }
            //认证 备
            if($row['server_type'] == 0 && $row['server_pri'] == 1){
                switch($row['attr_name']){
                    case 'server_ip' : $arr['authsecond_ipaddr'] = $row['attr_value'];
                        break;
                    case 'server_port' : $arr['authsecond_port'] = $row['attr_value'];
                        break;
                    case 'server_key' : $arr['authsecond_key'] = $row['attr_value'];
                        break;
                }
            }
            //计费 主
            if($row['server_type'] == 1 && $row['server_pri'] == 0){
                switch($row['attr_name']){
                    case 'server_ip' : $arr['acctpri_ipaddr'] = $row['attr_value'];
                        break;
                    case 'server_port' : $arr['acctpri_port'] = $row['attr_value'];
                        break;
                    case 'server_key' : $arr['acctpri_key'] = $row['attr_value'];
                        break;
                }
            }
            //计费 备
            if($row['server_type'] == 1 && $row['server_pri'] == 1){
                switch($row['attr_name']){
                    case 'server_ip' : $arr['acctsecond_ipaddr'] = $row['attr_value'];
                        break;
                    case 'server_port' : $arr['acctsecond_port'] = $row['attr_value'];
                        break;
                    case 'server_key' : $arr['acctsecond_key'] = $row['attr_value'];
                        break;
                }
            }
        }

        //高级属性
        $sql2  = "select radius_template.template_name,template_params.attr_value,template_attr.attr_name";
        $sql2 .= " from radius_template";
        $sql2 .= " left join template_params on radius_template.id=template_params.template_id";
        $sql2 .= " left join template_attr   on template_params.attr_id=template_attr.id";
        $sql2 .= " where radius_template.template_name='{$name}'";
        $data2 = $this->db->query($sql2)->result_array();
        foreach($data2 as $row){
            switch($row['attr_name']){
                case 'accton_enable' : $arr['accton_enable'] = $row['attr_value'] == 'disable' ? '0' : '1' ;break;
                case 'quiettime' : $arr['quiet_time'] = $row['attr_value'];break;
                case 'resptime' : $arr['resp_time'] = $row['attr_value'];break;
                case 'retrytimes' : $arr['retry_times'] = $row['attr_value'];break;
                case 'acct_interim_interval' : $arr['acct_interim_interval'] = $row['attr_value'];break;
                case 'acct_realretrytimes' : $arr['realretrytimes'] = $row['attr_value'];break;
                case 'nasip' : $arr['nasip'] = $row['attr_value'];break;
                case 'username_format' : $arr['username_format'] = $row['attr_value'];break;                
            }            
        }
        $arr['accton_sendtimes'] = '3';
        $arr['accton_sendinterval'] = '3';
        return $arr;
    }

    private function getPortal($name) {
        $arr = array(
            'portal_template' => $name,
            'interface_bind' => ''
        );
        $sqlcmd  = "select portal_auth.portal_name ,portal_server.server_name,portalserver_params.attr_value,portalserver_attr.attr_name";
        $sqlcmd .= " from portal_auth";
        $sqlcmd .= " left join portal_server on portal_auth.id=portal_server.portal_id";
        $sqlcmd .= " left join portalserver_params on portal_server.id=portalserver_params.portalserver_id";
        $sqlcmd .= " left join portalserver_attr on portalserver_params.attr_id=portalserver_attr.id";
        $sqlcmd .= " where portal_auth.portal_name='{$name}'";
        $data = $this->db->query($sqlcmd)->result_array();
        foreach($data as $row){
            switch($row['attr_name']){
                case 'server_ip' : $arr['server_ipaddr'] = $row['attr_value']; break;
                case 'server_port' : $arr['server_port'] = $row['attr_value']; break;
                case 'server_key' : $arr['server_key'] = $row['attr_value']; break;
                case 'redirect_url' : $arr['server_url'] = $row['attr_value']; break;
                case 'server_ifname' : $arr['interface_bind'] = $row['attr_value']; break;
                case 'ac_ip' : $arr['ac_ip'] = $row['attr_value']; break;
            }            
        }
        return $arr;
    }

    private function getPortalRule($name, $interface) {
        $arr = array(
            'template_name' => $name,
            'interface_bind' => $interface
        );
        $data = $this->db->select('portal_id,portal_name,attr_name,attr_value')
                        ->from('portal_auth')
                        ->join('portal_params','portal_auth.id=portal_params.portal_id')
                        ->join('portal_attr','portal_attr.id=portal_params.attr_id')
                        ->where('portal_auth.portal_name',$name)
                        ->get()->result_array();

        foreach($data as $res) {
            switch($res['attr_name']){
                case 'auth_maxuser':$arr['max_usernum'] = $res['attr_value'];break;
                case 'auth_mode':$arr['auth_mode'] = $res['attr_value'];break;
                case 'auth_mask':$arr['auth_mask'] = $res['attr_value'];break;
                case 'auth_ipaddr':$arr['auth_ip'] = $res['attr_value'];break;
                case 'auth_domain':$arr['auth_domain'] = $res['attr_value'];break;
                case 'auth_nasid':$arr['auth_nasid'] = $res['attr_value'];break;
                case 'vrrrp_id':$arr['vrrrp_id'] = $res['attr_value'];break;
                case 'traffic_flag':$arr['traffic_flag'] = $res['attr_value'];break;
                case 'acctinterim_flag':$arr['acctinterim_flag'] = $res['attr_value'];break; 
                case 'twoauth_exempt_flag':$arr['idle_test'] = $res['attr_value'];break;
            }               
        }
        return $arr;
    }
    
    private function getPortalWeb(){

    }

    private function getInterface() {
        $data = $this->db->select('port_name,ip1')
                ->from('port_table')
                ->get()
                ->result_array();
        if( count($data) >0 ){
            return $data[0]['ip1'];
        }
        return  $_SERVER['SERVER_ADDR'];
    }
/*=======================================  ADD  =======================================*/
    //1.创建 Radius 模板
    private function addRadiusTemplate($data) {
        $ret = radius_add_template_name(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    //2.创建 AAA
    private function addAaaTemplate($data) {        
        $ret = aaa_add_template_name(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    //3.创建 Portal 模板
    private function addPortalTemplate($data){
        $ret = portal_add_template_name(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    //4.创建 Portal 规则
    private function addPortalRule($data) {
        if($data['interface_bind'] == ''){
            return TRUE;
        }
        $ret = portal_set_template_attr(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    //5.创建 Portal 认证 ssid和网页模板

/*=======================================  Del   =======================================*/
    // 1.Radius 模板
    private function delRadiusTemplate($data) {
        $ret = radius_del_template_name(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    // 2. Aaa
    private function delAaaTemplate($data) {
        $ret = aaa_del_template_name(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    // 3. Portal 模板
    private function delPortalTemplate($data) {
        $ret = portal_del_template_name(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    // 4. Portal 规则
    private function delPortalRule($data) {
        $ret = portal_del_template_attr(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    // 5. web 网页模板
    private function delWebTemplate($name) {
        $this->portalsql->where('name', $name);
        if( $this->portalsql->delete('portal_ssid') ){
            return TRUE;
        }
        return FALSE;
    }


/*=======================================  Edit  =======================================*/
    // 1.Radius
    private function editRadiusTemplate($data){
        $ret = radius_edit_template_name(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    // 2. Aaa
    private function editAaaTemplate($data){
        $ret = aaa_edit_template_name(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    // 3. Portal 模板
    private function editPortalTemplate($data){
        $ret = portal_edit_template_name(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    // 4. Portal 规则
    private function editPortalRule($data){
        $ret = portal_set_template_attr(json_encode($data));
        $obj = json_decode($ret);
        if($obj->state->code == 2000){
            return TRUE;
        }
        return FALSE;
    }
    // 5. web 网页模板
/*=======================================  select  =======================================*/
    //判断radius模板是否存在
    private function isRadiusTemplate($name) {
        $ret = $this->db->query("select * from radius_template where template_name='{$name}'")->result_array();
        if(count($ret) > 0 ){
            return TRUE;
        }
        return FALSE;
    }
    //判断aaa 模板是否存在
    private function isAaaaTemplate($name) {
        $ret = $this->db->query("select * from domain_list where domain_name='{$name}'")->result_array();
        if(count($ret) > 0 ){
            return TRUE;
        }
        return FALSE;
    }
    //判断portal模板是否存在
    private function isPortalTemplate($name) {
        $ret = $this->db->query("select * from portal_auth where portal_name='{$name}'")->result_array();
        if(count($ret) > 0 ){
            return TRUE;
        }
        return FALSE;
    }
    //判断portal 规则是否存在
    private function isPortalRule($name) {
        $data = $this->db->select('portal_id,portal_name,attr_name,attr_value')
                        ->from('portal_auth')
                        ->join('portal_params','portal_auth.id=portal_params.portal_id')
                        ->join('portal_attr','portal_attr.id=portal_params.attr_id')
                        ->where('portal_auth.portal_name',$name)
                        ->get()->result_array();
        return FALSE;
    }
    //判断Web模板是否存在
    private function isWebTemplate($name) {
        $ret = $this->portalsql->query("select * from portal_ssid where name='{$name}'")->result_array();
        if(count($ret) > 0 ){
            return TRUE;
        }
        return FALSE;
    }
}
