import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { FormContainer, SaveButton, FormGroup, FormInput } from 'shared/components';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import validator from 'shared/validator';

import {
  getPortList, getInterfacesList, getWebTemplate, getAllGroupSSID, getApMac,
} from './getServerData';

import {
  $$radiusAuthServer, $$radiusAccServer, $$radiusAdvancedSetting, radiusDefaultData,
  $$potalServerFormOptions, potalServerDefaultSettingData,
  $$potalRuleFormOptions, potalRuleDefaultSettingData,
  $$portalTemplateFormOptions, portalTemplateDefaultSettingData,
} from './config';

const RADIUS_AUTH_SERVER_KEY = 'authServer';
const RADIUS_ACC_SERVER_KEY = 'accServer';
const RADIUS_ADVANCE_SETTING_KEY = 'radiusAdvanceSetting';
const PORTAL_SERVER_KEY = 'portalServer';
const PORTAL_RULE_KEY = 'portalRule';
const PORTAL_LOCAL_RULE_KEY = 'portalLocalRule';

function isAccSameWithAuth($$listItem) {
  return $$listItem.getIn(['radius', 'authpri_ipaddr']) === $$listItem.getIn(['radius', 'acctpri_ipaddr']) ||
    $$listItem.getIn(['radius', 'authpri_key']) === $$listItem.getIn(['radius', 'acctpri_key']);
}

function getAcctPort($$listItem) {
  const authPort = $$listItem.getIn(['radius', 'authpri_port']);
  let ret = $$listItem.getIn(['radius', 'acctpri_port']);

  if (!ret) {
    ret = parseInt(authPort, 10) + 1;
  }

  if (ret > 65535) {
    ret = '1813';
  }

  return `${ret}`;
}

const accessTypeSeletOptions = [
  {
    value: 'portal',
    label: __('Portal'),
  },
  {
    value: '8021x-access',
    label: __('802.1x'),
    disabled: true,
  },
  // {
  //   value: 'lan-access',
  //   label: __('LAN'),
  //   disabled: true,
  // }, {
  //   value: 'ppp-access',
  //   label: __('PPP'),
  //   disabled: true,
  // }, {
  //   value: 'mac-access',
  //   label: __('MAC'),
  //   disabled: true,
  // },
];

const authTypeSeletOptions = [
  {
    value: 'local',
    label: `${__('Local')}`,
  },
  {
    value: 'radius-scheme',
    label: `${__('External')}`,
  },
];
const serverType = [
  {
    value: 'local',
    label: `${__('Local')}`,
  },
  {
    value: 'remote',
    label: `${__('External')}`,
  },
];

// 大于2.5版本
if (window.guiConfig.versionCode >= 20500) {
  // 开启 802.1x
  accessTypeSeletOptions[1].disabled = false;
}

