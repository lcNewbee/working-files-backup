import React from 'react';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {List, fromJS} from 'immutable';

// components
import {Table} from 'shared/components/Table';
import Switchs from 'shared/components/Switchs';
import Button from 'shared/components/Button';
import Icon from 'shared/components/Icon';
import Modal from 'shared/components/Modal';

import * as actions from './actions';
import reducer from './reducer';
import echarts from 'echarts/lib/echarts';
import './index.scss';

/**
 * echarts图标按需引入
 */
// 引入柱状图
require('echarts/lib/chart/bar');

// 引入折线图
require('echarts/lib/chart/line');
require('echarts/lib/chart/lines');

// 引入折饼图
require('echarts/lib/chart/pie');

// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

const flowRateFilter = utils.filter('flowRate');
const flowRateKbFilter = utils.filter('flowRate:["KB"]');
const tooltip = {
  trigger: 'item',
  formatter: "{a} <br/>{b} : {c} ({d}%)"
}
const msg = {
  ip: _("IP Address"),
  mac: _("MAC Address"),
  days: _("Days"),
  apStatus: _('AP Status'),
  total: _('Total:'),
  apNumber: _('AP Number')

};
const timeTypeSwitchs = fromJS([
  {
    value: 'today',
    label: _('Today')
  },
  {
    value: 'yesterday',
    label: _('Yesterday')
  },
  {
    value: 'week',
    label: '7 ' + msg.days
  },
  {
    value: 'half_month',
    label: '15 ' + msg.days
  },
  {
    value: 'month',
    label: '30 ' + msg.days
  }
]);
const clientTypeSwitchs = fromJS([
  {
    value: '1',
    label: _('Activity')
  },
  {
    value: '2',
    label: _('Connect Time')
  }
]);

let apChart, statsChart, clientsChannelChart, clientsProducerChart;


