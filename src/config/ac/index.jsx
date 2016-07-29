import NotFound from 'shared/components/NotFound';
import remoteActionMiddleware from 'shared/utils/lib/remote_action_middleware';
import { combineReducers } from 'redux';

// 公用 样式
import 'shared/scss/styles.scss';
import guiConfig from './package.json';

// 多语言工具
const b28n = require('shared/b28n');
const langCn = require('../lang/cn/core.json');
const validateCn = require('../lang/cn/validate.json');
const langEn = require('../lang/en/core.json');

b28n.addDict(langCn, 'cn');
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

const sMainAc = require('../../screens/App/screens/MainAc');

// 热点统计
const sStatus = require('../../screens/App/screens/Main/screens/Stats');


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
          icon: 'bar-chart',
          text: _('VLAN'),
          indexRoute: { onEnter: (nextState, replace) => replace('/main/network/vlan/port') },
          childRoutes: [{
              id: 'vlanPort',
              path: '/main/network/vlan/port',
              text: _('Port Settings')
            }, {
              id: 'vlanDhcp',
              path: '/main/network/vlan/dhcp',
              text: _('DHCP Settings'),
            }, {
              id: 'vlanRoutes',
              path: '/main/network/vlan/routes',
              text: _('Routes Settings'),
            }, {
              id: 'vlanNat',
              path: '/main/network/vlan/nat',
              text: _('NAT Settings'),
            }, {
              id: 'vlanAcl',
              path: '/main/network/vlan/acl',
              text: _('ACL Settings'),
            }, {
              id: 'vlanAaa',
              path: '/main/network/vlan/aaa',
              text: _('AAA Settings'),
            }
          ]
        }, {
          id: 'port',
          path: '/main/network/port',
          text: _('Port Settings'),
        }, {
          id: 'portal',
          path: '/main/network/portal',
          text: _('Portal'),
        }, {
          id: 'radius',
          path: '/main/network/radius',
          text: _('Radius'),
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
              text: _('Alarm Status'),
            }
          ]
        }, {
          id: 'map',
          isIndex: true,
          path: '/main/group/map',
          icon: 'bar-chart',
          text: _('Monitor'),
          indexRoute: { onEnter: (nextState, replace) => replace('/main/group/map/live') },
          childRoutes: [{
              id: 'live',
              path: '/main/group/map/live',
              text: _('Live'),
            }, {
              id: 'rf',
              path: '/main/group/map/rf',
              text: _('RF'),
            }, {
              id: 'heat',
              path: '/main/group/monitor/heat',
              text: _('Heat Map'),
            }, {
              id: 'cientsTrace',
              path: '/main/group/monitor/trace',
              text: _('Cients Trace'),
            }
          ]
        }, {
          id: 'settings',
          isIndex: true,
          path: '/main/group/setting',
          icon: 'bar-chart',
          text: _('Settings'),
          indexRoute: { onEnter: (nextState, replace) => replace('/main/group/setting/user') },
          childRoutes: [{
              id: 'user',
              path: '/main/group/setting/user',
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
              text: _('Alarm Status'),
            }
          ]
        }, {
          id: 'status',
          isIndex: true,
          path: '/main/group/staxcusss',
          icon: 'bar-chart',
          text: _('STATISTICS'),
          component: sStatus.Screen,
          indexRoute: { onEnter: (nextState, replace) => replace('/main/group/staxcusss/232') },
          childRoutes: [{
              id: 'status',
              isIndex: true,
              path: '/main/group/staxcusss/232',
              text: _('STATISTICS'),
              component: sStatus.Screen,
            }
          ]
        }
      ],
    }, {
      path: '/main/system',
      component: sMainAc.Screen,
      text: _('SYSTEM'),
      indexRoute: { onEnter: (nextState, replace) => replace('/main/system/status') },
      childRoutes: [{
          id: 'status',
          isIndex: true,
          path: '/main/system/status',
          icon: 'bar-chart',
          text: _('STATISTICS'),
          component: sStatus.Screen,
        }, {
          id: 'status',
          isIndex: true,
          path: '/main/system/statusss',
          icon: 'bar-chart',
          text: _('STATISTICS'),
          component: sStatus.Screen,
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
  status: sStatus.status,
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

