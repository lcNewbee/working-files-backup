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


const App = require('./App');
const pLogin = require('./Login');

const routes = [{
  path: '/',
  component: App.Screen,
  indexRoute: { component: pLogin.Screen },
}];

const reducers = {
  app: appReducer,
  settings: settingsReducer,
  login: pLogin.login,
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
