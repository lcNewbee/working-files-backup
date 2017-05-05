import { fromJS } from 'immutable';
import validator from 'shared/validator';

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
    fieldset: 'auth',
    fieldsetOption: {
      legend: __('Primary Auth Server'),
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
    fieldset: 'auth',
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
    fieldset: 'auth',
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
      legend: __('Secondary Auth Server'),
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
