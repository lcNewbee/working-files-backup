import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { FormContainer, Icon, Button } from 'shared/components';
import { radioBase, radioAdvance, radioQos, numberKeys } from 'shared/config/axcRadio';
import { apStatus } from 'shared/config/axcAp';
import validator from 'shared/validator';

// custom
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';

const EDIT_LIST_ACTION = 'editList';
const AP_MONITOR_ACTION = 'monitor';
const flowRateFilter = utils.filter('flowRate');

// const settingsFormOptions = radioBase
//   // 添加自动功率
//   .map(
//     ($$item) => {
//       const curId = $$item.get('id');

//       switch (curId) {
//         // 功率添加自动选项
//         case 'phymode':
//           return $$item.updateIn(
//             ['options'],
//             $$options => $$options.unshift(Map({
//               value: 'auto',
//               label: __('Automatic'),
//             })),
//           ).set('disabled', true);

//         // 功率添加自动选项
//         case 'txpower':
//           return $$item.updateIn(
//             ['options'],
//             $$options => $$options.unshift(Map({
//               value: 'auto',
//               label: __('Automatic'),
//             })),
//           ).set('disabled', true);

//         // 信道只支持自动
//         case 'channel':
//           return $$item.set(
//             'options',
//             fromJS([
//               {
//                 value: 0,
//                 label: __('Automatic'),
//               },
//             ]),
//           ).set('disabled', true);

//         // 5G优先,  11n优先
//         case 'first5g':
//         case 'switch11n':
//           return $$item.set(
//               'label',
//               $$item.get('text'),
//             ).delete('text');

//         default:
//       }

//       return $$item;
//     },
//   )
//   .rest()
//   .butLast()
//   .groupBy(
//     item => item.get('fieldset'),
//   )
//   .toList();

const apMonitorSettingsOptions = fromJS([
  // {
  //   id: 'enable',
  //   width: 60,
  //   form: 'modalmonitor',
  //   label: __('Enable'),
  //   type: 'checkbox',
  //   dataType: 'number',
  //   value: '1',
  // },
  // {
  //   id: 'apopermode',
  //   width: 120,
  //   form: 'modalmonitor',
  //   label: __('AP Work Mode'),
  //   options: [
  //     {
  //       value: 1,
  //       label: __('Normal'),
  //     }, {
  //       value: 2,
  //       label: __('Monitor'),
  //     },
  //   ],
  //   defaultValue: 1,
  //   type: 'switch',
  //   dataType: 'number',
  //   value: 1,
  // },
  {
    id: 'scantype',
    form: 'modalmonitor',
    label: __('Scan Type'),
    options: [
      {
        value: 2,
        label: __('Passive'),
      }, {
        value: 1,
        label: __('Initiative'),
      },
    ],
    type: 'switch',
    dataType: 'number',
    defaultValue: 1,
  },
  {
    id: 'scanSpectrum',
    label: __('Scanning Band'),
    type: 'checkboxs',
    form: 'modalmonitor',
    required: true,
    options: [{ label: '5G', value: '5' }, { label: '2.4G', value: '2' }],
    defaultValue: '2,5',
    value: '2,5',
    boxStyle: { marginRight: '20px' },
  },
  {
    id: 'cycles',
    label: __('Scan Cycles Times'),
    form: 'modalmonitor',
    min: 0,
    max: 255,
    type: 'number',
    help: '0~255',
    dataType: 'number',
    defaultValue: 1,
  },
  {
    id: 'rpttime',
    label: __('Channel Quality Report Cycle'),
    form: 'modalmonitor',
    type: 'number',
    min: 1,
    max: 65535,
    dataType: 'number',
    defaultValue: 30,
    required: true,
    help: __('Seconds'),
  },
  {
    id: 'enable2g4chl',
    form: 'modalmonitor',
    label: __('Auto Channel'),
    type: 'checkbox',
    linkId: 'enable5gchl',
    dataType: 'number',
    defaultValue: 0,
    value: 1,
  }, {
    id: 'enable2g4pwr',
    form: 'modalmonitor',
    label: __('Auto Power'),
    type: 'checkbox',
    linkId: 'enable5gpwr',
    dataType: 'number',
    defaultValue: 0,
    value: 1,
  },
  {
    id: 'maxtxpwr',
    form: 'modalmonitor',
    label: __('Max Power'),
    type: 'select',
    defaultValue: '100%',
    options: [
      {
        value: '3%',
        label: '3%',
      }, {
        value: '6%',
        label: '6%',
      }, {
        value: '12%',
        label: '12%',
      }, {
        value: '25%',
        label: '25%',
      }, {
        value: '50%',
        label: '50%',
      }, {
        value: '100%',
        label: '100%',
      },
    ],
    visible($$data) {
      return $$data.get('enable2g4pwr') === 1;
    },
  },
  // {
  //   id: 'adjafactor2g4',
  //   label: __('Neighbor Coefficient'),
  //   linkId: 'adjafactor5g',
  //   min: 1,
  //   max: 255,
  //   type: 'number',
  //   dataType: 'number',
  //   defaultValue: '1',
  // },
]);

