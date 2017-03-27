import { connect } from 'react-redux';
import * as actions from './actions';
import reducer from './reducer';
import App from './components/App';

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

function createContainer(component) {
  return connect(
    mapStateToProps,
    actions,
  )(component);
}

// 添加 redux 属性的 react 页面
const Screen = createContainer(App);

export default {
  createContainer,
  actions,
  reducer,
  Screen,
};
