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
    id: 'password',
    label: _('Password'),
    className: 'cols col-6',
    type: 'password',
    noTable: true,
    required: true,
  }, {
    id: 'ex1',
    label: _('Question'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
  }, {
    id: 'ex2',
    label: _('Answer'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
  }, {
    id: 'type',
    label: _('Type'),
    className: 'cols col-6',
    options: [
      {
        value: '0',
        label: _('Unavailability'),
      }, {
        value: '1',
        label: _('Timekeeping'),
      }, {
        value: '2',
        label: _('Buy Out'),
      }, {
        value: '3',
        label: _('Traffic'),
      },
    ],
    defaultValue: '0',
    type: 'select',
    required: true,
    placeholder: _('Please Select ') + _('Type'),

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
    type: 'select',
    required: true,
    placeholder: _('Please Select ') + _('Mac Limit'),
  }, {
    id: 'maclimitcount',
    label: _('Mac Quantity'),
    className: 'cols col-6',
    type: 'text',
    required: true,
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
    type: 'select',
    required: true,
    placeholder: _('Auto Login') + _('Auto Login'),

  }, {
    id: 'speed',
    label: _('Speed Limit'),
    className: 'cols col-6',
    options: [
      {
        value: '0',
        label: _('1M'),
      },
    ],
    defaultValue: '0',
    type: 'select',
    required: true,
    placeholder: _('Please Select ') + _('Speed Limit'),
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
    className: 'cols col-12',
    type: 'text',
    maxLength: '32',

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
    type: 'select',
    placeholder: _('Please Select ') + _('Gender'),

  }, {
    id: 'idnumber',
    label: _('ID No.'),
    className: 'cols col-6',
    noTable: true,
    type: 'num',
  }, {
    id: 'phoneNumber',
    label: _('Phone'),
    noTable: true,
    className: 'cols col-6',
    type: 'num',
  }, {
    id: 'address',
    label: _('Address'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
  }, {
    id: 'email',
    label: _('Email'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
    validator: validator({
      rules: 'email',
    }),
  }, {
    id: 'description',
    label: _('Detail Information'),
    className: 'cols col-6',
    noTable: true,
    type: 'text',
  },
]);
