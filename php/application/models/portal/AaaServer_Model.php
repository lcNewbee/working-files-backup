<?php
class AaaServer_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
        $this->portalsql = $this->load->database('mysqlportal', TRUE);
        $this->load->helper(array('array', 'db_operation'));
	}
    function get_list(){
        $arr = array(
            'state' => array('code' => 2000,'msg' => 'ok'),
            'data' => array(
                'list' => array()
            )
        );
        $ret = $this->db->select('id,portal_rule_type,name,radius_template,domain_name,portal_template,portal_server_type,portal_rule,ssid,mac')
                        ->from('portal_config')
                        ->get()
                        ->result_array();

        $retAry = array();
        if( count($ret) > 0 ){
            foreach($ret as $row) {                
                $row['radius_server_type'] = $row['radius_template'] == 'local' ? 'local' : 'remote';
                $row['radius'] = $this->getRadius($row['radius_template']);//获取radius属性

                $row['portal_server_type'] = $row['portal_server_type'];
                $row['portalServer'] = $this->getPortal($row['portal_template']);//获取portal属性

                $row['portalRule'] = $this->getPortalRule($row['portal_template'], $row['portalServer']['interface_bind']);//获取portal 规则

                if($row['portal_rule_type'] === 'ssid'){                                        
                    $sqlcmd = "select id,apmac as mac,ssid,address,web from portal_ssid where ssid='{$row['ssid']}'";
                    if($row['mac'] != '' && $row['mac'] != null){
                        $sqlcmd = "select id,apmac as mac,ssid,address,web from portal_ssid where ssid='{$row['ssid']}' and apmac='{$row['mac']}'";                        
                    }
                    $webquery = $this->portalsql->query($sqlcmd)->result_array();
                    if(count($webquery) > 0) {
                        $row['portalTemplate'] = $webquery[0];
                    }
                }
                $domain_data = $this->getDomainState($row['domain_name']);
                $row['auth_accesstype'] = $domain_data['auth_accesstype'];
                $row['auth_schemetype'] = $domain_data['auth_schemetype'];
                $retAry[] = $row;
            }            
        }
        $arr['data']['list'] = $retAry;

        return $arr;
    }

    function add($data){        
        if( $this->isportalConfig($data['name']) ){
            return json_encode(json_no('name error', 6405));
        }
        $auth_type   = element('auth_accesstype', $data, NULL);
        $radius_type = element('radius_server_type', $data, NULL);
        $portal_type = element('portal_server_type', $data, NULL);  
        $portal_rule_type = element('portal_rule_type', $data, NULL);//ssid||port        
        /**
         * 1.radius
         * 2.aaa
         * 3.portal template
         * 4.portal rule
         * 5.web ssid
         * 6.产生配置记录
         * 7.下发ssid
        */
        if($auth_type === '8021x-access'){
            //802.1x 认证

            //802.1x 认证 -> 本地Radius服务器
            if( $radius_type === 'local' ) {                
                //1.创建 Radius 模板
                //2.创建 AAA
                $aaa_ary = array(
                    'radius_template'=> $radius_type,
                    'template_name'=>element('name', $data),
                    'auth_accesstype'=>element('auth_accesstype', $data),
                    'auth_schemetype'=>element('auth_schemetype', $data)                
                );
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
                //3.创建 Portal 模板
                //4.创建 Portal 规则
                //5.创建 Portal 认证 ssid和网页模板  
                //6.添加配置信息
                $config_ary = array(
                    'radius_template' => 'local',
                    'name' => element('name', $data),
                    'domain_name' => element('name', $data),
                    'mac' => ''
                );
                $this->db->insert('portal_config', $config_ary);
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
                    'radius_template'=> 'remote_radius_' . $data['name'],
                    'template_name'=>element('name', $data),
                    'auth_accesstype'=>element('auth_accesstype', $data),
                    'auth_schemetype'=>element('auth_schemetype', $data)                
                );
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
                //3.创建 Portal 模板
                //4.创建 Portal 规则
                //5.创建 Portal 认证 ssid和网页模板  
                //6.添加配置信息
                $config_ary = array(
                    'radius_template' => 'remote_radius_' . $data['name'],
                    'name' => element('name', $data),
                    'domain_name' => element('name', $data),
                    'mac' => ''
                );
                $this->db->insert('portal_config', $config_ary);                               
            }
        }else if($auth_type === 'portal') {
            //portal认证

            //portal认证 -> 本地radius服务器 + 本地Portal服务器
            if($radius_type === 'local' && $portal_type === 'local'){
                //选择AP的SSID方式弹portal
                if($portal_rule_type === 'ssid'){                    
                    //5.创建 Portal 认证 ssid和网页模板
                    $ssid = element('ssid',$data['portalTemplate'], '');
                    $apmac = element('apmac',$data['portalTemplate'], '');
                    if($ssid != ''){
                        //用户选择了ssid 和apmac  添加
                        if($apmac != ''){                            
                            // add
                            $web_ary = array(
                                'name' => 'local_ssid_' . element('name', $data),
                                'address' => '',//地址
                                'basip' => $this->getInterface(),
                                'web' => element('web',$data['portalTemplate']),//页面模版
                                'des' => element('des',$data['portalTemplate']),//描述
                                'ssid' => $ssid,
                                'apmac' => $apmac
                            );            
                            if( !$this->portalsql->insert('portal_ssid',$web_ary) ) {
                                return json_encode(json_no('add portal web error!'));
                            }
                        }else{
                            //选择ssid 但未选择apmac 修改
                            //没有apmac  ->  修改数据库中匹配到ssid 当没apmac的记录，
                            $ssid_data = $this->portalsql->query("select * from portal_ssid where ssid='{$ssid}' and apmac=''")->result_array();
                            if(count($ssid_data) > 0){
                                $web_ins = array(
                                    'name' => 'local_ssid_' . element('name', $data),
                                    'address' => '',//地址
                                    'basip' => $this->getInterface(),
                                    'web' => element('web',$data['portalTemplate']),//页面模版
                                    'des' => element('des',$data['portalTemplate']),//描述
                                    'ssid' => $ssid,
                                    'apmac' => $apmac
                                );                            
                                $this->portalsql->where("ssid='{$ssid}' AND apmac=''");
                                $this->portalsql->update('portal_ssid', $web_ins);
                            }else{
                                //没有就添加
                                $web_ary = array(
                                    'name' => 'local_ssid_' . element('name', $data),
                                    'address' => '',//地址
                                    'basip' => $this->getInterface(),
                                    'web' => element('web',$data['portalTemplate']),//页面模版
                                    'des' => element('des',$data['portalTemplate']),//描述
                                    'ssid' => $ssid,
                                    'apmac' => $apmac
                                );            
                                if( !$this->portalsql->insert('portal_ssid',$web_ary) ) {
                                    return json_encode(json_no('add portal web error!'));
                                }
                            }                            
                        }                                                
                    }                    
                    
                    //6.添加配置信息
                    $config_ary = array(
                        'name' => element('name', $data),
                        'portal_rule_type' => element('portal_rule_type', $data, 'ssid'),
                        'radius_template' => 'local',
                        'domain_name' => 'local',//domain域默认用local 不在做添加aaa
                        'portal_template' => 'local',
                        'portal_server_type' => 'local',
                        'portal_rule' => '',
                        'ssid' => $ssid,
                        'mac' => $apmac
                    );
                    $this->db->insert('portal_config', $config_ary);
                    //7.更新给Ap下发ssid属性
                    if(isset($data['portalTemplate']['ssid']) && $data['portalTemplate']['ssid'] != ''){
                        if(!$this->editApSsid($data['portalTemplate']['ssid'], 'local')){
                            return json_encode(json_no('ssid domain set error'));
                        }
                    }
                }
                //选择 根据端口弹portal
                if($portal_rule_type === 'port'){
                    //2.创建AAA
                    $my_domain = 'local_' . $data['portalRule']['interface_bind'];
                    $aaa_ary = array(
                        'radius_template'=> 'local',
                        'template_name'=>$my_domain,
                        'auth_accesstype'=>element('auth_accesstype', $data),
                        'auth_schemetype'=>element('auth_schemetype', $data)                
                    );
                    if(!$this->addAaaTemplate($aaa_ary)){
                        return json_encode(json_no('add aaa error!',6405));
                    }
                    //3.创建 portal 模版
                    $server_ip = $this->getInterface();
                    $portal_tp = array(
                        'ac_ip' => $server_ip,
                        'server_ipaddr' => $server_ip, 
                        'server_key' => '123456', 
                        'server_port' => '50100',                     
                        'server_url' => $server_ip . ':8080',                    
                        'template_name' => $my_domain,
                        'auth_domain' => $my_domain
                    );
                    if(!$this->addPortalTemplate($portal_tp)){
                        return json_encode(json_no('add portal template errot!'));
                    }
                    //4.创建 Portal 规则
                    $portal_rule_ary = array(
                        'template_name'=> $my_domain,
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
                    //6.添加配置信息
                    $config_ary = array(
                        'name' => element('name', $data),
                        'portal_rule_type' => element('portal_rule_type', $data, 'ssid'),
                        'radius_template' => 'local',
                        'domain_name' => $my_domain,
                        'portal_template' => $my_domain,
                        'portal_server_type' => 'local',
                        'portal_rule' => $data['portalRule']['interface_bind'],
                        'ssid' => element('ssid',$data['portalTemplate']),
                        'mac' => ''
                    );
                    $this->db->insert('portal_config', $config_ary);
                }                
            }

            //portal认证 -> 本地radius服务器 + 远程Portal服务器
            if($radius_type === 'local' && $portal_type === 'remote'){                                
                //1.创建 Radius 模板 
                //2.创建 AAA              
                $aaa_ary = array(
                    'radius_template'=> $radius_type,
                    'template_name'=>element('name', $data),
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
                    'template_name' => 'remote_portal_' . $data['name'],
                    'auth_domain' => element('name', $data)
                );
                if(!$this->addPortalTemplate($portal_tp)){
                    return json_encode(json_no('add portal template errot!'));
                }             
                //4.创建 Portal 规则
                $portal_rule_ary = array(
                    'template_name'=> 'remote_portal_' . $data['name'],//
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
                //5
                //6.添加配置信息
                $config_ary = array(
                    'name' => element('name', $data),
                    'portal_rule_type' => 'port',
                    'radius_template' => 'local',
                    'domain_name' => element('name', $data, ''),
                    'portal_template' => 'remote_portal_' . $data['name'],
                    'portal_server_type' => 'remote',
                    'portal_rule' => $data['portalRule']['interface_bind'],
                    'ssid' => '',
                    'mac' => ''
                );
                $this->db->insert('portal_config', $config_ary);
            }
            
            //portal认证 -> 远程radius服务器 + 本地Portal服务器
            if($radius_type === 'remote' && $portal_type === 'local'){                
                //1.创建 Radius 模板 
                $radius_ary = array(
                    'template_name' => 'remote_radius_' . $data['name'], 
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
                    'radius_template' => 'remote_radius_' . $data['name'], 
                    'template_name' => element('name', $data),
                    'auth_accesstype'=>element('auth_accesstype', $data),
                    'auth_schemetype'=>element('auth_schemetype', $data)                
                );
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }                 
                //3.创建 portal 模版
                $server_ip = $this->getInterface();
                $portal_tp = array(
                    'ac_ip' => $server_ip,
                    'server_ipaddr' => $server_ip, 
                    'server_key' => '123456', 
                    'server_port' => '50100',                     
                    'server_url' => $server_ip . ':8080',                    
                    'template_name' => 'local_' . $data['portalRule']['interface_bind'],
                    'auth_domain' => 'local_' . $data['name']
                );
                if(!$this->addPortalTemplate($portal_tp)){
                    return json_encode(json_no('add portal template errot!'));
                }                         
                //4.创建 Portal 规则
                $portal_rule_ary = array(
                    'template_name'=> 'local_' . $data['portalRule']['interface_bind'],
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
                //5
                //6.添加配置信息
                $config_ary = array(
                    'name' => element('name', $data),
                    'portal_rule_type' => 'port',
                    'radius_template' => 'remote_radius_' . $data['name'], 
                    'domain_name' => element('name', $data),
                    'portal_template' => 'local_' . $data['portalRule']['interface_bind'],
                    'portal_server_type' => 'remote',
                    'portal_rule' => $data['portalRule']['interface_bind'],
                    'ssid' => '',
                    'mac' => ''
                );
                $this->db->insert('portal_config', $config_ary);
            }

            //portal认证 -> 远程radius服务器 + 远程Portal服务器
            if($radius_type === 'remote' && $portal_type === 'remote'){
                //1.创建 Radius 模板 
                $radius_ary = array(
                    'template_name' => 'remote_radius_' . $data['name'], 
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
                    'radius_template'=> 'remote_radius_' . $data['name'],
                    'template_name'=> element('name',$data),
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
                    'template_name' => 'remote_portal_' . $data['name'],
                    'auth_domain' => element('name', $data)
                );
                if(!$this->addPortalTemplate($portal_tp)){
                    return json_encode(json_no('add portal template errot!'));
                }                                 
                //4.创建 Portal 规则
                $portal_rule_ary = array(
                    'template_name'=> 'remote_portal_' . $data['name'],
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
                //5
                //6.添加配置信息
                $config_ary = array(
                    'name' => element('name', $data),
                    'portal_rule_type' => 'port',
                    'radius_template' => 'remote_radius_' . $data['name'], 
                    'domain_name' => element('name', $data),
                    'portal_template' => 'remote_portal_' . $data['name'],
                    'portal_server_type' => 'remote',
                    'portal_rule' => $data['portalRule']['interface_bind'],
                    'ssid' => '',
                    'mac' => ''
                );
                $this->db->insert('portal_config', $config_ary);              
            }
        }
        return json_encode(json_ok());
    }
    function edit($data) {
        $auth_type   = element('auth_accesstype', $data, NULL);
        $radius_type = element('radius_server_type', $data, NULL);
        $portal_type = element('portal_server_type', $data, NULL); 
        $portal_rule_type = element('portal_rule_type', $data, NULL);//ssid||port
        $domain_name = element('name', $data, NULL);

        if($domain_name === 'local') {
            //只能修改ssid 和网页模板                 
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
            //更新配置
            //6.添加配置信息
            $config_ary = array(                
                'ssid' => element('ssid',$data['portalTemplate']),
                'mac' => element('apmac',$data['portalTemplate'], '')
            );
            $this->db->where('name', $data['name']);
            $this->db->update('portal_config', $config_ary);  
            //更新给Ap下发ssid属性
            if($data['portalTemplate']['ssid'] != ''){
                if(!$this->editApSsid($data['portalTemplate']['ssid'], $domain_name)){
                    return json_encode(json_no('ssid domain set error'));
                }
            }         

        }else{     
            $query = $this->db->query("select * from portal_config where name='{$domain_name}'")->result_array();
            if(count($query) > 0) {
                //1.删除 Radius 模板
                if($query[0]['radius_template'] != 'local'){
                    if( $this->isRadiusTemplate( $query[0]['radius_template'] )) {               
                        $this->delRadiusTemplate( array('radius_list'=>array( $query[0]['radius_template'] )) );                    
                    }
                }
                //2.删除aaa
                if($query[0]['domain_name'] != 'local'){
                    if( $this->isAaaaTemplate($query[0]['domain_name']) ) {
                        $this->delAaaTemplate(array('aaa_list'=>array( $query[0]['domain_name'] )));
                    }
                }
                //3.删除Portal 模板    
                if($query[0]['portal_template'] != 'local'){
                    if( $this->isPortalTemplate( $query[0]['portal_template'] ) ) {
                        $this->delPortalTemplate( array('portal_list'=>array( $query[0]['portal_template'] )) );
                    }
                }                            
                //4.删除Portal 规则
                $data_rule = $this->getPortal( $query[0]['portal_template'] );
                if($data_rule['interface_bind'] != '') {
                    $this->delPortalRule( array('portal_list'=>array($data_rule['interface_bind']))  );
                }
                //5.删除web 网页模板   
                $this->portalsql->where('name', 'local_ssid_' . $query[0]['name']);
                $this->portalsql->delete('portal_ssid');             
                //6.删除portal 配置
                $this->db->where('name',$domain_name);
                $this->db->delete('portal_config');

                //重新添加
                return $this->add($data);
            }                               
        }
        return json_encode(json_ok());
    }
    function del($data) {
        $del_ary = $data['selectedList'];
        foreach($del_ary as $res) {
            if($res === 'local'){
                continue;
            }
            $query = $this->db->query("select * from portal_config where name='{$res}'")->result_array();
            if(count($query) > 0) {
                //1.删除 Radius 模板
                if($query[0]['radius_template'] != 'local'){
                    if( $this->isRadiusTemplate( $query[0]['radius_template'] )) {               
                        $this->delRadiusTemplate( array('radius_list'=>array( $query[0]['radius_template'] )) );                    
                    }
                }
                //2.删除aaa
                if($query[0]['domain_name'] != 'local'){
                    if( $this->isAaaaTemplate($query[0]['domain_name']) ) {
                        $this->delAaaTemplate(array('aaa_list'=>array( $query[0]['domain_name'] )));
                    }
                }
                //3.删除Portal 模板    
                if($query[0]['portal_template'] != 'local'){
                    if( $this->isPortalTemplate( $query[0]['portal_template'] ) ) {
                        $this->delPortalTemplate( array('portal_list'=>array( $query[0]['portal_template'] )) );
                    }
                }                            
                //4.删除Portal 规则
                $data_rule = $this->getPortal( $query[0]['portal_template'] );
                if($data_rule['interface_bind'] != '') {
                    $this->delPortalRule( array('portal_list'=>array($data_rule['interface_bind']))  );
                }
                //5.删除web 网页模板   
                $this->portalsql->where('ssid', $query[0]['ssid']);
                $this->portalsql->delete('portal_ssid');             
                //6.删除portal 配置
                $this->db->where('name',$res);
                $this->db->delete('portal_config');
            }            
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

    private function getDomainState($name) {
        $arr = array(
            'auth_accesstype' => '',
            'auth_schemetype' => ''
        );
        $sqlcmd  = "select domain_list.domain_name,domain_params.attr_value,domain_attr.attr_name";
        $sqlcmd .= " from domain_list";
        $sqlcmd .= " left join domain_params on domain_list.id=domain_params.domain_id";
        $sqlcmd .= " left join domain_attr on domain_params.attr_id=domain_attr.id";
        $sqlcmd .= " where domain_list.domain_name='{$name}'";
        $data = $this->db->query($sqlcmd)->result_array();
        foreach($data as $row){
            switch($row['attr_name']){
                case 'auth_access_type' : $arr['auth_accesstype'] = $row['attr_value']; break;
                case 'auth_scheme_type' : $arr['auth_schemetype'] = $row['attr_value']; break;
            }
        }
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

    // 更新ap ssid 
    private function editApSsid($ssid, $domain) {
        $groupid = 0;
        $ssid_data = array();
        $query = $this->db->select('ssid_template.name,ssid_group.id,ssid_group.group_name')
                            ->from('ssid_template')
                            ->join('ssid_group_bind', 'ssid_template.id=ssid_group_bind.template_id', 'left')
                            ->join('ssid_group', 'ssid_group_bind.group_id=ssid_group.id', 'left')
                            ->where('ssid_template.name', $ssid)
                            ->get()
                            ->result_array();

        if(count($query) > 0){            
            $groupid = $query[0]['id'];
            $cgigroup = array('groupid' => $groupid);
            $retstr = axc_get_wireless_ssid(json_encode($cgigroup));
            $retary = json_decode($retstr, true);
                        
            if($retary['state']['code'] == 2000 && count($retary['data']['list']) > 0 ){
                foreach($retary['data']['list'] as $row) {                   
                    if($row['ssid'] == $ssid){                        
                        $ssid_data = $row;
                        break;
                    }
                }
            } 
                      
        }
        
        if($groupid > 0 && count($ssid_data) > 0 ){
            $cgipam = array(
                'groupid' => (int)$groupid,
                'ssid' => element('ssid', $ssid_data),
                'remark' => element('remark', $ssid_data),
                'vlanid' => (int)element('vlanId', $ssid_data, 0),
                'enabled' => (int)element('enabled', $ssid_data),
                'maxBssUsers' => (int)element('maxBssUsers', $ssid_data),
                'loadBalanceType' => (int)element('loadBalanceType', $ssid_data),
                'hiddenSsid' => (int)element('hiddenSsid', $ssid_data),
                'mandatorydomain' => $domain,
                'storeForwardPattern' => element('storeForwardPattern', $ssid_data),
                'upstream' => (int)element('upstream', $ssid_data),
                'downstream' => (int)element('downstream', $ssid_data),
                'encryption' => element('encryption', $ssid_data),
                'password' => element('password', $ssid_data, ''),
                'ssidisolate' => (int)element('ssidisolate', $ssid_data, ''),
                'greenap' => (int)element('greenap', $ssid_data, '')
            );
            
            $ret = axc_modify_wireless_ssid(json_encode($cgipam));
            $obj = json_decode($ret);
            if($obj->state->code == 2000){
                return TRUE;
            }            
        }        
        return FALSE;
    }
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
    //判断 portal配置 名称是否重复
    private function isportalConfig($name) {
        $ret = $this->db->query("select * from portal_config where name='{$name}'")->result_array();
        if(count($ret) > 0 ){
            return TRUE;
        }
        return FALSE;
    }
}
