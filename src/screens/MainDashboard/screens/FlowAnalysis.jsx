import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, EchartReact } from 'shared/components';
import utils from 'shared/utils';

import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';
import { colors, $$commonPieOption } from 'shared/config/axc';

import './FlowAnalysis.scss';
/**
 * @param {title, flow, diff, key, unit} info
 */
function renderTopInfoBox(info) {
  const { title = '', flow = '', diff = '', key = '', unit = '' } = info;
  return (
    <div className="cols info-box" key={key}>
      <div className="rw-dashboard-card info-card clearfix" >
        <div className="info-box-left fl">
          <div className="box-left-title">
            {title}
          </div>
          <div className="box-left-flow">
            {`${flow}`}
            <span>{`${unit}`}</span>
          </div>
        </div>
        <div className="info-box-right fl">
          {
            parseInt(diff, 10) > 0 ? (
              <Icon
                name="long-arrow-up"
                style={{ color: 'red', marginRight: '4px', fontSize: '16px' }}
              />
            ) : (
              <Icon
                name="long-arrow-down"
                style={{ color: 'green', marginRight: '4px', fontSize: '16px' }}
              />
            )
          }
          {`${Math.abs(diff)}${unit}`}
        </div>
      </div>
    </div>
  );
}

function makeCurFlowInfo(data) {
  const flow = data.get('curFlow') || 0;
  const diff = data.get('curFlowDiff') || 0;
  const title = __('当前客流量');
  const key = 'curFlow';
  const unit = '人';
  return { flow, title, diff, key, unit };
}
function makeTotalFlowInfo(data) {
  const flow = data.get('totalFlow') || 0;
  const diff = data.get('totalFlowDiff') || 0;
  const title = __('当日客流量');
  const key = 'totalFlow';
  const unit = '人';
  return { flow, title, diff, key, unit };
}
function makeFlowPeakInfo(data) {
  const flow = data.get('flowPeak') || 0;
  const diff = data.get('flowPeakDiff') || 0;
  const title = __('客流量峰值');
  const key = 'flowPeak';
  const unit = '人';
  return { flow, title, diff, key, unit };
}
function makeNewCustomFlowInfo(data) {
  const flow = data.get('newFlow') || 0;
  const diff = data.get('newFlowDiff') || 0;
  const title = __('新增游客量');
  const key = 'newFlow';
  const unit = '人';
  return { flow, title, diff, key, unit };
}
function makeAverageStayFlowInfo(data) {
  const flow = data.get('averageStayTime') || 0;
  const diff = data.get('averageStayTimeDiff') || 0;
  const title = __('平均游览时间');
  const key = 'averageStayTime';
  const unit = '分钟';
  return { flow, title, diff, key, unit };
}

// data为immutable类型
function getFlowRankOption(data) {
  const flowRank = data.get('flowRank') || fromJS([]);
  const legendData = flowRank.map(item => __(`${item.get('zoneName')}`));
  const flowRankData = flowRank.map(item => ({ value: parseFloat(item.get('flowPercent')), name: item.get('zoneName') })).toJS();
  const title = {
    text: '本日客流排行榜',
    left: '10px',
    top: 'top',
    show: true,
    textStyle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'normal',
      fontFamily: 'Microsoft YaHei',
    },
  };
  const ret = $$commonPieOption.mergeDeep({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {d}%',
    },
    legend: {
      itemWidth: 20,
      itemHeight: 12,
      itemGap: 10,
      left: '60%',
      top: '40%',
      data: legendData.toJS(),
      textStyle: {
        color: '#fff',
        fontSize: 14,
      },
      formatter: (seriesName) => {
        const index = fromJS(flowRankData).findIndex(item => item.get('name') === seriesName);
        if (index !== -1) return `${seriesName} : ${flowRankData[index].value}%`;
        return `${seriesName}`;
      },
    },
    series: [
      {
        name: '本日客流排行榜',
        type: 'pie',
        radius: ['50%', '70%'],
        // avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
            // formatter:
          },
          // emphasis: {
          //   show: true,
          // },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      },
    ],
  }).toJS();

  ret.title = title;
  ret.series[0].data = flowRankData;

  return ret;
}

