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
    type: 'number',
    required: true,
    min: '1',
    max: '65535',
    validator: validator({
      rules: 'num',
    }),
  },
  {
    id: 'sharedSecret',
    required: true,
    type: 'password',
    className: 'cols col-6',
    fieldset: 'base_setting',
    label: _('Shared Secret'),
    maxLength: '32',
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
    maxLength: '32',
    label: _('User'),
    validator: validator({
      rules: 'utf8Len:[1, 31]',
    }),
  },
  {
    id: 'bas_pwd',
    type: 'password',
    required: true,
    className: 'cols col-6',
    fieldset: 'base_setting',
    label: _('Password'),
    maxLength: '32',
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
    required: true,
    label: _('Portal Vertion'),
    type: 'select',
    defaultValue: '1',
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
    defaultValue: '1',
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
    type: 'number',
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: _('Time out'),
    min: '0',
    max: '999999999',
    help: _('Second'),
    validator: validator({
      rules: 'num',
    }),
  }, {
    id: 'web',
    required: true,
    fieldset: 'base_setting',
    label: _('Web Template'),
    className: 'cols col-6',
    type: 'select',
    defaultValue: '0',
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
        defaultValue: 'Empty Wanted',
        type: 'text',
        maxLength: '32',
        validator: validator({
          rules: 'utf8Len:[1, 31]',
        }),
      }, {
        id: 'password',
        label: _('Public Password'),
        type: 'password',
        maxLength: '30',
        validator: validator({
          rules: 'pwd',
        }),
      }, {
        id: 'sessiontime',
        label: _('Sesssion Time'),
        type: 'number',
        min: '0',
        max: '99999',
        validator: validator({
          rules: 'num',
        }),
      }, {
        id: 'url',
        label: _('URL After Authentication'),
        type: 'text',
        maxLength: '32',
        validator: validator({
          rules: 'utf8Len:[1, 31]',
        }),
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
