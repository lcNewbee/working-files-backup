import NotFound from 'shared/components/NotFound';
import settingsReducer from 'shared/reducers/settings';
import remoteActionMiddleware from 'shared/utils/lib/remote_action_middleware';
import { combineReducers } from 'redux';
import b28n from 'shared/b28n';
import * as appActions from 'shared/actions/app';
import appReducer from 'shared/reducers/app';

//
import 'shared/scss/styles.scss';
import guiConfig from './config.json';
// 多语言工具
const langCn = require('../lang/cn/core.json');
const apCn = require('../lang/cn/ap.json');

b28n.addDict(langCn, 'cn');
b28n.addDict(apCn, 'cn');

window.CB = b28n.init({
  supportLang: ['en', 'cn'],
});
window.guiConfig = guiConfig;


const App = require('../../screens/App');
const sWizard = require('../../screens/App/screens/Wizard');
// 登录界面
const pLogin = require('../../screens/App/screens/Login');
// 布局
const MainAP = require('../../screens/App/screens/MainAP');

const pSystemStatus = require('../../screens/App/screens/MainAP/screens/SystemStatus');
// 无线设置
const pWirelessConfig = require('../../screens/App/screens/MainAP/screens/WirelessConfig');
// 子菜单
const sBasic = require('../../screens/App/screens/MainAP/screens/WirelessConfig/Basic');

const routes = [{
  path: '/',
  component: App.Screen,
  formUrl: '/goform/get_system_info_forTestUse',
  indexRoute: { component: pLogin.Screen },
  childRoutes: [{
    path: '/main',
    component: MainAP.Screen,
    childRoutes: [{
      id: 'systemstatus',
      fetchUrl: 'goform/get_system_info_forTestUse',
      path: '/main/status',
      icon: 'pie-chart',
      text: _('Device Status'),
      component: pSystemStatus.Screen,
    }, {
      id: 'wirelessconfig',
      path: '/main/wirelessconfig_forTestUse',
      icon: 'wifi',
      text: _('Wireless'),
      component: pWirelessConfig,
      indexRoute: {
        onEnter: (nextState, replace) => replace('/main/wirelessconfig/basic'),
      },
      childRoutes: [
        {
          id: 'basic',
          path: '/main/wirelessconfig/basic',
          text: _('Basic'),
          formUrl: 'goform/get_wl_info_forTestUse',
          saveUrl: 'goform/set_wireless_forTestUse',
          component: sBasic.Screen,
        },
      ],
    },
    ],
  }, {
    path: '/wizard',
    component: sWizard.Screen,
  }],
}, {
  path: '*',
  component: NotFound,
}];

const reducers = {
  app: appReducer,
  settings: settingsReducer,

  login: pLogin.login,
  // systemstatus: pSystemStatus.systemstatus,
  basic: sBasic.basic,
};

const stores = remoteActionMiddleware(
  combineReducers(reducers),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const ac5000 = {
  reducers,
  routes,
  stores,
};

stores.dispatch(appActions.initAppConfig(guiConfig));

export default ac5000;
