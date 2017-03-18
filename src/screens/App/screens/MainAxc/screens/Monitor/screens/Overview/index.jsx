import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Map, List, fromJS } from 'immutable';
import EchartReact from 'shared/components/EchartReact';
import Table from 'shared/components/Table';
import Select from 'shared/components/Select';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';
import { colors, $$commonPieOption } from 'shared/config/axc';
import AppScreen from 'shared/components/Template/AppScreen';

const flowRateFilter = utils.filter('flowRate');

const msg = {
  days: _('Days'),
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
    label: `7 ${msg.days}`,
  },
  {
    value: 'half_month',
    label: `15 ${msg.days}`,
  },
  {
    value: 'month',
    label: `30 ${msg.days}`,
  },
]);
const ssidTableOptions = fromJS([
  {
    id: 'time',
    text: _('Time'),
    width: '20%',
  }, {
    id: 'mac',
    text: _('MAC'),
    width: '20%',
  }, {
    id: 'ssid',
    text: _('SSID'),
    width: '20%',
  }, {
    id: 'channel',
    text: _('Channel'),
    width: '20%',
  }, {
    id: 'rssi',
    text: _('rssi'),
    width: '20%',
  },
]);
const chartStyle = {
  width: '100%',
  minHeight: '200px',
};
const flowChartStyle = {
  width: '100%',
  minHeight: '300px',
};

function getTerminalTypeOption(serverData) {
  let dataList = serverData.get('terminalType');
  const ret = $$commonPieOption.mergeDeep({
    title: {
      text: _('Online Number'),
      subtext: `${serverData.get('clientsNumber') || 0}`,
    },
    legend: {
      formatter: (name) => {
        const num = dataList
          .find($$item => $$item.get('name') === name)
          .get('value') || 0;

        return `${name}: ${num}`;
      },
    },
    series: [
      {
        name: _('Type'),
      },
    ],
  }).toJS();


  if (List.isList(dataList)) {
    if (dataList.size < 1) {
      dataList = fromJS([{
        name: _('None'),
        value: 0,
      }]);
    } else {
      dataList = dataList.sort(($$a, $$b) => {
        const a = $$a.get('value');
        const b = $$b.get('value');
        let result = 0;

        if (a < b) {
          result = 1;
        } else if (a > b) {
          result = -1;
        }

        return result;
      });
    }

    ret.legend.data = dataList.map(item => item.get('name')).toJS();
    ret.series[0].data = dataList.toJS();
  }

  return ret;
}
function getApStatusOption(serverData) {
  const onlineNum = serverData.get('online') || 0;
  const offlineNum = serverData.get('offline') || 0;
  const ret = $$commonPieOption.mergeDeep({
    color: [colors[7], colors[2]],
    title: {
      text: _('AP Status'),
      subtext: `${onlineNum} / ${offlineNum}`,
    },
    legend: {
      formatter: (name) => {
        let num = serverData.get('offline') || 0;

        if (name === _('Online')) {
          num = serverData.get('online') || 0;
        }
        return `${name}: ${num}`;
      },
      data: [_('Offline'), _('Online')],
    },
    series: [
      {
        name: _('Status'),
      },
    ],
  }).toJS();

  ret.series[0].data = [
    { value: offlineNum, name: _('Offline') },
    { value: onlineNum, name: _('Online') },
  ];

  return ret;
}
function getFlowUnit(val) {
  let ret = {};

  if (val <= 10240) {
    ret = {
      label: 'B',
      val: 1,
    };
  } else if (val <= (50 * (1024 ** 2))) {
    ret = {
      label: 'KB',
      val: 1024,
    };
  } else if (val <= (50 * (1024 ** 3))) {
    ret = {
      label: 'MB',
      val: 1024 ** 2,
    };
  } else if (val <= (50 * (1024 ** 4))) {
    ret = {
      label: 'GB',
      val: 1024 ** 3,
    };
  } else {
    ret = {
      label: 'TB',
      val: 1024 ** 4,
    };
  }
  return ret;
}

