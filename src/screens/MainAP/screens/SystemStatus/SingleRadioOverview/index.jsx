import React from 'react'; import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import { FormGroup, Button, EchartReact, FormInput } from 'shared/components';
import Table from 'shared/components/Table';
import utils from 'shared/utils';
import { actions as sharedActions } from 'shared/containers/settings';
import { actions as appActions } from 'shared/containers/app';
import * as selfActions from './actions';
import reducer from './reducer';

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
    text: __('Name'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'mac',
    text: __('MAC'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '152px',
  }, {
    id: 'txBytes',
    text: __('Tx Data'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'rxBytes',
    text: __('Rx Data'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
    width: '144px',
  }, {
    id: 'txPackets',
    text: __('Tx Packets'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxPackets',
    text: __('Rx Packets'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'txErrorPackets',
    text: __('Tx Errors'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'rxErrorPackets',
    text: __('Rx Errors'),
    render(val) {
      if (val === '') {
        return '--';
      }
      return val;
    },
    width: '144px',
  }, {
    id: 'status',
    text: __('Status'),
    render(val) {
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
//     text: __('Name'),
//     render(val, item) {
//       const ssid = item.get('ssid');
//       if (val === '') {
//         return `--(${ssid})`;
//       }
//       return `${val}(${ssid })`;
//     },
//     width: '152px',
//   }, {
//     id: 'mac',
//     text: __('MAC'),
//     render(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '152px',
//   }, {
//     id: 'txBytes',
//     text: __('Tx Bytes'),
//     render(val) {
//       if (val === '') {
//         return '--';
//       }
//       return flowRateFilter.transform(val);
//     },
//     width: '144px',
//   }, {
//     id: 'rxBytes',
//     text: __('Rx Bytes'),
//     render(val) {
//       if (val === '') {
//         return '--';
//       }
//       return flowRateFilter.transform(val);
//     },
//     width: '144px',
//   }, {
//     id: 'txPackets',
//     text: __('Tx Packets'),
//     render(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '144px',
//   }, {
//     id: 'rxPackets',
//     text: __('Rx Packets'),
//     render(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '144px',
//   }, {
//     id: 'txErrorPackets',
//     text: __('Tx Error'),
//     render(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '144px',
//   }, {
//     id: 'rxErrorPackets',
//     text: __('Rx Error'),
//     render(val) {
//       if (val === '') {
//         return '--';
//       }
//       return val;
//     },
//     width: '144px',
//   }, {
//     id: 'ccq',
//     text: __('CCQ'),
//     render(val) {
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

// function getCpuOption(serverData) {
//   const ret = {
//     tooltip: {
//       trigger: 'item',
//       formatter: '{a} <br/>{b}: {d}%',
//     },
//     legend: {
//       orient: 'vertical',
//       x: 'left',
//       data: [__('Used'), __('Free')],
//     },
//     title: {
//       text: __('CPU Usage'),
//       x: 'center',
//     },
//     series: [
//       {
//         name: __('CPU Usage'),
//         type: 'pie',
//         radius: ['40%', '70%'],
//         avoidLabelOverlap: false,
//         label: {
//           normal: {
//             show: false,
//             position: 'center',
//           },
//           emphasis: {
//             show: true,
//             textStyle: {
//               fontSize: '20',
//               fontWeight: 'bold',
//             },
//           },
//         },
//         labelLine: {
//           normal: {
//             show: false,
//           },
//         },

//       },
//     ],
//   };

//   ret.series[0].data = [
//     { value: serverData.get('cpuInfo'), name: __('Used') },
//     { value: serverData.get('cpuTotal') - serverData.get('cpuInfo'), name: __('Free') },
//   ];

//   return ret;
// }
// function getMemoryOption(serverData) {
//   const ret = {
//     tooltip: {
//       trigger: 'item',
//       formatter: '{a} <br/>{b}: {c}KB ({d}%)',
//     },
//     title: {
//       text: __('Memory Usage'),
//       x: 'center',
//     },
//     legend: {
//       orient: 'vertical',
//       x: 'left',
//       data: [__('Used'), __('Free')],
//     },
//     series: [
//       {
//         name: __('Memory Usage'),
//         type: 'pie',
//         radius: ['40%', '70%'],
//         avoidLabelOverlap: false,
//         label: {
//           normal: {
//             show: false,
//             position: 'center',
//           },
//           emphasis: {
//             show: true,
//             textStyle: {
//               fontSize: '20',
//               fontWeight: 'bold',
//             },
//           },
//         },
//         labelLine: {
//           normal: {
//             show: false,
//           },
//         },
//       },
//     ],
//   };

//   ret.series[0].data = [
//     { value: serverData.get('memTotal') - serverData.get('memFree'), name: __('Used') },
//     { value: serverData.get('memFree'), name: __('Free') },
//   ];

//   return ret;
// }
function getFlowPerSsidOption(serverData) {
  let dataList = serverData.get('flowPerSsid');
  let totalNum = 0;
  dataList.forEach((item) => {
    totalNum += Number(item.get('value'));
  });
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} ({d}%)',
    },
    title: {
      text: __('Total: ') + flowRateFilter.transform(totalNum),
      left: '55%',
      // padding: [0, 0, 0, 370],
      textStyle: {
        fontSize: '18',
      },
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      y: 'top',
    },
    series: [
      {
        name: 'SSID',
        type: 'pie',
        radius: ['0%', '60%'],
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
        labelLine: {
          normal: {
            show: false,
          },
        },
        center: ['65%', '55%'],
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
function getTopTenFlowClientsOption(serverData) {
  let dataList = serverData.get('top10FlowClients');
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} ({d}%)',
    },
    title: {
      text: __('Top10 Flow Clients'),
      // x: 'center',
      // padding: [0, 0, 0, 350],
      left: '50%',
    },
    legend: {
      show: true,
      orient: 'vertical',
      x: 'left',
      y: 'top',
      // data: [__('Offline'), __('Online')],
    },
    series: [
      {
        name: __('Name'),
        type: 'pie',
        radius: ['0%', '60%'],
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
        labelLine: {
          normal: {
            show: false,
          },
        },
        center: ['65%', '55%'],
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

export default class SystemStatus extends React.Component {
  constructor(props) {
    super(props);
    // this.changeUptimeToReadable = this.changeUptimeToReadable.bind(this);
    this.onChangeRadio = this.onChangeRadio.bind(this);
    this.prepareChartData = this.prepareChartData.bind(this);
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
          this.props.changeFirstRefresh(false);
          // const customSetings = this.props.selfState.get('customSettingsForChart').toJS();
          if (this.props.store.getIn(['curData', 'radioList', 0, 'enable']) === '1') {
            this.prepareChartData();
          }
        });
      }
    });
    this.onChangeRadio({ value: '0' });
    a = setInterval(() => {
      this.props.fetchSettings().then(() => {
        if (this.props.store.getIn(['curData', 'radioList', 0, 'enable']) === '1') {
          this.prepareChartData();
        }
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
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
  }

  prepareChartData() { // { ssidFlowDir, top10ClientFlowDir }为流量方向，'upload','download'
    const customSetings = this.props.selfState.get('customSettingsForChart').toJS();
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
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
      // console.log('staList', staList);
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
      // console.log('sortedStaList', sortedStaList);
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
    // const clientOptions = fromJS([
    //   {
    //     id: 'mac',
    //     text: 'Mac',
    //   },
    //   {
    //     id: 'deviceName',
    //     text: __('Device Name'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return val;
    //     },
    //   },
    //   {
    //     id: 'ssid',
    //     text: __('Owner SSID'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return val;
    //     },
    //   },
    //   {
    //     id: 'signal',
    //     text: __('Signal(dBm)'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return val;
    //     },
    //   },
    //   {
    //     id: 'noise',
    //     text: __('Noise(dBm)'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return val;
    //     },
    //   },
    //   {
    //     id: 'txRate',
    //     text: __('Tx Rate'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return `${val}Mbps`;
    //     },
    //   },
    //   {
    //     id: 'rxRate',
    //     text: __('Rx Rate'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return `${val}Mbps`;
    //     },
    //   },
    //   {
    //     id: 'txBytes',
    //     text: __('Tx Bytes'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return flowRateFilter.transform(val);
    //     },
    //   },
    //   {
    //     id: 'rxBytes',
    //     text: __('Rx Bytes'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return flowRateFilter.transform(val);
    //     },
    //   },
    //   {
    //     id: 'txPackets',
    //     text: __('Tx Packets'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return val;
    //     },
    //   },
    //   {
    //     id: 'rxPackets',
    //     text: __('Rx Packets'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return val;
    //     },
    //   },
    //   {
    //     id: 'connectTime',
    //     text: __('Connect Time'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return changeUptimeToReadable(val);
    //     },
    //   },
    //   {
    //     id: 'ipAddr',
    //     text: __('IP'),
    //     render(val) {
    //       if (val === '' || val === undefined) {
    //         return '--';
    //       }
    //       return val;
    //     },
    //   },
    // ]);
    const connectionInfoOption = fromJS([
      {
        id: 'status',
        text: __('Connection Status'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      }, {
        id: 'connectTime',
        text: __('Connect Time'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return changeUptimeToReadable(val);
        },
      }, {
        id: 'txrate',
        text: __('Tx Rate'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return `${val}Mbps`;
        },
      }, {
        id: 'rxrate',
        text: __('Rx Rate'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return `${val}Mbps`;
        },
      }, {
        id: 'mac',
        text: __('Peer MAC'),
        render(val) {
          if (val === '' || val === undefined) {
            return '--';
          }
          return val;
        },
      },
    ]);
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    if (!this.props.store.getIn(['curData', 'radioList', radioId])
        || !this.props.store.getIn(['curData', 'sysStatus'])) return null;
    const {
      deviceModel, deviceName, version, uptime, systemTime, networkMode, systemMac,
      memInfo, cpuInfo,
    } = this.props.store.getIn(['curData', 'sysStatus']).toJS();
    const interfaces = this.props.store.getIn(['curData', 'interfaces']).toJS();
    const {
      wirelessMode, security, frequency, channelWidth, channel, radioMode, ssid,
      distance, txPower, noise, chutil, staList, peerList, vapList, signal,
    } = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    // const { memInfo, cpuInfo } = this.props.selfState.get('serverData').toJS();
    // const vapInterfacesList = (wirelessMode === 'sta') ? [vapList[0]] : vapList;
    // 绘图
    const serverData = this.props.selfState.get('serverData');
    // const memoryStatusOption = getMemoryOption(serverData);
    // const cpuStatusOption = getCpuOption(serverData);
    const topTenFlowClients = getTopTenFlowClientsOption(serverData);
    const flowPerSsid = getFlowPerSsidOption(serverData);

    return (
      <div className="o-box" style={{ minWidth: '1200px' }}>
        {
          this.props.product.get('deviceRadioList').size > 1 ? (
            <FormInput
              type="switch"
              label={__('Radio Select')}
              minWidth="100px"
              options={this.props.product.get('radioSelectOptions')}
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
              style={{
                marginBottom: '15px',
              }}
            />
          ) : null
        }

        {/* // CPU 和 Memory的两幅图片
          <div className="o-box row">
            <div className="cols col-6" >
              <div className="o-box__cell">
                <h3>{ __('Memory') }</h3>
              </div>
              <div className="o-box__cell">
                <EchartReact
                  option={memoryStatusOption}
                  className="o-box__canvas"
                  style={{
                    width: '100%',
                    minHeight: '200px',
                  }}
                />
              </div>
            </div>
            <div className="cols col-6">
              <div className="o-box__cell">
                <h3>{ __('CPU') }</h3>
              </div>
              <div className="o-box__cell">
                <EchartReact
                  option={cpuStatusOption}
                  className="o-box__canvas"
                  style={{
                    width: '100%',
                    minHeight: '200px',
                  }}
                />
              </div>
            </div>
          </div>
        */}

        { // SSID流量图 和 客户端流量前十
          wirelessMode === 'sta' ? null : (
            <div className="row" style={{ minWidth: '1200px' }}>
              <div className="cols col-6" style={{ minWidth: '600px' }}>
                <div className="o-box__cell clearfix">
                  <h3
                    className="fl"
                    style={{
                      paddingTop: '5px',
                      marginRight: '10px',
                    }}
                  >
                    { __('SSID Flow') }
                  </h3>
                  <FormInput
                    type="select"
                    options={[
                      { label: __('Upload'), value: 'upload' },
                      { label: __('Download'), value: 'download' },
                    ]}
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
                  {
                    this.props.store.getIn(['curData', 'radioList', radioId, 'enable']) === '1' ? (
                      <a
                        href="#/main/status/ssiddetails"
                        className="fr"
                        style={{
                          paddingTop: '5px',
                          color: 'blue',
                          // textDecoration: 'underline',
                        }}
                      >
                        {__('More Details')}
                      </a>
                    ) : null
                  }
                </div>
                <div className="o-box__cell">
                  {
                    this.props.store.getIn(['curData', 'radioList', radioId, 'enable']) === '1' ? (
                      <EchartReact
                        option={flowPerSsid}
                        className="o-box__canvas"
                        style={{
                          width: '100%',
                          minHeight: '260px',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '260px',
                          lineHeight: '260px',
                          textAlign: 'center',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                      >
                        Radio Off
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="cols col-6" style={{ minWidth: '600px' }}>
                <div className="o-box__cell clearfix">
                  <h3
                    className="fl"
                    style={{
                      paddingTop: '5px',
                      marginRight: '10px',
                    }}
                  >
                    { __('Top10 Flow Clients') }
                  </h3>
                  <FormInput
                    type="select"
                    options={[
                      { label: __('Upload'), value: 'upload' },
                      { label: __('Download'), value: 'download' },
                    ]}
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
                  {
                    this.props.store.getIn(['curData', 'radioList', radioId, 'enable']) === '1' ? (
                      <a
                        href="#/main/status/clientsdetails"
                        className="fr"
                        style={{
                          paddingTop: '5px',
                          color: 'blue',
                        }}
                      >
                        {__('More Details')}
                      </a>
                    ) : null
                  }
                </div>
                <div className="o-box__cell row">
                  {
                    this.props.selfState.getIn(['serverData', 'top10FlowClients']).size === 0 ||
                    this.props.store.getIn(['curData', 'radioList', radioId, 'enable']) === '0' ? (
                      <div
                        style={{
                          height: '260px',
                          lineHeight: '260px',
                          textAlign: 'center',
                          fontSize: '20px',
                          fontWeight: 'bold',
                        }}
                      >{__('No Client')}</div>
                    ) : (
                      <EchartReact
                        option={topTenFlowClients}
                        className="o-box__canvas cols col-12"
                        style={{
                          minHeight: '260px',
                        }}
                      />
                    )
                  }
                </div>
              </div>
            </div>
          )
        }

        <div className="row" style={{ minWidth: '1200px' }}>
          <div className="cols col-6" style={{ minWidth: '600px' }}>
            <div className="o-box__cell">
              <h3>{__('System Status')}</h3>
            </div>
            <div className="o-box__cell">
              <div
                style={{
                  marginLeft: '-15px',
                }}
              >
                <div className="cols col-6">
                  <FormGroup
                    type="plain-text"
                    label={__('Device Model :')}
                    value={deviceModel}
                  />
                  <FormGroup
                    label={__('Network Mode :')}
                    type="plain-text"
                    value={networkMode}
                  />
                  <FormGroup
                    label={__('System Uptime :')}
                    type="plain-text"
                    value={changeUptimeToReadable(uptime)}
                  />
                  <FormGroup
                    label={__('Access Point MAC Address :')}
                    type="plain-text"
                    value={systemMac}
                  />
                  <FormGroup
                    label={__('Memory Used :')}
                    type="plain-text"
                    value={memInfo}
                    help="%"
                  />
                </div>
                <div className="cols col-6">
                  <FormGroup
                    label={__('Device Name :')}
                    type="plain-text"
                    value={deviceName}
                  />
                  <FormGroup
                    label={__('Firmware Version :')}
                    type="plain-text"
                    value={version}
                  />
                  <FormGroup
                    label={__('System Time :')}
                    type="plain-text"
                    value={systemTime}
                  />
                  {/*
                    <FormGroup
                      label={__('LAN1 MAC :')}
                      type="plain-text"
                      value={lan0Mac}
                    />
                    wirelessMode !== 'sta' ? (
                      <FormGroup
                        label={__('Client Number :')}
                        type="plain-text"
                        value={staList.length}
                      />
                    ) : null
                  */}
                  <FormGroup
                    label={__('CPU Used :')}
                    type="plain-text"
                    value={cpuInfo}
                    help="%"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="cols col-6" style={{ minWidth: '600px' }}>
            <div className="o-box__cell">
              <h3>{__('Radio')}</h3>
            </div>
            {
              this.props.store.getIn(['curData', 'radioList', radioId, 'enable']) === '1' ? (
                <div className="o-box__cell" style={{ height: '227px' }}>
                  <div className="cols col-6">
                    <FormGroup
                      label={__('Radio Mode :')}
                      type="plain-text"
                      value={wirelessModeShowStyle(wirelessMode)}
                    />
                    <FormGroup
                      label={__('Wireless Mode :')}
                      type="plain-text"
                      value={radioMode}
                    />
                    <FormGroup
                      label={__('Channel/Frequency :')}
                      type="plain-text"
                      value={`${channel}/${frequency}`}
                    />
                    <FormGroup
                      label={__('Channel Utilization :')}
                      type="plain-text"
                      value={chutil}
                    />
                  </div>
                  <div className="cols col-6">
                    <FormGroup
                      label={__('Tx Power :')}
                      type="plain-text"
                      value={txPower}
                      help="dBm"
                    />
                    <FormGroup
                      label={__('Signal :')}
                      type="plain-text"
                      value={signal}
                      help="dBm"
                    />
                    <FormGroup
                      label={__('Noise :')}
                      type="plain-text"
                      value={noise}
                      help="dBm"
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="o-box__cell"
                  style={{
                    width: '100%',
                    height: '260px',
                    lineHeight: '260px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                  }}
                >
                  Radio Off
                </div>
              )
            }

          </div>
        </div>

        <div>
          <div className="o-box__cell">
            <h3>{__('Ethernet')}</h3>
          </div>
          <div className="o-box__cell">
            <Table
              className="table"
              options={interfaceOptions}
              list={interfaces}
            />
          </div>
        </div>

        {
          wirelessMode === 'sta' ? (
            <div className="remoteApTable o-box">
              <div className="o-box__cell">
                <h3>{__('Connection Info')}</h3>
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
        }

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