function createSettingsFormOptions() {
  const settingsFormOptions = fromJS([
    {
      id: 'radioEnable_2g',
      form: 'modalsetting',
      fieldset: 'radiosettingof2g',
      legend: __('2.4G Settings'),
      label: __('Radio'),
      type: 'checkbox',
      defaultValue: '1',
    },
    {
      id: 'radioPower_2g',
      fieldset: 'radiosettingof2g',
      form: 'modalsetting',
      label: __('Tx Power'),
      type: 'select',
      options: [
        {
          value: '3%',
          label: '3%',
        }, {
          value: '6%',
          label: '6%',
        }, {
          value: '12%',
          label: '12%',
        }, {
          value: '25%',
          label: '25%',
        }, {
          value: '50%',
          label: '50%',
        }, {
          value: '100%',
          label: '100%',
        },
      ],
    },
    {
      id: 'ssid_2g',
      label: __('SSID'),
      form: 'modalsetting',
      fieldset: 'radiosettingof2g',
      type: 'checkboxs',
      defaultValue: '',
      required: true,
      options: this.state.ssidOptions,
    },
    {
      id: 'radioEnable_5g',
      form: 'modalsetting',
      fieldset: 'radiosettingof5g',
      legend: __('5G Settings'),
      label: __('Radio'),
      type: 'checkbox',
      defaultValue: '1',
    },
    {
      id: 'radioPower_5g',
      form: 'modalsetting',
      fieldset: 'radiosettingof5g',
      label: __('Tx Power'),
      type: 'select',
      options: [
        {
          value: '3%',
          label: '3%',
        }, {
          value: '6%',
          label: '6%',
        }, {
          value: '12%',
          label: '12%',
        }, {
          value: '25%',
          label: '25%',
        }, {
          value: '50%',
          label: '50%',
        }, {
          value: '100%',
          label: '100%',
        },
      ],
    },
    {
      id: 'ssid_5g',
      form: 'modalsetting',
      fieldset: 'radiosettingof5g',
      label: __('SSID'),
      type: 'checkboxs',
      required: true,
      options: this.state.ssidOptions,
    },
  ]);
  return settingsFormOptions;
}