function getFlowOption(serverData, timeType) {
  const option = {
    color: [colors[0], colors[1]],
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        return `${params[0].name}<br />
                ${params[0].seriesName}: ${flowRateFilter.transform(params[0].value)}<br />
                ${params[1].seriesName}: ${flowRateFilter.transform(params[1].value)}`
      }
    },
    legend: {
      data: ['AP', _('Wireless')],
    },
    grid: {
      left: '0',
      right: '7%',
      bottom: '3%',
      containLabel: true,
    },
    calculable: true,
    xAxis: [{
      type: 'category',
      interval: 1,
      nameGap: 5,
      nameTextStyle: {
        fontWeight: 'bolder',
      },
      splitLine: {
        show: false,
        interval: 0,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
      },
    }],
    yAxis: [{
      type: 'value',
      name: _('KB'),
      splitNumber: 5,
      min: 0,
      axisLabel: {
        formatter: '{value}',
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: '#e1e6e9',
        },
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    }],
    series: [
      {
        name: 'AP',
        type: 'line',
        smooth: true,
      },
      {
        name: _('Wireless'),
        type: 'line',
        smooth: true,
      },
    ],
  };
  let xAxisData;
  let xAxisName = _('Days');
  let $$dataList = serverData.getIn(['flowList']);
  let maxVal = 0;
  let maxVal1 = 0;
  let utilObj = {};

  if (!$$dataList || !$$dataList.getIn([0, 'data']) || !$$dataList.getIn([1, 'data'])) {
    return null;
  }
  if ($$dataList.getIn([0, 'data'])) {
    maxVal = $$dataList.getIn([0, 'data']).max();
  }
  if ($$dataList.getIn([1, 'data'])) {
    maxVal1 = $$dataList.getIn([1, 'data']).max();
  }

  if (maxVal1 > maxVal) {
    maxVal = maxVal1;
  }

  utilObj = getFlowUnit(maxVal);

  $$dataList = $$dataList.toJS();

  if (timeType === 'yesterday' ||
    timeType === 'today') {
    xAxisData = List(new Array(24)).map(
      (val, i) => `${i}:00`,
    ).toJS();
    xAxisName = _('Hours');
  } else if (timeType === 'week') {
    xAxisData = List(new Array(7)).map(
      (val, i) => i + 1,
    ).toJS();
  } else if (timeType === 'half_month') {
    xAxisData = List(new Array(15)).map(
      (val, i) => i + 1,
    ).toJS();
  } else {
    xAxisData = List(new Array(30)).map(
      (val, i) => i + 1,
    ).toJS();
  }

  option.xAxis[0].data = xAxisData;
  option.xAxis[0].name = xAxisName;
  option.yAxis[0].name = utilObj.label;

  option.series[0].data = $$dataList[0].data.map(
    val => parseFloat(Number(val / utilObj.val).toFixed(12)),
  );
  option.series[1].data = $$dataList[1].data.map(
    val => parseFloat(Number(val / utilObj.val).toFixed(12)),
  );

  return option;
}

const propTypes = {
  store: PropTypes.instanceOf(Map),
  fetchScreenData: PropTypes.func,
  changeScreenQuery: PropTypes.func,
};
const defaultProps = {};
export default class View extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onChangeTimeType',
    ]);
  }
  componentWillMount() {
    this.initOptions(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const curScreenId = nextProps.store.get('curScreenId');

    if (this.props.store.getIn([curScreenId, 'data']) !== nextProps.store.getIn([curScreenId, 'data'])) {
      this.initOptions(nextProps);
    }
  }

  onChangeTimeType(data) {
    this.props.changeScreenQuery({
      timeType: data.value,
    });
    this.props.fetchScreenData();
  }

  initOptions(props) {
    const { store } = props;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);

    this.serverData = serverData;
    this.apStatusOption = getApStatusOption(serverData);
    this.terminalTypeOption = getTerminalTypeOption(serverData);
    this.flowOption = getFlowOption(serverData, store.getIn([curScreenId, 'query', 'timeType']));
  }

  render() {
    const { store } = this.props;
    const { serverData, apStatusOption, terminalTypeOption, flowOption } = this;
    const curScreenId = store.get('curScreenId');
    return (
      <AppScreen
        {...this.props}
        initOption={{
          isFetchInfinite: true,
          fetchIntervalTime: 10000,
          query: {
            timeType: 'today',
          },
        }}
      >
        <div className="t-overview">
          <div className="t-overview__section row">
            <div className="cols col-6" >
              <div className="element">
                <h3>{_('AP')}</h3>
              </div>
              <div className="element">
                <EchartReact
                  option={apStatusOption}
                  className="o-box__canvas"
                  style={chartStyle}
                />
              </div>
            </div>
            <div className="cols col-6">
              <div className="element">
                <h3>{_('Clients')}</h3>
              </div>
              <div className="element row">
                <EchartReact
                  option={terminalTypeOption}
                  className="o-box__canvas cols col-8"
                  style={chartStyle}
                />
              </div>
            </div>
          </div>

          <h3 className="element t-overview__header">{_('Historical Graphs')}</h3>
          <div className="t-overview__section">
            <div className="element t-overview__section-header">
              <h3>
                <span
                  style={{
                    marginRight: '16px',
                  }}
                >
                  {_('Traffic')}
                </span>
                <Select
                  options={timeTypeSwitchs.toJS()}
                  value={store.getIn([curScreenId, 'query', 'timeType'])}
                  onChange={this.onChangeTimeType}
                  clearable={false}
                />
              </h3>
            </div>
            <div className="element">
              <EchartReact
                option={flowOption}
                className="o-box__canvas"
                style={flowChartStyle}
              />
            </div>
          </div>
          <h3 className="element t-overview__header">
            {_('Rogue AP List')}
          </h3>
          <div className="element t-overview__section">
            <Table
              className="table table--light"
              options={ssidTableOptions}
              list={serverData.getIn(['neighborsAps', 'list']) || fromJS([])}
              page={serverData.getIn(['neighborsAps', 'page'])}
            />
          </div>
          <h3 className="element t-overview__header">
            {_('Interfering AP List')}
          </h3>
          <div className="element t-overview__section">
            <Table
              className="table table--light"
              options={ssidTableOptions}
              list={serverData.getIn(['aroundAps', 'list']) || fromJS([])}
              page={serverData.getIn(['aroundAps', 'page'])}
            />
          </div>
        </div>
      </AppScreen>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
