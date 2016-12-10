import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AppScreen from 'shared/components/Template/AppScreen';

// custom
import * as screenActions from 'shared/actions/screens';

const flowRateFilter = utils.filter('flowRate:["KB"]');
const listOptions = fromJS([
  {
    id: 'username',
    text: _('User Name'),
    width: '200',
  }, {
    id: 'curApp',
    text: _('Current App'),
  }, {
    id: 'bandwidth',
    text: _('Up/Down Speed'),
    transform(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}/${downRate}`;
    },
  }, {
    id: 'percentage',
    text: _('Percentage'),
  },
]);

const propTypes = {};
const defaultProps = {};

export default class FlowUser extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
      />
    );
  }
}

FlowUser.propTypes = propTypes;
FlowUser.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
    store: state.screens,
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  screenActions,
)(FlowUser);

