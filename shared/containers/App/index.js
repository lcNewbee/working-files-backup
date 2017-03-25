import { connect } from 'react-redux';
import actions from './action';
import App from './components/App';

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

// 添加 redux 属性的 react 页面
export const AppContainer = connect(
  mapStateToProps,
  actions,
)(App);

export { default as actions } from './action';
export { default as reducer } from './reducer';
