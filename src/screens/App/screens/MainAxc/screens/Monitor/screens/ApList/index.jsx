import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import utils from 'shared/utils';
import {
  ListInfo,
} from 'shared/components';

// custom
import * as listActions from 'shared/actions/list';

const flowRateFilter = utils.filter('flowRate:["KB"]');
const apTableOptions = fromJS([
  {
    id: 'devicename',
    width: '180',
    text: _('MAC Address') + '/' + _('Name'),
    transform(val, item) {
      return item.get('devicename') || item.get('mac');
    },
  }, {
    id: 'ip',
    width: '160',
    text: _('IP Address'),
  }, {
    id: 'mac',
    width: '160',
    text: _('MAC Address'),
  }, {
    id: 'type',
    width: '140',
    text: _('Connected Numbers'),
  }, {
    id: 'bandwidth',
    text: _('Up/Down Speed'),
    transform(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}/${downRate}`;
    },
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initList: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.onAction = this.onAction.bind(this);
  }
  onAction() {

  }
  render() {
    return (
      <ListInfo
        {...this.props}
        tableOptions={apTableOptions}
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.list,
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  listActions
)(View);
