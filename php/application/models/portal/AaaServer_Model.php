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

                $row['portalServer'] = $this->getPortal($row['portal_template']);//获取portal属性

                $row['portalRule'] = $this->getPortalRule($row['portal_template'], $row['portalServer']['interface_bind']);//获取portal 规则

                if($row['portal_rule_type'] === 'ssid'){
                    $sqlcmd = "select id,apmac,ssid,address,des,web from portal_ssid where BINARY ssid='{$row['ssid']}' and (apmac='' or apmac=null)";
                    if($row['mac'] != '' && $row['mac'] != ''){
                        $sqlcmd = "select id,apmac,ssid,address,des,web from portal_ssid where BINARY ssid='{$row['ssid']}' and apmac='{$row['mac']}'";
                    }
                    $webquery = $this->portalsql->query($sqlcmd)->result_array();
                    if(count($webquery) > 0) {
                        $webquery[0]['web'] = (int)$webquery[0]['web'];
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

    /****
        * 1.radius
        * 2.aaa
        * 3.portal template
        * 4.portal rule
        * 5.web ssid
        * 6.产生配置记录
        * 7.下发ssid
        * （radius、aaa、portal三种配置项采用同一个名称）
    */
    function add($data){
        if( $this->isportalConfig($data['name']) ){
            return json_encode(json_no('name error', 6405));
        }
        $auth_accesstype   = element('auth_accesstype', $data, NULL);//认证协议  portal | 802.1x
        $portal_rule_type = element('portal_rule_type', $data, NULL);// portal认证方式 ssid | port
        $domain = element('name', $data, NULL);//domain域 名称 **（统一name 不再加别的前后缀）
        $radius_server_type = element('radius_server_type', $data, NULL);//radius 服务类型 local | remote
        $portal_server_type = element('portal_server_type', $data, NULL);//portal 服务类型 local | remote
        $ac_ip = $this->getInterface();
        //802.1x 认证
        if($auth_accesstype === '8021x-access'){            
            //802.1x 认证 -> 远程Radius服务器
            if ($radius_server_type === 'remote') {
                //1.创建 Radius 模板
                $radius_ary = $this->getRadiusParams($data);
                if (!$this->addRadiusTemplate($radius_ary)) {
                    return json_encode(json_no('add 802.1x && remote Radius error!'));
                }
                //开启radius代理
                radsec_set_radsecproxy_info(json_encode(array('radsec_enable'=>'1','radius_template'=>$domain)));
                //2.创建 AAA
                $aaa_ary = $this->getDomainParams($data);
                if (!$this->addAaaTemplate($aaa_ary)) {
                    return json_encode(json_no('add aaa error!', 6405));
                }
                //3.创建 Portal 模板
                //4.创建 Portal 规则
                //5.创建 Portal 认证 ssid和网页模板
                //6.添加配置信息
                $config_ary = array(
                    'auth_accesstype' => $auth_accesstype,
                    'name' => $domain,
                    'radius_template' => $domain,
                    'domain_name' => $domain
                );
                $this->db->insert('portal_config', $config_ary);
            }
        }
        //portal认证
        if($auth_accesstype === 'portal') {
            //portal认证 -> 本地radius服务器 + 本地Portal服务器
            if($radius_server_type === 'local' && $portal_server_type === 'local'){
                //选择AP的SSID方式弹portal
                if($portal_rule_type === 'ssid'){
                    //5.创建 Portal 认证 ssid和网页模板
                    $ssid = element('ssid', $data['portalTemplate'], '');
                    $apmac = element('apmac', $data['portalTemplate'], '');
                    $web = element('web', $data['portalTemplate'], '');
                    $des = element('des', $data['portalTemplate'], '');
                    if($ssid != ''){
                        //用户选择了ssid 和 apmac  添加
                        if ($apmac != '') {
                            // 已存在相同 SSID 与 apmac 规则
                            // 直接返回错误码 6405
                            if ($this->isSameSsidApmacTemplate($data['portalTemplate']) ) {
                                return json_encode(json_no('add aaa error!', 6406));
                            }
                            // add
                            $web_ins = array(
                                'name' => $domain,
                                'address' => '',//地址
                                'basip' => $ac_ip,
                                'web' => $web,
                                'des' => $des,
                                'ssid' => $ssid,
                                'apmac' => $apmac
                            );
                            if(!$this->portalsql->insert('portal_ssid',$web_ins) ) {
                                return json_encode(json_no('add portal web error!'));
                            }

                        // 用户选择了ssid 但无 apmac  添加
                        // TODO: 已改为SSID与ammac 为必填项, 可能不需要次分支
                        } else {
                            //选择ssid 但未选择apmac 修改
                            //没有apmac  ->  修改数据库中匹配到ssid 当没apmac的记录，
                            $ssid_data = $this->portalsql->query("select * from portal_ssid where BINARY ssid='{$ssid}' and apmac=''")->result_array();
                            if(count($ssid_data) > 0){
                                $web_ins = array(
                                    'name' => $domain,
                                    'address' => '',//地址
                                    'basip' => $ac_ip,
                                    'web' => $web,
                                    'des' => $des,
                                    'ssid' => $ssid,
                                    'apmac' => $apmac
                                );
                                $ret = $this->editWebTemplate($web_ins, array('ssid'=>$ssid,'apmac'=>''));
                            }else{
                                //没有就添加
                                $web_ary = array(
                                    'name' => $domain,
                                    'address' => '',//地址
                                    'basip' => $ac_ip,
                                    'web' => $web,
                                    'des' => $des,
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
                        'name' => $domain,
                        'auth_accesstype' => $auth_accesstype,
                        'portal_rule_type' => 'ssid',
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
                    if(isset($ssid) && $ssid != ''){
                        if(!$this->editApSsid($ssid, 'local')){
                            return json_encode(json_no('ssid domain set error'));
                        }
                    }
                }
                //选择 根据端口弹portal 需要创建aaa模版
                if($portal_rule_type === 'port'){
                    //2.创建AAA    
                    $aaa_ary = $this->getDomainParams($data);
                    $aaa_ary['radius_template'] = 'local';//使用本地radius
                    if(!$this->addAaaTemplate($aaa_ary)){
                        return json_encode(json_no('add aaa error!',6405));
                    }
                    //3.创建 portal 模版
                    $portal_tp = array(
                        'ac_ip' => $ac_ip,
                        'server_ipaddr' => $ac_ip,
                        'server_key' => '123456',
                        'server_port' => '50100',
                        'server_url' => $ac_ip . ':8080',
                        'template_name' => $domain,
                        'auth_domain' => $domain
                    );
                    if(!$this->addPortalTemplate($portal_tp)){
                        return json_encode(json_no('add portal template errot!'));
                    }
                    //4.创建 Portal 规则
                    $portal_rule_ary = $this->getPortalRuleParams($data);
                    if(!$this->addPortalRule($portal_rule_ary)){
                        return json_encode(json_no('add portal rule error!'));
                    }
                    //6.添加配置信息
                    $config_ary = array(
                        'auth_accesstype' => $auth_accesstype,
                        'name' => $domain,
                        'portal_rule_type' => 'port',
                        'radius_template' => 'local',
                        'domain_name' => $domain,
                        'portal_template' => $domain,
                        'portal_server_type' => 'local',
                        'portal_rule' => $data['portalRule']['interface_bind'],
                        'ssid' => element('ssid',$data['portalTemplate']),
                        'mac' => ''
                    );
                    $this->db->insert('portal_config', $config_ary);
                }
            }

            //portal认证 -> 本地radius服务器 + 远程Portal服务器 该环境只能使用端口认证
            if($radius_server_type === 'local' && $portal_server_type === 'remote'){
                //1.创建 Radius 模板
                //2.创建 AAA
                $aaa_ary = $this->getDomainParams($data);
                $aaa_ary['radius_template'] = 'local';//使用本地radius
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
                //3.创建 Portal 模板
                $portal_tp = array(
                    'ac_ip' => element('ac_ip', $data['portalServer']),
                    'server_ipaddr' => element('server_ipaddr', $data['portalServer']),
                    'server_key' => element('server_key', $data['portalServer'],''),
                    'server_port' => element('server_port', $data['portalServer']),
                    'server_url' => element('server_url', $data['portalServer']),
                    'template_name' => $domain,
                    'auth_domain' => $domain
                );
                if(!$this->addPortalTemplate($portal_tp)){
                    return json_encode(json_no('add portal template errot!'));
                }
                //4.创建 Portal 规则
                $portal_rule_ary = $this->getPortalRuleParams($data);
                if(!$this->addPortalRule($portal_rule_ary)){
                    return json_encode(json_no('add portal rule error!'));
                }
                //5
                //6.添加配置信息
                $config_ary = array(
                    'auth_accesstype' => $auth_accesstype,
                    'name' => $domain,
                    'portal_rule_type' => 'port',
                    'radius_template' => 'local',
                    'domain_name' => $domain,
                    'portal_template' => $domain,
                    'portal_server_type' => 'remote',
                    'portal_rule' => $data['portalRule']['interface_bind'],
                    'ssid' => '',
                    'mac' => ''
                );
                $this->db->insert('portal_config', $config_ary);
            }

            //portal认证 -> 远程radius服务器 + 本地Portal服务器 该环境只能使用端口认证
            if($radius_server_type === 'remote' && $portal_server_type === 'local'){
                //1.创建 Radius 模板
                $radius_ary = $this->getRadiusParams($data);
                if(!$this->addRadiusTemplate($radius_ary)){
                    return json_encode(json_no('add remote Radius error!'));
                }                
                //2.创建 AAA
                $aaa_ary = $this->getDomainParams($data);
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
                //3.创建 portal 模版
                $portal_tp = array(
                    'ac_ip' => $ac_ip,
                    'server_ipaddr' => $ac_ip,
                    'server_key' => '123456',
                    'server_port' => '50100',
                    'server_url' => $ac_ip . ':8080',
                    'template_name' => $domain,
                    'auth_domain' => $domain
                );                
                if(!$this->addPortalTemplate($portal_tp)){
                    return json_encode(json_no('add portal template errot!'));
                }                
                //4.创建 Portal 规则
                $portal_rule_ary = $this->getPortalRuleParams($data);
                if(!$this->addPortalRule($portal_rule_ary)){
                    return json_encode(json_no('add portal rule error!'));
                }
                //5
                //6.添加配置信息
                $config_ary = array(
                    'auth_accesstype' => $auth_accesstype,
                    'name' => $domain,
                    'portal_rule_type' => 'port',
                    'radius_template' => $domain,
                    'domain_name' => $domain,
                    'portal_template' => $domain,
                    'portal_server_type' => 'local',
                    'portal_rule' => $data['portalRule']['interface_bind'],
                    'ssid' => '',
                    'mac' => ''
                );
                $this->db->insert('portal_config', $config_ary);
                
            }

            //portal认证 -> 远程radius服务器 + 远程Portal服务器 该环境只能使用端口认证
            if($radius_server_type === 'remote' && $portal_server_type === 'remote'){
                //1.创建 Radius 模板
                $radius_ary = $this->getRadiusParams($data);
                if(!$this->addRadiusTemplate($radius_ary)){
                    return json_encode(json_no('add remote Radius error!'));
                }
                //2.创建 AAA
                $aaa_ary = $this->getDomainParams($data);
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
                //3.创建 Portal 模板
                $portal_tp = array(
                    'ac_ip' => element('ac_ip', $data['portalServer']),
                    'server_ipaddr' => element('server_ipaddr', $data['portalServer']),
                    'server_key' => element('server_key', $data['portalServer'],''),
                    'server_port' => element('server_port', $data['portalServer']),
                    'server_url' => element('server_url', $data['portalServer']),
                    'template_name' => $domain,
                    'auth_domain' => $domain
                );
                if(!$this->addPortalTemplate($portal_tp)){
                    return json_encode(json_no('add portal template errot!'));
                }
                //4.创建 Portal 规则
                $portal_rule_ary = $this->getPortalRuleParams($data);
                if(!$this->addPortalRule($portal_rule_ary)){
                    return json_encode(json_no('add portal rule error!'));
                }
                //5
                //6.添加配置信息
                $config_ary = array(
                    'auth_accesstype' => $auth_accesstype,
                    'name' => $domain,
                    'portal_rule_type' => 'port',
                    'radius_template' => $domain,
                    'domain_name' => $domain,
                    'portal_template' => $domain,
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

    function edit($data){
        $auth_accesstype   = element('auth_accesstype', $data, NULL);//认证协议  portal | 802.1x
        $portal_rule_type = element('portal_rule_type', $data, NULL);// portal认证方式 ssid | port
        $domain = element('name', $data, NULL);//domain域
        $radius_server_type = element('radius_server_type', $data, NULL);//radius 服务类型 local | remote
        $portal_server_type = element('portal_server_type', $data, NULL);//portal 服务类型 local | remote
        $ac_ip = $this->getInterface();
        // 已存在相同 SSID 与 apmac 规则
        // 直接返回错误码 6405
        if ($this->isSameSsidApmacTemplate($data['portalTemplate'])) {
            return json_encode(json_no('add aaa error!', 6406));
        }
        $cfginfo = $this->db->query("select * from portal_config where id={$data['id']}")->result_array();
        //802
        if($auth_accesstype === '8021x-access'){            
            //1.操作Radius模板
            if($cfginfo[0]['radius_template'] != 'local'){
                //不是本地radius就修改              
                $radius_ary = $this->getRadiusParams($data);
                if(!$this->editRadiusTemplate($radius_ary)){
                    return json_encode(json_no('edit 802.1x && remote Radius error!'));
                }
            }else{
                //如果是本地radius local 就重新添加
                $radius_ary = $this->getRadiusParams($data);
                if(!$this->addRadiusTemplate($radius_ary)){
                    return json_encode(json_no('edit 802.1x && remote Radius error!'));
                }
            }
            //开启radius代理
            radsec_set_radsecproxy_info(json_encode(array('radsec_enable'=>'1','radius_template'=>$domain)));
            //2.操作AAA
            $aaa_ary = $this->getDomainParams($data);
            if($cfginfo[0]['domain_name'] != 'local'){
                if(!$this->editAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
            }else{                
                if(!$this->addAaaTemplate($aaa_ary)){
                    return json_encode(json_no('add aaa error!',6405));
                }
            }            
            //3.删除 Portal 模板
            if($cfginfo[0]['portal_template'] != 'local'){
                $this->delPortalTemplate( array('portal_list'=>array( $cfginfo[0]['portal_template'] )) );
            }
            //4.删除 Portal 规则
            if($cfginfo[0]['portal_rule'] != '' && $cfginfo[0]['portal_rule'] != null){
                $data_rule = $this->getPortal( $cfginfo[0]['portal_template'] );
                if($data_rule['interface_bind'] != '') {
                    $this->delPortalRule( array('portal_list'=>array($data_rule['interface_bind'])) );
                }
            }
            //5.删除 Portal 认证 ssid和网页模板
            $ret = $this->delWebTemplate($cfginfo[0]['name']);            
            //6.修改配置信息
            $config_ary = array(
                'auth_accesstype' => $auth_accesstype,
                'portal_rule_type' => null,
                'radius_template' => $domain,
                'domain_name' => $domain,
                'portal_template' => '',
                'portal_server_type' => '',
                'portal_rule' => '',
                'ssid' => '',
                'mac' => ''
            );
            $this->db->where('id',$data['id']);
            $this->db->update('portal_config', $config_ary);
        }
        //portal认证
        if($auth_accesstype === 'portal'){
            //portal认证 -> 本地radius服务器 + 本地Portal服务器
            if($radius_server_type === 'local' && $portal_server_type === 'local'){
                if($portal_rule_type === 'ssid'){  
                    $ssid = element('ssid', $data['portalTemplate'], '');
                    $apmac = element('apmac', $data['portalTemplate'], '');
                    $web = element('web', $data['portalTemplate'], '');
                    $des = element('des', $data['portalTemplate'], '');                  
                    //1 radius 需要删除
                    if($cfginfo[0]['radius_template'] != 'local'){
                        if( $this->isRadiusTemplate( $cfginfo[0]['radius_template'] )) {
                            $this->delRadiusTemplate( array('radius_list'=>array( $cfginfo[0]['radius_template'] )) );
                        }
                    }
                    //2. aaa 需要删除
                    if($cfginfo[0]['domain_name'] != 'local'){
                        if( $this->isAaaaTemplate($cfginfo[0]['domain_name']) ) {
                            $this->delAaaTemplate(array('aaa_list'=>array( $cfginfo[0]['domain_name'] )));
                        }
                    }
                    //3.Portal 需要删除
                    if($cfginfo[0]['portal_template'] != 'local'){
                        if( $this->isPortalTemplate( $cfginfo[0]['portal_template'] ) ) {
                            $this->delPortalTemplate( array('portal_list'=>array( $cfginfo[0]['portal_template'] )) );
                        }
                    }
                    //4.删除Portal 规则
                    $data_rule = $this->getPortal( $cfginfo[0]['portal_template'] );
                    if($data_rule['interface_bind'] != '') {
                        $this->delPortalRule( array('portal_list'=>array($data_rule['interface_bind']))  );
                    }
                    //5 web ssid 设置                      
                    if( $this->isWebTemplate($domain) ){
                        $web_template = array(
                            'ssid' => $ssid,
                            'apmac' => $apmac,
                            'web' => $web,
                            'des' => $des
                        );
                        $this->portalsql->where('name', $domain);
                        $this->portalsql->update('portal_ssid', $web_template);
                    }else{
                        $web_template = array(
                            'name' => $domain,
                            'ssid' => $ssid,
                            'apmac' => $apmac,
                            'web' => $web,
                            'des' => $des
                        );
                        $this->portalsql->insert('portal_ssid', $web_template);
                    }                    
                    //6.修改配置信息
                    $config_ary = array(
                        'name' => $domain,
                        'auth_accesstype' => $auth_accesstype,
                        'portal_rule_type' => 'ssid',
                        'radius_template' => 'local',
                        'domain_name' => 'local',//domain域默认用local 不在做添加aaa
                        'portal_template' => 'local',
                        'portal_server_type' => $portal_server_type,
                        'portal_rule' => '',
                        'ssid' => $ssid,
                        'mac' => $apmac
                    );
                    $this->db->where('id', $data['id']);
                    $this->db->update('portal_config', $config_ary);
                    //7.更新给Ap下发ssid属性
                    if(isset($ssid) && $ssid != ''){
                        if(!$this->editApSsid($ssid, 'local')){
                            return json_encode(json_no('ssid domain set error'));
                        }
                    }
                }
                //选择 根据端口弹portal 需要创建aaa模版
                if($portal_rule_type === 'port'){
                    //1 radius 需要删除
                    if($cfginfo[0]['radius_template'] != 'local'){
                        if( $this->isRadiusTemplate( $cfginfo[0]['radius_template'] )) {
                            $this->delRadiusTemplate( array('radius_list'=>array( $cfginfo[0]['radius_template'] )) );
                        }
                    }
                    //2 aaa 需要修改
                    $aaa_ary = $this->getDomainParams($data);  
                    $aaa_ary['radius_template'] = 'local';//使用本地radius                                      
                    if($cfginfo[0]['domain_name'] != 'local'){                        
                        if( !$this->editAaaTemplate($aaa_ary)){
                            return json_encode(json_no('edit aaa error!',6405));
                        }
                    }else{                                                
                        if(!$this->addAaaTemplate($aaa_ary)){
                            return json_encode(json_no('add aaa error!',6405));
                        }
                    }                    
                    //3 portal模版 需要修改                    
                    $portal_tp = array(
                        'ac_ip' => $ac_ip,
                        'server_ipaddr' => $ac_ip,
                        'server_key' => '123456',
                        'server_port' => '50100',
                        'server_url' => $ac_ip . ':8080',
                        'template_name' => $domain,
                        'auth_domain' => $domain
                    );                   
                    if($cfginfo[0]['portal_template'] != 'local' && $cfginfo[0]['portal_template'] != null){
                        if( !$this->editPortalTemplate($portal_tp)){
                            return json_encode(json_no('edit portal template errot!'));
                        }
                    }else{                                                                        
                        if(!$this->addPortalTemplate($portal_tp)){
                            return json_encode(json_no('add portal template errot!'));
                        }
                    }                    
                    //4.Portal 规则修改
                    $portal_rule_ary = $this->getPortalRuleParams($data);
                    if($cfginfo[0]['portal_rule'] != '' && $cfginfo[0]['portal_rule'] != null){
                        if(!$this->editPortalRule($portal_rule_ary)){
                            return json_encode(json_no('edit portal rule error!'));
                        }
                    }else{                        
                        if(!$this->addPortalRule($portal_rule_ary)){
                            return json_encode(json_no('add portal rule error!'));
                        }
                    }
                    //5 web ssid 配置删除
                    if($cfginfo[0]['name'] != 'local'){
                        $this->delWebTemplate($cfginfo[0]['name']);
                    }
                    //6. 修改 配置信息
                    $config_ary = array(
                        'auth_accesstype' => $auth_accesstype,
                        'name' => $domain,
                        'portal_rule_type' => 'port',
                        'radius_template' => 'local',
                        'domain_name' => $domain,
                        'portal_template' => $domain,
                        'portal_server_type' => $portal_server_type,
                        'portal_rule' => $data['portalRule']['interface_bind'],
                        'ssid' => '',
                        'mac' => '' 
                    );
                    $this->db->where('name', $domain);
                    $this->db->update('portal_config', $config_ary);
                    
                }
            }
            //portal认证 -> 本地radius服务器 + 远程Portal服务器 该环境只能使用端口认证
            if($radius_server_type === 'local' && $portal_server_type === 'remote'){
                //1 radius 需要删除
                if($cfginfo[0]['radius_template'] != 'local'){
                    if( $this->isRadiusTemplate( $cfginfo[0]['radius_template'] )) {
                        $this->delRadiusTemplate( array('radius_list'=>array( $cfginfo[0]['radius_template'] )) );
                    }
                }
                //2. AAA 需要修改
                $aaa_ary = $this->getDomainParams($data);  
                $aaa_ary['radius_template'] = 'local';//使用本地radius                                      
                if($cfginfo[0]['domain_name'] != 'local'){                        
                    if( !$this->editAaaTemplate($aaa_ary)){
                        return json_encode(json_no('edit aaa error!',6405));
                    }
                }else{                                                
                    if(!$this->addAaaTemplate($aaa_ary)){
                        return json_encode(json_no('add aaa error!',6405));
                    }
                }
                //3 portal模版 需要修改                    
                $portal_tp = array(
                    'ac_ip' => element('ac_ip', $data['portalServer']),
                    'server_ipaddr' => element('server_ipaddr', $data['portalServer']),
                    'server_key' => element('server_key', $data['portalServer'],''),
                    'server_port' => element('server_port', $data['portalServer']),
                    'server_url' => element('server_url', $data['portalServer']),
                    'template_name' => $domain,
                    'auth_domain' => $domain
                );                   
                if($cfginfo[0]['portal_template'] != 'local' && $cfginfo[0]['portal_template'] != null){
                    if( !$this->editPortalTemplate($portal_tp)){
                        return json_encode(json_no('edit portal template errot!'));
                    }
                }else{                                                                        
                    if(!$this->addPortalTemplate($portal_tp)){
                        return json_encode(json_no('add portal template errot!'));
                    }
                }
                //4.Portal 规则修改
                $portal_rule_ary = $this->getPortalRuleParams($data);
                if($cfginfo[0]['portal_rule'] != '' && $cfginfo[0]['portal_rule'] != null){
                    if(!$this->editPortalRule($portal_rule_ary)){
                        return json_encode(json_no('edit portal rule error!'));
                    }
                }else{                        
                    if(!$this->addPortalRule($portal_rule_ary)){
                        return json_encode(json_no('add portal rule error!'));
                    }
                }
                //5 web ssid 配置删除
                if($cfginfo[0]['name'] != 'local'){
                    $this->delWebTemplate($cfginfo[0]['name']);
                }
                //6. 修改 配置信息
                $config_ary = array(
                    'auth_accesstype' => $auth_accesstype,
                    'name' => $domain,
                    'portal_rule_type' => 'port',
                    'radius_template' => 'local',
                    'domain_name' => $domain,
                    'portal_template' => $domain,
                    'portal_server_type' => $portal_server_type,
                    'portal_rule' => $data['portalRule']['interface_bind'],
                    'ssid' => '',
                    'mac' => '' 
                );
                $this->db->where('name', $domain);
                $this->db->update('portal_config', $config_ary);
            }
            //portal认证 -> 远程radius服务器 + 本地Portal服务器 该环境只能使用端口认证
            if($radius_server_type === 'remote' && $portal_server_type === 'local'){
                //1 radius 需要修改
                $radius_ary = $this->getRadiusParams($data);
                if($cfginfo[0]['radius_template'] != 'local'){
                    if(!$this->editRadiusTemplate($radius_ary)){
                        return json_encode(json_no('edit remote Radius error!'));
                    }
                }else{                                        
                    if(!$this->addRadiusTemplate($radius_ary)){
                        return json_encode(json_no('add remote Radius error!'));
                    }
                }
                //2. AAA 需要修改
                $aaa_ary = $this->getDomainParams($data);  
                $aaa_ary['radius_template'] = 'local';//使用本地radius                                      
                if($cfginfo[0]['domain_name'] != 'local'){                        
                    if( !$this->editAaaTemplate($aaa_ary)){
                        return json_encode(json_no('edit aaa error!',6405));
                    }
                }else{                                                
                    if(!$this->addAaaTemplate($aaa_ary)){
                        return json_encode(json_no('add aaa error!',6405));
                    }
                }
                //3 portal模版 需要修改                    
                $portal_tp = array(
                    'ac_ip' => $ac_ip,
                    'server_ipaddr' => $ac_ip,
                    'server_key' => '123456',
                    'server_port' => '50100',
                    'server_url' => $ac_ip . ':8080',
                    'template_name' => $domain,
                    'auth_domain' => $domain
                );                   
                if($cfginfo[0]['portal_template'] != 'local' && $cfginfo[0]['portal_template'] != null){
                    if( !$this->editPortalTemplate($portal_tp)){
                        return json_encode(json_no('edit portal template errot!'));
                    }
                }else{                                                                        
                    if(!$this->addPortalTemplate($portal_tp)){
                        return json_encode(json_no('add portal template errot!'));
                    }
                }
                //4.Portal 规则修改
                $portal_rule_ary = $this->getPortalRuleParams($data);
                if($cfginfo[0]['portal_rule'] != '' && $cfginfo[0]['portal_rule'] != null){
                    if(!$this->editPortalRule($portal_rule_ary)){
                        return json_encode(json_no('edit portal rule error!'));
                    }
                }else{                        
                    if(!$this->addPortalRule($portal_rule_ary)){
                        return json_encode(json_no('add portal rule error!'));
                    }
                }
                //5 web ssid 配置删除
                if($cfginfo[0]['name'] != 'local'){
                    $this->delWebTemplate($cfginfo[0]['name']);
                }
                //6. 修改 配置信息
                $config_ary = array(
                    'auth_accesstype' => $auth_accesstype,
                    'name' => $domain,
                    'portal_rule_type' => 'port',
                    'radius_template' => $domain,
                    'domain_name' => $domain,
                    'portal_template' => $domain,
                    'portal_server_type' => $portal_server_type,
                    'portal_rule' => $data['portalRule']['interface_bind'],
                    'ssid' => '',
                    'mac' => '' 
                );
                $this->db->where('name', $domain);
                $this->db->update('portal_config', $config_ary);
            }
            //portal认证 -> 远程radius服务器 + 远程Portal服务器 该环境只能使用端口认证
            if($radius_server_type === 'remote' && $portal_server_type === 'remote'){
                //1 radius 需要修改
                $radius_ary = $this->getRadiusParams($data);
                if($cfginfo[0]['radius_template'] != 'local'){
                    if(!$this->editRadiusTemplate($radius_ary)){
                        return json_encode(json_no('edit remote Radius error!'));
                    }
                }else{                                        
                    if(!$this->addRadiusTemplate($radius_ary)){
                        return json_encode(json_no('add remote Radius error!'));
                    }
                }
                //2. AAA 需要修改
                $aaa_ary = $this->getDomainParams($data);  
                $aaa_ary['radius_template'] = 'local';//使用本地radius                                      
                if($cfginfo[0]['domain_name'] != 'local'){                        
                    if( !$this->editAaaTemplate($aaa_ary)){
                        return json_encode(json_no('edit aaa error!',6405));
                    }
                }else{                                                
                    if(!$this->addAaaTemplate($aaa_ary)){
                        return json_encode(json_no('add aaa error!',6405));
                    }
                }
                //3 portal模版 需要修改                    
                $portal_tp = array(
                    'ac_ip' => element('ac_ip', $data['portalServer']),
                    'server_ipaddr' => element('server_ipaddr', $data['portalServer']),
                    'server_key' => element('server_key', $data['portalServer'],''),
                    'server_port' => element('server_port', $data['portalServer']),
                    'server_url' => element('server_url', $data['portalServer']),
                    'template_name' => $domain,
                    'auth_domain' => $domain
                );                  
                if($cfginfo[0]['portal_template'] != 'local' && $cfginfo[0]['portal_template'] != null){
                    if( !$this->editPortalTemplate($portal_tp)){
                        return json_encode(json_no('edit portal template errot!'));
                    }
                }else{                                                                        
                    if(!$this->addPortalTemplate($portal_tp)){
                        return json_encode(json_no('add portal template errot!'));
                    }
                }
                //4.Portal 规则修改
                $portal_rule_ary = $this->getPortalRuleParams($data);
                if($cfginfo[0]['portal_rule'] != '' && $cfginfo[0]['portal_rule'] != null){
                    if(!$this->editPortalRule($portal_rule_ary)){
                        return json_encode(json_no('edit portal rule error!'));
                    }
                }else{                        
                    if(!$this->addPortalRule($portal_rule_ary)){
                        return json_encode(json_no('add portal rule error!'));
                    }
                }
                //5 web ssid 配置删除
                if($cfginfo[0]['name'] != 'local'){
                    $this->delWebTemplate($cfginfo[0]['name']);
                }
                //6. 修改 配置信息
                $config_ary = array(
                    'auth_accesstype' => $auth_accesstype,
                    'name' => $domain,
                    'portal_rule_type' => 'port',
                    'radius_template' => $domain,
                    'domain_name' => $domain,
                    'portal_template' => $domain,
                    'portal_server_type' => $portal_server_type,
                    'portal_rule' => $data['portalRule']['interface_bind'],
                    'ssid' => '',
                    'mac' => '' 
                );
                $this->db->where('name', $domain);
                $this->db->update('portal_config', $config_ary);
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
                $this->delWebTemplate($query[0]['name']);                
                //6.删除portal 配置
                $this->db->where('name',$res);
                $this->db->delete('portal_config');
            }
        }
        return json_encode(json_ok());
    }

/*=======================================  Params =======================================*/
    private function getRadiusParams($data) {
        $arr = array(
            'template_name' => element('name', $data, ''),
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
        return $arr;
    }
    private function getDomainParams($data) {
        $arr = array(
            'radius_template' => element('name', $data),
            'template_name' => element('name', $data),
            'auth_accesstype' => element('auth_accesstype', $data),
            'auth_schemetype' => element('auth_schemetype', $data)
        );
        return $arr;
    }
    private function getPortalRuleParams($data) {
        $arr = array(
            'template_name' => (string)element('name', $data, ''),
            'interface_bind' => (string)element('interface_bind', $data['portalRule'],''),
            'max_usernum' => (string)element('max_usernum', $data['portalRule'],'4096'),
            'auth_mode' => (string)element('auth_mode', $data['portalRule'],'1'),
            'auth_ip' => (string)element('auth_ip', $data['portalRule'],''),
            'auth_mask' => (string)element('auth_mask', $data['portalRule'],''),
            'idle_test' => (string)element('idle_test', $data['portalRule'],'0')
        );
        return $arr;
    }
/*=======================================  GET    =======================================*/
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
/*=======================================  ADD    =======================================*/
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

/*=======================================  Del    =======================================*/
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
        $sqlcmd = "DELETE FROM portal_ssid WHERE BINARY name='{$name}'";        
        if( $this->portalsql->query($sqlcmd) ){
            return TRUE;
        }
        return FALSE;
    }


/*=======================================  Edit   =======================================*/
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
    /** 5. web 网页模板
     * @dataAry数据键值对（键名必须和数据库一致）array('address'=>"SZ",...)
     * @whereAry 条件数组（键名必须和数据库一致）array('name'=>"admin",...)
     */
    private function editWebTemplate($dataAry, $whereAry) {
        if(count($dataAry) > 0 && count($whereAry) > 0){
            $sqlcmd = "update from portal_ssid set";
            foreach($dataAry as $key=>$value){
                switch($key){
                    case "name" : $sqlcmd .= " name='{$value}',";break;
                    case "address" : $sqlcmd .= " address='{$value}',";break;
                    case "basip" : $sqlcmd .= " basip='{$value}',";break;
                    case "des" : $sqlcmd .= " des='{$value}',";break;
                    case "ssid" : $sqlcmd .= " ssid='{$value}',";break;
                    case "apmac" : $sqlcmd .= " apmac='{$value}',";break;
                    case "web" : $sqlcmd .= " web={$value},";break;
                }
            }
            $sqlcmd = rtrim($sqlcmd, ',');//去掉最后一个逗号
            $sqlcmd .= " where 1=1 ";
            foreach($whereAry as $wkey=>$wvalue){
                switch($wkey){
                    case "id" : $sqlcmd .= " and id={$wvalue}";break;
                    case "ssid" : $sqlcmd .= " and BINARY ssid='{$wvalue}'";break;
                    case "name" : $sqlcmd .= " and BINARY name='{$wvalue}'";break;
                    case "apmac" : $sqlcmd .= " and BINARY apmac='{$wvalue}'";break;
                }
            }
            $ret = $this->portalsql->query($sqlcmd);
            if($ret > 0){
                return TRUE;
            }
        }
        return FALSE;
    }
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
/*=======================================  select =======================================*/
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
        $ret = $this->portalsql->query("select * from portal_ssid where BINARY name='{$name}'")->result_array();
        if(count($ret) > 0 ){
            return TRUE;
        }
        return FALSE;
    }
     // 判断添加（无$id参数）或修改时是否存在相同 SSID 与 apmac 的弹出规则
    private function isSameSsidApmacTemplate($templateData) {
      $ssid = element('ssid', $templateData, '');
      $apmac = element('apmac', $templateData, '');
      $id = element('id', $templateData, '');
      $ret = $this->portalsql->query("select * from portal_ssid where BINARY ssid='{$ssid}' and BINARY apmac='{$apmac}'")->result_array();

      if (count($ret) > 0) {
        // 添加时不需要判断ID
        if (!$id) {
          return TRUE;

        }

        // 修改时需要 找到的 ID 不一样才认为修改
        if ($id !== $ret[0]['id']) {
          return TRUE;
        }
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