function getFlowChangeOption(data) {
  const flowChange = data.get('flowChange') || fromJS([]);
  const tdFlowChange = flowChange.map(item => item.get('tdFlow'));
  const ystdFlowChange = flowChange.map(item => item.get('ystdFlow'));
  const timeData = flowChange.map(item => item.get('time'));

  const option = {
    textStyle: {
      color: '#fff',
    },
    title: {
      text: '七日游客量变化',
      left: '10px',
      top: 'top',
      show: true,
      textStyle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: 'Microsoft YaHei',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['今天', '昨天'],
      textStyle: {
        color: '#fff',
        fontSize: 14,
      },
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        dataView: { readOnly: false },
        magicType: { type: ['line', 'bar'] },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeData.toJS(),
      axisLine: {
        lineStyle: { color: '#fff' },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} 人',
      },
      axisLine: {
        lineStyle: { color: '#fff' },
      },
      splitLine: {
        // show: false,
        lineStyle: {
          color: '#444',
        },
      },
    },
    series: [
      {
        name: '今天',
        type: 'line',
        data: tdFlowChange.toJS(),
        markLine: {
          data: [
            { type: 'average', name: '平均值' },
          ],
        },
      },
      {
        name: '昨天',
        type: 'line',
        data: ystdFlowChange.toJS(),
      },
    ],
  };

  return option;
}

// 下面几个饼图的样式应该是一样的，在这里设置
const bottomChartCommonOption = $$commonPieOption.mergeDeep({
  legend: {
    itemWidth: 20,
    itemHeight: 12,
    itemGap: 10,
    textStyle: {
      color: '#fff',
      fontSize: 14,
    },
  },
  title: {
    left: '35px',
    top: 'top',
    show: true,
    textStyle: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'normal',
      fontFamily: 'Microsoft YaHei',
    },
  },
  series: [
    {
      radius: ['50%', '70%'],
    },
  ],
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {d}%',
  },
});

function getNewCustomerOption(data) {
  const totalFlow = data.get('totalFlow') || 0;
  const newFlow = data.get('newFlow') || 0;
  const oldFlow = +totalFlow - +newFlow;

  const legendData = ['新游客', '老游客'];
  const flowdata = [
    { value: newFlow, name: '新游客' },
    { value: oldFlow, name: '老游客' },
  ];
  const title = {
    text: '新老游客',
  };

  const option = bottomChartCommonOption.mergeDeep({
    series: [
      {
        data: flowdata,
        name: title.text,
        label: {
          normal: {
            show: true,
            position: 'center',
            color: '#fff',
            formatter: () => `今日客流总量\n\n${totalFlow}人`,
            textStyle: { color: '#fff', fontSize: 15 },
          },
        },
      },
    ],
    legend: {
      left: '60%',
      top: '50%',
      data: legendData,
      formatter: (seriesName) => {
        if (seriesName === legendData[0]) {
          return `${seriesName}: ${flowdata[0].value}人`;
        } else if (seriesName === legendData[1]) {
          return `${seriesName}: ${flowdata[1].value}人`;
        }
        return `${seriesName}`;
      },
    },
    title,
  }).toJS();

  return option;
}

function getStayTimeOption(data) {
  const stayTime = data.get('stayTime') || fromJS({});
  const averageTime = stayTime.get('averageTime');
  const beyound4 = stayTime.get('beyound4') || 0;
  const between1and4 = stayTime.get('between1and4') || 0;
  const bellow1 = stayTime.get('bellow1') || 0;
  const legendData = [__('> 4h'), __('1 ~ 4h'), __('0 ~ 1h')];
  const stayData = [
    { value: parseFloat(beyound4), name: legendData[0] },
    { value: parseFloat(between1and4), name: legendData[1] },
    { value: parseFloat(bellow1), name: legendData[2] },
  ];
  const title = {
    text: '停留时间',
  };

  const option = bottomChartCommonOption.mergeDeep({
    series: [
      {
        data: stayData,
        name: title.text,
        label: {
          normal: {
            show: true,
            position: 'center',
            color: '#fff',
            formatter: () => `平均停留时间\n\n${averageTime}分钟`,
            textStyle: { color: '#fff', fontSize: 15 },
          },
        },
      },
    ],
    legend: {
      left: '60%',
      top: '45%',
      data: legendData,
      formatter: (seriesName) => {
        const index = fromJS(stayData).findIndex(item => item.get('name') === seriesName);
        if (index !== -1) return `${seriesName} : ${stayData[index].value}%`;
        return `${seriesName}`;
      },
    },
    title,
  }).toJS();

  return option;
}

