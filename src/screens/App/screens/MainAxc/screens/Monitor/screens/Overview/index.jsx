import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Map, List, fromJS } from 'immutable';
import PureComponent from 'shared/components/Base/PureComponent';
import EchartReact from 'shared/components/EchartReact';
import Table from 'shared/components/Table';
import Switchs from 'shared/components/Switchs';
import Select from 'shared/components/Select';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';
import { colors, $$commonPieOption } from 'shared/config/axc';

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
    id: 'mac',
    text: _('MAC'),
    width: '30%',
  }, {
    id: 'ssid',
    text: _('SSID'),
    width: '30%',
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

function getTerminalTypeOption(serverData) {
  let dataList = serverData.get('terminalType');
  const ret = $$commonPieOption.mergeDeep({
    title: {
      text: _('Online Number'),
      subtext: serverData.get('clientsNumber'),
    },
    legend: {
      formatter: (name) => {
        const num = serverData.get('terminalType')
          .find($$item => $$item.get('name') === name)
          .get('value');

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
    dataList = dataList.sort(($$a, $$b) => {
      const a = $$a.get('value');
      const b = $$b.get('value');

      if (a < b) { return 1; }
      if (a > b) { return -1; }
      if (a === b) { return 0; }
    });
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
        let num = serverData.get('offline');

        if (name === _('Online')) {
          num = serverData.get('online');
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
  } else if (val <= (50 * Math.pow(1024, 2))) {
    ret = {
      label: 'KB',
      val: Math.pow(1024, 1),
    };
  } else if (val <= (50 * Math.pow(1024, 3))) {
    ret = {
      label: 'GB',
      val: Math.pow(1024, 2),
    };
  } else {
    ret = {
      label: 'TB',
      val: Math.pow(1024, 3),
    };
  }
  return ret;
}
function getFlowOption(serverData, timeType) {
  const option = {
    color: [colors[7], colors[0]],
    tooltip: {
      trigger: 'axis',
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
      minInterval: 1,
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
        // itemStyle: {
        //   normal: {
        //     areaStyle: {
        //       type: 'default',
        //       opacity: 0.3,
        //     },
        //   },
        // },
      },
      {
        name: _('Wireless'),
        type: 'line',
        smooth: true,
        // itemStyle: {
        //   normal: {
        //     areaStyle: {
        //       type: 'default',
        //       opacity: 0.4,
        //     },
        //   },
        // },
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
    val => (val / utilObj.val),
  );
  option.series[1].data = $$dataList[1].data.map(
    val => (val / utilObj.val),
  );

  return option;
}

const propTypes = {
  screens: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  groupid: PropTypes.any,
  initScreen: PropTypes.func,
  leaveScreen: PropTypes.func,
  fetchScreenData: PropTypes.func,
  changeScreenQuery: PropTypes.func,
};
const defaultProps = {};
export default class View extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onChangeTimeType',
    ]);
    props.initScreen({
      id: props.route.id,
      formUrl: props.route.formUrl,
      path: props.route.path,
      isFetchInfinite: true,
      fetchIntervalTime: 5000,
      query: {
        groupid: props.groupid,
        timeType: 'today',
      },
    });
  }

  componentWillMount() {
    this.props.fetchScreenData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.groupid !== prevProps.groupid) {
      this.props.changeScreenQuery({
        groupid: this.props.groupid,
      });
      this.props.fetchScreenData();
    }
  }

  componentWillUnmount() {
    this.props.leaveScreen();
  }

  onChangeTimeType(data) {
    this.props.changeScreenQuery({
      timeType: data.value,
    });
    this.props.fetchScreenData();
  }

  render() {
    const { screens, route } = this.props;
    const curScreenId = screens.get('curScreenId');
    const serverData = screens.getIn([curScreenId, 'data']);
    const apStatusOption = getApStatusOption(serverData);
    const terminalTypeOption = getTerminalTypeOption(serverData);
    const flowOption = getFlowOption(serverData, screens.getIn([curScreenId, 'query', 'timeType']));

    return (
      <div>
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
                  style={{
                    width: '100%',
                    minHeight: '200px',
                  }}
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
                  style={{
                    minHeight: '200px',
                    width: '100%',
                  }}
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
                  value={screens.getIn([curScreenId, 'query', 'timeType'])}
                  onChange={this.onChangeTimeType}
                  clearable={false}
                />
              </h3>
            </div>
            <div className="element">
              <EchartReact
                option={flowOption}
                className="o-box__canvas"
                style={{
                  width: '100%',
                  minHeight: '300px',
                }}
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
      </div>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
    screens: state.screens,
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
