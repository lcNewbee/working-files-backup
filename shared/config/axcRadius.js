import { fromJS } from 'immutable';
import validator from 'shared/utils/lib/validator';

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
    notEditable: true,
    validator: validator({
      rules: 'len[1,32]',
    }),
  }, {
    id: 'nasip',
    label: _('Nas IP'),
    form: 'authServer',
    type: 'text',
    maxLength: '15',
    required: true,
    className: 'cols col-12',
    validator: validator({
      rules: 'ip',
    }),
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
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'authpri_port',
    label: _('Auth Port'),
    fieldset: 'auth',
    form: 'authServer',
    required: true,
    defaultValue: '1812',
    type: 'number',
    min: 1,
    max: 65535,
  }, {
    id: 'authpri_key',
    label: _('Auth Password'),
    fieldset: 'auth',
    form: 'authServer',
    type: 'password',
    required: true,
    maxLength: '32',
    validator: validator({
      rules: 'pwd',
    }),
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
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'authsecond_port',
    label: _('Auth Port'),
    fieldset: 'auth_secondary',
    type: 'number',
    form: 'authServer',
    min: 1,
    max: 65535,
  }, {
    id: 'authsecond_key',
    label: _('Auth Password'),
    fieldset: 'auth_secondary',
    type: 'password',
    form: 'authServer',
    maxLength: '32',
    validator: validator({
      rules: 'pwd',
    }),
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
    required: true,
    type: 'text',
    form: 'accServer',
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'acctpri_port',
    label: _('Primary Acc Port'),
    fieldset: 'primary',
    required: true,
    defaultValue: '1813',
    type: 'number',
    form: 'accServer',
  }, {
    id: 'acctpri_key',
    required: true,
    label: _('Primary Acc Password'),
    fieldset: 'primary',
    form: 'accServer',
    type: 'password',
    maxLength: '32',
    validator: validator({
      rules: 'pwd',
    }),
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
    validator: validator({
      rules: 'ip',
    }),
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
    maxLength: '32',
    validator: validator({
      rules: 'pwd',
    }),
  },
]);

export const advancedSetting = fromJS([
  {
    id: 'username_format',
    label: _('User Format'),
    fieldset: 'parameter',
    defaultValue: 'WITH',
    noTable: true,
    type: 'select',
    required: true,
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
    defaultValue: '300',
    min: 60,
    max: 7200,
    noTable: true,
    type: 'number',
    required: true,
    help: _('Seconds'),
  }, {
    id: 'retry_times',
    label: _('Max Messaging Times'),
    fieldset: 'parameter',
    type: 'number',
    defaultValue: '3',
    min: 3,
    max: 10,
    required: true,
  }, {
    id: 'resp_time',
    label: _('Response Timeout Time'),
    fieldset: 'parameter',
    type: 'number',
    defaultValue: '3',
    min: 3,
    max: 30,
    required: true,
    help: _('Seconds'),
  }, {
    id: 'accton_enable',
    label: _('Accounting-on'),
    defaultValue: '0',
    value: '1',
    fieldset: 'parameter',
    required: true,
    noTable: true,
    type: 'checkbox',
    text: _('Enable'),
  }, {
    id: 'accton_sendtimes',
    label: _('Accounting-on Resend Times'),
    fieldset: 'parameter',
    type: 'number',
    required: true,
    defaultValue: '5',
    min: 3,
    max: 10,
  }, {
    id: 'accton_sendinterval',
    label: _('Accounting-on Resend Interval'),
    fieldset: 'acctonAdvance',
    noTable: true,
    type: 'number',
    required: true,
    help: _('Seconds'),
    defaultValue: '3',
    min: 3,
    max: 30,
  }, {
    id: 'nasip',
    label: _('Nas IP'),
    fieldset: 'parameter',
    type: 'text',
    required: true,
    validator: validator({
      rules: 'ip',
    }),
  }, {
    id: 'acct_interim_interval',
    label: _('Accounting Messaging Interval'),
    fieldset: 'acctonAdvance',
    noTable: true,
    required: true,
    type: 'number',
    help: _('Seconds'),
    defaultValue: '720',
    min: 300,
    max: 3600,
  }, {
    id: 'accton_sendtimes',
    label: _('Accounting-on Resend Times'),
    fieldset: 'acctonAdvance',
    type: 'number',
    defaultValue: '3',
    min: 3,
    max: 10,
  }, {
    id: 'realretrytimes',
    label: _('Accounting Message-Resend Times'),
    fieldset: 'acctonAdvance',
    type: 'number',
    required: true,
    defaultValue: '5',
    min: 3,
    max: 10,
  },
]);

