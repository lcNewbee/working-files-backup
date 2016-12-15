import { fromJS } from 'immutable';

export const radiusName = fromJS([
  {
    id: 'template_name',
    label: _('Name'),
    type: 'text',
    maxLength: '32',
    required: true,
  },
]);
export const authServer = fromJS([
  {
    id: 'authpri_ipaddr',
    label: _('Primary Auth IP'),
    fieldset: 'auth',
    legend: _('Primary Auth Server Settings'),
    defaultValue: '0',
    type: 'text',
  }, {
    id: 'authpri_port',
    label: _('Primary Auth Port'),
    fieldset: 'auth',
    defaultValue: '0',
    type: 'number',
  }, {
    id: 'authpri_key',
    label: _('Primary Auth Password'),
    fieldset: 'auth',
    defaultValue: '0',
    noTable: true,
    type: 'password',
  }, {
    id: 'authsecond_ipaddr',
    label: _('Secondary Auth IP'),
    legend: _('Secondary Auth Server Settings'),
    fieldset: 'auth_secondary',
    type: 'text',
  }, {
    id: 'authsecond_port',
    label: _('Secondary Auth Port'),
    fieldset: 'auth_secondary',
    type: 'number',
  }, {
    id: 'authsecond_key',
    label: _('Secondary Auth Password'),
    fieldset: 'auth_secondary',
    noTable: true,
    type: 'password',
  },
]);

export const accServer = fromJS([
  {
    id: 'acctpri_ipaddr',
    label: _('Primary Acc IP'),
    fieldset: 'Accounting',
    legend: _('Accounting Server Settings'),
    defaultValue: '0',
    type: 'text',
  }, {
    id: 'acctpri_port',
    label: _('Primary Acc Port'),
    fieldset: 'Accounting',
    defaultValue: '0',
    type: 'number',
  }, {
    id: 'acctpri_key',
    label: _('Primary Acc Password'),
    fieldset: 'Accounting',
    defaultValue: '0',
    noTable: true,
    type: 'password',
  }, {
    id: 'acctsecond_ipaddr',
    label: _('Secondary Acc IP'),
    fieldset: 'Accounting',
    type: 'text',
  }, {
    id: 'acctsecond_port',
    label: _('Secondary Acc Port'),
    fieldset: 'Accounting',
    type: 'number',
  }, {
    id: 'acctsecond_key',
    label: _('Secondary Acc Password'),
    fieldset: 'Accounting',
    noTable: true,
    type: 'password',
  },
]);

export const advancedSetting = fromJS([
  {
    id: 'username_format',
    label: _('User Format'),
    fieldset: 'parameter',
    legend: _('Advanced Settings'),
    defaultValue: 'WITH',
    noTable: true,
    type: 'select',
    placeholder: _('Please Select ') + _('User Format'),
    options: [
      {
        value: 'WITHOUT',
        label: 'WITHOUT_DOMAIN',
      }, {
        value: 'WITH',
        label: 'WITH_DOMAN',
      }, {
        value: 'UNCHANGE',
        label: 'KEEP_ORIGINAL',
      },
    ],
  }, {
    id: 'quiet_time',
    label: _('Silent Time'),
    fieldset: 'parameter',
    defaultValue: '0',
    noTable: true,
    type: 'number',
    help: _('Minute'),
  }, {
    id: 'retry_times',
    label: _('Max Messaging Times'),
    fieldset: 'parameter',
    noTable: true,
    type: 'number',
  }, {
    id: 'resp_time',
    label: _('Response Timeout Time'),
    fieldset: 'parameter',
    noTable: true,
    type: 'number',
    help: _('Seconds'),

  }, {
    id: 'accton_enable',
    label: _('Accounting-on'),
    fieldset: 'parameter',
    defaultValue: '0',
    noTable: true,
    type: 'checkbox',
    text: _('Enable'),
  }, {
    id: 'nasip',
    label: _('Nas IP'),
    fieldset: 'parameter',
    noTable: true,
    type: 'text',
  }, {
    id: 'accton_sendinterval',
    label: _('Accounting-on Resend Interval'),
    fieldset: 'parameter',
    defaultValue: '0',
    noTable: true,
    type: 'number',
    help: _('Seconds'),
  }, {
    id: 'acct_interim_interval',
    label: _('Accounting Messaging Interval'),
    fieldset: 'parameter',
    defaultValue: '0',
    noTable: true,
    type: 'number',
    help: _('Minute'),
  }, {
    id: 'accton_sendtimes',
    label: _('Accounting-on Resend Times'),
    fieldset: 'parameter',
    noTable: true,
    type: 'number',
  }, {
    id: 'realretrytimes',
    label: _('Accounting Message-Resend Times'),
    fieldset: 'parameter',
    noTable: true,
    type: 'number',
  },
]);

