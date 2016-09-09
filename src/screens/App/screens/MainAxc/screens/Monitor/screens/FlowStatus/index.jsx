import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import utils from 'shared/utils';
import {
  ListInfo,
} from 'shared/components';

// custom
import * as screenActions from 'shared/actions/screens';

const flowRateFilter = utils.filter('flowRate:["KB"]');
const flowTableOptions = fromJS([
  {
    id: 'appName',
    text: _('App Name'),
    width: '200',
  }, {
    id: 'number',
    text: _('User Numbers'),
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
        tableOptions={flowTableOptions}
      />
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  screenActions
)(View);

