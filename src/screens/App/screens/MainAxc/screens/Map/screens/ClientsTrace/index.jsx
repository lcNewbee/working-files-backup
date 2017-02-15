import React from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import utils from 'shared/utils';
import AppScreen from 'shared/components/Template/AppScreen';

// custom
import * as screenActions from 'shared/actions/screens';

const listOptions = fromJS([
  {
    id: 'stamac',
    text: _('Client'),
    width: '200',
  }, {
    id: 'starttime',
    text: _('Occurrence Time'),
  }, {
    id: 'endtime',
    text: _('Departure Time'),
  }, {
    id: 'rssi',
    text: _('RSSI'),
  },
]);

const propTypes = {};
const defaultProps = {};

export default class View extends React.PureComponent {
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