function getVisitTimesOptions(data) {
  const visitTimes = data.get('visitTimes') || fromJS({});
  const averageVisitTimes = visitTimes.get('averageTimes');
  const beyound10 = visitTimes.get('beyound10') || 0;
  const between3and10 = visitTimes.get('between3and10') || 0;
  const bellow3 = visitTimes.get('bellow3') || 0;
  const legendData = ['> 10', '4 ~ 10', '0 ~ 3'];
  const stayData = [
    { value: parseFloat(beyound10), name: legendData[0] },
    { value: parseFloat(between3and10), name: legendData[1] },
    { value: parseFloat(bellow3), name: legendData[2] },
  ];
  const title = {
    show: true,
    text: __('游览次数'),
    textStyle: { color: '#fff' },
  };

  const option = bottomChartCommonOption.mergeDeep({
    series: [
      {
        data: stayData,
        name: title.text,
        label: {
          normal: {
            show: true,
            position: 'center',
            color: '#fff',
            formatter: () => `平均来访次数\n\n${averageVisitTimes}次`,
            textStyle: { color: '#fff', fontSize: 15 },
          },
        },
      },
    ],
    legend: {
      left: '60%',
      top: '45%',
      data: legendData,
      formatter: (seriesName) => {
        const index = fromJS(stayData).findIndex(item => item.get('name') === seriesName);
        if (index !== -1) return `${seriesName} : ${stayData[index].value}%`;
        return `${seriesName}`;
      },
    },
    title,
  }).toJS();

  return option;
}

const bottomEchartStyle = {
  width: '100%',
  height: '250px',
};

const middleEchartStyle = {
  width: '100%',
  height: '250px',
};

const defaultProps = {};
const propTypes = {
  store: PropTypes.object,
};

export default class FlowAnalysis extends Component {
  constructor(props) {
    super(props);
    this.renderTop = this.renderTop.bind(this);
  }

  renderTop() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const data = store.getIn([curScreenId, 'data']);

    const curFlowInfo = makeCurFlowInfo(data);
    const curFlowBox = renderTopInfoBox(curFlowInfo);

    const totalFlowInfo = makeTotalFlowInfo(data);
    const totalFlowBox = renderTopInfoBox(totalFlowInfo);

    const flowPeakInfo = makeFlowPeakInfo(data);
    const flowPeakBox = renderTopInfoBox(flowPeakInfo);

    const newFlowInfo = makeNewCustomFlowInfo(data);
    const newFlowBox = renderTopInfoBox(newFlowInfo);

    const averageStayTimeInfo = makeAverageStayFlowInfo(data);
    const averageStayTimeBox = renderTopInfoBox(averageStayTimeInfo);

    const nodesList = [
      curFlowBox, totalFlowBox, flowPeakBox, newFlowBox, averageStayTimeBox,
    ];
    return (
      <div className="dashboard-top">
        {nodesList}
      </div>
    );
  }

  renderFlowRankPie() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const data = store.getIn([curScreenId, 'data']);
    const option = getFlowRankOption(data);
    return (
      <div className="rw-dashboard-card">
        <EchartReact
          option={option}
          style={{ ...middleEchartStyle }}
        />
      </div>
    );
  }

  renderFlowChangeChart() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const data = store.getIn([curScreenId, 'data']);
    const option = getFlowChangeOption(data);
    return (
      <div className="rw-dashboard-card">
        <EchartReact
          option={option}
          style={{ ...middleEchartStyle }}
        />
      </div>
    );
  }

  renderNewCustomersPie() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const data = store.getIn([curScreenId, 'data']);
    const option = getNewCustomerOption(data);
    return (
      <div className="rw-dashboard-card element">
        <EchartReact
          option={option}
          style={{ ...bottomEchartStyle }}
        />
      </div>
    );
  }

  renderStayTimePie() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const data = store.getIn([curScreenId, 'data']);
    const option = getStayTimeOption(data);
    return (
      <div className="rw-dashboard-card element">
        <EchartReact
          option={option}
          style={{ ...bottomEchartStyle }}
        />
      </div>
    );
  }

  renderVisitTimesPie() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const data = store.getIn([curScreenId, 'data']);
    const option = getVisitTimesOptions(data);
    return (
      <div className="rw-dashboard-card element">
        <EchartReact
          option={option}
          style={{ ...bottomEchartStyle }}
        />
      </div>
    );
  }


  render() {
    return (
      <AppScreen
        {...this.props}
      >
        <div
          className="dashboard-flowanalysis rw-dashboard"
        >
          {this.renderTop()}
          <div className="dashboard-middle row">
            <div className="middle-flowrank cols col-6">
              {this.renderFlowRankPie()}
            </div>
            <div className="middle-flowchange cols col-6">
              {this.renderFlowChangeChart()}
            </div>
          </div>
          <div className="dashboard-bottom row">
            <div className="bottom-newcustomers cols col-4">
              {this.renderNewCustomersPie()}
            </div>
            <div className="bottom-staytime cols col-4">
              {this.renderStayTimePie()}
            </div>
            <div className="bottom-visittimes cols col-4">
              {this.renderVisitTimesPie()}
            </div>
          </div>
        </div>
      </AppScreen>
    );
  }
}

FlowAnalysis.propTypes = propTypes;
FlowAnalysis.defaultProps = defaultProps;

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
)(FlowAnalysis);

