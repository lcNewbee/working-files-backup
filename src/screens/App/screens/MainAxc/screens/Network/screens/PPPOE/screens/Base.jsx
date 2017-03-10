import React from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import AppScreen from 'shared/components/Template/AppScreen';
import * as screenActions from 'shared/actions/screens';
import * as appActions from 'shared/actions/app';

const listOptions = fromJS([
  {
    id: 'service',
    text: _('PPPOE Service'),
    defaultValue: '1',
    type: 'switch',
    formProps: {
      required: true,
      type: 'checkbox',
      value: '1',
      text: _('Enable'),
    },
  }, {
    id: 'auth_method',
    text: _('Auth Method'),
    formProps: {
      type: 'select',
      required: true,
    },
    options: [
      {
        value: '0',
        label: _('Unencrypted'),
      },
      {
        value: '1',
        label: _('PAP'),
      },
      {
        value: '2',
        label: _('CHAP'),
      },
    ],
  }, {
    id: 'validate_mode',
    text: _('Validation Mode'),
    formProps: {
      label: _('Validation Mode'),
      type: 'switch',
      required: true,
    },
    options: [
      {
        value: 'local',
        label: `${_('Local')}`,
      },
      {
        value: 'radius-scheme',
        label: `${_('Remote')}`,
      },
    ],
  }, {
    id: 'max_user',
    text: _('Max Users'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'serverIP',
    text: _('Server IP'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'clientIP',
    text: _('Client IP'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'dns_server',
    text: _('DNS Server'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'standyby_server',
    text: _('Standby DNS Server'),
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'cur_user',
    text: _('Connected Users'),
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
