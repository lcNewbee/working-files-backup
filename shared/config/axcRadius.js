import { fromJS } from 'immutable';

export const radiusName = fromJS([
  // {
  //   id: 'template_name',
  //   label: _('Name'),
  //   form: 'radius',
  //   type: 'text',
  //   maxLength: '32',
  //   required: true,
  // },
]);
export const authServer = fromJS([
  {
    id: 'template_name',
    label: _('Name'),
    form: 'authServer',
    type: 'text',
    maxLength: '32',
    required: true,
    className: 'cols col-12',
    defaultValue: '',
  }, {
    id: 'authpri_ipaddr',
    fieldset: 'auth',
    fieldsetOption: {
      legend: _('Primary Auth Server'),
      className: 'cols col-6',
    },
    form: 'authServer',
    label: _('Auth IP'),
    type: 'text',
    required: true,
  }, {
    id: 'authpri_port',
    label: _('Auth Port'),
    fieldset: 'auth',
    form: 'authServer',
    defaultValue: '1812',
    type: 'number',
    required: true,
  }, {
    id: 'authpri_key',
    label: _('Auth Password'),
    fieldset: 'auth',
    form: 'authServer',
    type: 'password',
    required: true,
  }, {
    id: 'authsecond_ipaddr',
    label: _('Auth IP'),
    fieldset: 'auth_secondary',
    fieldsetOption: {
      legend: _('Secondary Auth Server'),
      className: 'cols col-6',
    },
    type: 'text',
    form: 'authServer',
  }, {
    id: 'authsecond_port',
    label: _('Auth Port'),
    fieldset: 'auth_secondary',
    type: 'number',
    form: 'authServer',
  }, {
    id: 'authsecond_key',
    label: _('Auth Password'),
    fieldset: 'auth_secondary',
    type: 'password',
    form: 'authServer',
  },
]);

export const accServer = fromJS([
  {
    id: 'acctpri_ipaddr',
    label: _('Primary Acc IP'),
    fieldset: 'primary',
    fieldsetOption: {
      legend: _('Primary Accounting Server'),
      className: 'cols col-6',
    },
    type: 'text',
    form: 'accServer',
  }, {
    id: 'acctpri_port',
    label: _('Primary Acc Port'),
    fieldset: 'primary',
    defaultValue: '1813',
    type: 'number',
    form: 'accServer',
  }, {
    id: 'acctpri_key',
    label: _('Primary Acc Password'),
    fieldset: 'primary',
    form: 'accServer',
    type: 'password',
  }, {
    id: 'acctsecond_ipaddr',
    label: _('Secondary Acc IP'),
    fieldsetOption: {
      legend: _('Secondary Accounting Server'),
      className: 'cols col-6',
    },
    fieldset: 'secondary',
    type: 'text',
    form: 'accServer',
  }, {
    id: 'acctsecond_port',
    label: _('Secondary Acc Port'),
    fieldset: 'secondary',
    type: 'number',
    form: 'accServer',
  }, {
    id: 'acctsecond_key',
    label: _('Secondary Acc Password'),
    fieldset: 'secondary',
    form: 'accServer',
    type: 'password',
  },
]);

export const advancedSetting = fromJS([
  {
    id: 'username_format',
    label: _('User Format'),
    fieldset: 'parameter',
    defaultValue: 'WITH',
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
    defaultValue: '1',
    type: 'number',
    help: _('Minute'),
  }, {
    id: 'retry_times',
    label: _('Max Messaging Times'),
    fieldset: 'parameter',
    defaultValue: '1',
    type: 'number',
  }, {
    id: 'resp_time',
    label: _('Response Timeout Time'),
    fieldset: 'parameter',
    defaultValue: '1',
    type: 'number',
    help: _('Seconds'),

  }, {
    id: 'accton_enable',
    label: _('Accounting-on'),
    fieldset: 'parameter',
    defaultValue: '0',
    type: 'checkbox',
    text: _('Enable'),
  }, {
    id: 'nasip',
    label: _('Nas IP'),
    fieldset: 'parameter',
    type: 'text',
  }, {
    id: 'accton_sendinterval',
    label: _('Accounting-on Resend Interval'),
    fieldset: 'parameter',
    defaultValue: '1',
    type: 'number',
    help: _('Seconds'),
  }, {
    id: 'acct_interim_interval',
    label: _('Accounting Messaging Interval'),
    fieldset: 'parameter',
    defaultValue: '1',
    type: 'number',
    help: _('Minute'),
  }, {
    id: 'accton_sendtimes',
    label: _('Accounting-on Resend Times'),
    fieldset: 'parameter',
    defaultValue: '1',
    type: 'number',
  }, {
    id: 'realretrytimes',
    label: _('Accounting Message-Resend Times'),
    fieldset: 'parameter',
    defaultValue: '1',
    type: 'number',
  },
]);