// 处理大于 2.5的版本
// if (window.guiConfig.versionCode >= 20500) {
//   $$radioAdvanceFormOptions = $$radioAdvanceFormOptions.concat(radioQos);
// }
const listOptions = fromJS([
  {
    id: 'devicename',
    width: 160,
    text: __('Name'),
    maxLength: '31',
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  },
  {
    id: 'ip',
    width: 140,
    text: __('IP Address'),
  },
  {
    id: 'mac',
    width: 140,
    text: __('MAC Address'),
  },
  {
    id: 'model',
    width: 100,
    text: __('AP Model'),
  },
  {
    id: 'softversion',
    width: 120,
    text: __('Firmware Version'),
  },
  {
    id: 'connectedNumbers',
    width: 80,
    text: __('Clients'),
  },
  {
    id: 'bandwidth',
    width: 160,
    text: __('Data'),
    render(val, item) {
      const upRate = flowRateFilter.transform(item.get('upstream'));
      const downRate = flowRateFilter.transform(item.get('downstream'));

      return `${upRate}↑/${downRate}↓`;
    },
  },
  {
    id: 'operationhours',
    text: __('Uptime'),
    width: 80,
    filter: 'connectTime',
  },
  {
    id: 'status',
    width: 120,
    text: __('Status'),
    defaultValue: 'unkown',
    options: apStatus,
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  fetch: PropTypes.func,

  closeModal: PropTypes.func.isRequired,
  validateAll: PropTypes.func,
  fetchScreenData: PropTypes.func,
  saveScreenSettings: PropTypes.func,
  addPropertyPanel: PropTypes.func,
  updateScreenSettings: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  onListAction: PropTypes.func,
  createModal: PropTypes.func,
  groupid: PropTypes.any,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSettings: {
        first5g: 1,
        switch11n: 1,
        txpower: 'auto',
        countrycode: 'CN',
        channel: 0,
        channelwidth: 40,
        groupid: props.groupid,
      },
      ssidOptions: [],
    };

    this.createSettingsFormOptions = createSettingsFormOptions.bind(this);
    utils.binds(this, [
      'renderCustomModal',
      'onAction',
      'onSave',
      'toggleBox',
      'onMonitorBtnClick',
    ]);
    this.screenId = props.route.id;
  }

  componentDidMount() {
    const query = {
      groupid: this.props.groupid,
      size: 99,
    };
    this.props.fetch('goform/group/ssidSetting', query)
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          const list = fromJS(json.data.list);
          const ssidOptions = list.map((item) => {
            const ssid = item.get('ssid');
            return fromJS({
              value: ssid,
              label: ssid,
            });
          });
          this.setState({ ssidOptions: ssidOptions.toJS() });
        }
      });
  }

  onAction(type, item) {
    const actionQuery = {
      groupid: this.props.groupid,
    };
    if (type === 'edit') {
      actionQuery.mac = item.get('mac');
      this.props.addPropertyPanel(actionQuery, item.toJS());
    } else {
      actionQuery.mac = item;
      actionQuery.action = type;
      actionQuery.operate = type;
      this.props.changeScreenActionQuery(actionQuery);
      this.props.onListAction();
    }
  }

  onSettingSelected() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$selectedList = $$myScreenStore.getIn(['actionQuery', 'selectedList']);
    const $$listData = $$myScreenStore.getIn(['data', 'list']);

    if ($$selectedList.size > 1) {
      this.props.changeScreenActionQuery({
        action: EDIT_LIST_ACTION,
        myTitle: __('Edit Selected AP'),
      });
      const screenSettings = fromJS({
        radioEnable_2g: '1',
        radioPower_2g: '100%',
        ssid_2g: '',
        radioEnable_5g: '1',
        radioPower_5g: '100%',
        ssid_5g: '',
      });
      this.props.updateScreenSettings(screenSettings);
    } else if ($$selectedList.size === 1) {
      this.onAction('edit', $$listData.get($$selectedList.get(0)));
    }
  }

  onMonitorBtnClick() {
    this.props.changeScreenActionQuery({
      action: AP_MONITOR_ACTION,
      myTitle: __('AP Monitor Settings'),
    });
    const screenSettings = fromJS({
      enable: '1',
      apopermode: 1,
      scantype: 2,
      scanSpectrum: '2,5',
      cycles: 1,
      rpttime: 30,
      enable2g4chl: 0,
      enable2g4pwr: 0,
      maxtxpwr: '100%',
    });
    this.props.updateScreenSettings(screenSettings);
  }

  onSave(formId) {
    const $$apList = this.props.store.getIn([
      this.screenId,
      'data',
      'list',
    ]);
    const selectedMacList = this.props.store.getIn([
      this.screenId,
      'actionQuery',
      'selectedList',
    ]).map(
      index => $$apList.getIn([index, 'mac']),
    );

    if (this.props.validateAll) {
      this.props.validateAll(formId)
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            const curScreenId = this.props.store.get('curScreenId');
            const radioSettings = this.props.store.getIn([curScreenId, 'curSettings']).toJS();
            const action = this.props.store.getIn([curScreenId, 'actionQuery', 'action']);
            if (action === EDIT_LIST_ACTION) {
              if (!radioSettings.ssid_2g || !radioSettings.ssid_5g) {
                this.props.createModal({
                  role: 'alert',
                  text: __('Please at least select one ssid per radio!'),
                });
                return;
              }
              this.props.saveScreenSettings({
                url: 'goform/group/ap/radiogroupcfg',
                onlyChanged: true,
                numberKeys: fromJS(numberKeys),
                data: {
                  action: EDIT_LIST_ACTION,
                  selectedList: selectedMacList,
                  ...radioSettings,
                },
              }).then(
                () => {
                  this.props.closeModal();
                  this.props.changeScreenActionQuery({
                    action: '',
                  });
                },
              );
            } else if (action === AP_MONITOR_ACTION) {
              if (!radioSettings.scanSpectrum) {
                this.props.createModal({
                  role: 'alert',
                  text: __('Please at least select one scanning radio!'),
                });
                return;
              }
              this.props.saveScreenSettings({
                url: 'goform/group/wips',
                onlyChanged: true,
                numberKeys: fromJS(numberKeys),
                data: {
                  action: AP_MONITOR_ACTION,
                  selectedList: selectedMacList,
                  ...radioSettings,
                },
              }).then(
                () => {
                  this.props.closeModal();
                  this.props.changeScreenActionQuery({
                    action: '',
                  });
                },
              );
            }
          }
        });
    }
  }
  toggleBox(moduleName) {
    this.setState({
      [moduleName]: !this.state[moduleName],
    });
  }
  renderCustomModal() {
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curData = $$myScreenStore.get('curSettings');
    const isEditList = $$myScreenStore.getIn(['actionQuery', 'action']) === EDIT_LIST_ACTION;
    const isApMonitor = $$myScreenStore.getIn(['actionQuery', 'action']) === AP_MONITOR_ACTION;
    if (!isEditList && !isApMonitor) {
      return null;
    }

    return (
      <div className="o-box row">
        <div className="o-box__cell">
          {
            isEditList && (
              <FormContainer
                id="radioBase"
                options={this.createSettingsFormOptions()}
                data={$$curData}
                onChangeData={this.props.updateScreenSettings}
                onSave={() => this.onSave('modalsetting')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                isSaving={app.get('saving')}
                saveText={__('Apply')}
                savingText={__('Applying')}
                savedText={__('Applied')}
                hasSaveButton
              />
            )
          }
          {
            isApMonitor && (
              <FormContainer
                options={apMonitorSettingsOptions}
                data={$$curData}
                onChangeData={this.props.updateScreenSettings}
                onSave={() => this.onSave('modalmonitor')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                isSaving={app.get('saving')}
                saveText={__('Apply')}
                savingText={__('Applying')}
                savedText={__('Applied')}
                hasSaveButton
              />
            )
          }
        </div>
      </div>
    );
  }
  render() {
    const myListOptions = listOptions.setIn([0, 'render'], (val, $$item) => {
      const mac = $$item.get('mac');
      const statusVal = $$item.get('status');
      let ret = (
        <span
          onClick={() => this.onAction('edit', $$item)}
          className="link-text"
        >
          { $$item.get('devicename') || mac }
        </span>
      );

      if (statusVal === 'new') {
        ret = $$item.get('devicename') || mac;
      }

      return ret;
    });
    let myActionButtons = [
      {
        actionName: 'upgrade',
        text: __('Upgrade'),
        icon: 'arrow-circle-o-up',
        needConfirm: true,
      }, {
        actionName: 'reboot',
        text: __('Reboot'),
        icon: 'power-off',
        needConfirm: true,
      }, {
        actionName: 'reset',
        text: __('Reset'),
        icon: 'undo',
        needConfirm: true,
      },
      {
        actionName: 'edit',
        text: __('Edit'),
        icon: 'cog',
        onClick: () => this.onSettingSelected(),
      },
      {
        actionName: 'monitor',
        text: __('Monitor'),
        icon: 'cog',
        onClick: () => this.onMonitorBtnClick(),
      },
    ];

    // 如果是所有组不支持对AP的操作
    if (this.props.groupid === -100) {
      myActionButtons = [];
    }

    return (
      <AppScreen
        {...this.props}
        listOptions={myListOptions}
        actionBarButtons={myActionButtons}
        modalChildren={this.renderCustomModal()}
        listKey="mac"
        addable={false}
        editable={false}
        deleteable={false}
        selectable={$$data => $$data.get('status') !== 'new'}
        actionable
        searchable
        searchProps={{
          placeholder: `${__('Name')}/MAC`,
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
    groupid: state.product.getIn(['group', 'selected', 'id']),
    apList: state.product.get('devices'),
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
    propertiesActions,
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
