import utils from 'shared/utils';

export function getInterfaceTypeOptions() {
  return utils.fetch('goform/network/radius/template')
    .then(json => ({
      options: json.data.list.filter(
        item => item,
      ).map(
        item => ({
          value: item.template_name,
          label: item.template_name,
        }),
      ),
    }));
}

export function getPortList() {
  return utils.fetch('goform/network/port')
    .then(json => ({
      options: json.data.list.filter(
        item => item,
      ).map(
        item => ({
          value: item.name,
          label: item.name,
        }),
      ),
    }));
}

export function getInterfacesList() {
  return utils.fetch('goform/network/interface')
    .then(json => ({
      options: json.data.list.filter(
        item => item,
      ).map(
        item => ({
          value: item.ip,
          label: item.ip,
        }),
      ),
    }));
}

export function getWebTemplate() {
  return utils.fetch('goform/portal/access/web', {
    size: 9999,
    page: 1,
  }).then(json => ({
    options: json.data.list.map(
      item => ({
        value: item.id,
        label: __(item.name),
      }),
    ),
  }));
}
export function getBasIP() {
  return utils.fetch('goform/portal/access/config')
    .then(json => ({
      basip: json.data.settings.bas_ip,
    }));
}
export function getAllGroupSSID() {
  return utils.fetch('goform/group/ssidSetting', {
    groupid: -100,
    size: 9999,
    page: 1,
  }).then(json => ({
    options: json.data.list.map(
      item => ({
        value: item.ssid,
        label: item.ssid,
      }),
    ),
  }));
}
export function getApMac() {
  return utils.fetch('goform/portal/access/ap', {
    size: 9999,
    page: 1,
  }).then(json => ({
    options: json.data.list.map(
      item => ({
        value: item.mac,
        label: item.mac,
      }),
    ),
  }));
}
