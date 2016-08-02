import NotFound from 'shared/components/NotFound';
import remoteActionMiddleware from 'shared/utils/lib/remote_action_middleware';
import { combineReducers } from 'redux';

// 公用 样式
import 'shared/scss/styles.scss';
import guiConfig from './package.json';


// 多语言工具
const b28n = require('shared/b28n');
const cnCore = require('../lang/cn/core.json');
const cnAc = require('../lang/cn/ac.json');
const validateCn = require('../lang/cn/validate.json');
const langEn = require('../lang/en/core.json');

b28n.addDict(cnCore, 'cn');
b28n.addDict(cnAc, 'cn');
b28n.addDict(validateCn, 'cn');
b28n.addDict(langEn, 'en');

window.CB = b28n.init({
  supportLang: ['en', 'cn']
});
window.guiConfig = guiConfig;

document.getElementsByTagName('body')[0].className += ' ' + b28n.getLang();

/** ***********************************************************
 * 产品界面配置
 */

// 公用组件

// 主APP
const App = require('../../screens/App');

//
const sLogin = require('../../screens/App/screens/Login');
const sWizard = require('../../screens/App/screens/Wizard');

//
const sMainAc = require('../../screens/App/screens/MainAc');
const sInterfaces = require('../../screens/App/screens/MainAc/screens/vlan/screens/Interfaces');
const sVlanAaa = require('../../screens/App/screens/MainAc/screens/vlan/screens/Aaa');
const sVlanAcl = require('../../screens/App/screens/MainAc/screens/vlan/screens/Acl');
const sVlanNat = require('../../screens/App/screens/MainAc/screens/vlan/screens/Nat');
const sVlanDhcp = require('../../screens/App/screens/MainAc/screens/vlan/screens/Dhcp');
const sVlanRoutes = require('../../screens/App/screens/MainAc/screens/vlan/screens/Routes');

