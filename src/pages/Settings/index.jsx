import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';

// 原生的 react 页面
export const Settings = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div>
        <h2>设置</h2>
        <div className="clearfix">
          <div className="btn-group">
            <a className="btn active">设备组</a>
            <a className="btn">流量控制</a>
            <a className="btn">无线网络</a>
            <a className="btn">Portal模板</a>
            <a className="btn">来宾用户设置</a>
            <a className="btn">管理员</a>
          </div>
        </div>
      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.settings;

  return {
    fetching: myState.get('fetching'),
    logined: myState.get('logined')
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Settings);

export const settings = reducer;

