import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import validator from 'shared/validator';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
  test: PropTypes.number,
};
const defaultProps = {
  test: 0,
};

const settingsOptions = fromJS([
  {
    id: 'bas_ip',
    label: _('Bas IP'),
    fieldset: 'base_setting',
    className: 'cols col-6',
    required: true,
    type: 'text',
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'bas_port',
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: _('Bas Port'),
    type: 'text',
    required: true,
  },
  {
    id: 'sharedSecret',
    required: true,
    type: 'password',
    className: 'cols col-6',
    fieldset: 'base_setting',
    label: _('Shared Secret'),
    validator: validator({
      rules: 'pwd',
    }),
  },
  {
    id: 'bas_user',
    type: 'text',
    required: true,
    className: 'cols col-6',
    fieldset: 'base_setting',
    label: _('User'),
  },
  {
    id: 'bas_pwd',
    type: 'password',
    required: true,
    className: 'cols col-6',
    fieldset: 'base_setting',
    label: _('Password'),
    validator: validator({
      rules: 'pwd',
    }),
  },
  {
    id: 'bas',
    required: true,
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: _('Device Type'),
    type: 'select',
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: _('Standard'),
      },
    ],
  },
  {
    id: 'portalVer',
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: _('Portal Vertion'),
    type: 'select',
    options: [
      {
        value: '1',
        label: _('V1/CMCC'),
      }, {
        value: '2',
        label: _('V2'),
        disabled: true,
      },
    ],
  },
  {
    id: 'authType',
    required: true,
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: _('Auth Type'),
    type: 'select',
    options: [
      {
        value: '0',
        label: _('PAP'),
        disabled: true,
      }, {
        value: '1',
        label: _('CHAP'),
      },
    ],
  },
  {
    id: 'timeoutSec',
    required: true,
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: _('Time out'),
    min: '0',
  }, {
    id: 'web',
    required: true,
    fieldset: 'base_setting',
    label: _('Web Template'),
    className: 'cols col-6',
    type: 'select',
    options: [
      {
        required: true,
        value: '0',
        label: _('Default Web'),
      },
    ],
  },
  // {
  //   id: 'isPortalCheck',
  //   required: true,
  //   fieldset: 'base_setting',
  //   className: 'cols col-6',
  //   label: _('Portal Acc'),
  //   type: 'text',
  // }, {
  //   id: 'isOut',
  //   required: true,
  //   fieldset: 'base_setting',
  //   className: 'cols col-6',
  //   label: _('Enviroment Deployment'),
  //   type: 'select',
  //   options: [
  //     {
  //       value: '0',
  //       label: _('Inside Network Deployment'),
  //     }, {
  //       value: '1',
  //       label: _('Outside Network Deployment'),
  //     },
  //   ],
  // }, {
  //   id: 'isComputer',
  //   required: true,
  //   fieldset: 'base_setting',
  //   className: 'cols col-6',
  //   label: _('Computer Auth'),
  //   type: 'select',
  //   options: [
  //     {
  //       value: '0',
  //       label: _('Allowed'),
  //     }, {
  //       value: '1',
  //       label: _('Forbidden'),
  //     },
  //   ],
  //   defaultValue: '0',
  // }, {
  //   id: 'lateAuth',
  //   required: true,
  //   fieldset: 'base_setting',
  //   className: 'cols col-6',
  //   label: _('Late Auth'),
  //   type: 'select',
  //   options: [
  //     {
  //       value: '0',
  //       label: _('Closed'),
  //     }, {
  //       value: '1',
  //       label: _('Open'),
  //     },
  //   ],
  //   defaultValue: '0',
  // }, {
  //   id: 'lateAuthTime',
  //   required: true,
  //   fieldset: 'base_setting',
  //   className: 'cols col-6',
  //   label: _('Late Authtime'),
  //   type: 'text',
  //   help: _('second'),
  // },
  {
    id: 'list',
    type: 'list',
    list: [
      {
        id: 'enable',
        label: _('Initiate Mode'),
        type: 'checkbox',
        display: 'block',
      }, {
        id: 'type',
        label: _('Authentication Types'),
        options: [
          {
            value: '0',
            label: _('One Key Auth'),
          }, {
            value: '1',
            label: _('Access User Auth'),
          }, {
            value: '2',
            label: _('Radius Auth'),
          }, {
            value: '3',
            label: _('App Auth'),
          }, {
            value: '4',
            label: _('Messages Auth'),
          }, {
            value: '5',
            label: _('Wechat Auth'),
          }, {
            value: '6',
            label: _('Public Platform Auth'),
          }, {
            value: '7',
            label: _('Visitor Auth'),
          },
        ],
        noForm: true,
      }, {
        id: 'username',
        label: _('Public User Name'),
        type: 'text',
      }, {
        id: 'password',
        label: _('Public Password'),
        type: 'password',
      }, {
        id: 'sessiontime',
        label: _('Sesssion Time'),
        type: 'text',
      }, {
        id: 'url',
        label: _('URL After Authentication'),
        type: 'text',
      },
    ],
  },
]);

export default class View extends React.Component {
  render() {
    return (
      <AppScreen
        {...this.props}
        className="port-base"
        settingsFormOptions={settingsOptions}
        hasSettingsSaveButton
        noTitle
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