const listOptions = fromJS([
  {
    id: 'name',
    text: __('Name'),
    defaultValue: '',
    notEditable: true,
    formProps: {
      type: 'text',
      required: true,
      maxLength: '31',
      validator: validator({
        rules: 'utf8Len:[1,31]',
      }),
    },
  },
  {
    id: 'auth_accesstype',
    text: __('Authentication Type'),
    defaultValue: 'portal',
    options: accessTypeSeletOptions,
    formProps: {
      label: __('Authentication Type'),
      required: true,
      type: 'switch',
      placeholder: __('Please Select ') + __('Rules Group'),
      onChange(newData) {
        const ret = newData;

        if (newData.value === '8021x-access') {
          ret.mergeData = {
            radius_server_type: 'remote',
          };
        }

        return ret;
      },
    },
  },
  {
    id: 'radius_server_type',
    text: __('Radius Server'),
    options: serverType,
    defaultValue: 'local',
    render: (val, $$data) => {
      const curName = val;

      return `${__(curName)} (${$$data.getIn(['radius', 'nasip'])})`;
    },
    formProps: {
      label: __('Radius Server Type'),
      required: true,
      type: 'switch',
      disabled($$data) {
        return $$data.get('auth_accesstype') === '8021x-access';
      },
      onChange: (data) => {
        const value = data.value;
        const newData = data;

        if (value === 'remote') {
          newData.mergeData = {
            portal_rule_type: 'port',
          };
        }

        return newData;
      },
    },
  },
  {
    id: 'portal_server_type',
    text: __('Portal Server'),
    defaultValue: 'local',
    options: serverType,
    render: (val, $$data) => {
      const curName = $$data.getIn(['portalServer', 'portal_template']);

      if ($$data.get('auth_accesstype') !== 'portal') {
        return '-';
      }

      return `${__(curName)} (${$$data.getIn(['portalServer', 'server_ipaddr'])})`;
    },
    formProps: {
      label: __('Portal Server Type'),
      required: true,
      type: 'switch',
      visible: $$data => $$data.get('auth_accesstype') === 'portal',
      onChange: (data) => {
        const value = data.value;
        const newData = data;

        if (value === 'local') {
          newData.mergeData = {
            auth_schemetype: 'local',
          };
        } else {
          newData.mergeData = {
            auth_schemetype: 'radius-scheme',
          };
        }

        return newData;
      },
    },
  },
  {
    id: 'auth_schemetype',
    text: __('Type'),
    defaultValue: 'local',
    options: authTypeSeletOptions,
    noTable: true,
    noForm: true,
    formProps: {
      label: __('Type'),
      required: true,
      type: 'switch',
      placeholder: __('Please Select ') + __('Rules Group'),
    },
  },
  {
    id: 'portal_rule_type',
    defaultValue: 'port',
    noTable: true,
    noForm: true,
  },
  {
    id: 'portal_server_port',
    text: __('Portal Rule Port'),
    noForm: true,
    render: (val, $$data) => {
      let ret = $$data.getIn(['portalRule', 'interface_bind']);

      if ($$data.get('auth_accesstype') !== 'portal') {
        return '-';
      }

      if (!ret || ret === 'lo') {
        ret = __('Limitless');
      }
      return ret;
    },
  },
  {
    id: 'portal_server_ssid',
    text: __('Portal SSID '),
    noForm: true,
    render: (val, $$data) => {
      if ($$data.get('auth_accesstype') !== 'portal') {
        return '-';
      }
      return $$data.getIn(['portalTemplate', 'ssid']) || __('-');
    },
  },
  {
    id: 'portal_server_mac',
    text: __('Portal Access Point MAC Address'),
    noForm: true,
    render: (val, $$data) => {
      if ($$data.get('auth_accesstype') !== 'portal') {
        return '-';
      }

      return $$data.getIn(['portalTemplate', 'apmac']) || __('-');
    },
  },
  {
    id: 'portal_server_web',
    valuePath: ['portalTemplate', 'web'],
    text: __('Portal WEB Template'),
    options: fromJS([]),
    noForm: true,
    render: (val, $$data, $$option) => {
      const $$curOptions = $$option.get('options');
      const $$curItem = $$curOptions.find($$item => $$item.get('value') === val);

      if ($$data.get('auth_accesstype') !== 'portal') {
        return '-';
      }

      return $$curItem ? $$curItem.get('label') : '-';
    },
  },
]);

