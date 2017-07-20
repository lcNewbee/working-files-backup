import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, fromJS } from 'immutable';
import Button from 'shared/components/Button/Button';
// components
import {
  Table, Switchs, Icon, Modal, EchartReact,
} from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import * as actions from './actions';
import reducer from './reducer';

const flowRateFilter = utils.filter('flowRate');
const flowRateKbFilter = utils.filter('flowRate:["KB"]');
const msg = {
  ip: __('IP Address'),
  mac: __('MAC Address'),
  days: __('Days'),
  apStatus: __('AP Status'),
  total: __('Total:'),
  apNumber: __('AP Number'),
};
const colors = [
  '#00a7f6', '#f6402b', '#ff9801', '#ffc100',
  '#91d951', '#1fb5ac', '#73d6d1',
  '#00a7f6', '#1193f5', '#3e4cb7',
  '#6834bc', '#9c1ab2', '#eb1461',
];
const timeTypeSwitchs = fromJS([
  {
    value: 'today',
    label: __('Today'),
  },
  {
    value: 'yesterday',
    label: __('Yesterday'),
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
    label: __('Activity'),
  },
  {
    value: '2',
    label: __('Connect Time'),
  },
]);
const clientNetworkChartOption = {
  color: colors,
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ' + __('clientUnit') + ' ({d}%)',
  },

  title: {
    text: __('Clients Frequency Diagram'),
    subtext: msg.total,
    x: 'center',
  },

  series: [
    {
      name: __('Frequency'),
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
  color: colors,
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ' + __('clientUnit') + ' ({d}%)',
  },

  title: {
    text: __('Terminal Type'),
    subtext: msg.total,
    x: 'center',
  },

  series: [
    {
      name: __('Producer'),
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
  color: [colors[1], colors[4]],
  tooltip: {
    trigger: 'item',
    formatter: `{a} <br/>{b} : {c} ${__('apUnit')} ({d}%)`,
  },
  title: {
    text: msg.apStatus,
    subtext: msg.total,
    x: 'center',
  },
  series: [
    {
      name: __('Status'),
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
// const colors = ['#c23531', '#2f4554', '#0093dd', '#d48265', '#91c7ae'];
const clientsStatsOption = fromJS({
  color: colors,
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['2.4G', '5G', __('Total')],
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
    name: __('Number'),
    minInterval: 1,
    min: 0,
    splitNumber: 5,
    color: colors[0],
    axisLabel: {
      formatter: '{value}',
    },
    axisLine: {
      lineStyle: {
        // color: colors[1],
      },
    },
    splitLine: {
      lineStyle: {
        color: '#ddd',
        type: 'dotted',
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
      name: __('Total'),
      type: 'line',
    },
  ],
});
const clientsDayStatsOption = clientsStatsOption.toJS();
const clientsWeekStatsOption = clientsStatsOption.toJS();
const clients15DayStatsOption = clientsStatsOption.toJS();
const clients30DayStatsOption = clientsStatsOption.toJS();
const eChartStyle = {
  width: '100%',
  height: '240px',
};

const propTypes = {
  createModal: PropTypes.func,
};
const defaultProps = {};

// 原生的 react 页面
export class Status extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showOfflineAp: false,
    };

    utils.binds(this, [
      'hideOfflineApp',
      'showOfflineAp',
      'onChangeTime',
      'onChangeClientSortType',
      'onOfflineApPageChange',
      'createTimeTypeClass',
      'getClientsListOption',
      'getApListOption',
      'getOfflineApListOption',
      'onDeleteOfflineAp',
      'getClientNumberChartOption',
      'getApNumberChartOption',
      'getClientStatisticsChartOption',
      'onDeleteOfflineDev',
    ]);
  }
  componentWillMount() {
    this.props.fetchStatus();
    this.props.fetchOfflineAp();
  }
  componentWillUnmount() {
    this.props.leaveStatusScreen();
  }

  hideOfflineApp() {
    this.props.hideOfflineAp()
  }

  showOfflineAp() {
    this.props.showOfflineAp();
    this.props.fetchOfflineAp();
  }

  onChangeTime(data) {
    if (data.value) {
      this.props.changeStatsQuery({
        time_type: data.value,
      });

      this.props.fetchStatus();
    }
  }

  onChangeClientSortType(data) {
    if (data.value) {
      this.props.changeStatsQuery({
        'sort_type': data.value,
      });

      this.props.fetchStatus();
    }
  }

  onOfflineApPageChange(i) {
    this.props.changeOfflineApQuery({
      page: i,
    });
    this.props.fetchOfflineAp();
  }

  onDeleteOfflineAp(mac) {
    const comfirmText = __('Are you sure delete offline AP: %s?', mac);
    this.props.createModal({
      id: 'status',
      role: 'confirm',
      text: comfirmText,
      apply: () => {
        this.props.deleteOfflineAp(mac);
      },
    });
    // this.props.deleteOfflineAp(mac);
  }
  createTimeTypeClass(type) {
    let ret = 'btn';

    if (this.props.query.get('time_type') === name) {
      ret += ' active';
    }

    return ret;
  }

  getClientsListOption() {
    const ret = fromJS([
      {
        id: 'hostname',
        text: __('Name'),
      }, {
        id: 'ipaddress',
        text: __('IP Address'),
      }, {
        id: 'macaddress',
        text: __('MAC Address'),
      }, {
        id: 'softversion',
        text: __('UP/Down'),
        render(val, item) {
          return flowRateKbFilter.transform(item.get('upstream')) +
              ' / ' + flowRateKbFilter.transform(item.get('downstream'));
        },
      }, {
        id: 'connecttime',
        text: __('Connect Time'),
        filter: 'connectTime',
        width: 160,
      },
    ]);

    return ret;
  }

  getApListOption() {
    const ret = fromJS([
      {
        id: 'devicename',
        text: __('Name'),
      }, {
        id: 'ipaddress',
        text: __('IP Address'),
      }, {
        id: 'macaddress',
        text: __('MAC Address'),
      }, {
        id: 'up/down flow',
        text: __('UP/Down'),
        render(val, item) {
          return flowRateFilter.transform(item.get('upstream')) + ' / ' +
              flowRateFilter.transform(item.get('downstream'));
        },
      },
    ]);

    return ret;
  }

  getOfflineApListOption() {
    const ret = fromJS([
      {
        id: 'index',
        text: __('Index'),
      },
      {
        id: 'devicename',
        text: __('Name'),
      }, {
        id: 'mac',
        text: __('MAC Address'),
      }, {
        id: 'model',
        text: __('Model'),
      }, {
        id: 'softversion',
        text: __('Version'),
      }, {
        id: 'channel2.4G',
        text: __('Channel2.4G'),
      }, {
        id: 'channel5.8G',
        text: __('Channel5.8G'),
      }, {
        id: 'op',
        text: __('Actions'),
        render: function (val, item) {
          return (
            <Button
              id={item.get('id')}
              icon="trash"
              text={__('Delete')}
              onClick={this.onDeleteOfflineAp.bind(this, item.get('mac'))}
              size="sm"
            />
          );
        }.bind(this),
      }]);

    return ret;
  }
  getClientNumberChartOption(type) {
    const clientInfo = this.props.data.get('clientInfo');
    let ret = clientNetworkChartOption;

    if (clientInfo.get('producerlist')) {
      clientProducerOption.series[0].data = clientInfo.get('producerlist')
        .map((val, key) => ({
          value: val,
          name: __(key),
        })).toArray()
      .sort((prev, next) => prev.value <= next.value);
    }

    clientNetworkChartOption.series[0].data = clientInfo.delete('total').delete('producerlist')
      .map((val, key) => ({
        value: val,
        name: __(key),
      })).toArray()
      .sort((prev, next) => prev.value <= next.value);

    if (type === 'producer') {
      ret = clientProducerOption;
    }
    ret.title.subtext = msg.total + clientInfo.get('total');

    return ret;
  }

  getApNumberChartOption() {
    const apInfo = this.props.data.get('apInfo');
    const data = apInfo.delete('total').delete('default').map(function (val, key) {
      return {
        value: val,
        name: __(key),
      };
    }).toArray();

    apChartOption.series[0].data = data;
    apChartOption.title.subtext = msg.total + apInfo.get('total');

    return apChartOption;
  }
  getClientStatisticsChartOption() {
    let clientStatisticsList = this.props.data.get('clientStatisticsList');
    let totalClientStatisticsList = null;
    let xAxisData;
    let xAxisName = __('Days');
    let maxData = 200;
    let ret = clientsDayStatsOption;

    if (!clientStatisticsList) {
      return;
    }

    totalClientStatisticsList = clientStatisticsList.getIn([0, 'data']).map(function (item, i) {
      return item + clientStatisticsList.getIn([1, 'data', i]);
    }).toJS();
    clientStatisticsList = clientStatisticsList.toJS();

    maxData = Math.max.apply(null, totalClientStatisticsList);

    maxData = parseInt(maxData, 10);

    // if (maxData % 5 !== 0) {
    //   maxData = (maxData + 5) - (maxData % 5);
    // }

    if (this.props.query.get('time_type') === 'yesterday' ||
        this.props.query.get('time_type') === 'today') {
      xAxisData = List(new Array(24)).map(function (val, i) {
        return (i) + ':00';
      }).toJS();
      xAxisName = __('Hours');
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
    ret.yAxis[0].max = maxData;

    ret.series[0].data = clientStatisticsList[0].data;
    ret.series[1].data = clientStatisticsList[1].data;
    ret.series[2].data = totalClientStatisticsList;

    return ret;
  }
  onDeleteOfflineDev(mac) {
    this.props.deleteOfflineAp(mac);
  }

  render() {
    const clientsListOption = this.getClientsListOption();
    const apListOption = this.getApListOption();
    const offlineApOption = this.getOfflineApListOption();
    const apNumberChartOption = this.getApNumberChartOption();
    const statisticsChartOption = this.getClientStatisticsChartOption();
    const clientNetworkChartOptions = this.getClientNumberChartOption();
    const clientsProducerChart = this.getClientNumberChartOption('producer');

    return (
      <div className="Stats t-overview">
        <h2>{ __('Statistics') }</h2>
        <div className="t-overview__section row" >
          <div className="cols col-4" >
            <div className="element t-overview__section-header">
              <h3>{ msg.apNumber }</h3>
            </div>
            <div className="element">
              <EchartReact
                style={eChartStyle}
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
          <div className="cols col-8" >
            <div className="element t-overview__section-header">
              <h3>{ __('Clients Number') }</h3>
            </div>
            <div className="element row">
              <div className="cols col-6">
                <EchartReact
                  option={clientNetworkChartOptions}
                  style={eChartStyle}
                />
              </div>
              <div className="cols col-6">
                <EchartReact
                  option={clientsProducerChart}
                  style={eChartStyle}
                />
              </div>

            </div>
          </div>
        </div>
        <div className="t-overview__section row" >
          <div >
            <h3 className="element t-overview__section-header">{ __('Clients Statistics') }
              <Switchs
                options={timeTypeSwitchs}
                value={this.props.query.get('time_type')}
                onChange={this.onChangeTime}
              />
            </h3>
          </div>
          <div className="element">
            <EchartReact
              className="stats-group-canvas"
              option={statisticsChartOption}
              style={{
                width: '100%',
                height: '300px',
              }}
              needClear
            />
          </div>
        </div>

        <div className="t-overview__section row">
          <div className="element t-overview__section-header">
            <h3>{__('Clients Ranklist')}
              <Switchs
                options={clientTypeSwitchs}
                value={this.props.query.get('sort_type')}
                onChange={this.onChangeClientSortType}
              />
              <a className="link-more" href="#/main/clients">
                {__('See More')}
                <Icon name="arrow-circle-o-right" className="icon" />
              </a>
            </h3>
          </div>
          <div className="element">
            <Table
              className="table"
              options={clientsListOption}
              list={this.props.data.get('clientlist')}
            />
          </div>
        </div>

        <div className="t-overview__section row">
          <div className="element t-overview__section-header">
            <h3>{ __('AP Activity Ranklist') }
              <a className="link-more" href="#/main/devices">{__('See More')}
                <Icon name="arrow-circle-o-right" className="icon" />
              </a>
            </h3>
          </div>
          <div className="element">
            <Table
              className="table"
              options={apListOption}
              list={this.props.data.get('aplist')}
            />
          </div>
        </div>

        <Modal
          isShow={this.props.isOfflineApShow}
          title={__('Offline Ap List')}
          onClose={this.hideOfflineApp}
          onOk={this.hideOfflineApp}
          draggable
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
}

Status.propTypes = propTypes;
Status.defaultProps = defaultProps;

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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Status);

export const status = reducer;
