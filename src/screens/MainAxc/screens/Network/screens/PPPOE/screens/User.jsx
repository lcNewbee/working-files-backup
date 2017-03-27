import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'user_name',
    text: __('User Name'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'pwd',
    text: __('User Password'),
    formProps: {
      type: 'text',
      required: true,
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
