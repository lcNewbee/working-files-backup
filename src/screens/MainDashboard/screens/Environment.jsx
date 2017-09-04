import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon, EchartReact } from 'shared/components';
import utils from 'shared/utils';

import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';

import './Environment.scss';
/**
 *
 * @param {value, title, icon, key, unit} info
 */
function renderTopInfoBox(info) {
  const { value = 0, title = '', icon = '', unit = '' } = info;
  return (
    <div className="env-top-infobox rw-dashboard-card clearfix">
      <div className="env-infobox-left fl">
        <Icon
          name={icon}
          style={{ fontSize: 50 }}
        />
      </div>
      <div className="env-infobox-right fl">
        <div className="infobox-right-value">{value}<span>{unit}</span></div>
        <div className="infobox-right-title">{title}</div>
      </div>
    </div>
  );
}

const defaultProps = {};
const propTypes = {
  store: PropTypes.object,
};

export default class Environment extends Component {
  constructor(props) {
    super(props);
    this.renderTop = this.renderTop.bind(this);
  }

  renderTop() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const data = store.getIn([curScreenId, 'data']);
    const {
      temperature = '0', humidity = '0', noise = '0', pm25 = '0', waterQuality = '0',
    } = data.toJS();
    const topCardsData = [
      { value: temperature, title: '当前温度', icon: 'thermometer-half', key: 'temperature', unit: '℃' },
      { value: humidity, title: '当前湿度', icon: 'tint', key: 'humidity' },
      { value: noise, title: '噪音强度', icon: 'bullhorn', key: 'noise', unit: 'dB' },
      { value: pm25, title: '空气质量', icon: 'leaf', key: 'pm25' },
      { value: waterQuality, title: '水质指数', icon: 'flask', key: 'waterQuality' },
    ];

    const topNodes = topCardsData.map(item => (
      <div
        className="env-top-cards cols"
        key={item.key}
      >
        {renderTopInfoBox(item)}
      </div>
    ));

    return topNodes;
  }

  renderTemperatureChart() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const leatestWeekData = store.getIn([curScreenId, 'data', 'leatestWeekData']) || fromJS([]);
    const timeData = leatestWeekData.map(item => item.get('date')).toJS();
    const lowTempData = leatestWeekData.map(item => item.getIn(['temperature', 0])).toJS();
    const highTempData = leatestWeekData.map(item => item.getIn(['temperature', 1])).toJS();
    const option = {
      title: {
        text: '七日气温变化',
        textStyle: {
          color: '#fff',
        },
      },
      textStyle: {
        color: '#fff',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['最低气温', '最高气温'],
        textStyle: {
          color: '#fff',
        },
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeData,
        axisLine: {
          lineStyle: { color: '#fff' },
        },
      },
      yAxis: {
        type: 'value',
        name: '温度 °C',
        axisLabel: {
          formatter: '{value}',
        },
        axisLine: {
          lineStyle: { color: '#fff' },
        },
        splitLine: {
          show: false,
          lineStyle: { color: '#444' },
        },
      },
      series: [
        {
          name: '最低气温',
          type: 'line',
          data: lowTempData,
        },
        {
          name: '最高气温',
          type: 'line',
          data: highTempData,
        },
      ],
    };
    return (
      <div className="rw-dashboard-card element">
        <EchartReact
          option={option}
          style={{ wdith: '100%', height: '250px' }}
        />
      </div>
    );
  }
  renderAirQualityChart() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const leatestWeekData = store.getIn([curScreenId, 'data', 'leatestWeekData']) || fromJS([]);
    const timeData = leatestWeekData.map(item => item.get('date')).toJS();
    const qualityData = leatestWeekData.map(item => item.get('pm25')).toJS();
    const option = {
      color: ['#3398DB'],
      textStyle: {
        color: '#fff',
      },
      title: {
        text: '七日空气质量统计',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: timeData,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: { color: '#fff' },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '空气质量',
          axisLine: {
            lineStyle: { color: '#fff' },
          },
          splitLine: {
            show: false,
            lineStyle: { color: '#444' },
          },
        },
      ],
      series: [
        {
          name: '空气质量',
          type: 'bar',
          barWidth: '60%',
          data: qualityData,
        },
      ],
    };
    return (
      <div className="rw-dashboard-card element">
        <EchartReact
          option={option}
          style={{ wdith: '100%', height: '250px' }}
        />
      </div>
    );
  }

  renderWaterQualityChart() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const leatestWeekData = store.getIn([curScreenId, 'data', 'leatestWeekData']) || fromJS([]);
    const timeData = leatestWeekData.map(item => item.get('date')).toJS();
    const qualityData = leatestWeekData.map(item => item.get('waterQuality')).toJS();
    const option = {
      color: ['#3398DB'],
      textStyle: {
        color: '#fff',
      },
      title: {
        text: '七日水质统计',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: timeData,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: { color: '#fff' },
          },

        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '水质',
          axisLine: {
            lineStyle: { color: '#fff' },
          },
          splitLine: {
            show: false,
            lineStyle: { color: '#444' },
          },
        },
      ],
      series: [
        {
          name: '空气质量',
          type: 'bar',
          barWidth: '60%',
          data: qualityData,
        },
      ],
    };
    return (
      <div className="rw-dashboard-card element">
        <EchartReact
          option={option}
          style={{ wdith: '100%', height: '250px' }}
        />
      </div>
    );
  }

  renderNoiseMonitorChart() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const noiseMonitor = store.getIn([curScreenId, 'data', 'noiseMonitor']) || fromJS({});
    const timeData = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
    const { monitor1 = [], monitor2 = [], monitor3 = [] } = noiseMonitor.toJS();
    const option = {
      title: {
        text: '噪音监控',
        textStyle: {
          color: '#fff',
        },
      },
      textStyle: {
        color: '#fff',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['监控点1', '监控点2', '监控点3'],
        textStyle: {
          color: '#fff',
        },
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeData,
        axisLine: {
          lineStyle: { color: '#fff' },
        },
      },
      yAxis: {
        type: 'value',
        name: '噪音(dB)',
        axisLabel: {
          formatter: '{value}',
        },
        axisLine: {
          lineStyle: { color: '#fff' },
        },
        splitLine: {
          show: false,
          lineStyle: { color: '#444' },
        },
      },
      series: [
        {
          name: '监控点1',
          type: 'line',
          data: monitor1,
        },
        {
          name: '监控点2',
          type: 'line',
          data: monitor2,
        },
        {
          name: '监控点3',
          type: 'line',
          data: monitor3,
        },
      ],
    };
    return (
      <div className="rw-dashboard-card element">
        <EchartReact
          option={option}
          style={{ wdith: '100%', height: '250px' }}
        />
      </div>
    );
  }

  render() {
    return (
      <AppScreen
        {...this.props}
      >
        <div className="rw-dashboard">
          <div className="env-top row">
            {this.renderTop()}
          </div>
          <div className="env-middle row">
            <div className="env-temp cols col-6">
              {this.renderTemperatureChart()}
            </div>
            <div className="env-airquality cols col-6">
              {this.renderAirQualityChart()}
            </div>
          </div>
          <div className="row">
            <div className="env-airquality cols col-6">
              {this.renderWaterQualityChart()}
            </div>
            <div className="env-airquality cols col-6">
              {this.renderNoiseMonitorChart()}
            </div>
          </div>
        </div>
      </AppScreen>
    );
  }
}

Environment.propTypes = propTypes;
Environment.defaultProps = defaultProps;

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
)(Environment);

