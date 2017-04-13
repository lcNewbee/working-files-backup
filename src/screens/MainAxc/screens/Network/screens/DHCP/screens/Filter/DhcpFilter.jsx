import React from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'name',
    text: __('Filter Name'),
    formProps: {
      required: true,
      type: 'text',
      maxLength: '31',
      validator: validator({
        rules: 'utf8Len:[1, 31]',
      }),
    },
  }, {
    id: 'option',
    text: __('Option Number'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'deviation',
    text: __('Deviation'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'option_value',
    text: __('Option Value'),
    formProps: {
      required: true,
      type: 'text',
    },
  },
]);
const propTypes = {
};
const defaultProps = {};

export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
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
