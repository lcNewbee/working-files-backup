import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { Button, Modal} from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import validator from 'shared/validator';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
  test: PropTypes.number,
  updateScreenSettings: PropTypes.func,
};
const defaultProps = {
  test: 0,
};

  // {
  //   id: 'url',
  //   label: __('URL After Authentication'),
  //   type: 'text',
  //   validator: validator({
  //     rules: 'utf8Len:[0, 255]',
  //   }),
  // },
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
        onChange: (data) => {
          const curIndex = data.index;
          const retData = data;
          if (retData.value === '1') {
            // 接入认证
            if (curIndex === 1) {
              retData.mergeData = {
                list: [
                  {},
                  {},
                  { enable: '0' },
                ],
              };
            // Radiu认证
            } else if (curIndex === 2) {
              retData.mergeData = {
                list: [
                  {},
                  { enable: '0' },
                ],
              };
            }
          }
          return retData;
        },
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
          }, {
            value: '9',
            label: __('Facebook Auth'),
          },
        ],
        noForm: true,
      }, {
        id: 'username',
        label: __('Public User Name'),
        defaultValue: 'Empty Wanted',
        type: 'text',
        maxLength: '129',
        validator: validator({
          rules: 'utf8Len:[1, 128]',
        }),
      }, {
        id: 'password',
        label: __('Public Password'),
        type: 'password',
        maxLength: '128',
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
          rules: 'num:[0,99999]',
        }),
      }, {
        id: 'url',
        label: __('URL After Authentication'),
        type: 'text',
        validator: validator({
          rules: 'utf8Len:[0, 255]',
        }),
      },
    ],
  },

const oneKeyURLOption = fromJS([
  {
    id: 'oneKey_URL',
    label: __('URL After Authentication'),
    type: 'text',
    validator: validator({
      rules: 'utf8Len:[0, 255]',
    }),
  },
]);

export default class View extends React.Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onBeforeSync',
    ]);
  }

  onOneKeyURLModal() {
    this.setState({
      customModal: true,
    });
  }
  render() {
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
          rules: 'num:[1,65535]',
        }),
      },
      {
        id: 'sharedSecret',
        required: true,
        type: 'password',
        className: 'cols col-6',
        fieldset: 'base_setting',
        label: __('Shared Secret'),
        maxLength: '128',
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
        maxLength: '129',
        label: __('User'),
        validator: validator({
          rules: 'utf8Len:[1, 128]',
        }),
      },
      {
        id: 'bas_pwd',
        type: 'password',
        required: true,
        className: 'cols col-6',
        fieldset: 'base_setting',
        label: __('Password'),
        maxLength: '128',
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
          rules: 'num:[0,10]',
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
      }, {
        id: 'list',
        type: 'table',
        thead: [
          __('Authetication'),
          __('Redirect URL after Authetication'),
          __('Limit Online Time after Authetication'),
        ],
        list: [
          [
            {
              id: 'oneKey_auth',
              form: 'authetication_form',
              text: __('One Key Authetication'),
              noForm: true,
            },
            {
              id: 'oneKey_redirect',
              styel: {
                marginLeft: 800,
              },
              form: 'authetication_form',
              type: 'text',
              /*appendRender: () => {
                return (
                  <Button
                    type="button"
                    text={__('Advance')}
                    style={{ marginLeft: 100 }}
                    key="advanceConfigration"
                    icon="plus"
                  />
                );
              },*/
            },
            {
              id: 'oneKey_allowTime',
              form: 'authetication_form',
              type: 'text',
              help: __('minutes(0 means no limitation)'),
            },
          ],
          [
            {
              id: 'accessUser_auth',
              form: 'authetication_form',
              text: __('Access User Authetication'),
              noForm: true,
            },
            {
              id: 'accessUser_redirect',
              form: 'authetication_form',
              type: 'text',
              /*appendRender: () => {
                return (
                  <Button
                    type="button"
                    text={__('Advance')}
                    style={{ marginLeft: 100 }}
                    key="advanceConfigration"
                    icon="plus"
                  />
                );
              },*/
            },
            {
              id: 'accessUser_allowTime',
              form: 'authetication_form',
              type: 'text',
              help: __('minutes(0 means no limitation)'),
            },
          ],
          [
            {
              id: 'SNS_auth',
              form: 'authetication_form',
              text: __('SNS Authetication'),
              noForm: true,
            },
            {
              id: 'SNS_redirect',
              form: 'authetication_form',
              type: 'text',
              /*appendRender: () => {
                return (
                  <Button
                    type="button"
                    text={__('Advance')}
                    style={{ marginLeft: 100 }}
                    key="advanceConfigration"
                    icon="plus"
                  />
                );
              },*/
            },
            {
              id: 'SNS_allowTime',
              form: 'authetication_form',
              type: 'text',
              help: __('minutes(0 means no limitation)'),
            },
          ],
          [
            {
              id: 'wechat_auth',
              form: 'authetication_form',
              text: __('Wechat Authetication'),
              noForm: true,
            },
            {
              id: 'wechat_redirect',
              form: 'authetication_form',
              type: 'text',
              /*appendRender: () => {
                return (
                  <Button
                    type="button"
                    text={__('Advance')}
                    style={{ marginLeft: 100 }}
                    key="advanceConfigration"
                    icon="plus"
                  />
                );*/
              // },
            },
            {
              id: 'wechat_allowTime',
              form: 'authetication_form',
              type: 'text',
              help: __('minutes(0 means no limitation)'),
            },
          ],
          [
            {
              id: 'facebook_auth',
              form: 'authetication_form',
              text: __('Facebook Authetication'),
              noForm: true,
            },
            {
              id: 'facebook_redirect',
              form: 'authetication_form',
              type: 'text',
              /*appendRender: () => {
                return (
                  <Button
                    type="button"
                    text={__('Advance')}
                    style={{ marginLeft: 100 }}
                    key="advanceConfigration"
                    icon="plus"
                  />
                );
              },*/
            },
            {
              id: 'facebook_allowTime',
              form: 'authetication_form',
              type: 'text',
              help: __('minutes(0 means no limitation)'),
            },
          ],
        ],
      },
    ]);
    return (
      <AppScreen
        {...this.props}
        className="port-base"
        settingsFormOptions={settingsOptions}
        onBeforeSync={this.onBeforeSync}
        hasSettingsSaveButton
        noTitle
      />
      // /*<Modal
      //   id="AppScreenListModal"
      //   isShow={this.state.customModal}
      //   title="Creat new AAA template"
      //   onClose={() => {
      //     this.setState({
      //       customModal: false,
      //     });
      //   }}
      //   size="lg"
      //   customBackdrop
      //   noFooter
      // >
      // </Modal>*/
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
