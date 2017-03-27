import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { actions as appActions } from '../app';
import * as actions from './actions';
import reducer from './reducer';
import components from './components';
import AppScreen from './components/AppScreen';

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}

function createContainer(component) {
  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(component);
}

// 添加 redux 属性的 react 页面
const AppContainer = createContainer(AppScreen);

export default {
  createContainer,
  actions,
  components,
  reducer,
  AppContainer,
};
