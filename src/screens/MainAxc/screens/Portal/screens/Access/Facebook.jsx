import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';



const listOptions = fromJS([
  {
    id: 'appId',
    text: __('App ID'),
    formProps: {
      type: 'text',
      required: true,
      maxLength: '256',
      validator: validator({
        rules: 'utf8Len:[1, 255]',
      }),
    },
  }, {
    id: 'appSecret',
    text: __('Password'),
    formProps: {
      maxLength: '128',
      type: 'password',
      required: true,
      validator: validator({
        rules: 'pwd',
      }),
    },
  }, {
    id: 'appVersion',
    text: __('App Version'),
    formProps: {
      type: 'text',
    },
  }, {
    id: 'state',
    text: __('State'),
    formProps: {
      type: 'select',
      required: true,
    },
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: __('On Service'),
      }, {
        value: '0',
        label: __('Out of Service'),
      },
    ],
  },
]);

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};
export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        listOptions={listOptions}
        noTitle
        actionable
        selectable
        searchable
        searchProps={{
          placeholder: `${__('App ID')}`,
        }}
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
