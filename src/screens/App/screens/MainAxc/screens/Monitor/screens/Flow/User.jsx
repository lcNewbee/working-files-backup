import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import utils from 'shared/utils';
import ListInfo from 'shared/components/Template/ListInfo';

// custom
import * as screenActions from 'shared/actions/screens';

const flowRateFilter = utils.filter('flowRate:["KB"]');
const flowTableOptions = fromJS([
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

export default function View(props) {
  return (
    <ListInfo
      {...props}
      tableOptions={flowTableOptions}
      noTitle
    />
  );
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
  screenActions
)(View);

