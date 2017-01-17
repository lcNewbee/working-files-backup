import { fromJS } from 'immutable';
import validator from 'shared/utils/lib/validator';

export const baseSetting = fromJS([
  {
    id: 'loginName',
    label: _('Login Name'),
    className: 'cols col-12',
    type: 'text',
    required: true,
    maxLength: '32',
  }, {
    id: 'date',
    label: _('Expired Date'),
    noForm: true,
    className: 'cols col-6',
    type: 'text',
    required: true,

  }, {
    id: 'time',
    label: _('Left Time'),
    className: 'cols col-6',
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'octets',
    label: _('Left Traffic'),
    className: 'cols col-6',
    noForm: true,
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'password',
    label: _('Password'),
    className: 'cols col-6',
    type: 'pwd',
    noTable: true,
    formProps: {
      required: true,
    },
  }, {
    id: 'maclimit',
    label: _('Mac Limit'),
    className: 'cols col-6',
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Mac Limit'),
      placeholder: _('Please Select ') + _('Mac Limit'),
    },
  }, {
    id: 'maclimitcount',
    label: _('Mac Quantity'),
    className: 'cols col-6',
    formProps: {
      type: 'num',
      min: '0',
      required: true,
    },
  }, {
    id: 'autologin',
    label: _('Auto Login'),
    className: 'cols col-6',
    options: [
      {
        value: '0',
        label: _('Closed'),
      }, {
        value: '1',
        label: _('Open'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Auto Login'),
      placeholder: _('Auto Login') + _('Auto Login'),
    },
  }, {
    id: 'speed',
    className: 'cols col-6',
    label: _('Speed Limit'),
    options: [
      {
        value: '0',
        label: _('1M'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      required: true,
      label: _('Speed Limit'),
      placeholder: _('Please Select ') + _('Speed Limit'),
    },
  }, {
    id: 'ex4',
    label: _('Last Unbind Month'),
    className: 'cols col-6',
    formProps: {
      type: 'text',
      required: true,
    },
  }, {
    id: 'ex3',
    label: _('Unbind Times'),
    className: 'cols col-6',
    formProps: {
      type: 'num',
      min: '0',
      required: true,
    },
  },
]);

export const advancedSetting = fromJS([
  {
    id: 'name',
    label: _('Name'),
    noTable: true,
    className: 'cols col-6',
    formProps: {
      type: 'text',
      maxLength: '32',
    },
  }, {
    id: 'gender',
    label: _('Gender'),
    className: 'cols col-6',
    noTable: true,
    options: [
      {
        value: '0',
        label: _('Male'),
      }, {
        value: '1',
        label: _('Female'),
      },
    ],
    defaultValue: '0',
    formProps: {
      type: 'select',
      label: _('Gender'),
      placeholder: _('Please Select ') + _('Gender'),
    },
  }, {
    id: 'idnumber',
    label: _('ID No.'),
    noTable: true,
    formProps: {
      type: 'num',
      className: 'cols col-6',
    },
  }, {
    id: 'phoneNumber',
    label: _('Phone'),
    noTable: true,
    className: 'cols col-6',
    formProps: {
      type: 'num',
    },
  }, {
    id: 'address',
    label: _('Address'),
    className: 'cols col-6',
    noTable: true,
    formProps: {
      type: 'text',
    },
  }, {
    id: 'email',
    label: _('Email'),
    noTable: true,
    formProps: {
      type: 'text',
      validator: validator({
        rules: 'email',
      }),
    },
  }, {
    id: 'description',
    label: _('Detail Information'),
    className: 'cols col-6',
    noTable: true,
    formProps: {
      type: 'text',
    },
  },
]);
