import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';
import './_index.scss';

const rows = [
  ['a1', 'b1', 'c1', 32, 32,32,32, 32,4546,32],
  // .... and more
];

// 原生的 react 页面
export const Device = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className="page-device">
        <h2>设备信息</h2>
        <div className="clearfix">
          <input type="text" className="search fl"/>
          <div className="btn-group fl">
            <button className="btn active">All</button>
            <button className="btn">室内接入点全部</button>
            <button className="btn">点对点网桥</button>
            <button className="btn">室外接入点</button>
          </div>
          <select name="" id="" className="fr">
            <option value="ds">dsdsd</option>
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>MAC地址/设备名</th>
              <th>地址</th>
              <th>状态</th>
              <th>型号</th>
              <th>版本号</th>
              <th>信道</th>
              <th>运行时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {(
              rows.map(function (item, i) {
                return (
                  <tr key={i} >
                    <td>{item[0]}</td>
                    <td>{item[1]}</td>
                    <td>{item[2]}</td>
                    <td>{item[2]}</td>
                    <td>{item[2]}</td>
                    <td>{item[2]}</td>
                    <td>{item[2]}</td>
                    <td>{item[2]}</td>
                  </tr>
                );
              })
            ) }
          </tbody>
        </table>
      </div >
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
)(Device);

export const device = reducer;

