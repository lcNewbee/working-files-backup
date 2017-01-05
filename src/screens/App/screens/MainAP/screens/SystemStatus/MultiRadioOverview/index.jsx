import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import { FormGroup, Button, EchartReact, FormInput } from 'shared/components';
import Table from 'shared/components/Table';
import utils from 'shared/utils';
import * as sharedActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import * as selfActions from './actions';
import reducer from './reducer';

import './index.scss';

const flowRateFilter = utils.filter('flowRate');
const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  product: PropTypes.instanceOf(Map),
  selfState: PropTypes.instanceOf(Map),
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  fetch: PropTypes.func,
  changeCurrRadioConfig: PropTypes.func,
  changeCustomSettingsForChart: PropTypes.func,

  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
  app: PropTypes.instanceOf(Map),
  changeFirstRefresh: PropTypes.func,
  changeServerData: PropTypes.func,
};
let a;
const defaultProps = {};
const interfaceOptions = fromJS([
  {
    id: 'name',
    text: _('Name'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'mac',
    text: _('MAC'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'txBytes',
    text: _('Tx Data'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'rxBytes',
    text: _('Rx Data'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'txPackets',
    text: _('Tx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxPackets',
    text: _('Rx Packets'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'txErrorPackets',
    text: _('Tx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxErrorPackets',
    text: _('Rx Errors'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'status',
    text: _('Status'),
    transform(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
  },
]);
// const vapInterfaceOptions = fromJS([
//   {
//     id: 'name',
//     text: _('Name'),
//     transform(val, item) {
//       const ssid = item.get('ssid');
//       if (val === '') {
//         return `--(${ssid})`;
//       }
//       return `${val}(${ssid })`;
//     },
//     width: '152px',
//   }, {
//     id: 'mac',
//     text: _('MAC'),
//     transform(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '152px',
//   }, {
//     id: 'txBytes',
//     text: _('Tx Bytes'),
//     transform(val) {
//       if (val === '') {
//         return '--';
//       }
//       return flowRateFilter.transform(val);
//     },
//     width: '144px',
//   }, {
//     id: 'rxBytes',
//     text: _('Rx Bytes'),
//     transform(val) {
//       if (val === '') {
//         return '--';
//       }
//       return flowRateFilter.transform(val);
//     },
//     width: '144px',
//   }, {
//     id: 'txPackets',
//     text: _('Tx Packets'),
//     transform(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '144px',
//   }, {
//     id: 'rxPackets',
//     text: _('Rx Packets'),
//     transform(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '144px',
//   }, {
//     id: 'txErrorPackets',
//     text: _('Tx Error'),
//     transform(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '144px',
//   }, {
//     id: 'rxErrorPackets',
//     text: _('Rx Error'),
//     transform(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '144px',
//   }, {
//     id: 'ccq',
//     text: _('CCQ'),
//     transform(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//   },
// ]);
function changeUptimeToReadable(time) {
  let timeStr = '';
  const t = parseInt(time, 10);
  const days = Math.floor(t / (24 * 3600));
  const hours = Math.floor((t - (days * 24 * 3600)) / 3600);
  const minutes = Math.floor((t - (days * 24 * 3600) - (hours * 3600)) / 60);
  const seconds = Math.floor((t - (days * 24 * 3600) - (hours * 3600) - (minutes * 60)) % 60);
  if (days > 0) {
    timeStr = `${days}d ${hours}h ${minutes}m ${seconds}s `;
  } else if (hours > 0) {
    timeStr = `${hours}h ${minutes}m ${seconds}s `;
  } else if (minutes > 0) {
    timeStr = `${minutes}m ${seconds}s `;
  } else {
    timeStr = `${seconds}s`;
  }
  return timeStr;
}

function wirelessModeShowStyle(wirelessMode) {
  let ret = '';
  switch (wirelessMode) {
    case 'sta':
      ret = 'Station'; break;
    case 'repeater':
      ret = 'Repeater'; break;
    case 'ap':
      ret = 'AP'; break;
    default:
  }
  return ret;
}

function getTopTenFlowClientsOption(serverData) {
  let dataList = serverData.get('top10FlowClients');
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} ({d}%)',
    },
    title: {
      text: _('Top10 Flow Clients'),
      left: '48%',
      textStyle: {
        fontWeight: 'normal',
        fontSize: '18',
      },
    },
    legend: {
      show: true,
      orient: 'vertical',
      x: 'left',
      y: 'bottom',
      // data: [_('Offline'), _('Online')],
    },
    series: [
      {
        name: _('Name'),
        type: 'pie',
        radius: '50%',
        avoidLabelOverlap: false,
        label: {
          // formatter: '{b}: {c}',
          normal: {
            show: false,
            //position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '12',
              fontWeight: 'bold',
            },
          },
        },
        center: ['65%', '55%'],
        labelLine: {
          normal: {
            show: false,
          },
        },
      },
    ],
  };

  if (List.isList(dataList)) {
    dataList = dataList.map((item) => {
      let name;
      const userName = item.get('name');
      if (!userName || userName === '') {
        name = item.get('mac');  // 如果没有name，则使用mac代替
      } else if (userName.length >= 16) {
        name = `${userName.substr(0, 13)}...`; // 如果名称太长则后面显示省略号
      } else if (userName.length < 16) {
        name = userName; // 有名称，且长度合法
      }
      return item.set('name', `${name}: ${flowRateFilter.transform(item.get('value'))}`)
                .set('value', `${Number(item.get('value'))}`)
                .delete('mac'); // 删除数据中的mac变量
    });
    ret.legend.data = dataList.map(item => `${item.get('name')}`).toJS();
    ret.series[0].data = dataList.toJS();
  }
  return ret;
}

function getFlowPerSsidOption(serverData) {
  let dataList = serverData.get('flowPerSsid');
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} ({d}%)',
    },
    title: {
      text: _('SSID Flow'),
      left: '53%',
      textStyle: {
        fontWeight: 'normal',
        fontSize: '18',
      },
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      y: 'bottom',
    },
    series: [
      {
        name: 'SSID',
        type: 'pie',
        radius: '50%',
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            //position: 'center',
          },
          emphasis: {
            show: false,
            textStyle: {
              fontSize: '12',
              fontWeight: 'bold',
            },
          },
        },
        center: ['65%', '55%'],
        labelLine: {
          normal: {
            show: false,
          },
        },

      },
    ],
  };

  if (List.isList(dataList)) {
    dataList = dataList.map(item => item.set('name', `${item.get('name')}: ${flowRateFilter.transform(item.get('value'))}`)
                                        .set('value', `${Number(item.get('value'))}`));
    ret.legend.data = dataList.map(item => `${item.get('name')}`).toJS();
    ret.series[0].data = dataList.toJS();
  }

  return ret;
}