// 原生的 react 页面
export const Status = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
     return {
       showOfflineAp: false
     }
  },

  componentWillMount() {
    this.props.fetchStatus();
    this.props.fetchOfflineAp();
  },

  componentDidMount() {
    // apChart = echarts.init(document.getElementById('echartsContent'));
    // statsChart = echarts.init(document.getElementById('clientsStats'));
    // clientsChannelChart = echarts.init(document.getElementById('clientsChannelStats'));
    // clientsProducerChart = echarts.init(document.getElementById('clientsProducerStats'));

    // this.renderApNumber();
    // this.renderClientNumber();
    // this.renderClientStatistics();

  },

  componentDidUpdate(prevProps) {
    apChart = echarts.init(document.getElementById('echartsContent'));
    statsChart = echarts.init(document.getElementById('clientsStats'));
    clientsChannelChart = echarts.init(document.getElementById('clientsChannelStats'));
    clientsProducerChart = echarts.init(document.getElementById('clientsProducerStats'));

    //if(!prevProps.data.equals(this.props.data)) {
      this.renderApNumber();
      this.renderClientNumber();
      this.renderClientStatistics();
    //}

  },

  componentWillUnmount() {
    this.props.leaveStatusScreen();
  },

  hideOfflineApp() {
    this.setState({
      showOfflineAp: false
    })
  },

  showOfflineAp() {
    this.props.fetchOfflineAp();
    this.setState({
      showOfflineAp: true
    });
  },

  renderApNumber() {
    const apInfo = this.props.data.get('apInfo');

    let apOption = {
      tooltip:  {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} " + _('apUnit') + " ({d}%)"
      },
      title: {
        text: msg.apStatus,
        subtext: msg.total + apInfo.get('total'),
        x: 'center'
      },
      series: [
        {
          name: _('Status'),
          type: 'pie',
          radius: ['10%', '45%'],
          center: ['50%', '58%'],

          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    const data = apInfo.delete('total').delete('default').map(function(val, key) {
      return {
        value: val,
        name: _(key)
      }
    }).toArray();

    apOption.series[0].data = data;
    apChart.setOption(apOption);

    apChart.on('click', function(params) {
      if(params.dataIndex === 0) {
        this.showOfflineAp();
      } else {
        window.location.hash = "#/main/devices";
      }

    }.bind(this));
  },

  renderClientNumber() {
    const clientInfo = this.props.data.get('clientInfo');
    const clientNetworkOption = {
      tooltip:  {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} " + _('clientUnit') + " ({d}%)"
      },

      title: {
        text: _('Clients Frequency Diagram'),
        subtext: _('Total:') + clientInfo.get('total'),
        x: 'center'
      },

      series: [
        {
          name: _('Frequency'),
          type: 'pie',
          radius: ['10%', '45%'],
          center: ['50%', '58%'],

          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    const clientProducerOption = {
      tooltip:  {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} " + _('clientUnit') + " ({d}%)"
      },

      title: {
        text: _('Clients Producer Diagram'),
        subtext: _('Total:') + clientInfo.get('total'),
        x: 'center'
      },

      series: [
        {
          name: _('Producer'),
          type: 'pie',
          radius: ['10%', '45%'],
          center: ['50%', '58%'],

          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    if(clientInfo.get('producerlist')) {
      clientProducerOption.series[0].data = clientInfo.get('producerlist')
        .map(function(val, key) {
          return {
            value: val,
            name: _(key)
          }
        }).toArray();
    }


    clientNetworkOption.series[0].data = clientInfo.delete('total').delete('producerlist')
      .map(function(val, key) {
        return {
          value: val,
          name: _(key)
        }
      }).toArray();

    clientsChannelChart.setOption(clientNetworkOption);
    clientsProducerChart.setOption(clientProducerOption);
  },

  renderClientStatistics() {
    const dayText = _('D')
    const colors = ['#c23531','#2f4554', '#0093dd', '#d48265', '#91c7ae'];
    let clientStatisticsList = this.props.data.get('clientStatisticsList');
    let totalClientStatisticsList = null;
    let xAxisData;
    let xAxisName = _('Days');
    let maxData = 200;

    if(!clientStatisticsList) {
      return ;
    }
    totalClientStatisticsList = clientStatisticsList.getIn([0, 'data']).map(function (item, i){
      return item + clientStatisticsList.getIn([1, 'data', i]);
    }).toJS();
    clientStatisticsList = clientStatisticsList.toJS();

    maxData = Math.max.apply(null, clientStatisticsList[0].data.concat(clientStatisticsList[1].data));

    maxData = parseInt(maxData * 1.2, 10);
    maxData = maxData < 5 ? 5 : maxData;

    if(this.props.query.get('time_type') === 'yesterday' ||
        this.props.query.get('time_type') === 'today') {

      xAxisData = List(new Array(24)).map(function(val, i) {
        return (i) + ':00';
      }).toJS();
      xAxisName = _('Hours');

    } else if (this.props.query.get('time_type') === 'week') {

      xAxisData = List(new Array(7)).map(function(val, i) {
        return i + 1;
      }).toJS();
    } else if (this.props.query.get('time_type') === 'half_month') {

      xAxisData = List(new Array(15)).map(function(val, i) {
        return i + 1;
      }).toJS();
    } else {

      xAxisData = List(new Array(30)).map(function(val, i) {
        return i + 1;
      }).toJS();
    }

    const ClientsStatsOption = {
        color: colors,

        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['2.4G', '5G', _('Total'),_('upstream'),_('downstream')],
        },
        xAxis: [{
          type: 'category',
          data: xAxisData,
          name: xAxisName,
          interval: 1,
          splitLine: {
            interval: 0
          },
          axisLabel: {
            interval: 0
          }
        }],
        yAxis: [{
            type: 'value',
            name: _('Number'),
            minInterval: 1,
            splitNumber:5,
            color: colors[0],
            axisLabel: {
              formatter: '{value}'
            },
            axisLine: {
              lineStyle: {
                  color: colors[1]
              }
            },
          },
          {
            type:'value',
            name:_('UP/Down Flow'),
            minInterval:0.1,
            splitNumber:5,
            color:colors[2],
            axisLabel:{
              fromatter:'{value}'
            },
            axisLine:{
              lineStyle:{
                color:colors[3]
              }
            }
          }
        ],

        series: [
          {
            name: '2.4G',
            type: 'bar',
            data: clientStatisticsList[0].data
          },
          {
            name: '5G',
            type: 'bar',
            data: clientStatisticsList[1].data
          },
          {
            name: _('Total'),
            type: 'line',
            data: totalClientStatisticsList
          },
          {
            name:_('upstream'),
            type:'line',
            yAxisIndex:1,
            data:clientStatisticsList[2].data
          },
          {
            name:_('downstream'),
            type:'line',
            yAxisIndex: 1,
            data:clientStatisticsList[3].data
          }
        ]
      };
    statsChart.setOption(ClientsStatsOption);
  },

  toPdf() {
    var doc = new jsPDF();
    var imgData;
    var Context;
    var Canvas = document.getElementsByTagName("canvas")[0];

    Context = Canvas.getContext("2d");
    imgData = Canvas.toDataURL('image/png');
    doc.text(20, 20, 'AP数量');
    doc.addImage(imgData, 'png', 20, 30, 50, 50);

    doc.save('download1.pdf');
  },

  onChangeTime(data) {
    if(data.value) {
      this.props.changeStatsQuery({
        'time_type': data.value
      });

      this.props.fetchStatus();
    }
  },
  onChangeClientSortType(data) {
    if(data.value) {
      this.props.changeStatsQuery({
        'sort_type': data.value
      });

      this.props.fetchStatus();
    }
  },

  onOfflineApPageChange(i) {
    this.props.changeOfflineApQuery({
      page: i
    });
    this.props.fetchOfflineAp();
  },

  createTimeTypeClass(type) {
    var ret = 'btn';

    if(this.props.query.get('time_type') === name) {
      ret += ' active';
    }

    return ret;
  },

  getClientsListOption() {
    const ret = fromJS([
      {
        id: 'hostname',
        text: _('Name'),
        transform: function(val, item) {
          return val || item.get('macaddress');
        }
      }, {
        id: 'ipaddress',
        text:  _('IP Address')
      }, {
        id: 'macaddress',
        text:  _('MAC Address')
      }, {
        id: 'softversion',
        text:  _('UP/Down Flow'),
        transform(val, item) {
          return flowRateKbFilter.transform(item.get('upstream')) +
              ' / ' + flowRateKbFilter.transform(item.get('downstream'));
        }
      }, {
        id: 'connecttime',
        text:  _('Connect Time'),
        filter: 'connectTime',
        width: '160',
      }
    ]);

    return ret;
  },

  getApListOption() {
    var ret = fromJS([
      {
        id: 'devicename',
        text: _('Name'),
        transform: function(val, item) {
          return val || item.get('macaddress');
        }
      }, {
        id: 'ipaddress',
        text:  _('IP Address')
      }, {
        id: 'macaddress',
        text:  _('MAC Address')
      }, {
        id: 'up/down flow',
        text:  _('UP/Down Flow'),
        transform(val, item) {
          return flowRateFilter.transform(item.get('upstream')) + ' / ' +
              flowRateFilter.transform(item.get('downstream'));
        }
      }
    ]);

    return ret;
  },

  getOfflineApListOption() {
    var ret = fromJS([
      {
        id: 'devicename',
        text: _('Name'),
        transform: function(val, item) {
          return val || item.get('mac');
        }
      }, {
        id: 'model',
        text: _('Model')
      }, {
        id: 'softversion',
        text: _('Version')
      }, {
        id: 'channel',
        text: _('Channel'),
        transform: function(val, item) {
          var ret = val;

          if(val == 0) {
            ret = _('auto');
          }
          return ret;
        }
      }, {
        id: 'op',
        text: _('Actions'),
        transform: function(val, item) {
          var mac = item.get('mac');
          return (
            <Button
              icon="bomb"
              size="sm"
              text={_('Delete')}
              onClick={this.onDeleteOfflineDev.bind(this, mac)}
            />
          );
        }.bind(this)
      }
    ]);

    return ret;
  },

  onDeleteOfflineDev: function(mac) {
    this.props.deleteOfflineAp(mac);
  },

  render() {
    const clientsListOption = this.getClientsListOption();
    const apListOption = this.getApListOption();
    const offlineApOption = this.getOfflineApListOption();

    return (
      <div className="Stats">
        <h2>{ _('Statistics') }</h2>
        <div className="stats-group clearfix" >
          <div className="stats-group-small" >
            <div className="stats-group-cell">
              <h3>{ msg.apNumber }</h3>
            </div>
            <div className="stats-group-cell">
              <div
                id="echartsContent"
                className="stats-group-canvas"
              />
            </div>
          </div>
          <div className="stats-group-medium" >
            <div className="stats-group-cell">
              <h3>{ _('Clients Number') }</h3>
            </div>
            <div className="stats-group-cell">
              <div
                id="clientsChannelStats"
                className="stats-group-canvas"
                style={{
                  width: '50%'
                }}
              />
              <div id="clientsProducerStats"
                className="stats-group-canvas"
                style={{
                  width: '50%'
                }}
              />
            </div>
          </div>
          <div className="stats-group-large" >
            <div className="stats-group-cell">
              <h3>{ _('Clients Statistics') }
                <Switchs
                  options={timeTypeSwitchs}
                  value={this.props.query.get('time_type')}
                  onChange={this.onChangeTime}
                />
              </h3>
            </div>
            <div className="stats-group-cell">
              <div
                id="clientsStats"
                className="stats-group-canvas"
                style={{
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div className="stats-group-large">
            <div className="stats-group-header">
              <h3>{_('Clients Ranklist')}
                <Switchs
                  options={clientTypeSwitchs}
                  value={this.props.query.get('sort_type')}
                  onChange={this.onChangeClientSortType}
                />
                <a className="link-more" href="#/main/clients">
                  {_('See More')}
                  <Icon name="arrow-circle-o-right" className="icon" />
                </a>
              </h3>
            </div>
            <div className="stats-group-cell">
              <Table
                className="table"
                options={clientsListOption}
                list={this.props.data.get('clientlist')}
              />
            </div>
          </div>

          <div className="stats-group-large">
            <div className="stats-group-header">
              <h3>{ _('AP Activity Ranklist') }
                <a className="link-more" href="#/main/devices">{_('See More')}
                  <Icon name="arrow-circle-o-right" className="icon" />
                </a>
              </h3>
            </div>
            <div className="stats-group-cell">
              <Table
                className="table"
                options={apListOption}
                list={this.props.data.get('aplist')}
              />
            </div>
          </div>

        </div>

        <Modal
          isShow={this.state.showOfflineAp}
          title={_("Offline Ap List")}
          onClose={this.hideOfflineApp}
          onOk={this.hideOfflineApp}
        >
          <Table
            className="table"
            options={offlineApOption}
            list={this.props.offlineAp.get('list')}
            page={this.props.offlineAp.get('page')}
            onPageChange={this.onOfflineApPageChange}
          />

        </Modal>
      </div>
    );
  }
});

function mapStateToProps(state) {
  const myState = state.status;
  return {
    app: state.app,
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    offlineAp: myState.get('offlineAp'),
    query: myState.get('query')
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions
)(Status);

export const status = reducer;
