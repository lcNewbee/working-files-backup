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
    label: __('Bas IP'),
    fieldset: 'base_setting',
    className: 'cols col-6',
    required: true,
    type: 'text',
    validator: validator({
      rules: 'ip',
      exclude: '127.0.0.1',
    }),
  },
  {
    id: 'bas_port',
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: __('Bas Port'),
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
    label: __('Shared Secret'),
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
    label: __('User'),
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
    label: __('Password'),
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
    label: __('Device Type'),
    type: 'select',
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: __('Standard'),
      },
    ],
  },
  {
    id: 'portalVer',
    fieldset: 'base_setting',
    className: 'cols col-6',
    required: true,
    label: __('Portal Vertion'),
    type: 'select',
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: __('V1/CMCC'),
      }, {
        value: '2',
        label: __('V2'),
        disabled: true,
      },
    ],
  },
  {
    id: 'authType',
    required: true,
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: __('Auth Type'),
    type: 'select',
    defaultValue: '1',
    options: [
      {
        value: '0',
        label: __('PAP'),
        disabled: true,
      }, {
        value: '1',
        label: __('CHAP'),
      },
    ],
  },
  {
    id: 'timeoutSec',
    required: true,
    type: 'number',
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: __('Time out'),
    min: '0',
    max: '10',
    defaultValue: '4',
    help: __('Second'),
    validator: validator({
      rules: 'num',
    }),
  }, {
    id: 'web',
    required: true,
    fieldset: 'base_setting',
    label: __('Web Template'),
    className: 'cols col-6',
    type: 'select',
    defaultValue: '0',
    options: [
      {
        value: '0',
        label: __('Default Web'),
      },
    ],
  },
  {
    id: 'isPortalCheck',
    required: true,
    fieldset: 'base_setting',
    className: 'cols col-6',
    label: __('Portal Acc'),
    type: 'select',
    defaultValue: '1',
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
  },
  // {
  //   id: 'isOut',
  //   required: true,
  //   fieldset: 'base_setting',
  //   className: 'cols col-6',
  //   label: __('Enviroment Deployment'),
  //   type: 'select',
  //   options: [
  //     {
  //       value: '0',
  //       label: __('Inside Network Deployment'),
  //     }, {
  //       value: '1',
  //       label: __('Outside Network Deployment'),
  //     },
  //   ],
  // }, {
  //   id: 'isComputer',
  //   required: true,
  //   fieldset: 'base_setting',
  //   className: 'cols col-6',
  //   label: __('Computer Auth'),
  //   type: 'select',
  //   options: [
  //     {
  //       value: '0',
  //       label: __('Allowed'),
  //     }, {
  //       value: '1',
  //       label: __('Forbidden'),
  //     },
  //   ],
  //   defaultValue: '0',
  // }, {
  //   id: 'lateAuth',
  //   required: true,
  //   fieldset: 'base_setting',
  //   className: 'cols col-6',
  //   label: __('Late Auth'),
  //   type: 'select',
  //   options: [
  //     {
  //       value: '0',
  //       label: __('Closed'),
  //     }, {
  //       value: '1',
  //       label: __('Open'),
  //     },
  //   ],
  //   defaultValue: '0',
  // }, {
  //   id: 'lateAuthTime',
  //   required: true,
  //   fieldset: 'base_setting',
  //   className: 'cols col-6',
  //   label: __('Late Authtime'),
  //   type: 'text',
  //   help: __('second'),
  // },
  {
    id: 'list',
    type: 'list',
    list: [
      {
        id: 'enable',
        label: __('Initiate Mode'),
        type: 'checkbox',
        display: 'block',
      }, {
        id: 'type',
        label: __('Authentication Types'),
        options: [
          {
            value: '0',
            label: __('One Key Auth'),
          }, {
            value: '1',
            label: __('Access User Auth'),
          }, {
            value: '2',
            label: __('Radius Auth'),
          }, {
            value: '3',
            label: __('App Auth'),
          }, {
            value: '4',
            label: __('Messages Auth'),
          }, {
            value: '5',
            label: __('Wechat Auth'),
          }, {
            value: '6',
            label: __('Public Platform Auth'),
          }, {
            value: '7',
            label: __('Visitor Auth'),
          },
        ],
        noForm: true,
      }, {
        id: 'username',
        label: __('Public User Name'),
        defaultValue: 'Empty Wanted',
        type: 'text',
        maxLength: '32',
        validator: validator({
          rules: 'utf8Len:[1, 31]',
        }),
      }, {
        id: 'password',
        label: __('Public Password'),
        type: 'password',
        maxLength: '30',
        validator: validator({
          rules: 'pwd',
        }),
      }, {
        id: 'sessiontime',
        label: __('Sesssion Time'),
        type: 'number',
        min: '0',
        max: '99999',
        validator: validator({
          rules: 'num',
        }),
      }, {
        id: 'url',
        label: __('URL After Authentication'),
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