export default class SystemStatus extends React.Component {
  constructor(props) {
    super(props);
    // this.changeUptimeToReadable = this.changeUptimeToReadable.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.prepareChartData = this.prepareChartData.bind(this);
    this.getCpuAndMemPercentOption = this.getCpuAndMemPercentOption.bind(this);
    this.getStaPeerFlowOption = this.getStaPeerFlowOption.bind(this);
  }

  componentWillMount() {
    clearInterval(a);
    // 必须要有初始化，因为要在settings中插入一个由该页面id命名的对象
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {},
    });
    // this.props.changeCurrRadioConfig(this.props.product.getIn(['deviceRadioList', 0]));
    this.props.fetch('goform/get_firstLogin_info').then((json) => {
      if (json.state && json.state.code === 2000 && json.data.ifFirstLogin === '0') {
        this.props.fetchSettings().then(() => {
          this.props.fetch('goform/get_network_info').then((json1) => {
            if (json1.state && json1.state.code === 2000) {
              const networkInfo = fromJS(json1.data);
              this.props.updateItemSettings({ networkInfo });
            }
          });
        }).then(() => {
          this.props.changeFirstRefresh(false);
          // const customSetings = this.props.selfState.get('customSettingsForChart').toJS();
          this.prepareChartData();
        });
      }
    });
    this.onChangeRadio({ value: '0' });
    a = setInterval(() => {
      this.props.fetchSettings().then(() => {
        this.props.fetch('goform/get_network_info').then((json1) => {
          if (json1.state && json1.state.code === 2000) {
            const networkInfo = fromJS(json1.data);
            this.props.updateItemSettings({ networkInfo });
          }
        });
        this.prepareChartData();
      });
    }, 10000);
  }


  // componentDidMount() {
  //   console.log(this.props.product.getIn(['deviceRadioList', 0]));
  //   this.props.changeCurrRadioConfig(this.props.product.getIn(['deviceRadioList', 0]));
  // }

  componentDidUpdate(prevProps) {
    // console.log('app.refreshAt', this.props.app.get('refreshAt'));
    // console.log('prevProps.app.refreshAt', prevProps.app.get('refreshAt'));
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      // console.log('refresh');
      clearInterval(a);
      this.props.fetchSettings();
      this.onChangeRadio({ value: '0' });
      a = setInterval(this.props.fetchSettings, 10000);
    }
  }

  componentWillUnmount() {
    // console.log('interval', a);
    clearInterval(a);
    this.props.leaveSettingsScreen();
    this.props.changeFirstRefresh(true);
  }
  onChangeRadio(data) { // 注意参数实际是data的value属性，这里表示radio序号
    const radioType = this.props.product.getIn(['deviceRadioList', data.value, 'radioType']);
    console.log('radioType', radioType);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
  }

  getCpuAndMemPercentOption() {
    const cpuUsed = Number(this.props.store.getIn(['curData', 'sysStatus', 'cpuInfo']));
    const memUsed = Number(this.props.store.getIn(['curData', 'sysStatus', 'memInfo']));
    const xAxisData = ['CPU', 'Memary'];
    const data1 = [cpuUsed, memUsed];
    const data2 = [100 - cpuUsed, 100 - memUsed];

    const itemStyle = {
      normal: {
      },
      emphasis: {
        barBorderWidth: 1,
        shadowBlur: 5,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        // shadowColor: 'rgba(0,0,0,0.5)',
      },
    };

    const option = {
      backgroundColor: '#f2f2f2',
      legend: {
        data: ['Used', 'Free'],
        orient: 'vertical',
        align: 'left',
        y: 'bottom',
        left: 10,
      },
      title: {
        text: _('CPU/MEM Usage'),
        x: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: '18',
        },
      },
      brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0,
      },
      toolbox: {
        feature: {
          magicType: {
            type: ['stack', 'tiled'],
          },
          dataView: {},
        },
      },
      tooltip: {
        show: true,
        formatter: '{a} <br/> {b} : {c}%',
      },
      yAxis: {
        data: xAxisData,
        silent: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        splitArea: { show: false },
      },
      xAxis: {
        inverse: false,
        splitArea: { show: false },
      },
      grid: {
        left: 100,
      },
      series: [
        {
          name: 'Used',
          type: 'bar',
          stack: 'one',
          barWidth: 25,
          itemStyle,
          data: data1,
        },
        {
          name: 'Free',
          type: 'bar',
          stack: 'one',
          barWidth: 25,
          itemStyle,
          data: data2,
        },
      ],
    };

    return option;
  }

  getStaPeerFlowOption() {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const download = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList', '0', 'txBytes']);
    const upload = this.props.store.getIn(['curData', 'radioList', radioId, 'vapList', '0', 'rxBytes']);
    const downloadFlow = flowRateFilter.transform(download);
    const uploadFlow = flowRateFilter.transform(upload);

    const option = {
      title: {
        text: _('Station Peer Flow'),
        x: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: '18',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        y: 'bottom',
        data: [`${_('Download')}: ${downloadFlow}`, `${_('Upload')}: ${uploadFlow}`],
      },
      series: [
        {
          name: _('Flow'),
          type: 'pie',
          radius: '50%',
          center: ['50%', '60%'],
          data: [
            { value: download, name: `Download: ${downloadFlow}` },
            { value: upload, name: `Upload: ${uploadFlow}` },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };

    return option;
  }

  prepareChartData() { // { ssidFlowDir, top10ClientFlowDir }为流量方向，'upload','download'
    const customSetings = this.props.selfState.get('customSettingsForChart').toJS();
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    if (!this.props.store.getIn(['curData', 'radioList', radioId]) ||
        !this.props.store.getIn(['curData', 'sysStatus'])) return null;
    const { cpuInfo, memTotal, memFree } = this.props.store.getIn(['curData', 'sysStatus']).toJS();
    const that = this;
    function getFlowPerSsidList() {
      const vapList = that.props.store.getIn(['curData', 'radioList', radioId, 'vapList']);
      let flowPerSsid;
      if (customSetings.ssidFlowDir === 'upload') {
        flowPerSsid = vapList.map(item => fromJS({
          name: item.get('ssid'),
          value: Number(item.get('rxBytes')),
        }));
      } else if (customSetings.ssidFlowDir === 'download') {
        flowPerSsid = vapList.map(item => fromJS({
          name: item.get('ssid'),
          value: Number(item.get('txBytes')),
        }));
      }
      return flowPerSsid;
    }
    function getTop10FlowClientsList() {
      const staList = that.props.store.getIn(['curData', 'radioList', radioId, 'staList']);
      let sortedStaList;
      let top10FlowClients;
      if (customSetings.top10ClientFlowDir === 'upload') { // 排序
        sortedStaList = staList.sort((itemA, itemB) => {
          const txBytesA = Number(itemA.get('txBytes'));
          const txBytesB = Number(itemB.get('txBytes'));
          return txBytesB - txBytesA;
        });
      } else if (customSetings.top10ClientFlowDir === 'download') {
        sortedStaList = staList.sort((itemA, itemB) => {
          const rxBytesA = Number(itemA.get('rxBytes'));
          const rxBytesB = Number(itemB.get('rxBytes'));
          return rxBytesB - rxBytesA;
        });
      }
      if (sortedStaList.size > 10) { // 裁剪前十
        sortedStaList = sortedStaList.slice(0, 10);
      }
      if (customSetings.top10ClientFlowDir === 'upload') {
        top10FlowClients = sortedStaList.map(item => fromJS({
          name: item.get('deviceName'),
          value: Number(item.get('txBytes')),
          mac: item.get('mac'), // 如果客户端没有名称，则使用mac代替
        }));
      } else if (customSetings.top10ClientFlowDir === 'download') {
        top10FlowClients = sortedStaList.map(item => fromJS({
          name: item.get('deviceName'),
          value: Number(item.get('rxBytes')),
          mac: item.get('mac'),
        }));
      }
      // console.log('top10FlowClients', top10FlowClients);
      return top10FlowClients;
    }
    const { ssidFlowDir, top10ClientFlowDir } = this.props.selfState.get('customSettingsForChart').toJS();
    const flowPerSsid = getFlowPerSsidList(ssidFlowDir);
    const top10FlowClients = getTop10FlowClientsList(top10ClientFlowDir);
    this.props.changeServerData(fromJS({ cpuInfo, memFree, memTotal, flowPerSsid, top10FlowClients }));
  }

  render() {
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    if (!this.props.store.getIn(['curData', 'radioList', radioId])
        || !this.props.store.getIn(['curData', 'sysStatus'])
        || !this.props.store.getIn(['curData', 'networkInfo'])) return null;
    const {
      deviceModel, deviceName, version, uptime, systemTime, networkMode, wlan0Mac,
    } = this.props.store.getIn(['curData', 'sysStatus']).toJS();
    const interfaces = this.props.store.getIn(['curData', 'interfaces']).toJS();
    const {
      wirelessMode, security, frequency, channelWidth, channel, radioMode, ssid,
      distance, txPower, noise, chutil, staList, vapList, signal, enable,
    } = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    const {
      wiredMode, proto, ip, gateway, mask, dns1, dns2,
    } = this.props.store.getIn(['curData', 'networkInfo']).toJS();
    const routerInfo = this.props.store.getIn(['curData', 'networkInfo', 'routerInfo']);
    const radioList = this.props.store.getIn(['curData', 'radioList']);
    const peerList = this.props.store.getIn(['curData', 'radioList', radioId, 'peerList']);
    const { memInfo, cpuInfo } = this.props.store.getIn(['curData', 'sysStatus']).toJS();
    const radioSelectOptions = this.props.product.get('radioSelectOptions');
    const serverData = this.props.selfState.get('serverData');
    const topTenFlowClients = getTopTenFlowClientsOption(serverData);
    const flowPerSsid = getFlowPerSsidOption(serverData);
    const cpuAndMemUsage = this.getCpuAndMemPercentOption();
    // const vapInterfacesList = (wirelessMode === 'sta') ? [vapList[0]] : vapList;
    // 绘图
    // const serverData = this.props.selfState.get('serverData');
    // const memoryStatusOption = getMemoryOption(serverData);
    // const cpuStatusOption = getCpuOption(serverData);
    // const topTenFlowClients = getTopTenFlowClientsOption(serverData);
    // const flowPerSsid = getFlowPerSsidOption(serverData);

    return (
      <div className="o-box" style={{ minWidth: '1200px' }}>
        <div className="row">
          <div className="cols col-4" style={{ minWidth: '290px' }}>
            <div className="o-box__cell">
              <h3>{_('Network Info')}</h3>
            </div>
            <div
              className="o-box__cell"
              style={{
                height: '217px',
              }}
            >
              {
                wiredMode === 'bridge' ? (
                  <div className="o-description-list o-description-list--lg info-box">
                    <dl className="o-description-list-row">
                      <dt>{_('Network Mode')}</dt>
                      <dd>{wiredMode}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('IP Mode')}</dt>
                      <dd>{proto}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('IP Address')}</dt>
                      <dd>{ip}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('Gateway')}</dt>
                      <dd>{gateway}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('Network Mask')}</dt>
                      <dd>{mask}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('Primary DNS')}</dt>
                      <dd>{dns1}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('Secondary DNS')}</dt>
                      <dd>{dns2}</dd>
                    </dl>
                  </div>
                ) : (
                  <div className="o-description-list o-description-list--lg info-box">
                    <dl className="o-description-list-row">
                      <dt>{_('Network Mode')}</dt>
                      <dd>{wiredMode}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('WAN IP Mode')}</dt>
                      <dd>{routerInfo.get('proto')}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('WAN IP')}</dt>
                      <dd>{routerInfo.get('ip')}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('Gateway')}</dt>
                      <dd>{routerInfo.get('gateway')}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('Network Mask')}</dt>
                      <dd>{routerInfo.get('mask')}</dd>
                    </dl>
                    <dl className="o-description-list-row">
                      <dt>{_('NAT Enable')}</dt>
                      <dd>{routerInfo.get('nat') === '1' ? 'Enable' : 'Disabled'}</dd>
                    </dl>
                  </div>
                )
              }
            </div>
          </div>
          <div className="cols col-8" style={{ minWidth: '380px' }}>
            <div className="o-box__cell">
              <h3>{_('System Status')}</h3>
            </div>
            <div
              className="o-box__cell cols col-6"
              style={{
                height: '217px',
              }}
            >
              <div className="o-description-list o-description-list--lg info-box">
                <dl className="o-description-list-row">
                  <dt>{_('Device Mode')}</dt>
                  <dd>{deviceModel}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('Device Name')}</dt>
                  <dd>{deviceName}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('Firmware Version')}</dt>
                  <dd>{version}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('System Uptime')}</dt>
                  <dd>{changeUptimeToReadable(uptime)}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('System Time')}</dt>
                  <dd>{systemTime}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('AP MAC')}</dt>
                  <dd>{wlan0Mac}</dd>
                </dl>
              </div>
            </div>
            <div className="cols col-6 o-box__cell" style={{ minWidth: '380px' }}>
              <EchartReact
                className="o-box__canvas"
                option={cpuAndMemUsage}
                style={{
                  minHeight: '200px',
                }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="cols col-12">
            <div className="o-box__cell clearfix">
              {
                this.props.product.get('deviceRadioList').size > 1 ? (
                  <FormInput
                    type="switch"
                    label={_('Radio Select')}
                    minWidth="100px"
                    options={radioSelectOptions}
                    value={this.props.selfState.getIn(['currRadioConfig', 'radioId'])}
                    onChange={(data) => {
                      Promise.resolve().then(() => {
                        this.onChangeRadio(data);
                      }).then(() => {
                        if (this.props.store.getIn(['curData', 'radioList', data.value, 'enable']) === '1') {
                          this.prepareChartData();
                        }
                      });
                    }}
                  />
                ) : null
              }
              <a
                onClick={(e) => {
                  e.preventDefault();
                  const radioTypeVal = this.props.product.getIn(['deviceRadioList', radioId, 'radioType']);
                  const config = fromJS({
                    radioId,
                    radioType: radioTypeVal,
                  });
                  this.props.changeCurrRadioConfig(config);
                  window.location.href = '#/main/status/radiodetails';
                }}
                style={{
                  paddingTop: '3px',
                  marginLeft: '20px',
                  color: 'blue',
                  cursor: 'pointer',
                }}
              >
                {_('More Details >>')}
              </a>
            </div>
          </div>
          <div
            className="cols col-4 o-box__cell"
            style={{
              height: '287px',
              minWidth: '290px',
            }}
          >
            <div className="box-cell-head">{_('Radio Info')}</div>
            <div className="o-description-list o-description-list--lg info-box">
              <dl className="o-description-list-row">
                <dt>{_('Wireless Mode')}</dt>
                <dd>{wirelessModeShowStyle(radioList.getIn([radioId, 'wirelessMode']))}</dd>
              </dl>
              <dl className="o-description-list-row">
                <dt>{_('Protocol')}</dt>
                <dd>{radioList.getIn([radioId, 'radioMode'])}</dd>
              </dl>
              <dl className="o-description-list-row">
                <dt>{_('Channel/Frequency')}</dt>
                <dd>{`${radioList.getIn([radioId, 'channel'])}/${radioList.getIn([radioId, 'frequency'])}`}</dd>
              </dl>
              <dl className="o-description-list-row">
                <dt>{_('Channel Width')}</dt>
                <dd>{radioList.getIn([radioId, 'channelWidth'])}</dd>
              </dl>
              <dl className="o-description-list-row">
                <dt>{_('Channel Utilization')}</dt>
                <dd>{radioList.getIn([radioId, 'chutil'])}</dd>
              </dl>
              {
                wirelessMode !== 'sta' && typeof (staList) !== 'undefined' ? (
                  <dl className="o-description-list-row">
                    <dt>{_('Client Number')}</dt>
                    <dd>{staList.length}</dd>
                  </dl>
                ) : null
              }
              <dl className="o-description-list-row">
                <dt>{_('Tx Power')}</dt>
                <dd>{`${radioList.getIn([radioId, 'txPower'])} dBm`}</dd>
              </dl>
              <dl className="o-description-list-row">
                <dt>{_('Signal')}</dt>
                <dd>{`${radioList.getIn([radioId, 'signal'])} dBm`}</dd>
              </dl>
              <dl className="o-description-list-row">
                <dt>{_('Noise')}</dt>
                <dd>{`${radioList.getIn([radioId, 'noise'])} dBm`}</dd>
              </dl>
            </div>
          </div>
          {
            wirelessMode !== 'sta' && enable === '1' && staList.length > 0 ? (
              <div
                className="cols col-4 o-box__cell"
                style={{
                  position: 'relative',
                  minWidth: '380px',
                }}
              >
                <FormInput
                  type="switch"
                  options={[
                    { value: 'download', label: _('Download') },
                    { value: 'upload', label: _('Upload') },
                  ]}
                  minWidth="84px"
                  style={{
                    position: 'absolute',
                    right: '0',
                    bottom: '0',
                    zIndex: '99',
                  }}
                  value={this.props.selfState.getIn(['customSettingsForChart', 'top10ClientFlowDir'])}
                  onChange={(data) => {
                    Promise.resolve().then(() => {
                      this.props.changeCustomSettingsForChart(fromJS({ top10ClientFlowDir: data.value }));
                    }).then(() => {
                      if (this.props.store.getIn(['curData', 'radioList', radioId, 'enable']) === '1') {
                        this.prepareChartData();
                      }
                    });
                  }}
                />
                <EchartReact
                  option={topTenFlowClients}
                  className="o-box__canvas"
                  style={{
                    minHeight: '270px',
                  }}
                />
              </div>
            ) : (
              <div className="cols col-4 o-box__cell">
                {
                  wirelessMode === 'sta' ? (
                    <div>
                      <div className="box-cell-head">{_('Remote Client Info')}</div>
                      <div className="o-description-list o-description-list--lg info-box">
                        <dl className="o-description-list-row">
                          <dt>{_('Connection Status')}</dt>
                          <dd>{peerList.getIn([0, 'status']) || 'No Connection'}</dd>
                        </dl>
                        <dl className="o-description-list-row">
                          <dt>{_('Remote SSID')}</dt>
                          <dd>{peerList.getIn([0, 'ssid']) || '--'}</dd>
                        </dl>
                        <dl className="o-description-list-row">
                          <dt>{_('Peer MAC')}</dt>
                          <dd>{peerList.getIn([0, 'mac']) || '--'}</dd>
                        </dl>
                        <dl className="o-description-list-row">
                          <dt>{_('Connect Time')}</dt>
                          <dd>{changeUptimeToReadable(peerList.getIn([0, 'connectTime'])) || '--'}</dd>
                        </dl>
                        <dl className="o-description-list-row">
                          <dt>{_('Tx Rate')}</dt>
                          <dd>{peerList.getIn([0, 'txrate']) || '--'}</dd>
                        </dl>
                        <dl className="o-description-list-row">
                          <dt>{_('Rx Rate')}</dt>
                          <dd>{peerList.getIn([0, 'rxrate']) || '--'}</dd>
                        </dl>
                      </div>
                    </div>
                  ) : (
                    <div className="radio-off-notice">{_('No Client')}</div>
                  )
                }

              </div>
            )
          }

          <div
            className="cols col-4 o-box__cell"
            style={{
              position: 'relative',
              minWidth: '380px',
            }}
          >
            {
              enable === '0' ? (
                <div className="radio-off-notice">{_('Radio Off')}</div>
              ) : (
                <div>
                  {
                    wirelessMode !== 'sta' ? (
                      <div>
                        <FormInput
                          type="switch"
                          options={[
                            { value: 'download', label: _('Download') },
                            { value: 'upload', label: _('Upload') },
                          ]}
                          minWidth="84px"
                          style={{
                            position: 'absolute',
                            right: '0',
                            bottom: '0',
                            zIndex: '99',
                          }}
                          value={this.props.selfState.getIn(['customSettingsForChart', 'ssidFlowDir'])}
                          onChange={(data) => {
                            Promise.resolve().then(() => {
                              this.props.changeCustomSettingsForChart(fromJS({ ssidFlowDir: data.value }));
                            }).then(() => {
                              if (this.props.store.getIn(['curData', 'radioList', radioId, 'enable']) === '1') {
                                this.prepareChartData();
                              }
                            });
                          }}
                        />
                        <EchartReact
                          className="o-box__canvas"
                          option={flowPerSsid}
                          style={{
                            minHeight: '270px',
                          }}
                        />
                      </div>
                    ) : (
                      <EchartReact
                        className="o-box__canvas"
                        option={this.getStaPeerFlowOption()}
                        style={{
                          minHeight: '270px',
                        }}
                      />
                    )
                  }
                </div>
              )
            }


          </div>
        </div>

        <div>
          <div className="o-box__cell">
            <h3>{_('Ethernet')}</h3>
          </div>
          <div className="o-box__cell">
            <Table
              className="table"
              options={interfaceOptions}
              list={interfaces}
            />
          </div>
        </div>

        {/*
          wirelessMode === 'sta' ? (
            <div className="remoteApTable o-box">
              <div className="o-box__cell">
                <h3>{_('Connection Info')}</h3>
              </div>
              <div className="o-box__cell">
                <Table
                  className="table"
                  options={connectionInfoOption}
                  list={peerList}
                />
              </div>
            </div>
          ) : null
        */}

        {
          this.props.app.get('fetching') && this.props.selfState.get('firstRefresh') ? (
            <div className="o-modal" role="message">
              <div className="o-modal__backdrop" />
              <div className="o-modal__message">
                <div className="o-modal__content">
                  <div className="o-modal__clarbody">
                    <h3>Axilspot</h3>
                    <span className="fa fa-spinner fa-spin" style={{ color: '#0093dd', marginLeft: '5px' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

SystemStatus.propTypes = propTypes;
SystemStatus.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    selfState: state.systemstatus,
    app: state.app,
    store: state.settings,
    product: state.product,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SystemStatus);

export const systemstatus = reducer;
