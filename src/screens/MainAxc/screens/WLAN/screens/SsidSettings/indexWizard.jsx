import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils } from 'shared/utils';
import validator from 'shared/validator';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  Table, Modal, SaveButton, Button, WizardContainer, FormContainer, FormGroup, FormInput,
} from 'shared/components';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import * as productActions from '../../../../reducer';
import Icon from 'shared/components/Icon';


let ret;
// 本地服务器名称
function getLocalRadiusServerName() {
  return utils.fetch('goform/portal/radius/nas', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.name,
            item,
          }),
        ),
      }
    ),
  );
}
function getLocalRadiusInformation() {
  return utils.fetch('goform/portal/radius/nas', {
    size: 9999,
    page: 1,
  }).then((json) => {
    if (json.state && json.state.code === 2000) {
      return fromJS(json.data.list);
    }
    return fromJS([]);
  });
}
// 远程服务器中的Radius模板
function getRadiusServerName() {
  return utils.fetch('goform/network/radius/template', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.template_name,
          }),
        ),
      }
    ),
  );
}

// 远程服务器中的Portal模板
function getPortalServerName() {
  return utils.fetch('goform/network/portal/server', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.template_name,
          }),
        ),
      }
    ),
  );
}

// 本地服务器中Portal 账户列表
function getPortalLoginName() {
  return utils.fetch('goform/portal/account/list/index', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.loginName,
            item,
          }),
        ),
      }
    ),
  );
}

// 获取充值卡列表名称
function getCardCategoryName() {
  return utils.fetch('goform/portal/card/cardcategory', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.name,
          }),
        ),
      }
    ),
  );
}
// 获取基本接入配置
function getAccessConfig() {
  return utils.fetch('goform/portal/access/config', {
    size: 9999,
    page: 1,
  })
    .then(json => (
      {
        accessList: json.data.settings.list.map(
          item => ({
            value: item.id,
            label: item.name,
          }),
        ),
      }
    ),
  );
}
const msg = {
  upSpeed: __('Up Speed'),
  downSpeed: __('Down Speed'),
  selectGroup: __('Select Group'),
};
let encryptionOptions = fromJS([
  {
    value: 'none',
    label: __('NONE'),
  }, {
    value: 'psk-mixed',
    label: __('SECURITY'),
  }, {
    value: '802.1x',
    label: '802.1x',
  },
]);

// 处理小于 2.5的版本
if (window.guiConfig.versionCode < 20500) {
  encryptionOptions = encryptionOptions.delete(-1);
}

const loadBalanceTypeArr = [
  {
    value: '0',
    label: __('Disable'),
  }, {
    value: '1',
    label: __('Users'),
  }, {
    value: '2',
    label: __('SSID'),
  },
];

const validOptions = Map({
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 256]',
  }),
  vlanid: validator({
    rules: 'num:[2, 4095]',
  }),
  ssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 32]',
  }),
  upstream: validator({
    rules: 'num:[0, 102400, 0]',
  }),
  downstream: validator({
    rules: 'num:[0, 102400, 0]',
  }),
  maxUser: validator({
    rules: 'num:[0, 64]',
  }),
});
const storeForwardOption = [
  {
    value: 'local',
    label: __('Local Forward'),
  },
  //  {
  //   value: 'centralized-802.3',
  //   label: __('Centralized Forward-%s', '802.3'),
  // }, {
  //   value: 'centralized-802.11',
  //   label: __('Centralized Forward-%s', '802.11'),
  // },
];
const checkboxOptions = [
  {
    value: '1',
    label: __('On'),
    render() {
      return (
        <span
          style={{
            color: 'green',
          }}
        >
          {__('On')}
        </span>
      );
    },
  }, {
    value: '0',
    label: __('Off'),
    render() {
      return (
        <span
          style={{
            color: 'red',
          }}
        >
          {__('Off')}
        </span>
      );
    },
  },
];
const $$accessTypeSeletOptions = fromJS([
  {
    value: 'portal',
    label: __('Portal'),
  },
  {
    value: '8021x-access',
    label: __('802.1x'),
    disabled: true,
  },
  {
    value: 'lan-access',
    label: __('LAN'),
    disabled: true,
  }, {
    value: 'ppp-access',
    label: __('PPP'),
    disabled: true,
  }, {
    value: 'mac-access',
    label: __('MAC'),
    disabled: true,
  },
]);
const flowRateFilter = utils.filter('flowRate:["KB"]');

const cardCategoryOptions = fromJS([
  {
    id: 'name',
    label: __('Name'),
    type: 'text',
    required: true,
    maxLength: 129,
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  }, {
    id: 'state',
    label: __('Type'),
    type: 'select',
    required: true,
    options: [
      {
        value: '0',
        label: __('Hour Card'),
      }, {
        value: '1',
        label: __('Day Card'),
      },
      {
        value: '2',
        label: __('Month Card'),
      }, {
        value: '3',
        label: __('Year Card'),
      }, {
        value: '4',
        label: __('Traffic Card'),
      },
    ],
  }, {
    id: 'maclimit',
    label: __('Mac Limit'),
    type: 'select',
    required: true,
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
  }, {
    id: 'maclimitcount',
    label: __('Mac Quantity'),
    type: 'number',
    required: true,
    min: '0',
    max: '999999',
    validator: validator({
      rules: 'num:[0,999999]',
    }),
  }, {
    id: 'autologin',
    label: __('Auto Login'),
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    type: 'select',
    required: true,
  }, {
    id: 'speed',
    label: __('Speed Limit'),
    type: 'select',
    required: true,
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: __('1M'),
      },
    ],
  }, {
    id: 'time',
    label: __('Count'),
    type: 'number',
    required: true,
    min: 1,
    max: 999999,
    validator: validator({
      rules: 'num:[1,999999]',
    }),
    render(val, data) {
      if (data.get('state') === '0') {
        ret = `${val}h`;
      } else if (data.get('state') === '1') {
        ret = `${val}d`;
      } else if (data.get('state') === '2') {
        ret = `${val}m`;
      } else if (data.get('state') === '3') {
        ret = `${val}y`;
      } else if (data.get('state') === '4') {
        if (val > 1024) {
          ret = `${(val / 1024).toFixed(2)}Gb`;
        } else {
          ret = `${val}Mb`;
        }
      }
      return ret;
    },
  }, {
    id: 'money',
    label: __('Price'),
    type: 'number',
    required: true,
    min: '0',
    max: '999999999',
    validator: validator({
      rules: 'num:[1,999999]',
    }),
    help: __('$'),
  }, {
    id: 'description',
    label: __('Description'),
    width: '120px',
    options: [],
    type: 'textarea',
    required: true,
    maxLength: 256,
    validator: validator({
      rules: 'utf8Len:[1,255]',
    }),
  },
]);

