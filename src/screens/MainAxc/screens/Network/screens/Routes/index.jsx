// V2.5版本的静态路由功能页面
import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'destnet',
    text: __('Target IP'),
    defaultValue: '',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip:[true]',
        exclude: '0.0.0.0',
      }),
    },
  }, {
    id: 'mask',
    text: __('Target Subnet Mask'),
    defaultValue: '',
    formProps: {
      required: true,
      validator: validator({
        rules: 'mask',
        exclude: ['0.0.0.0', '255.255.255.255'],
      }),
    },
  }, {
    id: 'gateway',
    text: __('Next Hop IP'),
    defaultValue: '',
    formProps: {
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  },
]);

const propTypes = {
  save: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        listKey="allKeys"
        actionable
        selectable
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
