import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';

// 原生的 react 页面
export const Statistics = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className="login">
        <p>设备统计报表</p>
        {this.props.fetching ? 'dsd': 'ok'}
      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.device;

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
)(Statistics);

export const device = reducer;

