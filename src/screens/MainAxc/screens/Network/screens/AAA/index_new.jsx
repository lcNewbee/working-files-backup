import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { Icon, FormContainer, SaveButton, FormGroup } from 'shared/components';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import validator from 'shared/validator';

import {
  getPortList, getWebTemplate, getAllGroupSSID, getApMac,
} from './getServerData';
import {
  $$radiusAuthServer, $$radiusAccServer, $$radiusAdvancedSetting, radiusDefaultData,
  $$potalServerFormOptions, potalServerDefaultSettingData,
  $$potalRuleFormOptions, potalRuleDefaultSettingData,
  $$portalTemplateFormOptions, portalTemplateDefaultSettingData,
} from './config';

const $$defaultNoneItem = fromJS({
  value: '',
  label: __('None'),
});

const RADIUS_AUTH_SERVER_KEY = 'authServer';
const RADIUS_ACC_SERVER_KEY = 'accServer';
const RADIUS_ADVANCE_SETTING_KEY = 'radiusAdvanceSetting';
const PORTAL_SERVER_KEY = 'portalServer';
const PORTAL_RULE_KEY = 'portalRule';
const PORTAL_LOCAL_RULE_KEY = 'portalLocalRule';

const DEFAULT_STR = _('ALL');

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
    label: `${__('Remote')}`,
  },
];
const serverType = [
  {
    value: 'local',
    label: `${__('Local')}`,
  },
  {
    value: 'remote',
    label: `${__('Remote')}`,
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
    defaultValue: 'radius-scheme',
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
    defaultValue: 'ssid',
    noTable: true,
    noForm: true,
  },
  {
    id: 'portal_server_port',
    text: __('Portal Rule Port'),
    noForm: true,
    render: (val, $$data) => $$data.getIn(['portalRule', 'interface_bind']) || __('None'),
  },
  {
    id: 'portal_server_ssid',
    text: __('Portal SSID '),
    noForm: true,
    render: (val, $$data) => $$data.getIn(['portalTemplate', 'ssid']) ||  __('None'),
  },
  {
    id: 'portal_server_mac',
    text: __('Portal Access Point MAC Address'),
    noForm: true,
    render: (val, $$data) => $$data.getIn(['portalTemplate', 'mac']) ||  __('None'),
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
      return $$curItem ? $$curItem.get('label') : DEFAULT_STR;
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
  updateCurEditListItem: PropTypes.func,
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
      'toggleBox',
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
      [RADIUS_ACC_SERVER_KEY]: true,
      [PORTAL_SERVER_KEY]: true,
      [PORTAL_RULE_KEY]: true,
      [PORTAL_LOCAL_RULE_KEY]: true,
    };
  }

  componentWillMount() {
    this.onFetchData();
  }
  componentWillUpdate(nextProps, nextState) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curList = $$myScreenStore.getIn(['data', 'list']);
    const $$nextList = nextProps.store.getIn([myScreenId, 'data', 'list']);
    const curActionType = $$myScreenStore.getIn(['actionQuery', 'action']);
    const nextActionType = nextProps.store.getIn([myScreenId, 'actionQuery', 'action']);

    if (nextState.portOptions.size > 0) {
      if (this.state.portOptions !== nextState.portOptions) {
        this.initFormOptions(nextProps, nextState);
      } else if ($$curList !== $$nextList || curActionType !== nextActionType) {
        this.updateFormOptions(nextProps, nextState);
      }
    }
  }
  onSave() {
    this.props.validateAll()
      .then(
        ($$msg) => {
          if ($$msg.isEmpty()) {
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
    ]).then(
      (values) => {
        const portOptions = fromJS(values[0].options);
        let ssidOptions = fromJS(values[1].options);
        let apsMacOptions = fromJS(values[2].options);
        const webTemplateOptions = fromJS(values[3].options);

        ssidOptions = ssidOptions.unshift($$defaultNoneItem);
        apsMacOptions = apsMacOptions.unshift($$defaultNoneItem);

        this.setState({
          portOptions,
          ssidOptions,
          apsMacOptions,
          webTemplateOptions,
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
    const curListItemName = $$myScreenStore.getIn(['curListItem', 'domain_name']);
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

    this.$$potalRuleFormOptions = $$potalRuleFormOptions.map(
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
      this.$$baseFormOptions = $$baseFormOptions.map(
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

    this.listOptions = listOptions.map(
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
    this.$$potalRuleFormOptions = $$potalRuleFormOptions.map(
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
    this.$$portalTemplateFormOptions = $$portalTemplateFormOptions.map(
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

  toggleBox(moduleName) {

    // this.setState({
    //   [moduleName]: !this.state[moduleName],
    // });
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
            onClick={() => this.toggleBox(RADIUS_AUTH_SERVER_KEY)}
          >
            {/* <Icon
              name={this.state[RADIUS_AUTH_SERVER_KEY] ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
            /> */}
            {__('Remote Radius Authentication Server')}
          </h3>
        </div>
        {
          this.state[RADIUS_AUTH_SERVER_KEY] ? (
            <div className="o-box__cell">
              <FormContainer
                id={RADIUS_AUTH_SERVER_KEY}
                className="o-form--compassed"
                options={$$radiusAuthServer}
                data={$$curData.get('radius')}
                onChangeData={(data) => {
                  this.props.updateCurEditListItem({
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
            onClick={() => this.toggleBox(RADIUS_ACC_SERVER_KEY)}
          >
            {/* <Icon
              name={this.state[RADIUS_ACC_SERVER_KEY] ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
              onClick={() => this.toggleBox(RADIUS_ACC_SERVER_KEY)}
            />*/}
            {__('Remote Radius Accounting Server')}
          </h3>
        </div>
        {
          this.state[RADIUS_ACC_SERVER_KEY] ? (
            <div className="o-box__cell">
              <FormContainer
                id={RADIUS_ACC_SERVER_KEY}
                options={$$radiusAccServer}
                className="o-form--compassed"
                data={$$curData.get('radius')}
                onChangeData={(data) => {
                  this.props.updateCurEditListItem({
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
            onClick={() => this.toggleBox(RADIUS_ADVANCE_SETTING_KEY)}
          >
            {/* <Icon
              name={this.state[RADIUS_ADVANCE_SETTING_KEY] ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
              onClick={() => this.toggleBox(RADIUS_ADVANCE_SETTING_KEY)}
            />*/}
            {__('Remote Radius Server Advanced Settings')}
          </h3>
        </div>
        {
          this.state[RADIUS_ADVANCE_SETTING_KEY] ? (
            <div className="o-box__cell">
              <FormContainer
                id={RADIUS_ADVANCE_SETTING_KEY}
                options={$$radiusAdvancedSetting}
                className="o-form--compassed"
                data={$$curData.get('radius')}
                onChangeData={(data) => {
                  this.props.updateCurEditListItem({
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
            onClick={() => this.toggleBox(PORTAL_SERVER_KEY)}
          >
            {/* <Icon
              name={this.state[PORTAL_SERVER_KEY] ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
              onClick={() => this.toggleBox(PORTAL_SERVER_KEY)}
            />*/}
            {__('Remote Portal Server')}
          </h3>
        </div>
        {
          this.state[PORTAL_SERVER_KEY] ? (
            <div className="o-box__cell">
              <FormContainer
                id={PORTAL_SERVER_KEY}
                className="o-form--compassed"
                options={$$potalServerFormOptions}
                data={$$curData.get('portalServer')}
                onChangeData={(data) => {
                  this.props.updateCurEditListItem({
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
            onClick={() => this.toggleBox(PORTAL_RULE_KEY)}
          >
            {/* <Icon
              name={this.state[PORTAL_RULE_KEY] ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
              onClick={() => this.toggleBox(PORTAL_RULE_KEY)}
            />*/}
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
                  this.props.updateCurEditListItem({
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
            onClick={() => this.toggleBox(PORTAL_LOCAL_RULE_KEY)}
          >
            {/* <Icon
              name={this.state[PORTAL_LOCAL_RULE_KEY] ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
              onClick={() => this.toggleBox(PORTAL_LOCAL_RULE_KEY)}
            />*/}
            {__('Local Portal Rule')}
          </h3>
        </div>
        {
          this.state[PORTAL_LOCAL_RULE_KEY] ? (
            <div className="o-box__cell row">
              {
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
                      this.props.updateCurEditListItem({
                        portal_rule_type: data.value,
                      });
                    }}
                  />
                ) : null
              }

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
                      this.props.updateCurEditListItem({
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
                      this.props.updateCurEditListItem({
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

    if (actionType !== 'add' && actionType !== 'edit') {
      return null;
    }

    // if (actionType === 'edit') {
    //   $$myBaseFormOptions = $$myBaseFormOptions.map(
    //     ($$item) => {
    //       let $$ret = $$item;
    //       if ($$item.get('notEditable')) {
    //         $$ret = $$ret.set('readOnly', true);
    //       }

    //       return $$ret;
    //     },
    //   );
    // }

    return (
      <div className="o-box row">
        <div className="o-box__cell">
          <FormContainer
            id="polifBase"
            className="o-form"
            options={this.$$baseFormOptions}
            initOption={{
              defaultEditData: $$defaultData.toJS(),
            }}
            data={$$curData}
            onChangeData={(data) => {
              this.props.updateCurEditListItem(data);
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
            onClick={this.onSave}
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
          defaultEditData: $$defaultData.toJS(),
        }}
        deleteable={
          ($$item, index) => (index !== 0)
        }
        selectable={
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
