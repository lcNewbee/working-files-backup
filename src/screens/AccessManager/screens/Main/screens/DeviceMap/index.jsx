import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';

class DeviceMap extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };

  render() {
    return (
      <div>
        <h2>地图</h2>
      </div>
    );
  }
}

function mapStateToProps(state) {
  var myState = state.deviceMap;

  return {
    store: myState,
    app: state.app
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions
)(DeviceMap);

export const device = reducer;

