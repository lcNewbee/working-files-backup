import React from 'react';
import {connect} from 'react-redux';
import * as actions from 'actions/ajax';
import reducer from './reducer';

export const App = React.createClass({
  render: function() {
    return this.props.children;
  }
});

function mapStateToProps(state) {
  var myState = state.app;

  return {
    app: myState
  };
}
// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps
)(App);

export const app = reducer;
