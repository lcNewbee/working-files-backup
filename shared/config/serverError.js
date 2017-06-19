import stringUtils from 'shared/utils/lib/string';

let __ = window.__;

if (!__) {
  __ = stringUtils.format;
}

const ERROR_MSG_MAP = {
  6000: __('AP with the same name already exists'),
  6001: __('AP with the same MAC already exists'),

  // AXC： 网络管理 6100 - 6199
  6109: __('Interfaces with the same segment already exists'),
  6110: __('Please configure the appropriate IP addresses and mask on interfaces'),
  6111: __('Next hop IP must within interfaces segment'),
  6112: __('Same mac already exists'),
  6113: __('Same mac already exists'),

  // AXC： AP组管理 6200 - 6299
  6200: __(''),
  6201: __('Already exists with the same name SSID'),
  6202: __('Group with the same name already exists'),
  6203: __('AP with the same name already exists'),

  // AXC: 系统设置 6300 - 6399
  6300: __('Pelect upload the correct firmware file'),
  6301: __('Upload the firmware file error'),
  6302: __('Same AP model and firmware version item already exists'),

  // AXC: Portal 6400 - 6499
  6401: __('Fail to send message'),
  6402: __('This IP has existed'),
  6403: __('This username has benn used'),
  6404: __('The format of the file is incorrect,please upload zip file!'),
  6405: __('Item with the same name already exists'),
  6406: __('Item with the same SSID and access point MAC address already exists'),
  6407: __('Add AAA policy fail'),

  // AC: 设置
  8001: __('Same AP model and firmware version item already exists!'),
  8002: __('The firmware version of this model has existed!'),

  9999: __('Sync Data Error'),
};

export default ERROR_MSG_MAP;
