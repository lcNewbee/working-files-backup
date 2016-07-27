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
      indexRoute: { onEnter: (nextState, replace) => replace('/main/network/status') },
      childRoutes: [{
          id: 'status',
          isIndex: true,
          path: '/main/network/status',
          icon: 'bar-chart',
          text: _('STATISTICS'),
          component: sStatus.Screen,
        }
      ],
    }, {
      path: '/main/group',
      component: sMainAc.Screen,
      indexRoute: { onEnter: (nextState, replace) => replace('/main/group/status') },
      childRoutes: [{
          id: 'status',
          isIndex: true,
          path: '/main/group/status',
          icon: 'bar-chart',
          text: _('STATISTICS'),
          component: sStatus.Screen,
          indexRoute: { onEnter: (nextState, replace) => replace('/main/group/status/232') },
          childRoutes: [{
              id: 'status',
              path: '/main/group/status/232',
              text: _('STATISTICS'),
              component: sStatus.Screen,
            }, {
              id: 'status',
              path: '/main/group/status/23',
              text: _('STATISTICS'),
              component: sStatus.Screen,
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
  indexRoute: { onEnter: (nextState, replace) => replace('/main/network/status') },
}, {
  path: '*',
  component: NotFound,
}];


// 配置模块页面 store
const reducers = {
  app: App.app,
  login: sLogin.login,
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

