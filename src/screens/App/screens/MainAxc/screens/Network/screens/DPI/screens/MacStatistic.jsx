import React, { PropTypes } from 'react';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import Select from 'shared/components/Select';
import Table from 'shared/components/Table';
import EchartReact from 'shared/components/EchartReact';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';
import { colors } from 'shared/config/axc';

const flowRateFilter = utils.filter('flowRate');
const propTypes = fromJS({
  route: PropTypes.object,
  initScreen: PropTypes.func,
});

const flowChartStyle = {
  width: '100%',
  minHeight: '300px',
};

const msg = {
  days: _('Days'),
};
const timeTypeSwitchs = fromJS([
  {
    value: '0',
    label: _('Today'),
  },
  {
    value: '1',
    label: _('Yesterday'),
  },
  {
    value: '7',
    label: `7 ${msg.days}`,
  },
  {
    value: '15',
    label: `15 ${msg.days}`,
  },
  {
    value: '30',
    label: `30 ${msg.days}`,
  },
]);

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
  } else if (val <= (50 * Math.pow(1024, 2))) {
    ret = {
      label: 'MB',
      val: Math.pow(1024, 2),
    };
  } else if (val <= (50 * Math.pow(1024, 3))) {
    ret = {
      label: 'GB',
      val: Math.pow(1024, 3),
    };
  } else {
    ret = {
      label: 'TB',
      val: Math.pow(1024, 4),
    };
  }
  return ret;
}

function getFlowOption(serverData, timeType) {
  const option = {
    color: [colors[0], colors[1]],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [_('Upload'), _('Download')],
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
        name: _('Upload'),
        type: 'line',
        // smooth: true,
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
        name: _('Download'),
        type: 'line',
        // smooth: true,
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
  let $$upDataList = serverData.getIn(['upFlowList']);
  let $$downDataList = serverData.getIn(['downFlowList']);
  let maxVal = 0;
  let maxVal1 = 0;
  let utilObj = {};

  if (!$$upDataList || !$$downDataList) {
    return null;
  }
  maxVal = $$upDataList.max();
  maxVal1 = $$downDataList.max();

  if (maxVal1 > maxVal) {
    maxVal = maxVal1;
  }

  utilObj = getFlowUnit(maxVal);

  $$upDataList = $$upDataList.toJS();
  $$downDataList = $$downDataList.toJS();

  if (timeType === '0' ||
    timeType === '1') {
    xAxisData = List(new Array(25)).map(
      (val, i) => `${i}:00`,
    ).toJS();
    xAxisName = _('Hours');
  } else if (timeType === '7') {
    xAxisData = List(new Array(8)).map(
      (val, i) => i,
    ).toJS();
  } else if (timeType === '15') {
    xAxisData = List(new Array(16)).map(
      (val, i) => i,
    ).toJS();
  } else {
    xAxisData = List(new Array(31)).map(
      (val, i) => i,
    ).toJS();
  }

  option.xAxis[0].data = xAxisData;
  option.xAxis[0].name = xAxisName;
  option.yAxis[0].name = utilObj.label;

  option.series[0].data = $$upDataList.map(
    val => parseFloat(val / utilObj.val).toFixed(3),
  );
  option.series[1].data = $$downDataList.map(
    val => parseFloat(val / utilObj.val).toFixed(3),
  );

  return option;
}

const listOptions = fromJS([
  {
    id: 'mac',
    text: _('MAC'),
  }, {
    id: 'ip',
    text: _('IP'),
  }, {
    id: 'flow_num',
    text: _('Flow Num'),
  }, {
    id: 'upbytes',
    text: _('Upload Bytes'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
  }, {
    id: 'downbytes',
    text: _('Download Bytes'),
    transform(val) {
      if (val === '' || val === undefined) {
        return '--';
      }
      return flowRateFilter.transform(val);
    },
  }, {
    id: 'uppackets',
    text: _('Upload Packets'),
  }, {
    id: 'downpackets',
    text: _('Download Packets'),
  },
]);


export default class MacStatistic extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'initOptions',
      'onChangeTimeType',
      'onChangeMac',
      'onChangeInterface',
      'getMacOptions',
    ]);
  }
  componentWillMount() {
    this.initOptions(this.props);
  }

  componentDidMount() {
    this.props.fetch(this.props.route.formUrl).then((json) => {
      let macVal = '';
      if (json.data.list && json.data.list[0]) {
        macVal = json.data.list[0].mac;
      }
      this.props.changeScreenQuery({
        mac: macVal,
      });
    }).then(() => {
      this.props.fetchScreenData();
    });
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

  onChangeMac(data) {
    this.props.changeScreenQuery({
      mac: data.value,
    });
    this.props.fetchScreenData();
  }

  onChangeInterface(data) {
    this.props.changeScreenQuery({
      ethx: data.value,
    });
    this.props.fetchScreenData();
  }

  getMacOptions() {
    const curScreenId = this.props.store.get('curScreenId');
    const list = this.props.store.getIn([curScreenId, 'data', 'list']);
    const options = list.map(item => ({
      value: item.get('mac'),
      label: item.get('mac'),
    }));
    return options.toJS();
  }

  initOptions(props) {
    const { store } = props;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);

    this.serverData = serverData;
    this.flowOption = getFlowOption(serverData, store.getIn([curScreenId, 'query', 'timeType']));
  }

  render() {
    const flowOption = this.flowOption;
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);

    return (
      <AppScreen
        {...this.props}
        // listOptions={listOptions}
        initOption={{
          isFetchInfinite: true,
          fetchIntervalTime: 5000,
          query: {
            timeType: '0',
            mac: '',
          },
        }}
        // listTitle={_('Statistics Within 30 Seconds')}
      >
        <div className="t-overview">
          <h3 className="element t-overview__header">{_('Statistics Within 30 Seconds')}</h3>
          <div className="t-overview__section">
            <Table
              className="table"
              options={listOptions}
              list={serverData.getIn(['list'])}
            />
          </div>
          <h3 className="element t-overview__header">{_('Historical Graphs')}</h3>
          <div className="t-overview__section">
            <div className="element t-overview__section-header">
              <h3>
                <span
                  style={{
                    marginRight: '10px',
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
                <span
                  style={{
                    marginRight: '10px',
                    marginLeft: '20px',
                  }}
                >
                  {_('MAC')}
                </span>
                <Select
                  options={this.getMacOptions()}
                  value={store.getIn([curScreenId, 'query', 'mac'])}
                  onChange={this.onChangeMac}
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
        </div>
      </AppScreen>
    );
  }
}

MacStatistic.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
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
)(MacStatistic);
