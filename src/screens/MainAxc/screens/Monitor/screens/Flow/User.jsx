import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import utils from 'shared/utils';


// custom
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

const flowRateFilter = utils.filter('flowRate:["KB"]');
const listOptions = fromJS([
  {
    id: 'username',
    text: __('User Name'),
    width: '200',
  }, {
    id: 'curApp',
    text: __('Current App'),
  }, {
    id: 'bandwidth',
    text: __('Up/Down Speed'),
    transform(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}/${downRate}`;
    },
  }, {
    id: 'percentage',
    text: __('Percentage'),
  },
]);

const propTypes = {};
const defaultProps = {};

export default class FlowUser extends React.PureComponent {
  constructor(props) {
    super(props);
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

