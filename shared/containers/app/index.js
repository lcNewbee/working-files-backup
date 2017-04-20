import { connect } from 'react-redux';
import * as appActions from './actions';
import appReducer from './reducer';
import App from './components/App';


function mapStateToProps(state) {
  const $$app = state.app;
  return {
    // app: state.app,
    $$router: $$app.get('router'),
    $$modal: $$app.get('modal'),
  };
}

// Export List
export function createContainer(component) {
  return connect(
    mapStateToProps,
    appActions,
  )(component);
}
export const actions = appActions;
export const reducer = appReducer;

// 添加 redux 属性的 react 页面
export const Screen = createContainer(App);

