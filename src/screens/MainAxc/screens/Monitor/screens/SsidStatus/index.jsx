import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import utils from 'shared/utils';

// custom
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

const flowRateFilter = utils.filter('flowRate');
const checkboxOptions = [
  {
    value: 1,
    label: __('On'),
    render() {
      return (
        <span
          style={{
            color: 'green',
          }}
        >
          {__('On')}
        </span>
      );
    },
  }, {
    value: 0,
    label: __('Off'),
    render() {
      return (
        <span
          style={{
            color: 'red',
          }}
        >
          {__('Off')}
        </span>
      );
    },
  },
];
const ssidListOptions = fromJS([
  {
    id: 'ssid',
    text: 'SSID',
    width: '180',

  }, {
    id: 'enabled',
    text: __('Status'),
    options: checkboxOptions,
  }, {
    id: 'onlineNumber',
    width: '140',
    text: __('Online Numbers'),
  }, {
    id: 'apNumber',
    width: '140',
    text: __('AP Number'),
  }, {
    id: 'bandwidth',
    text: __('UP/Down Traffic'),
    transform(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}/${downRate}`;
    },
  },
]);
const apNumberIndex = ssidListOptions.findIndex(
  $$item => $$item.get('id') === 'apNumber',
);

const propTypes = {};
const defaultProps = {};
export default class View extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'initListOptions',
    ]);
    this.initListOptions(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.groupid !== this.props.groupid) {
      this.initListOptions(nextProps);
    }
  }

  initListOptions(props) {
    // 所有组
    if (props.groupid === -100) {
      this.listOptions = ssidListOptions;
    } else {
      this.listOptions = ssidListOptions.delete(apNumberIndex);
    }
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={this.listOptions}
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

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
)(View);
