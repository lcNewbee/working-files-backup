export const PURVIEW_ADMIN = 'All';
export const PURVIEW_GUEST = 'Read-only';

export const purviewOptions = [
  {
    value: '1',
    module: 'network',
    label: _('NETWORK'),
  }, {
    value: '2',
    module: 'group',
    label: _('AP GROUP'),
  }, {
    value: '3',
    module: 'system',
    label: _('SYSTEM'),
  },
];

export default {};
