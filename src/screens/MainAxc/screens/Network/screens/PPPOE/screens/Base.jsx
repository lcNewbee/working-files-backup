import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';

import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';

const listOptions = fromJS([
  {
    id: 'service',
    text: __('PPPOE Service'),
    defaultValue: '1',
    type: 'switch',
    formProps: {
      required: true,
      type: 'checkbox',
      value: '1',
      text: __('Enable'),
    },
  }, {
    id: 'auth_method',
    text: __('Authentication Method'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: __('Unencrypted'),
      },
      {
        value: '1',
        label: __('PAP'),
      },
      {
        value: '2',
        label: __('CHAP'),
      },
    ],
  }, {
    id: 'validate_mode',
    text: __('Validation Mode'),
    formProps: {
      label: __('Validation Mode'),
      type: 'switch',
      required: true,
    },
    options: [
      {
        value: 'local',
        label: `${__('Local')}`,
      },
      {
        value: 'radius-scheme',
        label: `${__('Remote')}`,
      },
    ],
  }, {
    id: 'max_user',
    text: __('Max Users'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'serverIP',
    text: __('Server IP'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'clientIP',
    text: __('Client IP'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'dns_server',
    text: __('DNS Server'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'standyby_server',
    text: __('Standby DNS Server'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'cur_user',
    text: __('Connected Users'),
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
