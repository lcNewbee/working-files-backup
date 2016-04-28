import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';

// 原生的 react 页面
export const Clients = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div>
        <h2>客户端列表</h2>
      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.clients;

  return {
    fetching: myState.get('fetching'),
    logined: myState.get('logined'),
    data: myState.get('data')
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Clients);

export const clients = reducer;

