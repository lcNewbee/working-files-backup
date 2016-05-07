import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from './actions';
import reducer from './reducer';
import Button from 'comlan/components/Button';

const msg = {
  TITIE: _('Reports'),
  EXPORTING: _('Exporting The Reports')
}

// 原生的 react 页面
export const Statistics = React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className="page-reports">
        <h2>{msg.TITIE}</h2>
        <div>
          <Button
            role="download"
            text={msg.EXPORTING}
          />
        </div>
      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.statistics;

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

export const statistics = reducer;