const routes = [{
  path: '/',
  component: App.Screen,
  indexRoute: { component: sLogin.Screen },
  childRoutes: [
    {
      path: '/main/network',
      component: sMainAc.Screen,
      text: _('NETWORK'),
      indexRoute: { onEnter: (nextState, replace) => replace('/main/network/vlan') },
      childRoutes: [{
          id: 'status',
          isIndex: true,
          path: '/main/network/vlan',
          icon: 'list',
          text: _('VLAN'),
          indexRoute: { onEnter: (nextState, replace) => replace('/main/network/vlan/interface') },
          childRoutes: [{
              id: 'interface',
              path: '/main/network/vlan/interface',
              text: _('Interface Settings'),
              component: sInterfaces.Screen,
            }, {
              id: 'vlanDhcp',
              path: '/main/network/vlan/dhcp',
              text: _('DHCP Settings'),
              component: sVlanDhcp.Screen,
            }, {
              id: 'vlanRoutes',
              path: '/main/network/vlan/routes',
              text: _('Routes Settings'),
              component: sVlanRoutes.Screen,
            }, {
              id: 'vlanNat',
              path: '/main/network/vlan/nat',
              text: _('NAT Settings'),
              component: sVlanNat.Screen,
            }, {
              id: 'vlanAcl',
              path: '/main/network/vlan/acl',
              text: _('ACL Settings'),
              component: sVlanAcl.Screen,
            }, {
              id: 'vlanAaa',
              path: '/main/network/vlan/aaa',
              text: _('AAA Settings'),
              component: sVlanAaa.Screen,
            }
          ]
        }, {
          id: 'port',
          path: '/main/network/port',
          icon: 'th',
          text: _('Port Settings'),
        }, {
          id: 'portal',
          icon: 'copy',
          path: '/main/network/portal',
          text: _('Portal Policy'),
        }, {
          id: 'radius',
          icon: 'files-o',
          path: '/main/network/radius',
          text: _('Radius Template'),
        }
      ],
    }, {
      path: '/main/group',
      component: sMainAc.Screen,
      text: _('AP GROUP'),
      indexRoute: { onEnter: (nextState, replace) => replace('/main/group/monitor') },
      childRoutes: [
        {
          id: 'monitor',
          isIndex: true,
          path: '/main/group/monitor',
          icon: 'bar-chart',
          text: _('Monitor'),
          indexRoute: { onEnter: (nextState, replace) => replace('/main/group/monitor/user') },
          childRoutes: [{
              id: 'user',
              path: '/main/group/monitor/user',
              text: _('User'),
            }, {
              id: 'client',
              path: '/main/group/monitor/client',
              text: _('Clients'),
            }, {
              id: 'flow',
              path: '/main/group/monitor/flow',
              text: _('Flow'),
            }, {
              id: 'wirelessStatus',
              path: '/main/group/monitor/wireless',
              text: _('Wireless Status'),
            }, {
              id: 'safeStatus',
              path: '/main/group/monitor/safe',
              text: _('Safe Status'),
            }, {
              id: 'alarmStatus',
              path: '/main/group/monitor/alarm',
              text: _('Alarm Events'),
            }
          ]
        }, {
          id: 'map',
          isIndex: true,
          path: '/main/group/map',
          icon: 'map',
          text: _('Map'),
          indexRoute: { onEnter: (nextState, replace) => replace('/main/group/map/live') },
          childRoutes: [{
              id: 'live',
              path: '/main/group/map/live',
              text: _('Live Map'),
            }, {
              id: 'rf',
              path: '/main/group/map/rf',
              text: _('RF'),
            }, {
              id: 'heat',
              path: '/main/group/map/heat',
              text: _('Heat Map'),
            }, {
              id: 'cientsTrace',
              path: '/main/group/map/trace',
              text: _('Cients Trace'),
            }
          ]
        }, {
          id: 'wireless',
          isIndex: true,
          path: '/main/group/wireless',
          icon: 'wifi',
          text: _('Wireless'),
          indexRoute: { onEnter: (nextState, replace) => replace('/main/group/wireless/acl') },
          childRoutes: [{
              id: 'acl',
              path: '/main/group/wireless/acl',
              text: _('ACL Policy'),
            }, {
              id: 'smart',
              path: '/main/group/wireless/smart',
              text: _('Smart RF'),
            }, {
              id: 'timerPolicy',
              path: '/main/group/wireless/timer',
              text: _('Timer Policy'),
            }, {
              id: 'wirelessSafe',
              path: '/main/group/wireless/safe',
              text: _('Wireless Safe Policy'),
            }
          ]
        }, {
          id: 'report',
          isIndex: true,
          path: '/main/group/report',
          icon: 'file-text-o',
          text: _('Report'),
          indexRoute: { onEnter: (nextState, replace) => replace('/main/group/report/flow') },
          childRoutes: [
            {
              id: 'flowReport',
              isIndex: true,
              path: '/main/group/report/flow',
              text: _('Flow Report'),
            }, {
              id: 'businessReport',
              isIndex: true,
              path: '/main/group/report/business',
              text: _('Business Report'),
            }
          ]
        }, {
          id: 'system',
          isIndex: true,
          path: '/main/group/system',
          icon: 'cogs',
          text: _('System'),
          indexRoute: { onEnter: (nextState, replace) => replace('/main/group/system/upgrade') },
          childRoutes: [
            {
              id: 'upgrade',
              isIndex: true,
              path: '/main/group/system/upgrade',
              text: _('System Upgrade'),
            }, {
              id: 'apCorrelation',
              isIndex: true,
              path: '/main/group/system/correlation',
              text: _('AP Correlation'),
            }, {
              id: 'apLogs',
              isIndex: true,
              path: '/main/group/system/logs',
              text: _('AP Logs'),
            }
          ]
        }
      ],
    }, {
      path: '/main/system',
      component: sMainAc.Screen,
      text: _('SYSTEM'),
      indexRoute: { onEnter: (nextState, replace) => replace('/main/system/upgrade') },
      childRoutes: [{
          id: 'acUpgrade',
          isIndex: true,
          path: '/main/system/upgrade',
          icon: 'level-up',
          text: _('AC Upgrade'),
        }, {
          id: 'admin',
          isIndex: true,
          path: '/main/system/admin',
          icon: 'user',
          text: _('Admin Settings'),
        }, {
          id: 'License',
          isIndex: true,
          path: '/main/system/license',
          icon: 'file-text',
          text: _('License'),
        }, {
          id: 'systemMonitor',
          isIndex: true,
          path: '/main/system/monitor',
          icon: 'video-camera',
          text: _('System Monitor'),
        }, {
          id: 'activeStandby',
          isIndex: true,
          path: '/main/system/activeStandby',
          icon: 'refresh',
          text: _('Active-Standby'),
        }, {
          id: 'cluster',
          isIndex: true,
          path: '/main/system/cluster',
          icon: 'server',
          text: _('Custer Settings'),
        }, {
          id: 'signatures',
          isIndex: true,
          path: '/main/system/signatures',
          icon: 'tasks',
          text: _('Signatures'),
        }
      ],
    }, {
      path: '/wizard',
      component: sWizard.Screen,
    },
  ],
},{
  path: '/main/status',
  indexRoute: { onEnter: (nextState, replace) => replace('/main/network') },
}, {
  path: '*',
  component: NotFound,
}];


// 配置模块页面 store
const reducers = {
  app: App.app,
  login: sLogin.login,
  mainAc: sMainAc.mainAc,
  interfaces: sInterfaces.reducer
};

// Store
const stores = remoteActionMiddleware(
  combineReducers(reducers),

  // 支持 chrome 插件 Redux DevTools
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const app = {
  reducers,
  routes,
  stores,
};


export default app;

