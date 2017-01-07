export const PURVIEW_ADMIN = 'All';
export const PURVIEW_GUEST = 'Read-only';

export const purviewOptions = [
  {
    value: '1',
    module: 'network',
    label: _('Network '),
  }, {
    value: '2',
    module: 'group',
    label: _('AP Groups '),
  }, {
    value: '3',
    module: 'system',
    label: _('System '),
  },
  // {
  //   value: '3',
  //   module: 'portal',
  //   label: _('Portal '),
  // },
];

export default {};
