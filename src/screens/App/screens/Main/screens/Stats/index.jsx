import React from 'react';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { List, fromJS } from 'immutable';

// components
import {
  Table, Switchs, Icon, Modal, EchartReact,
} from 'shared/components';

import * as actions from './actions';
import reducer from './reducer';
import './_index.scss';

const flowRateFilter = utils.filter('flowRate');
const flowRateKbFilter = utils.filter('flowRate:["KB"]');
const msg = {
  ip: _('IP Address'),
  mac: _('MAC Address'),
  days: _('Days'),
  apStatus: _('AP Status'),
  total: _('Total:'),
  apNumber: _('AP Number'),
};
const timeTypeSwitchs = fromJS([
  {
    value: 'today',
    label: _('Today'),
  },
  {
    value: 'yesterday',
    label: _('Yesterday'),
  },
  {
    value: 'week',
    label: '7 ' + msg.days,
  },
  {
    value: 'half_month',
    label: '15 ' + msg.days,
  },
  {
    value: 'month',
    label: '30 ' + msg.days,
  },
]);
const clientTypeSwitchs = fromJS([
  {
    value: '1',
    label: _('Activity'),
  },
  {
    value: '2',
    label: _('Connect Time'),
  },
]);
const clientNetworkChartOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ' + _('clientUnit') + ' ({d}%)',
  },

  title: {
    text: _('Clients Frequency Diagram'),
    subtext: msg.total,
    x: 'center',
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
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};
const clientProducerOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ' + _('clientUnit') + ' ({d}%)',
  },

  title: {
    text: _('Terminal Type'),
    subtext: msg.total,
    x: 'center',
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
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};
const apChartOption = {
  color: ['#c23531', '#4BC076', '#2f4554', '#61a0a8', '#d48265'],
  tooltip: {
    trigger: 'item',
    formatter: `{a} <br/>{b} : {c} ${_('apUnit')} ({d}%)`,
  },
  title: {
    text: msg.apStatus,
    subtext: msg.total,
    x: 'center',
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
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
};
const colors = ['#c23531', '#2f4554', '#0093dd', '#d48265', '#91c7ae'];
const clientsStatsOption = fromJS({
  color: colors,
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['2.4G', '5G', _('Total')],
  },
  xAxis: [{
    type: 'category',
    interval: 1,
    splitLine: {
      interval: 0,
    },
    axisLabel: {
      interval: 0,
    },
  }],
  yAxis: [{
    type: 'value',
    name: _('Number'),
    minInterval: 1,
    splitNumber: 5,
    color: colors[0],
    axisLabel: {
      formatter: '{value}',
    },
    axisLine: {
      lineStyle: {
        color: colors[1],
      },
    },
  }],
  series: [
    {
      name: '2.4G',
      type: 'bar',
    },
    {
      name: '5G',
      type: 'bar',
    },
    {
      name: _('Total'),
      type: 'line',
    },
  ],
});
const clientsDayStatsOption = clientsStatsOption.toJS();
const clientsWeekStatsOption = clientsStatsOption.toJS();
const clients15DayStatsOption = clientsStatsOption.toJS();
const clients30DayStatsOption = clientsStatsOption.toJS();
const statisticsChartStyle = {
  width: '100%',
};