const $$baseFormOptions = utils.immutableUtils.getFormOptions(listOptions);
const $$defaultData = fromJS(immutableUtils.getDefaultData(listOptions))
  .mergeDeep({
    radius: radiusDefaultData,
    portalServer: potalServerDefaultSettingData,
    portalRule: potalRuleDefaultSettingData,
    portalTemplate: portalTemplateDefaultSettingData,
  });

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  updateCurListItem: PropTypes.func,
  reportValidError: PropTypes.func,
  validateAll: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'renderCustomModal',
      'renderRemoteRadiusServer',
      'renderRemotePortalServer',
      'renderLocalPortalRule',
      'initFormOptions',
      'onSave',
      'onFetchData',
    ]);

    this.state = {
      radiusOptions: fromJS([]),
      portOptions: fromJS([]),
      ssidOptions: fromJS([]),
      apsMacOptions: fromJS([]),
      webTemplateOptions: fromJS([]),
      [RADIUS_AUTH_SERVER_KEY]: true,
      [RADIUS_ADVANCE_SETTING_KEY]: true,
      [RADIUS_ACC_SERVER_KEY]: false,
      [PORTAL_SERVER_KEY]: true,
      [PORTAL_RULE_KEY]: true,
      [PORTAL_LOCAL_RULE_KEY]: true,
    };
    this.listOptions = listOptions;
    this.$$baseFormOptions = $$baseFormOptions;
    this.$$radiusAuthServer = $$radiusAuthServer;
    this.$$radiusAccServer = $$radiusAccServer;
    this.$$radiusAdvancedSetting = $$radiusAdvancedSetting;

    this.$$potalServerFormOptions = $$potalServerFormOptions;
    this.$$potalRuleFormOptions = $$potalRuleFormOptions;
    this.$$portalTemplateFormOptions = $$portalTemplateFormOptions;
  }

  componentWillMount() {
    this.onFetchData();
  }
  componentWillReceiveProps(nextProps) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const curActionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    const nextActionType = nextProps.store.getIn([myScreenId, 'actionQuery', 'action']);
    const $$nextListItem = nextProps.store.getIn([myScreenId, 'curListItem']);

    if (curActionType !== nextActionType && nextActionType) {
      if ($$nextListItem && isAccSameWithAuth($$nextListItem)) {
        this.setState({
          [RADIUS_ACC_SERVER_KEY]: false,
        });
      } else {
        this.setState({
          [RADIUS_ACC_SERVER_KEY]: true,
        });
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curList = $$myScreenStore.getIn(['data', 'list']);
    const $$nextList = nextProps.store.getIn([myScreenId, 'data', 'list']);
    const curActionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    const nextActionType = nextProps.store.getIn([myScreenId, 'actionQuery', 'action']);
    const curListItemName = $$myScreenStore.getIn(['curListItem', 'name']);
    const nextListItemName = nextProps.store.getIn([myScreenId, 'curListItem', 'name']);

    if (nextState.portOptions.size > 0) {
      if (this.state.portOptions !== nextState.portOptions) {
        this.initFormOptions(nextProps, nextState);
      } else if ($$curList !== $$nextList || curActionType !== nextActionType ||
          curListItemName !== nextListItemName) {
        this.updateFormOptions(nextProps, nextState);
      }
    }
  }
  onSave($$curData) {
    this.props.validateAll()
      .then(
        ($$msg) => {
          if ($$msg.isEmpty()) {
            // 远程 Radius 计费服务器关闭时则设置值与认证服务器一样
            if (!this.state[RADIUS_ACC_SERVER_KEY] && $$curData.get('radius_server_type') === 'remote') {
              this.props.updateCurListItem({
                radius: {
                  acctpri_ipaddr: $$curData.getIn(['radius', 'authpri_ipaddr']),
                  acctpri_port: getAcctPort($$curData),
                  acctpri_key: $$curData.getIn(['radius', 'authpri_key']),
                },
              });
            }
            this.props.onListAction();
          }
        },
      );
  }
  onFetchData() {
    Promise.all([
      getPortList(),
      getAllGroupSSID(),
      getApMac(),
      getWebTemplate(),
      getInterfacesList(),
    ]).then(
      (values) => {
        const portOptions = fromJS(values[0].options);
        const ssidOptions = fromJS(values[1].options);
        const apsMacOptions = fromJS(values[2].options);
        const webTemplateOptions = fromJS(values[3].options);
        const interfacesIpList = fromJS(values[4].options);
        this.setState({
          portOptions,
          ssidOptions,
          apsMacOptions,
          webTemplateOptions,
          interfacesIpList,
        });
      },
    );
  }
  updateFormOptions(props, state) {
    const { store } = props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const actionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    const $$curList = $$myScreenStore.getIn(['data', 'list']);
    const curListItemName = $$myScreenStore.getIn(['curListItem', 'name']);
    const $$myPortOptions = state.portOptions
      .filterNot(($$item) => {
        const curPort = $$item.get('value');
        const curPortIndex = $$curList.findIndex(
          $$listItem => $$listItem.getIn(['portalRule', 'interface_bind']) === curPort,
        );
        let ret = curPortIndex !== -1;

        if (actionType === 'edit' && $$myScreenStore.getIn(['curListItem', 'domain_name']) === $$curList.getIn([curPortIndex, 'domain_name'])) {
          ret = false;
        }

        return ret;
      });

    this.$$potalRuleFormOptions = this.$$potalRuleFormOptions.map(
      ($$item) => {
        const curId = $$item.get('id');
        let $$ret = $$item;

        switch (curId) {
          case 'interface_bind':
            $$ret = $$ret.set('options', $$myPortOptions);
            break;

          default:
        }

        return $$ret;
      },
    );

    //
    if (actionType === 'edit') {
      this.$$baseFormOptions = this.$$baseFormOptions.map(
        ($$item) => {
          const curId = $$item.get('id');
          const localReadOnlyIds = 'radius_server_type,portal_server_type,auth_accesstype,';
          let $$ret = $$item;

          if ($$item.get('notEditable')) {
            $$ret = $$ret.set('readOnly', true);
          }
          if (curListItemName === 'local') {
            if (localReadOnlyIds.indexOf(`${curId},`) !== -1) {
              $$ret = $$ret.set('readOnly', true);
            }
          } else if (localReadOnlyIds.indexOf(`${curId},`) !== -1) {
            $$ret = $$ret.set('readOnly', false);
          }

          return $$ret;
        },
      );
    } else if (actionType === 'add') {
      this.$$baseFormOptions = $$baseFormOptions;
    }
  }
  initFormOptions(nextProps, nextState) {
    const { store } = nextProps;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const actionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    const $$curList = $$myScreenStore.getIn(['data', 'list']);
    const $$myPortOptions = nextState.portOptions
      .filterNot(($$item) => {
        const curPort = $$item.get('value');
        const curPortIndex = $$curList.findIndex(
          $$listItem => $$listItem.getIn(['portalRule', 'interface_bind']) === curPort,
        );
        let ret = curPortIndex !== -1;

        if (actionType === 'edit' && $$myScreenStore.getIn(['curListItem', 'domain_name']) === $$curList.getIn([curPortIndex, 'domain_name'])) {
          ret = false;
        }

        return ret;
      });

    this.listOptions = this.listOptions.map(
      ($$item) => {
        let $$ret = $$item;

        if ($$ret.get('id') === 'radius_template') {
          $$ret = $$ret.set('options', nextState.radiusOptions);
        } else if ($$ret.get('id') === 'portal_server_web') {
          $$ret = $$ret.set('options', nextState.webTemplateOptions);
        }
        return $$ret;
      },
    );
    this.$$potalRuleFormOptions = this.$$potalRuleFormOptions.map(
      ($$item) => {
        const curId = $$item.get('id');
        let $$ret = $$item;

        switch (curId) {
          case 'interface_bind':
            $$ret = $$ret.set('options', $$myPortOptions);
            break;

          default:
        }

        return $$ret;
      },
    );
    this.$$potalServerFormOptions = this.$$potalServerFormOptions
      .setIn([1, 1, 'options'], nextState.interfacesIpList);
    // .map(
    //   ($$item) => {
    //     const curId = $$item.get('id');
    //     let $$ret = $$item;


    //     switch (curId) {
    //       case 'ac_ip':
    //         $$ret = $$ret.set('options', nextState.interfacesIpList);
    //         break;

    //       default:
    //     }
    //     return $$ret;
    //   },
    // );
    this.$$portalTemplateFormOptions = this.$$portalTemplateFormOptions.map(
      ($$item) => {
        const curId = $$item.get('id');
        let $$ret = $$item;


        switch (curId) {
          case 'ssid':
            $$ret = $$ret.set('options', nextState.ssidOptions);
            break;

          case 'apmac':
            $$ret = $$ret.set('options', nextState.apsMacOptions);
            break;

          case 'web':
            $$ret = $$ret.set('options', nextState.webTemplateOptions);
            break;

          default:
        }

        return $$ret;
      },
    );
  }

  renderRemoteRadiusServer($$curData) {
    const { app } = this.props;

    if ($$curData.get('radius_server_type') !== 'remote') {
      return null;
    }
    return (
      <div>
        <div className="o-box__cell">
          <h3
            style={{ cursor: 'pointer' }}
          >
            {__('External Radius Authentication Server')}
          </h3>
        </div>
        {
          this.state[RADIUS_AUTH_SERVER_KEY] ? (
            <div className="o-box__cell">
              <FormContainer
                id={RADIUS_AUTH_SERVER_KEY}
                className="o-form--compassed"
                options={this.$$radiusAuthServer}
                data={$$curData.get('radius')}
                onChangeData={(data) => {
                  this.props.updateCurListItem({
                    radius: data,
                  });
                }}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
              />
            </div>
          ) : null
        }

        <div className="o-box__cell">
          <h3
            style={{ cursor: 'pointer' }}
          >
            {__('External Radius Accounting Server')}
            <FormInput
              type="checkbox"
              value="1"
              style={{
                float: 'right',
                marginTop: '2px',
              }}
              checked={this.state[RADIUS_ACC_SERVER_KEY]}
              onChange={(data) => {
                this.setState({
                  [RADIUS_ACC_SERVER_KEY]: data.value === '1',
                });
              }}
            />
          </h3>
        </div>
        {
          this.state[RADIUS_ACC_SERVER_KEY] ? (
            <div className="o-box__cell">
              <FormContainer
                id={RADIUS_ACC_SERVER_KEY}
                options={this.$$radiusAccServer}
                className="o-form--compassed"
                data={$$curData.get('radius')}
                onChangeData={(data) => {
                  this.props.updateCurListItem({
                    radius: data,
                  });
                }}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
              />
            </div>
          ) : null
        }
        <div className="o-box__cell">
          <h3
            style={{ cursor: 'pointer' }}
          >
            {__('External Radius Server Advanced Settings')}
          </h3>
        </div>
        {
          this.state[RADIUS_ADVANCE_SETTING_KEY] ? (
            <div className="o-box__cell">
              <FormContainer
                id={RADIUS_ADVANCE_SETTING_KEY}
                options={this.$$radiusAdvancedSetting}
                className="o-form--compassed"
                data={$$curData.get('radius')}
                onChangeData={(data) => {
                  this.props.updateCurListItem({
                    radius: data,
                  });
                }}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
              />
            </div>
          ) : null
        }
      </div>
    );
  }
  renderRemotePortalServer($$curData) {
    const { app } = this.props;

    if ($$curData.get('auth_accesstype') === '8021x-access' || $$curData.get('portal_server_type') !== 'remote') {
      return null;
    }

    return (
      <div>
        <div className="o-box__cell">
          <h3
            style={{ cursor: 'pointer' }}
          >
            {__('External Portal Server')}
          </h3>
        </div>
        {
          this.state[PORTAL_SERVER_KEY] ? (
            <div className="o-box__cell">
              <FormContainer
                id={PORTAL_SERVER_KEY}
                className="o-form--compassed"
                options={this.$$potalServerFormOptions}
                data={$$curData.get('portalServer')}
                onChangeData={(data) => {
                  this.props.updateCurListItem({
                    portalServer: data,
                  });
                }}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
                isSaving={app.get('saving')}
              />
            </div>
          ) : null
        }
        <div className="o-box__cell">
          <h3
            style={{ cursor: 'pointer' }}
          >
            {__('Portal Rules')}
          </h3>
        </div>
        {
          this.state[PORTAL_RULE_KEY] ? (
            <div className="o-box__cell">
              <FormContainer
                id={PORTAL_RULE_KEY}
                options={this.$$potalRuleFormOptions}
                data={$$curData.get('portalRule')}
                onChangeData={(data) => {
                  this.props.updateCurListItem({
                    portalRule: data,
                  });
                }}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
              />
            </div>
          ) : null
        }
      </div>
    );
  }
  renderLocalPortalRule($$curData) {
    const { app } = this.props;
    const $$localPortFormOptions = this.$$potalRuleFormOptions;
    const portalRuleType = $$curData.get('portal_rule_type');

    if ($$curData.get('auth_accesstype') === '8021x-access' || $$curData.get('portal_server_type') !== 'local') {
      return null;
    }

    return (
      <div>
        <div className="o-box__cell">
          <h3
            style={{ cursor: 'pointer' }}
          >
            {__('Local Portal Rule')}
          </h3>
        </div>
        {
          this.state[PORTAL_LOCAL_RULE_KEY] ? (
            <div className="o-box__cell row">
              {/* {
                $$curData.get('radius_server_type') === 'local' ? (
                  <FormGroup
                    style={{
                      padding: '0 .75rem',
                    }}
                    type="switch"
                    readOnly={$$curData.get('name') === 'local'}
                    value={portalRuleType}
                    label={__('Rule Type')}
                    options={[
                      {
                        value: 'ssid',
                        label: __('SSID'),
                      },
                      {
                        value: 'port',
                        label: __('Port'),
                      },
                    ]}
                    onChange={(data) => {
                      this.props.updateCurListItem({
                        portal_rule_type: data.value,
                      });
                    }}
                  />
                ) : null
              } */}

              {
                portalRuleType === 'port' ? (
                  <FormContainer
                    id="portalLocalPortSetting"
                    style={{
                      padding: '0 5px',
                    }}
                    options={$$localPortFormOptions}
                    data={$$curData.get('portalRule')}
                    onChangeData={(data) => {
                      this.props.updateCurListItem({
                        portalRule: data,
                      });
                    }}
                    onSave={() => this.onSave('portalServerSetting')}
                    invalidMsg={app.get('invalid')}
                    validateAt={app.get('validateAt')}
                    onValidError={this.props.reportValidError}
                    isSaving={app.get('saving')}
                  />
                ) : (
                  <FormContainer
                    id="portalLocalTemplateSetting"
                    options={this.$$portalTemplateFormOptions}
                    data={$$curData.get('portalTemplate')}
                    onChangeData={(data) => {
                      this.props.updateCurListItem({
                        portalTemplate: data,
                      });
                    }}
                    style={{
                      padding: '0 5px',
                    }}
                    onSave={() => this.onSave('portalServerSetting')}
                    invalidMsg={app.get('invalid')}
                    validateAt={app.get('validateAt')}
                    onValidError={this.props.reportValidError}
                    isSaving={app.get('saving')}
                  />
                )
              }
            </div>
          ) : null
        }
      </div>
    );
  }
  renderCustomModal() {
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curData = $$myScreenStore.get('curListItem');
    const actionType = $$myScreenStore.getIn(['actionQuery', 'action']);

    if ($$curData && actionType !== 'add' && actionType !== 'edit') {
      return null;
    }

    return (
      <div className="o-box row">
        <div className="o-box__cell">
          <FormContainer
            id="polifBase"
            className="o-form"
            options={this.$$baseFormOptions}
            initOption={{
              defaultListItem: $$defaultData.toJS(),
            }}
            data={$$curData}
            onChangeData={(data) => {
              this.props.updateCurListItem(data);
            }}
            onSave={() => this.onSave('serverChoices')}
            invalidMsg={app.get('invalid')}
            validateAt={app.get('validateAt')}
            onValidError={this.props.reportValidError}
            isSaving={app.get('saving')}
          />
        </div>
        { this.renderRemoteRadiusServer($$curData) }
        { this.renderRemotePortalServer($$curData) }
        { this.renderLocalPortalRule($$curData) }

        <div className="o-box__cell">
          <SaveButton
            style={{
              marginLeft: '180px',
            }}
            loading={app.get('saving')}
            onClick={() => {
              this.onSave($$curData);
            }}
          />
        </div>

      </div>
    );
  }
  render() {
    return (
      <AppScreen
        {...this.props}
        listKey="name"
        modalChildren={this.renderCustomModal()}
        listOptions={this.listOptions}
        initOption={{
          defaultListItem: $$defaultData.toJS(),
        }}
        deleteable={
          ($$item, index) => (index !== 0)
        }
        selectable={
          ($$item, index) => (index !== 0)
        }
        editable={
          ($$item, index) => (index !== 0)
        }
        actionable
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