// 创建新账户的基本设置
const baseSetting = fromJS([
  {
    id: 'loginName',
    label: __('Login Name'),
    className: 'cols col-6',
    type: 'text',
    required: true,
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  }, {
    id: 'password',
    label: __('Password'),
    className: 'cols col-6',
    type: 'password',
    noTable: true,
    required: true,
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  }, {
    id: 'ex1',
    label: __('Question'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  }, {
    id: 'ex2',
    label: __('Answer'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
    maxLength: '129',
    validator: validator({
      rules: 'utf8Len:[1,128]',
    }),
  }, {
    id: 'state',
    label: __('Type'),
    className: 'cols col-12',
    options: [
      {
        value: '0',
        label: __('Deactivated'),
      }, {
        value: '1',
        label: __('Free'),
      },
      {
        value: '2',
        label: __('Time-based'),
      }, {
        value: '3',
        label: __('Buy Out'),
      }, {
        value: '4',
        label: __('Traffic'),
      },
    ],
    defaultValue: '0',
    type: 'select',
    required: true,
    placeholder: __('Please Select ') + __('Type'),

  }, {
    id: 'maclimit',
    label: __('Mac Limit'),
    className: 'cols col-6',
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    defaultValue: '0',
    type: 'select',
    required: true,
    placeholder: __('Please Select ') + __('Mac Limit'),
  }, {
    id: 'maclimitcount',
    label: __('Mac Quantity'),
    className: 'cols col-6',
    type: 'number',
    min: '0',
    max: '999999',
    validator: validator({
      rules: 'num:[0,999999]',
    }),
    required: true,
  }, {
    id: 'autologin',
    label: __('Auto Login'),
    className: 'cols col-6',
    options: [
      {
        value: '0',
        label: __('Closed'),
      }, {
        value: '1',
        label: __('Open'),
      },
    ],
    defaultValue: '0',
    type: 'select',
    required: true,
    placeholder: __('Auto Login') + __('Auto Login'),

  }, {
    id: 'speed',
    label: __('Speed Limit'),
    noForm: true,
    noTable: true,
    className: 'cols col-6',
    options: [
      {
        value: '1',
        label: __('1M'),
      },
    ],
    defaultValue: '0',
    type: 'select',
    required: true,
    placeholder: __('Please Select ') + __('Speed Limit'),
  }, {
    id: 'ex4',
    label: __('Last Unbind Month'),
    className: 'cols col-6',
    type: 'number',
    required: true,
    min: '1',
    max: '12',
    validator: validator({
      rules: 'num:[0,12]',
    }),
  }, {
    id: 'ex3',
    label: __('Unbind Times'),
    className: 'cols col-6',
    type: 'number',
    min: '0',
    max: '999999',
    validator: validator({
      rules: 'num:[0,999999]',
    }),
    required: true,
  },
]);


// Radius Template 选项
const serverChoices = fromJS([
  {
    id: 'serverType',
    label: __('Server Type'),
    className: 'cols col-4',
    defaultValue: 'remote',
    display: 'block',
    options: [
      {
        value: 'remote',
        label: __('External Server'),
      }, {
        value: 'local',
        label: __('Local Server'),
      },
    ],
    type: 'switch',
  },
]);
const authServer = fromJS([
  {
    id: 'template_name',
    label: __('Name'),
    form: 'authServer',
    type: 'text',
    maxLength: '31',
    required: true,
    className: 'cols col-12',
    notEditable: true,
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  }, {
    id: 'nasip',
    label: __('Nas IP'),
    form: 'authServer',
    type: 'text',
    required: true,
    className: 'cols col-12',
    validator: validator({
      rules: 'ip',
    }),
    visible(data) {
      return data.get('serverType') === 'remote';
    },
  }, {
    id: 'nasip',
    label: __('Nas IP'),
    form: 'authServer',
    type: 'select',
    required: true,
    className: 'cols col-12',
    validator: validator({
      rules: 'ip',
    }),
    visible(data) {
      return data.get('serverType') === 'local';
    },
    onChange: (data) => {
      const item = data.item;
      const retData = data;
      retData.mergeData = {
        authpri_ipaddr: item.ip,
        authpri_port: '1812',
        authpri_key: item.sharedSecret,
        authsecond_ipaddr: item.ip,
        authsecond_port: '1812',
        authsecond_key: item.sharedSecret,
      };
      return retData;
    },
  }, {
    id: 'authpri_ipaddr',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    fieldset: 'Authentication',
    fieldsetOption: {
      legend: __('Primary Authentication Server'),
      className: 'cols col-6',
    },
    form: 'authServer',
    label: __('IP Address'),
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'authpri_port',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Port'),
    fieldset: 'Authentication',
    form: 'authServer',
    required: true,
    defaultValue: '1812',
    type: 'number',
    min: '1',
    max: '65535',
  }, {
    id: 'authpri_key',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Password'),
    fieldset: 'Authentication',
    form: 'authServer',
    type: 'password',
    required: true,
    maxLength: '31',
    validator: validator({
      rules: 'pwd',
    }),
  }, {
    id: 'authsecond_ipaddr',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('IP Address'),
    fieldset: 'auth_secondary',
    fieldsetOption: {
      legend: __('Secondary Authentication Server'),
      className: 'cols col-6',
    },
    type: 'text',
    form: 'authServer',
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'authsecond_port',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Port'),
    fieldset: 'auth_secondary',
    type: 'number',
    form: 'authServer',
    min: '1',
    max: '65535',
  }, {
    id: 'authsecond_key',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Password'),
    fieldset: 'auth_secondary',
    type: 'password',
    form: 'authServer',
    maxLength: '31',
    validator: validator({
      rules: 'pwd',
    }),
  },
]);

// Portal Policy选项
const portalPolycyOptions = fromJS([
  {
    id: 'template_name',
    label: __('Server Name'),
    form: 'portalPolycyForm',
    type: 'text',
    maxLength: '31',
    notEditable: true,
    required: true,
    validator: validator({
      rules: 'utf8Len:[1,31]',
    }),
  },
  {
    id: 'server_ipaddr',
    label: __('Server IP'),
    form: 'portalPolycyForm',
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'server_port',
    label: __('Server Port'),
    form: 'portalPolycyForm',
    type: 'number',
    min: '1',
    max: '65535',
    required: true,
  }, {
    id: 'server_key',
    label: __('Shared Key'),
    form: 'portalPolycyForm',
    noTable: true,
    type: 'password',
    maxLength: '31',
    required: true,
    validator: validator({
      rules: 'pwd',
    }),
  }, {
    id: 'server_url',
    label: __('Redirect URL'),
    form: 'portalPolycyForm',
    type: 'text',
    required: true,
  }, {
    id: 'ac_ip',
    label: __('AC IP'),
    form: 'portalPolycyForm',
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  },
]);

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  group: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  groupid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  changeScreenActionQuery: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  updateScreenCustomProps: PropTypes.func,
  fetch: PropTypes.func,
  receiveScreenData: PropTypes.func,
  createModal: PropTypes.func,
  onListAction: PropTypes.func,
  reportValidError: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.getCurrData = this.getCurrData.bind(this);
    this.onUpdateSettings = this.onUpdateSettings.bind(this);

    utils.binds(this, [
      'onSave',
      'fetchCopyGroupSsids',
      'renderActionBar',
      'onOpenCopySsidModal',
      'onSelectCopyFromGroup',
      'renderUpdateSsid',
      'renderCustomModal',
      'onSelectCopySsid',
      'fetchMandatoryDomainList',
      'renderStepOne',
      'renderAAATemplate',
      'onAddNewAAAModal',
      'renderRadiusTemplate',
      'toggleBox',
      'renderNewRadiusTemplate',
      'getDefaultEditData',
      'createNewRemoteRadiusTemplate',
      'getWizardOptions',
      'onAddNewAAAModal',
      'renderServerChoice',
      'renderServerConfigration',
      'renderPortalAuthChoice',
      'renderCreatePortalAccount',
      'renderChargeForAccount',
      'renderPortalAuthConfig',
      'showConfigPage',
    ]);
    this.state = {
      updateListOptions: false,
      localRadiusServerOptions: fromJS([]),
      radiusServerTemplateName: fromJS([]),
      portalServerTemplateName: fromJS([]),
      portalLoginName: fromJS([]),
      categoryTypeOptions: fromJS([]),
      accessListOptions: fromJS([]),
      $$localRadiusDataList: fromJS([]),
    };
    const listOptions = fromJS([
      {
        id: 'ssid',
        notEditable: true,
        text: __('SSID'),
        maxLength: '31',
        formProps: {
          type: 'text',
          required: true,
          notEditable: true,
          validator: validator({
            rules: 'utf8Len:[1, 31]',
          }),
        },
      }, {
        id: 'remark',
        text: __('Description'),
        formProps: {
          type: 'text',
          maxLength: 255,
          validator: validator({
            rules: 'utf8Len:[1, 255]',
          }),
        },
        noTable: true,
      }, {
        id: 'enabled',
        text: __('Status'),
        options: checkboxOptions,
        defaultValue: '1',
        formProps: {
          type: 'checkbox',
          value: '1',
        },
      }, {
        id: 'hiddenSsid',
        text: __('Hide SSID'),
        options: [
          {
            value: '1',
            label: __('YES'),
            render() {
              return (
                <span
                  style={{
                    color: 'red',
                  }}
                >
                  {__('YES')}
                </span>
              );
            },
          }, {
            value: '0',
            label: __('NO'),
            render() {
              return (
                <span
                  style={{
                    color: 'green',
                  }}
                >
                  {__('NO')}
                </span>
              );
            },
          },
        ],
        defaultValue: '0',
        formProps: {
          type: 'checkbox',
          value: '1',
        },
      }, {
        id: 'ssidisolate',
        text: __('Wireless Client Isolation'),
        defaultValue: '1',
        options: checkboxOptions,
        formProps: {
          type: 'checkbox',
          value: '1',
        },
      },
      {
        id: 'greenap',
        text: __('Green AP Mode'),
        defaultValue: '1',
        options: checkboxOptions,
        formProps: {
          type: 'checkbox',
          value: '1',
        },
      },
      {
        id: 'maxBssUsers',
        text: __('Max Clients'),
        defaultValue: 64,
        formProps: {
          type: 'number',
          min: 1,
          max: 128,
        },
      },
      {
        id: 'vlanId',
        text: __('VLAN ID'),
        defaultValue: '1',
        formProps: {
          type: 'number',
          min: '1',
          max: '4094',
          required: true,
        },
      },
      {
        id: 'storeForwardPattern',
        options: storeForwardOption,
        text: __('Forwarding Mode'),
        defaultValue: 'local',
        formProps: {
          type: 'select',
        },
      }, {
        id: 'upstream/downstream',
        text: __('UP/Down Traffic'),
        render(val, item) {
          const upRate = flowRateFilter.transform(item.get('upstream'));
          const downRate = flowRateFilter.transform(item.get('downstream'));

          return `${upRate} / ${downRate}`;
        },
        noForm: true,
      }, {
        id: 'loadBalanceType',
        text: __('Traffic Control'),
        defaultValue: '0',
        options: loadBalanceTypeArr,
        formProps: {
          type: 'switch',
        },
      }, {
        id: 'upstream',
        defaultValue: '64',
        text: msg.upSpeed,
        noTable: true,
        formProps: {
          type: 'number',
          min: 1,
          max: 102400,
          required: true,
          visible($$data) {
            const curRepaet = $$data.get('loadBalanceType');

            return curRepaet !== '0';
          },
          help: 'KB/S',
        },
      }, {
        id: 'downstream',
        defaultValue: '256',
        text: msg.downSpeed,
        noTable: true,
        formProps: {
          type: 'number',
          min: 1,
          max: 102400,
          required: true,
          visible($$data) {
            const curRepaet = $$data.get('loadBalanceType');

            return curRepaet !== '0';
          },
          help: 'KB/S',
        },
      },
      {
        id: 'encryption',
        text: __('Encryption'),
        defaultValue: 'psk-mixed',
        options: encryptionOptions,
        formProps: {
          type: 'switch',
        },
      },
      {
        id: 'password',
        text: __('Password'),
        defaultValue: '',
        noTable: true,
        formProps: {
          type: 'password',
          required: true,
          maxLength: '63',
          validator: validator({
            rules: 'remarkTxt:["\'\\\\"]|utf8Len:[8, 63]',
          }),
          visible($$data) {
            const curRepaet = $$data.get('encryption');

            return curRepaet === 'psk-mixed';
          },
        },
      },
      {
        id: 'accessControl',
        text: __('Access Control'),
        defaultValue: 'none',
        options: [
          {
            value: 'none',
            label: __('None'),
          }, {
            value: 'portal',
            label: __('Portal'),
          },
        ],
        formProps: {
          type: 'switch',
          visible($$data) {
            const curRepaet = $$data.get('encryption');
            return curRepaet !== '802.1x';
          },
        },
      },
      {
        id: 'portalTemplate',
        text: __('Portal Template'),
        formProps: {
          type: 'select',
          visible($$data) {
            const accessControl = $$data.get('accessControl');
            const encryption = $$data.get('encryption');
            return accessControl === 'portal' && encryption !== '802.1x';
          },
          options: [
            {
              value: '0',
              label: 'local',
            },
            {
              value: '1',
              label: 'remote1',
            },
            {
              value: '2',
              label: 'remote2',
            },
          ],
        },
      },
      {
        id: 'Authentication',
        text: __('Authetication'),
        formProps: {
          type: 'select',
          visible($$data) {
            const portalTemplate = $$data.get('portalTemplate');
            const accessControl = $$data.get('accessControl');
            const encryption = $$data.get('encryption');
            return portalTemplate === '0' && accessControl === 'portal' && encryption !== '802.1x';
          },
          options: [
            {
              value: '0',
              label: 'Wechat Authentication',
            },
            {
              value: '1',
              label: 'Facebook Authentication',
            },
            {
              value: '2',
              label: 'On Key Authentication',
            },
            {
              value: '3',
              label: 'SNS Authentication',
            },
          ],
        },
      },
      {
        id: 'mandatorydomain',
        text: __('AAA Policy'),
        defaultValue: 'default',
        noTable: true,
        formProps: {
          type: 'select',
          options: [],
          visible($$data) {
            const encryption = $$data.get('encryption');
            return encryption === '802.1x';
          },
        },
      },
    ]);
    // 对特定版本处理
    this.listOptions = listOptions;
  }
  componentWillMount() {
    this.getDefaultEditData();
    getAccessConfig()
      .then((data) => {
        this.setState({
          accessListOptions: fromJS(data.accessList),
        });
      });
    getCardCategoryName()
      .then((data) => {
        this.setState({
          categoryTypeOptions: fromJS(data.options),
        });
      });
    getLocalRadiusInformation()
      .then(($$data) => {
        this.setState({
          $$localRadiusDataList: $$data,
        });
      });
    getLocalRadiusServerName()
      .then((data) => {
        this.setState({
          localRadiusServerOptions: fromJS(data.options),
        });
      });
    getRadiusServerName()
      .then((data) => {
        this.setState({
          radiusServerTemplateName: fromJS(data.options),
        });
      });
    getPortalServerName()
      .then((data) => {
        this.setState({
          portalServerTemplateName: fromJS(data.options),
        });
      });
    getPortalLoginName()
      .then((data) => {
        this.setState({
          portalLoginName: fromJS(data.options),
        });
      });
  }

  componentDidMount() {
    this.props.changeScreenActionQuery({
      groupid: this.props.groupid,
    });
    this.fetchMandatoryDomainList();
  }
  onSave(type) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$copyGroupSsids = $$myScreenStore.getIn(['data', 'copyGroupSsids']);

    if (type === 'copy') {
      let $$copySelectedList = $$myScreenStore.getIn(['actionQuery', 'copySelectedList']);
      $$copySelectedList = $$copySelectedList.map(
        index => $$copyGroupSsids.getIn(['list', index, 'ssid']),
      );

      // 没有选择要拷贝的 Ssids
      if ($$copySelectedList.size < 1) {
        this.props.createModal({
          type: 'alert',
          text: __('Please select ssid'),
        });
      } else {
        this.props.changeScreenActionQuery({
          copySelectedList: $$copySelectedList.toJS(),
        });
        this.props.onListAction();
      }
    }
  }

  onUpdateSettings(name) {
    return (item) => {
      const data = {};
      data[name] = item.value;
      this.props.updateCurEditListItem(data);
    };
  }
  onOpenCopySsidModal() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const copyFromGroupId = $$myScreenStore.getIn(['actionQuery', 'copyFromGroupId']);

    this.props.changeScreenActionQuery({
      action: 'copy',
      myTitle: __('Copy Form Other Group'),
      copySelectedList: fromJS([]),
    });
    this.fetchCopyGroupSsids(copyFromGroupId);
  }
  onAddNewAAAModal() {
    this.setState({
      customModal: true,
    });
  }

  onSelectCopyFromGroup(groupId, e) {
    e.preventDefault();
    this.props.changeScreenActionQuery({
      copyFromGroupId: groupId,
      copySelectedList: fromJS([]),
    });
    this.fetchCopyGroupSsids(groupId);
  }
  onSelectCopySsid(data) {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    let $$copySelectedList = $$myScreenStore.getIn(['actionQuery', 'copySelectedList']);
    let $$copyGroupSsid = $$myScreenStore.getIn(['data', 'copyGroupSsids']);

    $$copyGroupSsid = $$copyGroupSsid.update('list',
      ($$list) => {
        const ret = immutableUtils.selectList(
          $$list,
          data,
          $$copySelectedList,
        );
        $$copySelectedList = ret.selectedList;

        return ret.$$list;
      },
    );

    this.props.receiveScreenData({
      copyGroupSsids: $$copyGroupSsid,
    }, this.props.route.id);
    this.props.changeScreenActionQuery({
      copySelectedList: $$copySelectedList,
    });
  }

  getCurrData(name) {
    return this.props.store.getIn([this.props.route.id, 'curListItem', name]);
  }

  getDefaultEditData() {
    const myDefaultEditData = {};
    authServer.forEach(
      ($$item, index) => {
        const curId = $$item.get('id');
        const defaultValue = $$item.get('defaultValue') || '';

        myDefaultEditData[curId] = defaultValue;

        return index;
      },
    );
    serverChoices.forEach(
      ($$item, index) => {
        const curId = $$item.get('id');
        const defaultValue = $$item.get('defaultValue') || '';

        myDefaultEditData[curId] = defaultValue;

        return index;
      },
    );
    this.defaultEditData = myDefaultEditData;
  }

  fetchCopyGroupSsids(groupid) {
    const fetchUrl = this.props.route.fetchUrl || this.props.route.formUrl;
    const queryData = {
      groupid,
    };

    if (groupid === -100) {
      queryData.filterGroupid = this.props.groupid;
    }

    this.props.fetch(fetchUrl, queryData)
      .then(
        (json) => {
          if (json && json.state && json.state.code === 2000) {
            this.props.receiveScreenData({
              copyGroupSsids: json.data,
            }, this.props.route.id);
          }
        },
      );
  }
  fetchMandatoryDomainList() {
    this.props.fetch('goform/network/Aaa', {
      page: 1,
      size: 500,
    })
      .then((json) => {
        let options = [];

        if (json && json.data && json.data.list) {
          options = json.data.list
            .filter(
              item => item,
            ).map(
              (item) => {
                const curAccessTypeLabel = $$accessTypeSeletOptions.find(
                  $$item => $$item.get('value') === item.auth_accesstype,
                ).get('label');

                return {
                  value: item.domain_name,
                  label: `${item.domain_name}(${curAccessTypeLabel})`,
                  type: item.auth_accesstype,
                };
              },
            );
        }

        if (options) {
          options.unshift({
            value: '',
            label: __('None'),
          });
        }

        this.setState({
          updateListOptions: !this.state.updateListOptions,
        });
        this.listOptions = this.listOptions.map(
          ($$item) => {
            let $$retItem = $$item;

            if ($$retItem.get('id') === 'mandatorydomain') {
              $$retItem = $$retItem.setIn(['formProps', 'options'],
                ($$data) => {
                  let $$retOptions = fromJS(options);

                  if ($$data.get('encryption') === '802.1x') {
                    $$retOptions = $$retOptions.filter(
                      $$optionItem => $$optionItem.get('type') === '8021x-access',
                    );
                  } else {
                    $$retOptions = $$retOptions.filter(
                      $$optionItem => $$optionItem.get('type') !== '8021x-access',
                    );
                  }

                  return $$retOptions.toJS();
                },
              );
            }

            return $$retItem;
          },
        );
      },
    );
  }

  getWizardOptions($$curListItem, $$curWizardItem) {
    const accessControlType = $$curListItem.get('accessControl');
    const encryptionType = $$curListItem.get('encryption');
    const serverTypeChoice = $$curWizardItem.get('serverType');

    let $$options = fromJS([
      {
        title: __('Choose Server'),
        render: this.renderServerChoice,
      }, {
        title: __('Config Server'),
        render: this.renderServerConfigration,
      }, {
        title: __('Choose Authentication'),
        render: this.renderPortalAuthChoice,
      },
    ]);
    if (encryptionType !== '802.1x' && accessControlType === 'portal') {
      if (serverTypeChoice !== 'local') {
        $$options = $$options.delete(2);
      }
      return $$options;
    } else if (encryptionType === '802.1x') {
      $$options = $$options.delete(2);
    }
    return $$options;
  }
  toggleBox(moduleName) {
    this.setState({
      [moduleName]: !this.state[moduleName],
    });
  }

  // 新建远程Radius Server服务器
  createNewRemoteRadiusTemplate() {
    return (
      <FormContainer
        id="authServer"
        className="o-form--compassed"
        options={$$myAuthServer}
        data={$$curData}
        onChangeData={this.props.updateCurEditListItem}
        onSave={() => this.onSave('authServer')}
        invalidMsg={app.get('invalid')}
        validateAt={app.get('validateAt')}
        onValidError={this.props.reportValidError}
        isSaving={app.get('saving')}
        hasSaveButton
      />
    );
  }

  // 服务器选择
  renderServerChoice() {
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curWizardData = $$myScreenStore.get('customProps');

    return (
      <div className="o-box row">
        <div className="o-box__cell">
          <FormContainer
            id="serverChoice"
            className="o-form--compassed"
            options={serverChoices}
            data={$$curWizardData}
            onChangeData={(data) => {
              this.props.updateScreenCustomProps(data);
            }}
            onSave={() => this.onSave('serverChoices')}
            invalidMsg={app.get('invalid')}
            validateAt={app.get('validateAt')}
            onValidError={this.props.reportValidError}
            isSaving={app.get('saving')}
          />
        </div>
      </div>
    );
  }
  // 服务器配置
  renderServerConfigration() {
    // 远程radius服务器配置
    const radiusServerNameOptions = fromJS([
      {
        id: 'radiusServerName',
        label: __('Server Name'),
        required: true,
        type: 'select',
        width: '200px',
      }, {
        id: 'nasip',
        label: __('Nas IP'),
        form: 'authServer',
        type: 'select',
        disabled: true,
        required: true,
        appendRender: () => (
            <Button
              type="button"
              text={__('New')}
              key="addRadiusServer"
              icon="plus"
              style={{ marginTop: '20px' }}
              theme="primary"
              onClick={() => this.toggleBox('isCreateNewRadiusServer')}
            />
          ),
      },
    ]);
    // 本地radius服务器配置
    const localRadiusServerNameOptions = fromJS([
      {
        id: 'template_name',
        label: __('Name'),
        form: 'authServer',
        type: 'select',
        maxLength: '31',
        required: true,
        validator: validator({
          rules: 'utf8Len:[1,31]',
        }),
      }, {
        id: 'ip',
        label: __('Nas IP'),
        form: 'authServer',
        type: 'text',
        disabled: true,
        required: true,
        validator: validator({
          rules: 'ip',
        }),
        appendRender: () => (
            <Button
              type="button"
              text={__('New')}
              key="addLocalRadiusServer"
              icon="plus"
              style={{ marginTop: '20px' }}
              theme="primary"
              onClick={() => this.toggleBox('isCreateNewLocalRadiusServer')}
            />
          ),
      },
    ]);

    // 新建本地NasIP内容
    const newNasIPOptions = fromJS([
      {
        id: 'ip',
        label: __('IP'),
        type: 'text',
        required: true,
        validator: validator({
          rules: 'ip',
        }),
      }, {
        id: 'name',
        label: __('Name'),
        type: 'text',
        required: true,
        maxLength: '129',
        validator: validator({
          rules: 'utf8Len:[1,128]',
        }),
      }, {
        id: 'sharedSecret',
        label: __('Shared Secret'),
        type: 'password',
        required: true,
        maxLength: '129',
        validator: validator({
          rules: 'utf8Len:[1,128]',
        }),
      }, {
        id: 'ex2',
        label: __('Acc Send Interval'),
        defaultValue: '300',
        type: 'number',
        help: __('Seconds'),
        min: '0',
        max: '99999999',
        required: true,
        render(val) {
          return onlinetimeFilter.transform(val);
        },
      }, {
        id: 'ex3',
        label: __('Check Period'),
        defaultValue: '600',
        help: __('Seconds'),
        min: '0',
        max: '99999999',
        type: 'number',
        validator: validator({
          rules: 'num:[0,99999999]',
        }),
        required: true,
        render(val) {
          return onlinetimeFilter.transform(val);
        },
      }, {
        id: 'ex4',
        label: __('Idle Time'),
        defaultValue: '600',
        help: __('Second'),
        min: '0',
        max: '99999999',
        type: 'number',
        validator: validator({
          rules: 'num:[0,99999999]',
        }),
        required: true,
        render(val) {
          return onlinetimeFilter.transform(val);
        },
      }, {
        id: 'type',
        options: [
          {
            value: '0',
            label: __('Standard'),
          },
        ],
        noTable: true,
        noForm: true,
        defaultValue: '0',
        type: 'select',
        required: true,
        label: __('Equipment Type'),
        placeholder: __('Please Select ') + __('Equipment Type'),
      }, {
        id: 'description',
        label: __('Description'),
        type: 'textarea',
        maxLength: '256',
        validator: validator({
          rules: 'utf8Len:[1,255]',
        }),
      }, {
        id: 'ex1',
        label: __('is Delegated'),
        defaultValue: '0',
        options: checkboxOptions,
        type: 'switch',
        required: true,
      }, {
        id: 'ex5',
        defaultValue: '0',
        label: __('Concurrency Unlock'),
        options: checkboxOptions,
        type: 'switch',
        required: true,
      },
    ]);

    const portalServerNameOptions = fromJS([
      {
        id: 'portalServerName',
        label: __('Server Name'),
        required: true,
        type: 'select',
        width: '200px',
      }, {
        id: 'server_ipaddr',
        label: __('Server IP'),
        type: 'select',
        required: true,
        disabled: true,
        appendRender: () => (
            <Button
              type="button"
              text={__('New')}
              key="addPortalServer"
              icon="plus"
              style={{ marginTop: '20px' }}
              theme="primary"
              onClick={() => this.toggleBox('isCreateNewPortalServer')}
            />
          ),
      },
    ]);

    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curWizardData = $$myScreenStore.get('customProps');
    const $$curData = $$myScreenStore.get('curListItem');
    const serverTypeChoice = $$curWizardData.get('serverType');
    const isLocalServer = (serverTypeChoice === 'local');
    const encryptionType = $$curData.get('encryption');
    const isPortalServerConfigShow = (encryptionType !== '802.1x');
    // const curAuthServer = authServer.setIn([2, 'options'], this.state.nasIPOptions);
    // const $$myAuthServer = curAuthServer;
    const $$curRadiusServerName = radiusServerNameOptions.setIn([0, 'options'], this.state.radiusServerTemplateName);
    const $$curLocalRadiusServerName = localRadiusServerNameOptions.setIn([0, 'options'], this.state.localRadiusServerOptions);
    const $$curPortalServerName = portalServerNameOptions.setIn([0, 'options'], this.state.portalServerTemplateName);
    const $$localRadiusDataList = this.state.$$localRadiusDataList;
    const $$localRadiusDataItem = $$localRadiusDataList.find($$item => $$item.get('id') === $$curData.get('template_name'));
    let $$localRadiusInformation = $$curWizardData;


    if ($$localRadiusDataItem) {
      // NasIP列表是IP,模态框里的是nasIP;
      $$localRadiusInformation = $$curWizardData.merge($$localRadiusDataItem.delete('name'));
    }


    return (
      <div className="o-box row">
        <div className="o-box__cell">
          <h3
            style={{ cursor: 'pointer' }}
            onClick={() => this.toggleBox('isRadiusServerShow')}
          >
            <Icon
              name={this.state.RadiusServerShow ? 'minus-square' : 'plus-square'}
              size="lg"
              style={{
                marginRight: '5px',
              }}
            />
            {__('Radius Server')}
          </h3>
        </div>
        {
          this.state.isRadiusServerShow ? (
            isLocalServer ? (
              <div className="o-box__cell">
                <div>
                  <FormContainer
                    id="localRadiusServer"
                    className="o-form--compassed"
                    options={$$curLocalRadiusServerName}
                    data={$$localRadiusInformation}
                    onChangeData={(data) => {
                      this.props.updateScreenCustomProps(data);
                    }}
                    onSave={() => this.onSave('localRadiusServer')}
                    invalidMsg={app.get('invalid')}
                    validateAt={app.get('validateAt')}
                    onValidError={this.props.reportValidError}
                    isSaving={app.get('saving')}
                  />
                  {
                    this.state.isCreateNewLocalRadiusServer ? (
                      <FormContainer
                        id="newLocalRadiusServer"
                        className="o-form--compassed"
                        options={newNasIPOptions}
                        data={$$curWizardData}
                        onChangeData={(data) => {
                          this.props.updateScreenCustomProps(data);
                        }}
                        onSave={() => this.onSave('newLocalRadiusServer')}
                        invalidMsg={app.get('invalid')}
                        validateAt={app.get('validateAt')}
                        onValidError={this.props.reportValidError}
                        isSaving={app.get('saving')}
                        hasSaveButton
                      />
                    ) : null
                  }
                </div>
              </div>
            ) : (
              <div className="o-box__cell">
                <div>
                  <FormContainer
                    id="radiusServer"
                    className="o-form--compassed"
                    options={$$curRadiusServerName}
                    data={$$curWizardData}
                    onChangeData={(data) => {
                      this.props.updateScreenCustomProps(data);
                    }}
                    onSave={() => this.onSave('radiusServer')}
                    invalidMsg={app.get('invalid')}
                    validateAt={app.get('validateAt')}
                    onValidError={this.props.reportValidError}
                    isSaving={app.get('saving')}
                  />
                  {
                    this.state.isCreateNewRadiusServer ? (
                      <FormContainer
                        id="radiusServer"
                        className="o-form--compassed"
                        options={$$myAuthServer}
                        data={$$curData}
                        onChangeData={this.props.updateCurEditListItem}
                        onSave={() => this.onSave('authServer')}
                        invalidMsg={app.get('invalid')}
                        validateAt={app.get('validateAt')}
                        onValidError={this.props.reportValidError}
                        isSaving={app.get('saving')}
                        hasSaveButton
                      />
                    ) : null
                  }
                </div>
              </div>
            )
          ) : null
        }
        {
          isPortalServerConfigShow ? (
            <div>
              <div className="o-box__cell">
                <h3
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.toggleBox('isPortalServerShow')}
                >
                  <Icon
                    name={this.state.isPortalServerShow ? 'minus-square' : 'plus-square'}
                    size="lg"
                    style={{
                      marginRight: '5px',
                    }}
                    onClick={() => this.toggleBox('isPortalServerShow')}
                  />
                  {__('Portal Server')}
                </h3>
              </div>
              {
                this.state.isPortalServerShow ? (
                  <div className="o-box__cell">
                    <div>
                      <FormContainer
                        id="portalServerChoice"
                        className="o-form--compassed"
                        options={$$curPortalServerName}
                        data={$$curWizardData}
                        onChangeData={(data) => {
                          this.props.updateScreenCustomProps(data);
                        }}
                        onSave={() => this.onSave('portalServerChoice')}
                        invalidMsg={app.get('invalid')}
                        validateAt={app.get('validateAt')}
                        onValidError={this.props.reportValidError}
                        isSaving={app.get('saving')}
                      />
                      {
                        this.state.isCreateNewPortalServer ? (
                          <FormContainer
                            id="newPortalServer"
                            className="o-form--compassed"
                            options={portalPolycyOptions}
                            data={$$curWizardData}
                            onChangeData={(data) => {
                              this.props.updateScreenCustomProps(data);
                            }}
                            onSave={() => this.onSave('newPortalServer')}
                            invalidMsg={app.get('invalid')}
                            validateAt={app.get('validateAt')}
                            onValidError={this.props.reportValidError}
                            isSaving={app.get('saving')}
                            hasSaveButton
                          />
                        ) : null
                      }
                    </div>
                  </div>
                ) : null
              }
            </div>
          ) : null
        }

      </div>
    );
  }
  // 认证方式选择
  renderPortalAuthChoice() {
    const portalAccessTableOptions = fromJS([
      {
        id: 'accessControlTable',
        type: 'table',
        thead: [
          __('Authentication Types'),
          __('Initiate Mode'),
          __('Sesssion Time(min)'),
          __('URL After Authentication'),
        ],
        list: [
          [
            {
              id: 'oneKeyType',
              form: 'oneKey',
              text: __('One Key Authentication'),
              noForm: true,
            },
            {
              id: 'oneKeyEnable',
              form: 'oneKey',
              type: 'checkbox',
              onClick: () => this.toggleBox('isOpen'),
            }, {
              id: 'oneKeySessiontime',
              form: 'oneKey',
              min: '0',
              max: '8192',
              type: 'number',
            }, {
              id: 'oneKeyUrl',
              form: 'oneKey',
              type: 'text',
            },
          ],
          [
            {
              id: 'accessUserType',
              form: 'accessUser',
              text: __('Access User Authentication'),
              noForm: true,
            },
            {
              id: 'accessUserEnable',
              form: 'accessUser',
              type: 'checkbox',
            }, {
              id: 'accessUserSessiontime',
              form: 'accessUser',
              min: '0',
              max: '8192',
              type: 'number',
            }, {
              id: 'accessUserUrl',
              form: 'accessUser',
              type: 'text',
            },
          ],
          [
            {
              id: 'radiusAuthType',
              form: 'radiusAuth',
              text: __('Radius Authentication'),
              noForm: true,
            },
            {
              id: 'radiusAuthEnable',
              form: 'radiusAuth',
              type: 'checkbox',
            }, {
              id: 'radiusAuthSessiontime',
              form: 'radiusAuth',
              min: '0',
              max: '8192',
              type: 'number',
            }, {
              id: 'radiusAuthUrl',
              form: 'radiusAuth',
              type: 'text',
            },
          ],
          [
            {
              id: 'appAuthType',
              form: 'appAuth',
              text: __('App Authentication'),
              noForm: true,
            },
            {
              id: 'appAuthEnable',
              form: 'appAuth',
              type: 'checkbox',
            }, {
              id: 'appAuthSessiontime',
              form: 'appAuth',
              min: '0',
              max: '8192',
              type: 'number',
            }, {
              id: 'appAuthUrl',
              form: 'appAuth',
              type: 'text',
            },
          ],
          [
            {
              id: 'messageAuthType',
              form: 'messageAuth',
              text: __('Messages Authentication'),
              noForm: true,
            },
            {
              id: 'messageAuthEnable',
              form: 'messageAuth',
              type: 'checkbox',
            }, {
              id: 'messageAuthSessiontime',
              form: 'messageAuth',
              min: '0',
              max: '8192',
              type: 'number',
            }, {
              id: 'messageAuthUrl',
              form: 'messageAuth',
              type: 'text',
            },
          ],
          [
            {
              id: 'wechatAuthType',
              form: 'wechatAuth',
              text: __('Wechat Authentication'),
              noForm: true,
            },
            {
              id: 'wechatAuthEnable',
              form: 'wechatAuth',
              type: 'checkbox',
            }, {
              id: 'wechatAuthSessiontime',
              form: 'wechatAuth',
              min: '0',
              max: '8192',
              type: 'number',
            }, {
              id: 'wechatAuthUrl',
              form: 'wechatAuth',
              type: 'text',
            },
          ],
          [
            {
              id: 'platFormAuthType',
              form: 'platFormAuth',
              text: __('Public Platform Authentication'),
              noForm: true,
            },
            {
              id: 'platFormAuthEnable',
              form: 'platFormAuth',
              type: 'checkbox',
            }, {
              id: 'platFormAuthSessiontime',
              form: 'platFormAuth',
              min: '0',
              max: '8192',
              type: 'number',
            }, {
              id: 'platFormAuthUrl',
              form: 'platFormAuth',
              type: 'text',
            },
          ],
          [
            {
              id: 'visitorAuthType',
              form: 'visitorAuth',
              text: __('Visitor Authentication'),
              noForm: true,
            },
            {
              id: 'visitorAuthEnable',
              form: 'visitorAuth',
              type: 'checkbox',
            }, {
              id: 'visitorAuthSessiontime',
              form: 'visitorAuth',
              min: '0',
              max: '8192',
              type: 'number',
            }, {
              id: 'visitorAuthUrl',
              form: 'visitorAuth',
              type: 'text',
            },
          ],
          [
            {
              id: 'facebookAuthType',
              form: 'facebookAuth',
              text: __('Facebook Authentication'),
              noForm: true,
            },
            {
              id: 'facebookAuthEnable',
              form: 'facebookAuth',
              type: 'checkbox',
            }, {
              id: 'facebookAuthSessiontime',
              form: 'facebookAuth',
              min: '0',
              max: '8192',
              type: 'number',
            }, {
              id: 'facebookAuthUrl',
              form: 'facebookAuth',
              type: 'text',
            },
          ],
        ],
      },
    ]);
    const portalAccountOptions = fromJS([
      {
        id: 'loginName',
        label: __('Login Name'),
        required: true,
        type: 'select',
        appendRender: () => (
            <Button
              type="button"
              text={__('New')}
              key="addPortalAccount"
              icon="plus"
              style={{ marginTop: '20px' }}
              theme="primary"
              onClick={() => this.toggleBox('isCreateNewPortalAccount')}
            />
          ),
      },
    ]);
    const rechargeOptions = fromJS([
      {
        id: 'name',
        label: __('Recharge Choices'),
        form: 'recharge',
        required: true,
        type: 'select',
        appendRender: () => (
            <Button
              type="button"
              text={__('New')}
              key="addCardCategory"
              icon="plus"
              style={{ marginTop: '20px' }}
              theme="primary"
              onClick={() => this.toggleBox('isCreateCardCategory')}
            />
          ),
      },
    ]);
    const wechatOptions = fromJS([
      {
        id: 'ssid',
        label: __('SSID Choices'),
        form: 'recharge',
        required: true,
        type: 'select',
        appendRender: () => (
            <Button
              type="button"
              text={__('New')}
              key="addCardCategory"
              icon="plus"
              style={{ marginTop: '20px' }}
              theme="primary"
              onClick={() => this.toggleBox('isCreateNewWechat')}
            />
          ),
      },
    ]);
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curWizardData = $$myScreenStore.get('customProps');
    const $$curPortalAccount = portalAccountOptions.setIn([0, 'options'], this.state.portalLoginName);
    const $$curRechargeOptions = rechargeOptions
      .setIn([0, 'options'], this.state.categoryTypeOptions);
    const isOneKey = $$curWizardData.get('isOneKey');
    const isAccessUser = $$curWizardData.get('isAccessUser');
    const isMessage = $$curWizardData.get('isMessage');
    const isFacebook = $$curWizardData.get('isFacebook');
    const isWechat = $$curWizardData.get('isWechat');

    const formGroupStyle = {
      margin: 0,
    };

    return (
      <div className="o-box row">
        <div className="o-box__cell rows" style={{ color: '#fff', background: '#333' }}>
          <div className="cols col-3">{__('Type')}</div>
          <div className="cols col-4">{__('Sesstion Time')}</div>
          <div className="cols col-4">{__('Redirect URL After Authentication')}</div>
        </div>
        <div className="o-box__cell">
          <div className="o-form o-form--flow">
            <FormGroup
              name="isOneKey"
              checked={isOneKey === '1'}
              type="checkbox"
              text={__('One Key Authentication')}
              className="cols col-3"
              style={formGroupStyle}
              onChange={
                (data) => {
                  this.props.updateScreenCustomProps({
                    isOneKey: data.value,
                  });
                }
              }
            />
            <FormGroup
              type="text"
              name="sesstionTime"
              className="cols col-4"
              style={formGroupStyle}
            />
            <FormGroup
              type="text"
              className="cols col-4"
              style={formGroupStyle}
            />
          </div>
          {
            isOneKey === '1' ? (
              <div className="o-box__cell">
                <div>
                  <FormContainer
                    id="portalAccountChoice"
                    className="o-form--compassed"
                    options={$$curPortalAccount}
                    data={$$curWizardData}
                    onChangeData={(data) => {
                      this.props.updateScreenCustomProps(data);
                    }}
                    onSave={() => this.onSave('portalAccountChoice')}
                    invalidMsg={app.get('invalid')}
                    validateAt={app.get('validateAt')}
                    onValidError={this.props.reportValidError}
                    isSaving={app.get('saving')}
                  />
                  {
                    this.state.isCreateNewPortalAccount ? (
                      <FormContainer
                        id="newPortalAccount"
                        className="o-form--compassed"
                        options={baseSetting}
                        data={$$curWizardData}
                        onChangeData={(data) => {
                          this.props.updateScreenCustomProps(data);
                        }}
                        onSave={() => this.onSave('newPortalAccount')}
                        invalidMsg={app.get('invalid')}
                        validateAt={app.get('validateAt')}
                        onValidError={this.props.reportValidError}
                        isSaving={app.get('saving')}
                        hasSaveButton
                      />
                    ) : null
                  }
                </div>
              </div>
            ) : null
          }
        </div>
        <div className="o-box__cell">
          <div className="o-form o-form--flow">
            <FormGroup
              name="isAccessUser"
              checked={isAccessUser === '1'}
              type="checkbox"
              text={__('Access User Authentication')}
              className="cols col-3"
              style={formGroupStyle}
              onChange={
                (data) => {
                  this.props.updateScreenCustomProps({
                    isAccessUser: data.value,
                  });
                }
              }
            />
            <FormGroup
              type="text"
              name="sesstionTime"
              className="cols col-4"
              placeholder={__('Sesstion Time')}
              style={formGroupStyle}
            />
            <FormGroup
              type="text"
              className="cols col-4"
              style={formGroupStyle}
            />
          </div>
          {
            isAccessUser === '1' ? (
              <div
                className="o-box__cell"
                style={{
                  marginTop: '20px',
                }}
              >
                <div className="account">
                <h3>Account</h3>
                <div>
                  <FormContainer
                    id="portalAccountChoice"
                    className="o-form--compassed"
                    options={$$curPortalAccount}
                    data={$$curWizardData}
                    onChangeData={(data) => {
                      this.props.updateScreenCustomProps(data);
                    }}
                    onSave={() => this.onSave('portalAccountChoice')}
                    invalidMsg={app.get('invalid')}
                    validateAt={app.get('validateAt')}
                    onValidError={this.props.reportValidError}
                    isSaving={app.get('saving')}
                  />
                  {
                    this.state.isCreateNewPortalAccount ? (
                      <FormContainer
                        id="newPortalAccount"
                        className="o-form--compassed"
                        options={baseSetting}
                        data={$$curWizardData}
                        onChangeData={(data) => {
                          this.props.updateScreenCustomProps(data);
                        }}
                        onSave={() => this.onSave('newPortalAccount')}
                        invalidMsg={app.get('invalid')}
                        validateAt={app.get('validateAt')}
                        onValidError={this.props.reportValidError}
                        isSaving={app.get('saving')}
                        hasSaveButton
                      />
                    ) : null
                  }
                </div>
              </div>
                <div className="recharge">
                <h3
style={{
                  marginTop: '20px',
                }}
                >Recharge</h3>
                <div>
                  <FormContainer
                    id="rechargeForm"
                    className="o-form--compassed"
                    options={$$curRechargeOptions}
                    data={$$curWizardData}
                    onChangeData={(data) => {
                      this.props.updateScreenCustomProps(data);
                    }}
                    onSave={() => this.onSave('rechargeForm')}
                    invalidMsg={app.get('invalid')}
                    validateAt={app.get('validateAt')}
                    onValidError={this.props.reportValidError}
                    isSaving={app.get('saving')}
                  />
                  {
                    this.state.isCreateCardCategory ? (
                      <FormContainer
                        id="createCardCategory"
                        className="o-form--compassed"
                        options={cardCategoryOptions}
                        data={$$curWizardData}
                        onChangeData={(data) => {
                          this.props.updateScreenCustomProps(data);
                        }}
                        onSave={() => this.onSave('createCardCategory')}
                        invalidMsg={app.get('invalid')}
                        validateAt={app.get('validateAt')}
                        onValidError={this.props.reportValidError}
                        isSaving={app.get('saving')}
                        hasSaveButton
                      />
                    ) : null
                  }
                </div>
              </div>

              </div>
            ) : null
          }
        </div>
        <div className="o-box__cell">
          <div className="o-form o-form--flow">
            <FormGroup
              name="isOneKey"
              value={this.isRadius ? '1' : '0'}
              type="checkbox"
              text={__('Radius Authentication')}
              className="cols col-3"
              style={formGroupStyle}
              onChange={
                (data) => {
                  this.props.updateScreenCustomProps(data);
                }
              }
            />
            <FormGroup
              type="text"
              name="sesstionTime"
              className="cols col-4"
              style={formGroupStyle}
            />
            <FormGroup
              type="text"
              className="cols col-4"
              style={formGroupStyle}
            />
          </div>
        </div>
        <div className="o-box__cell">
          <div className="o-form o-form--flow">
            <FormGroup
              name="isAPP"
              value={this.isApp ? '1' : '0'}
              type="checkbox"
              text={__('App Authentication')}
              className="cols col-3"
              style={formGroupStyle}
              onChange={
                (data) => {
                  this.props.updateScreenCustomProps(data);
                }
              }
            />
            <FormGroup
              type="text"
              name="sesstionTime"
              className="cols col-4"
              style={formGroupStyle}
            />
            <FormGroup
              type="text"
              className="cols col-4"
              style={formGroupStyle}
            />
          </div>
        </div>
        <div className="o-box__cell">
          <div className="o-form o-form--flow">
            <FormGroup
              name="isMessage"
              checked={isMessage === '1'}
              type="checkbox"
              text={__('Message Authentication')}
              className="cols col-3"
              style={formGroupStyle}
              onChange={
                (data) => {
                  this.props.updateScreenCustomProps({
                    isMessage: data.value,
                  });
                }
              }
            />
            <FormGroup
              type="text"
              name="sesstionTime"
              className="cols col-4"
              style={formGroupStyle}
            />
            <FormGroup
              type="text"
              className="cols col-4"
              style={formGroupStyle}
            />
          </div>
        </div>
        <div className="o-box__cell">
          <div className="o-form o-form--flow">
            <FormGroup
              name="isWechat"
              value={isWechat === '1'}
              type="checkbox"
              text={__('Wechat Authentication')}
              className="cols col-3"
              style={formGroupStyle}
              onChange={
                (data) => {
                  this.props.updateScreenCustomProps({
                    isWechat: data.value,
                  });
                }
              }
            />
            <FormGroup
              type="text"
              name="sesstionTime"
              className="cols col-4"
              style={formGroupStyle}
            />
            <FormGroup
              type="text"
              className="cols col-4"
              style={formGroupStyle}
            />
          </div>
        </div>
        <div className="o-box__cell">
          <div className="o-form o-form--flow">
            <FormGroup
              name="isPublicPlatform"
              value={this.isPublicPlatform ? '1' : '0'}
              type="checkbox"
              text={__('Public Platform Authentication')}
              className="cols col-3"
              style={formGroupStyle}
              onChange={
                (data) => {
                  this.props.updateScreenCustomProps(data);
                }
              }
            />
            <FormGroup
              type="text"
              name="sesstionTime"
              className="cols col-4"
              style={formGroupStyle}
            />
            <FormGroup
              type="text"
              className="cols col-4"
              style={formGroupStyle}
            />
          </div>
        </div>
        <div className="o-box__cell">
          <div className="o-form o-form--flow">
            <FormGroup
              name="isVisitor"
              value={this.isVisitor ? '1' : '0'}
              type="checkbox"
              text={__('Visitor Authentication')}
              className="cols col-3"
              style={formGroupStyle}
              onChange={
                (data) => {
                  this.props.updateScreenCustomProps(data);
                }
              }
            />
            <FormGroup
              type="text"
              name="sesstionTime"
              className="cols col-4"
              style={formGroupStyle}
            />
            <FormGroup
              type="text"
              className="cols col-4"
              style={formGroupStyle}
            />
          </div>
        </div>
        <div className="o-box__cell">
          <div className="o-form o-form--flow">
            <FormGroup
              name="isFacebook"
              checked={isFacebook === '1'}
              type="checkbox"
              text={__('Facebook Authentication')}
              className="cols col-3"
              style={formGroupStyle}
              onChange={
                (data) => {
                  this.props.updateScreenCustomProps({
                    isFacebook: data.value,
                  });
                }
              }
            />
            <FormGroup
              type="text"
              name="sesstionTime"
              className="cols col-4"
              style={formGroupStyle}
            />
            <FormGroup
              type="text"
              className="cols col-4"
              style={formGroupStyle}
            />
          </div>
        </div>
      </div>
    );
  }

  // 根据所选的认证方式进行配置
  renderPortalAuthConfig() {
    const snsConfigOptions = fromJS([
      {
        id: 'name',
        label: __('Name'),
        required: true,
        type: 'select',
        appendRender: () => (
            <Button
              type="button"
              text={__('New')}
              key="addNewSNS"
              icon="plus"
              style={{ marginTop: '20px' }}
              theme="primary"
              onClick={() => this.toggleBox('isConfigNewSNS')}
            />
          ),
      },
    ]);
    const configNewSNSOptions = fromJS([
      {
        id: 'name',
        label: __('Name'),
        type: 'text',
        required: true,
        maxLength: '129',
        validator: validator({
          rules: 'utf8Len:[1, 128]',
        }),
      }, {
        id: 'url',
        label: __('URL'),
        noTable: true,
        type: 'text',
        required: true,
        maxLength: '256',
        validator: validator({
          rules: 'utf8Len:[1, 255]',
        }),
      }, {
        id: 'appkey',
        label: __('App Key'),
        help: __('gwid,accountid,username'),
        maxLength: '129',
        type: 'text',
        required: true,
        validator: validator({
          rules: 'utf8Len:[1, 128]',
        }),
      }, {
        id: 'appsecret',
        label: __('Password'),
        maxLength: '128',
        type: 'password',
        required: true,
        validator: validator({
          rules: 'pwd',
        }),
      }, {
        id: 'smstemplate',
        label: __('Template ID'),
        maxLength: '256',
        help: __('ServiceID, Spcode'),
        type: 'text',
        validator: validator({
          rules: 'utf8Len:[1, 255]',
        }),
      }, {
        id: 'smssign',
        label: __('Signature ID'),
        help: __('srcTermID'),
        type: 'text',
        maxLength: '33',
        validator: validator({
          rules: 'utf8Len:[1, 32]',
        }),
      }, {
        id: 'company',
        label: __('Company Name'),
        type: 'text',
        maxLength: '33',
        required: true,
        validator: validator({
          rules: 'utf8Len:[1, 32]',
        }),
      }, {
        id: 'count',
        labelt: __('Used Times'),
        noForm: true,
        type: 'number',
        required: true,
        min: '0',
        max: '99999',
        defaultValue: '5',
        help: __('Times'),
        validator: validator({
          rules: 'num:[0,99999]',
        }),
      }, {
        id: 'type',
        label: __('Type'),
        type: 'select',
        required: true,
        options: [
          {
            value: '1',
            label: __('iKuai'),
          }, {
            value: '2',
            label: __('Alidayu'),
          }, {
            value: '3',
            label: __('Sucker Ducker'),
          }, {
            value: '4',
            label: __('China Mobile ESMS'),
          }, {
            value: '5',
            label: __('China Unicome OSMS'),
          }, {
            value: '6',
            label: __('China Mobile OpenMas'),
          }, {
            value: '7',
            label: __('Submail'),
          }, {
            value: '8',
            label: __('Carrier Message'),
          }, {
            value: '9',
            label: __('China Telicome SMGP'),
          }, {
            value: '10',
            label: __('Huaxin Message System'),
          }, {
            value: '11',
            label: __('China Telicome ESMS'),
          },
        ],
      }, {
        id: 'state',
        label: __('State'),
        type: 'select',
        required: true,
        options: [
          {
            value: '1',
            label: __('Enable'),
          }, {
            value: '0',
            label: __('Disable'),
          },
        ],
      }, {
        id: 'more',
        label: __('Multi Terminal Log'),
        type: 'select',
        required: true,
        options: [
          {
            value: '0',
            label: __('Enable'),
          }, {
            value: '1',
            label: __('Disable'),
          },
        ],
      }, {
        id: 'time',
        label: __('Overdue Duration'),
        type: 'number',
        min: '0',
        max: '10',
        defaultValue: '5',
        help: __('Minutes'),
        validator: validator({
          rules: 'num:[0,10]',
        }),
        render(val) {
          ret = `${val}m`;
          return ret;
        },
      }, {
        id: 'text',
        label: __('Message Content'),
        noTable: true,
        type: 'textarea',
        required: true,
        maxLength: '257',
        validator: validator({
          rules: 'utf8Len:[1, 256]',
        }),
      },
    ]);
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curWizardData = $$myScreenStore.get('customProps');
    return (
      <div className="o-box__cell">
        <div>
          <FormContainer
            id="configSNS"
            className="o-form--compassed"
            options={snsConfigOptions}
            data={$$curWizardData}
            onChangeData={(data) => {
              this.props.updateScreenCustomProps(data);
            }}
            onSave={() => this.onSave('configSNS')}
            invalidMsg={app.get('invalid')}
            validateAt={app.get('validateAt')}
            onValidError={this.props.reportValidError}
            isSaving={app.get('saving')}
          />
          {
            this.state.isConfigNewSNS ? (
              <FormContainer
                id="configNewSNS"
                className="o-form--compassed"
                options={configNewSNSOptions}
                data={$$curWizardData}
                onChangeData={(data) => {
                  this.props.updateScreenCustomProps(data);
                }}
                onSave={() => this.onSave('configNewSNS')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
                isSaving={app.get('saving')}
                hasSaveButton
              />
            ) : null
          }
        </div>
      </div>
    );
  }
  // 选择账户或者创建账户
  renderCreatePortalAccount() {
    const portalAccountOptions = fromJS([
      {
        id: 'loginName',
        label: __('Login Name'),
        required: true,
        type: 'select',
        appendRender: () => (
            <Button
              type="button"
              text={__('New')}
              key="addPortalAccount"
              icon="plus"
              style={{ marginTop: '20px' }}
              theme="primary"
              onClick={() => this.toggleBox('isCreateNewPortalAccount')}
            />
          ),
      },
    ]);
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curWizardData = $$myScreenStore.get('customProps');
    const $$curPortalAccount = portalAccountOptions.setIn([0, 'options'], this.state.portalLoginName);
    return (
      <div className="o-box__cell">
        <div>
          <FormContainer
            id="portalAccountChoice"
            className="o-form--compassed"
            options={$$curPortalAccount}
            data={$$curWizardData}
            onChangeData={(data) => {
              this.props.updateScreenCustomProps(data);
            }}
            onSave={() => this.onSave('portalAccountChoice')}
            invalidMsg={app.get('invalid')}
            validateAt={app.get('validateAt')}
            onValidError={this.props.reportValidError}
            isSaving={app.get('saving')}
          />
          {
            this.state.isCreateNewPortalAccount ? (
              <FormContainer
                id="newPortalAccount"
                className="o-form--compassed"
                options={baseSetting}
                data={$$curWizardData}
                onChangeData={(data) => {
                  this.props.updateScreenCustomProps(data);
                }}
                onSave={() => this.onSave('newPortalAccount')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
                isSaving={app.get('saving')}
                hasSaveButton
              />
            ) : null
          }
        </div>
      </div>
    );
  }

  // 为上一步选择的账户充值
  renderChargeForAccount() {
    const rechargeOptions = fromJS([
      {
        id: 'loginName',
        label: __('Login Name'),
        form: 'recharge',
        type: 'select',
        disabled: true,
        required: true,
      },
      {
        id: 'name',
        label: __('Recharge Choices'),
        form: 'recharge',
        required: true,
        type: 'select',
        appendRender: () => (
            <Button
              type="button"
              text={__('New')}
              key="addCardCategory"
              icon="plus"
              style={{ marginTop: '20px' }}
              theme="primary"
              onClick={() => this.toggleBox('isCreateCardCategory')}
            />
          ),
      },
    ]);
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curWizardData = $$myScreenStore.get('customProps');
    const $$curRechargeOptions = rechargeOptions
      .setIn([0, 'options'], this.state.portalLoginName)
      .setIn([1, 'options'], this.state.categoryTypeOptions);
    return (
      <div className="o-box__cell">
        <div>
          <FormContainer
            id="rechargeForm"
            className="o-form--compassed"
            options={$$curRechargeOptions}
            data={$$curWizardData}
            onChangeData={(data) => {
              this.props.updateScreenCustomProps(data);
            }}
            onSave={() => this.onSave('rechargeForm')}
            invalidMsg={app.get('invalid')}
            validateAt={app.get('validateAt')}
            onValidError={this.props.reportValidError}
            isSaving={app.get('saving')}
          />
          {
            this.state.isCreateCardCategory ? (
              <FormContainer
                id="createCardCategory"
                className="o-form--compassed"
                options={cardCategoryOptions}
                data={$$curWizardData}
                onChangeData={(data) => {
                  this.props.updateScreenCustomProps(data);
                }}
                onSave={() => this.onSave('createCardCategory')}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                onValidError={this.props.reportValidError}
                isSaving={app.get('saving')}
                hasSaveButton
              />
            ) : null
          }
        </div>
      </div>
    );
  }

  renderActionBar() {
    return (
      <Button
        text={__('Link From Other Group')}
        key="cpoyActionButton"
        icon="link"
        theme="primary"
        onClick={() => this.onOpenCopySsidModal()}
      />
    );
  }

  renderCustomModal() {
    const { store, app, route } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$myScreenStore = store.get(myScreenId);
    const $$curListItem = store.getIn([myScreenId, 'curListItem']);
    const $$group = this.props.group;
    const selectGroupId = $$group.getIn(['selected', 'id']);
    const copyFromGroupId = $$myScreenStore.getIn(['actionQuery', 'copyFromGroupId']);
    const actionQuery = store.getIn([route.id, 'actionQuery']) || Map({});
    const isCopySsid = actionQuery.get('action') === 'copy';
    if (!isCopySsid) {
      return null;
    }
    return (
      <div className="row">
        <div className="o-list cols col-4">
          <h3 className="o-list__header">{__('Group List')}</h3>
          <ul className="m-menu m-menu--open">
            {
              $$group.getIn(['list']).map((item) => {
                const curId = item.get('id');
                let classNames = 'm-menu__link';

                // 不能选择自己组
                if (curId === selectGroupId) {
                  return null;
                }

                if (curId === copyFromGroupId) {
                  classNames = `${classNames} active`;
                }

                return (
                  <li key={curId}>
                    <a
                      className={classNames}
                      onClick={
                        e => this.onSelectCopyFromGroup(curId, e)
                      }
                    >
                      {item.get('groupname')}
                    </a>
                  </li>
                );
              })
            }
          </ul>

        </div>
        <div className="o-list cols col-8">
          <h3 className="o-list__header">{__('Group SSID List')}</h3>
          <Table
            options={[
              {
                id: 'ssid',
                text: __('SSID'),
              }, {
                id: 'hiddenSsid',
                text: __('Hide SSID'),
                options: [
                  {
                    value: '1',
                    label: __('YES'),
                    render() {
                      return (
                        <span
                          style={{
                            color: 'red',
                          }}
                        >
                          {__('YES')}
                        </span>
                      );
                    },
                  }, {
                    value: '0',
                    label: __('NO'),
                    render() {
                      return (
                        <span
                          style={{
                            color: 'green',
                          }}
                        >
                          {__('NO')}
                        </span>
                      );
                    },
                  },
                ],
                defaultValue: '0',
              }, {
                id: 'storeForwardPattern',
                options: storeForwardOption,
                text: __('Forward Pattern'),
                defaultValue: 'local',
              }, {
                id: 'encryption',
                text: __('Encryption'),
                defaultValue: 'psk-mixed',
              },
            ]}
            list={$$myScreenStore.getIn(['data', 'copyGroupSsids', 'list'])}
            psge={$$myScreenStore.getIn(['data', 'copyGroupSsids', 'page'])}
            onRowSelect={this.onSelectCopySsid}
            selectable
          />
          <div className="o-list__footer">
            <SaveButton
              type="button"
              text={__('Apply')}
              savingText={__('Applying')}
              savedText={__('Applied')}
              className="fr"
              loading={app.get('saving')}
              onClick={() => this.onSave('copy')}
            />
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { store, route } = this.props;
    const actionQuery = store.getIn([route.id, 'actionQuery']) || Map({});
    const isCopySsid = actionQuery.get('action') === 'copy';
    const myScreenId = store.get('curScreenId');
    const $$curListItem = store.getIn([myScreenId, 'curListItem']);
    const $$curWizardItem = store.getIn([myScreenId, 'customProps']);
    const wizardOptions = this.getWizardOptions($$curListItem, $$curWizardItem);
    return (
      <AppScreen
        {...this.props}
        listOptions={this.listOptions}
        listKey="allKeys"
        actionBarChildren={this.renderActionBar()}
        initOption={{
          actionQuery: {
            copyFromGroupId: -100,
          },
          customProps: {
            serverType: 'remote',
          },
        }}
        modalSize={isCopySsid ? 'lg' : 'md'}
        modalChildren={this.renderCustomModal()}
        actionable
        selectable
      >
        <Modal
          id="AppScreenListModal"
          isShow={this.state.customModal}
          title="Creat new AAA template"
          onClose={() => {
            this.setState({
              customModal: false,
            });
          }}
          size="lg"
          customBackdrop
          noFooter
        >
          <WizardContainer
            options={wizardOptions}
            onBeforeStep={this.onBeforeStep}
            onCompleted={this.onComplete}
            size="sm"
            initStep={0}
          />
        </Modal>
      </AppScreen>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    group: state.product.get('group'),
    groupid: state.product.getIn(['group', 'selected', 'id']),
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
    productActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(View);
