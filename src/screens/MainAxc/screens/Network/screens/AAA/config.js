import { fromJS } from 'immutable';
import validator from 'shared/validator';
import utils, { immutableUtils } from 'shared/utils';

// Radius
export const $$radiusServerChoices = fromJS([
  {
    id: 'serverType',
    label: __('Server Type'),
    className: 'cols',
    defaultValue: 'remote',
    inputStyle: {
      display: 'block',
      minWidth: '240px',
    },
    options: [
      {
        value: 'remote',
        label: __('Remote Server'),
      }, {
        value: 'local',
        label: __('Local Server'),
      },
    ],
    type: 'switch',
  },
]);

export const $$radiusAuthServer = fromJS([
  // {
  //   id: 'template_name',
  //   label: __('Name'),
  //   form: 'authServer',
  //   type: 'text',
  //   maxLength: '31',
  //   required: true,
  //   className: 'cols col-12',
  //   notEditable: true,
  //   validator: validator({
  //     rules: 'utf8Len:[1,31]',
  //   }),
  // },
  {
    id: 'nasip',
    label: __('NAS IP'),
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
    label: __('NAS IP'),
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
        acctpri_ipaddr: item.ip,
        acctpri_port: '1813',
        acctpri_key: item.sharedSecret,
        acctsecond_ipaddr: item.ip,
        acctsecond_port: '1813',
        acctsecond_key: item.sharedSecret,
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

export const $$radiusAccServer = fromJS([
  {
    id: 'acctpri_ipaddr',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('IP Address'),
    fieldset: 'primary',
    fieldsetOption: {
      legend: __('Primary Accounting Server'),
      className: 'cols col-6',
    },
    required: true,
    type: 'text',
    form: 'accServer',
    validator: validator({
      rules: 'ip',
    }),
  },
  {
    id: 'acctpri_port',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Port'),
    fieldset: 'primary',
    required: true,
    defaultValue: '1813',
    type: 'number',
    form: 'accServer',
    min: '1',
    max: '65535',
  }, {
    id: 'acctpri_key',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    required: true,
    label: __('Password'),
    fieldset: 'primary',
    form: 'accServer',
    type: 'password',
    maxLength: '31',
    validator: validator({
      rules: 'pwd',
    }),
  }, {
    id: 'acctsecond_ipaddr',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('IP Address'),
    fieldsetOption: {
      legend: __('Secondary Accounting Server'),
      className: 'cols col-6',
    },
    fieldset: 'secondary',
    type: 'text',
    form: 'accServer',
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'acctsecond_port',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Port'),
    fieldset: 'secondary',
    type: 'number',
    form: 'accServer',
    min: '1',
    max: '65535',
  }, {
    id: 'acctsecond_key',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Password'),
    fieldset: 'secondary',
    form: 'accServer',
    type: 'password',
    maxLength: '31',
    validator: validator({
      rules: 'pwd',
    }),
  },
]);

export const $$radiusAdvancedSetting = fromJS([
  {
    id: 'username_format',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('User Format'),
    fieldset: 'parameter',
    defaultValue: 'UNCHANGE',
    noTable: true,
    type: 'select',
    className: 'cols col-6',
    required: true,
    placeholder: __('Please Select ') + __('User Format'),
    options: [
      {
        value: 'UNCHANGE',
        label: 'KEEP_ORIGINAL',
      }, {
        value: 'WITH',
        label: 'WITH_DOMAN',
      }, {
        value: 'WITHOUT',
        label: 'WITHOUT_DOMAIN',
      },
    ],
  }, {
    id: 'quiet_time',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Silent Time'),
    className: 'cols col-6',
    fieldset: 'parameter',
    defaultValue: '300',
    min: '60',
    max: '7200',
    noTable: true,
    type: 'number',
    required: true,
    help: __('Seconds'),
  }, {
    id: 'retry_times',
    className: 'cols col-6',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Max Messaging Times'),
    fieldset: 'parameter',
    type: 'number',
    defaultValue: '3',
    min: '1',
    max: '10',
    required: true,
  }, {
    id: 'resp_time',
    className: 'cols col-6',
    label: __('Response Timeout Time'),
    fieldset: 'parameter',
    type: 'number',
    defaultValue: '3',
    min: '1',
    max: '30',
    required: true,
    help: __('Seconds'),
  },
  {
    id: 'accton_enable',
    className: 'cols col-6',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting-on'),
    defaultValue: '0',
    value: '1',
    fieldset: 'parameter',
    required: true,
    noTable: true,
    noForm: true,
    type: 'checkbox',
    text: __('Enable'),
  }, {
    id: 'accton_sendtimes',
    className: 'cols col-6',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting-on Resend Times'),
    fieldset: 'acctonAdvance',
    type: 'number',
    defaultValue: '3',
    min: '1',
    max: '10',
    required: true,
    noForm: true,
    noTable: true,
    visible(data) {
      return data.get('accton_enable') === '1';
    },
  }, {
    id: 'accton_sendinterval',
    className: 'cols col-6',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting-on Resend Interval'),
    fieldset: 'acctonAdvance',
    noTable: true,
    noForm: true,
    type: 'number',
    required: true,
    help: __('Seconds'),
    defaultValue: '3',
    min: '1',
    max: '30',
    visible(data) {
      return data.get('accton_enable') === '1';
    },
  },
  {
    id: 'acct_interim_interval',
    className: 'cols col-6',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting Messaging Interval'),
    fieldset: 'acctonAdvance',
    noTable: true,
    required: true,
    type: 'number',
    help: __('Seconds'),
    defaultValue: '720',
    min: '300',
    max: '3600',
  }, {
    id: 'realretrytimes',
    className: 'cols col-6',
    disabled: (data) => {
      if (data.get('serverType') === 'local') {
        return true;
      }
      return false;
    },
    label: __('Accounting Message-Resend Times'),
    fieldset: 'acctonAdvance',
    type: 'number',
    required: true,
    defaultValue: '5',
    min: '1',
    max: '10',
  },
]);

export const radiusDefaultData = utils.extend(
  {},
  immutableUtils.getDefaultData($$radiusAuthServer),
  immutableUtils.getDefaultData($$radiusAccServer),
  immutableUtils.getDefaultData($$radiusAdvancedSetting),
);

// Portal
export const MSG = {
  Seconds: __('Seconds'),
  minutes: __('Minutes'),
  hour: __('Hour'),
  hours: __('Hours'),
  days: __('Days'),
  userDef: __('User Defined'),
  imageDes: __('Select 1-3 slide pictures of dimension 640px*640px'),
};
export const refreshtimeOtions = [
  {
    value: '2',
    label: `2 ${MSG.Seconds}`,
  }, {
    value: '3',
    label: `3 ${MSG.Seconds}`,
  }, {
    value: '5',
    label: `5 ${MSG.Seconds}`,
    default: true,
  }, {
    value: '10',
    label: `10 ${MSG.Seconds}`,
  }, {
    value: '20',
    label: `20 ${MSG.Seconds}`,
  },
];

// minutes
export const expirationOptions = [
  {
    value: '600',
    label: `10 ${MSG.minutes}`,
  }, {
    value: '1200',
    label: `20 ${MSG.minutes}`,
  }, {
    value: '1800',
    label: `30 ${MSG.minutes}`,
  }, {
    value: '3600',
    label: `1 ${MSG.hour}`,
  }, {
    value: '14400',
    label: `4 ${MSG.hours}`,
  }, {
    value: '28800',
    label: `8 ${MSG.hours}`,
  }, {
    value: '86400',
    label: `24 ${MSG.hours}`,
  }, {
    value: '172800',
    label: `2 ${MSG.days}`,
  }, {
    value: '259200',
    label: `3 ${MSG.days}`,
  }, {
    value: '432000',
    label: `5 ${MSG.days}`,
  }, {
    value: '604800',
    label: `7 ${MSG.days}`,
  }, {
    value: '1296000',
    label: `15 ${MSG.days}`,
  }, {
    value: '2592000',
    label: `30 ${MSG.days}`,
  },
];
export const $$potalServerOptions = fromJS([
  // {
  //   id: 'template_name',
  //   label: __('Server Name'),
  //   noForm: true,
  //   formProps: {
  //     type: 'text',
  //     maxLength: '31',
  //     notEditable: true,
  //     noForm: true,
  //     required: true,
  //     validator: validator({
  //       rules: 'utf8Len:[1,31]',
  //     }),
  //   },
  // },
  {
    id: 'server_ipaddr',
    label: __('Server IP'),
    fieldset: 'Authentication',
    fieldsetOption: {
      legend: ' ',
      className: 'cols col-6',
    },
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
      // visible(data) {
      //   return data.get('address_type') === '1';
      // },
    },
  },
  {
    id: 'server_port',
    label: __('Server Port'),
    fieldset: 'Authentication',
    formProps: {
      type: 'number',
      min: '1',
      max: '65535',
      required: true,
    },
  }, {
    id: 'server_key',
    label: __('Shared Key'),
    fieldset: 'Authentication',
    noTable: true,
    formProps: {
      type: 'password',
      maxLength: '31',
      required: true,
      validator: validator({
        rules: 'pwd',
      }),
    },
  }, {
    id: 'server_url',
    label: __('Redirect URL'),
    fieldset: 'other',
    fieldsetOption: {
      legend: ' ',
      className: 'cols col-6',
    },
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ac_ip',
    label: __('AC IP'),
    fieldset: 'other',
    formProps: {
      type: 'text',
      required: true,
      validator: validator({
        rules: 'ip',
      }),
    },
  },
]);

export const $$potalServerFormOptions = immutableUtils.getFormOptions($$potalServerOptions);
export const potalServerDefaultSettingData = immutableUtils.getDefaultData($$potalServerOptions);

// Portal Rules
export const $$potalRuleOptions = fromJS([
  {
    id: 'interface_bind',
    label: __('Port'),
    defaultValue: '',
    formProps: {
      type: 'switch',
      inputStyle: {
        display: 'block',
      },
    },
  },
  {
    id: 'template_name',
    label: __('Server Name'),
    defaultValue: 'local',
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
      required: true,
      notEditable: true,
      visible: $$data => $$data.getIn(['interface_bind']),
    },
  },
  {
    id: 'max_usernum',
    label: __('Max Users'),
    defaultValue: '4096',
    formProps: {
      type: 'number',
      min: '5',
      max: '4096',
      visible: $$data => $$data.getIn(['interface_bind']),
    },
  }, {
    id: 'auth_mode',
    label: __('Authentication Type'),
    defaultValue: '1',
    options: [
      {
        value: '1',
        label: __('Direct'),
      },
      {
        value: '2',
        label: __('Layer3'),
      },
    ],
    formProps: {
      type: 'switch',
      inputStyle: {
        width: '200px',
      },
      visible: $$data => $$data.getIn(['interface_bind']),
    },
  }, {
    id: 'auth_ip',
    label: __('Authentication IP'),
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'ip',
      }),
      required: true,
      visible($$data) {
        return $$data.getIn(['interface_bind']) && $$data.get('auth_mode') === '2';
      },
    },
  }, {
    id: 'auth_mask',
    label: __('Authentication Subnet Mask'),
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'mask',
      }),
      required: true,
      visible($$data) {
        return $$data.getIn(['interface_bind']) && $$data.get('auth_mode') === '2';
      },
    },
  },
  {
    id: 'idle_test',
    label: __('Auto Re-login'),
    defaultValue: '0',
    formProps: {
      type: 'checkbox',
      value: '1',
      visible: $$data => $$data.getIn(['interface_bind']),
    },
  },
]);