// 原生的 react 页面
export const Status = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      showOfflineAp: false,
    };
  },

  componentWillMount() {
    this.props.fetchStatus();
    this.props.fetchOfflineAp();
  },

  componentWillUnmount() {
    this.props.leaveStatusScreen();
  },

  hideOfflineApp() {
    this.props.hideOfflineAp()
  },

  showOfflineAp() {
    this.props.showOfflineAp();
    this.props.fetchOfflineAp();
  },

  onChangeTime(data) {
    if (data.value) {
      this.props.changeStatsQuery({
        time_type: data.value,
      });

      this.props.fetchStatus();
    }
  },
  onChangeClientSortType(data) {
    if (data.value) {
      this.props.changeStatsQuery({
        'sort_type': data.value,
      });

      this.props.fetchStatus();
    }
  },

  onOfflineApPageChange(i) {
    this.props.changeOfflineApQuery({
      page: i,
    });
    this.props.fetchOfflineAp();
  },

  createTimeTypeClass(type) {
    let ret = 'btn';

    if (this.props.query.get('time_type') === name) {
      ret += ' active';
    }

    return ret;
  },

  getClientsListOption() {
    const ret = fromJS([
      {
        id: 'hostname',
        text: _('Name'),
        transform(val, item) {
          return val || item.get('macaddress');
        },
      }, {
        id: 'ipaddress',
        text: _('IP Address'),
      }, {
        id: 'macaddress',
        text: _('MAC Address'),
      }, {
        id: 'softversion',
        text: _('UP/Down'),
        transform(val, item) {
          return flowRateKbFilter.transform(item.get('upstream')) +
              ' / ' + flowRateKbFilter.transform(item.get('downstream'));
        },
      }, {
        id: 'connecttime',
        text: _('Connect Time'),
        filter: 'connectTime',
        width: '160',
      },
    ]);

    return ret;
  },

  getApListOption() {
    const ret = fromJS([
      {
        id: 'devicename',
        text: _('Name'),
        transform(val, item) {
          return val || item.get('macaddress');
        },
      }, {
        id: 'ipaddress',
        text: _('IP Address'),
      }, {
        id: 'macaddress',
        text: _('MAC Address'),
      }, {
        id: 'up/down flow',
        text: _('UP/Down'),
        transform(val, item) {
          return flowRateFilter.transform(item.get('upstream')) + ' / ' +
              flowRateFilter.transform(item.get('downstream'));
        },
      },
    ]);

    return ret;
  },

  getOfflineApListOption() {
    const ret = fromJS([
      {
        id: 'devicename',
        text: _('Name'),
        transform(val, item) {
          return val || item.get('mac');
        },
      }, {
        id: 'model',
        text: _('Model'),
      }, {
        id: 'softversion',
        text: _('Version'),
      }, {
        id: 'channel',
        text: _('Channel'),
        transform(val, item) {
          let ret = val;

          if (val == 0) {
            ret = _('auto');
          }
          return ret;
        },
      },
    ]);

    return ret;
  },
  getClientNumberChartOption(type) {
    const clientInfo = this.props.data.get('clientInfo');
    let ret = clientNetworkChartOption;

    if (clientInfo.get('producerlist')) {
      clientProducerOption.series[0].data = clientInfo.get('producerlist')
        .map((val, key) => ({
          value: val,
          name: _(key),
        })).toArray()
      .sort((prev, next) => prev.value <= next.value);
    }

    clientNetworkChartOption.series[0].data = clientInfo.delete('total').delete('producerlist')
      .map((val, key) => ({
        value: val,
        name: _(key),
      })).toArray()
      .sort((prev, next) => prev.value <= next.value);

    if (type === 'producer') {
      ret = clientProducerOption;
    }
    ret.title.subtext = msg.total + clientInfo.get('total');

    return ret;
  },

  getApNumberChartOption() {
    const apInfo = this.props.data.get('apInfo');
    const data = apInfo.delete('total').delete('default').map(function (val, key) {
      return {
        value: val,
        name: _(key),
      };
    }).toArray();

    apChartOption.series[0].data = data;
    apChartOption.title.subtext = msg.total + apInfo.get('total');

    return apChartOption;
  },
  getClientStatisticsChartOption() {
    const dayText = _('D');
    let clientStatisticsList = this.props.data.get('clientStatisticsList');
    let totalClientStatisticsList = null;
    let xAxisData;
    let xAxisName = _('Days');
    let maxData = 200;
    var ret = clientsDayStatsOption;

    if (!clientStatisticsList) {
      return;
    }
    totalClientStatisticsList = clientStatisticsList.getIn([0, 'data']).map(function (item, i) {
      return item + clientStatisticsList.getIn([1, 'data', i]);
    }).toJS();
    clientStatisticsList = clientStatisticsList.toJS();

    maxData = Math.max.apply(null, clientStatisticsList[0].data.concat(clientStatisticsList[1].data));

    maxData = parseInt(maxData * 1.2, 10);
    maxData = maxData < 5 ? 5 : maxData;

    if (this.props.query.get('time_type') === 'yesterday' ||
        this.props.query.get('time_type') === 'today') {
      xAxisData = List(new Array(24)).map(function (val, i) {
        return (i) + ':00';
      }).toJS();
      xAxisName = _('Hours');
      ret = clientsDayStatsOption;
    } else if (this.props.query.get('time_type') === 'week') {
      xAxisData = List(new Array(7)).map(function (val, i) {
        return i + 1;
      }).toJS();
      ret = clientsWeekStatsOption;
    } else if (this.props.query.get('time_type') === 'half_month') {
      xAxisData = List(new Array(15)).map(function (val, i) {
        return i + 1;
      }).toJS();
      ret = clients15DayStatsOption;
    } else {
      xAxisData = List(new Array(30)).map(function (val, i) {
        return i + 1;
      }).toJS();
      ret = clients30DayStatsOption;
    }

    ret.xAxis[0].data = xAxisData;
    ret.xAxis[0].name = xAxisName;

    ret.series[0].data = clientStatisticsList[0].data;
    ret.series[1].data = clientStatisticsList[1].data;
    ret.series[2].data = totalClientStatisticsList;

    return ret;
  },

  onDeleteOfflineDev(mac) {
    this.props.deleteOfflineAp(mac);
  },

  render() {
    const clientsListOption = this.getClientsListOption();
    const apListOption = this.getApListOption();
    const offlineApOption = this.getOfflineApListOption();
    const apNumberChartOption = this.getApNumberChartOption();
    const statisticsChartOption = this.getClientStatisticsChartOption();
    const clientNetworkChartOption = this.getClientNumberChartOption();
    const clientsProducerChart = this.getClientNumberChartOption('producer');

    return (
      <div className="Stats">
        <h2>{ _('Statistics') }</h2>
        <div className="stats-group clearfix" >
          <div className="stats-group-small" >
            <div className="stats-group-cell">
              <h3>{ msg.apNumber }</h3>
            </div>
            <div className="stats-group-cell">
              <EchartReact
                className="stats-group-canvas"
                option={apNumberChartOption}
                onEvents={{
                  click: (params) => {
                    if (params.dataIndex === 0) {
                      this.showOfflineAp();
                    } else {
                      window.location.hash = '#/main/devices';
                    }
                    return true;
                  },
                }}
              />
            </div>
          </div>
          <div className="stats-group-medium" >
            <div className="stats-group-cell">
              <h3>{ _('Clients Number') }</h3>
            </div>
            <div className="stats-group-cell">
              <div className="cols col-6">
                <EchartReact
                  option={clientNetworkChartOption}
                  className="stats-group-canvas"
                />
              </div>
              <div className="cols col-6">
                <EchartReact
                  option={clientsProducerChart}
                  className="stats-group-canvas"
                />
              </div>

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
              <EchartReact
                className="stats-group-canvas"
                option={statisticsChartOption}
                style={statisticsChartStyle}
                needClear
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
          isShow={this.props.isOfflineApShow}
          title={_('Offline Ap List')}
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
  },
});

function mapStateToProps(state) {
  const myState = state.status;
  return {
    app: state.app,
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    offlineAp: myState.get('offlineAp'),
    isOfflineApShow: myState.get('isOfflineApShow'),
    query: myState.get('query'),
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions
)(Status);

export const status = reducer;
