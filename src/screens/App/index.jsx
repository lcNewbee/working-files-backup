import React from 'react';
import utils from 'utils';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import * as actions from 'actions/app';
import reducer from './reducer';

export const App = React.createClass({

  componentWillMount() {
    this.props.fetchAcInfo();
  },

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
function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    actions
  ), dispatch)
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export const app = reducer;
