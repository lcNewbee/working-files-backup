import stringUtils from 'shared/utils/lib/string';

let _ = window._;

if (!_) {
  _ = stringUtils.format;
}

const ERROR_MSG_MAP = {
  6000: _('AP with the same name already exists'),
  6001: _('AP with the same MAC already exists'),

  // AXC： 网络设置 6100 - 6199
  6110: _('Please configure the appropriate IP addresses and mask on interfaces'),

  // AXC： 网络设置 6200 - 6299
  6200: _(''),

  // AXC: 系统设置 6300 - 6399
  6300: _('Pelect upload the correct firmware file'),
};

export default ERROR_MSG_MAP;