export const $$potalRuleFormOptions = immutableUtils.getFormOptions($$potalRuleOptions);
export const potalRuleDefaultSettingData = immutableUtils.getDefaultData($$potalRuleOptions);

// Portal template
export const $$portalTemplateOptions = fromJS([
  // {
  //   id: 'name',
  //   text: _('Name'),
  //   formProps: {
  //     maxLength: '129',
  //     type: 'text',
  //     validator: validator({
  //       rules: 'utf8Len:[1, 128]',
  //     }),
  //   },
  // },
  {
    id: 'ip',
    text: _('IP'),
    noTable: true,
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'address',
    text: _('Address'),
    noTable: true,
    noForm: true,
    formProps: {
      type: 'text',
      maxLength: '256',
      validator: validator({
        rules: 'utf8Len:[1, 255]',
      }),
    },
  }, {
    id: 'basip',
    text: _('BAS'),
    noTable: true,
    noForm: true,
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'ip',
      }),
    },
  },
  {
    id: 'ssid',
    text: _('SSID'),
    options: [
      {
        value: '',
        label: __('ALL'),
      },
    ],
    formProps: {
      type: 'select',
      maxLength: '129',
      defaultValue: '',
      validator: validator({
        rules: 'utf8Len:[1, 128]',
      }),
    },
  },
  {
    id: 'apmac',
    text: _('Access Point MAC Address'),
    options: [
      {
        value: '',
        label: __('ALL'),
      },
    ],
    formProps: {
      defaultValue: '',
      type: 'select',
    },
  },
  {
    id: 'web',
    text: _('Web Template'),
    formProps: {
      type: 'select',
      defaultValue: '6',
      required: true,
      visible: $$data => $$data.get('apmac') || $$data.get('ssid'),
    },
  },
  {
    id: 'des',
    text: _('Description'),
    noTable: true,
    formProps: {
      type: 'textarea',
      maxLength: '257',
      validator: validator({
        rules: 'utf8Len:[1, 256]',
      }),
    },
  }, {
    id: 'x',
    text: _('x'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
    },
  }, {
    id: 'y',
    text: _('y'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',

    },
  }, {
    id: 'apid',
    text: _('AP ID'),
    noForm: true,
    noTable: true,
    formProps: {
      type: 'select',
    },
  },
]);

export const $$portalTemplateFormOptions = immutableUtils.getFormOptions($$portalTemplateOptions);
export const portalTemplateDefaultSettingData =
    immutableUtils.getDefaultData($$portalTemplateOptions);


