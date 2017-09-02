import React from 'react'; import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Map } from 'immutable';
import EchartReact from 'shared/components/EchartReact';
import Progress from 'shared/components/Progress';

import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';
import { colors, $$commonPieOption } from 'shared/config/axc';

const uptimeFilter = utils.filter('connectTime');

function getCpuOption(serverData) {
  const usedValue = serverData.get('cpuUsed');
  const freeValue = serverData.get('cpuTotal') - usedValue;
  const usedName = `${__('Used')}: ${usedValue}%`;
  const freeName = `${__('Unused')}: ${freeValue}%`;
  const ret = $$commonPieOption.mergeDeep({
    color: [colors[1], colors[7]],
    legend: {
      data: [usedName, freeName],
      x: '60%',
    },
    title: {
      text: `${__('Used')}`,
      subtext: `${usedValue || ''}%`,
    },
    series: [
      {
        name: __('CPU Usage'),
      },
    ],
  }).toJS();

  ret.series[0].data = [
    { value: usedValue, name: usedName },
    { value: freeValue, name: freeName },
  ];

  return ret;
}
function getMemoryOption(serverData) {
  const usedValue = serverData.get('cpuUsed');
  const freeValue = serverData.get('cpuTotal') - usedValue;
  const usedName = `${__('Used')}: ${usedValue}%`;
  const freeName = `${__('Unused')}: ${freeValue}%`;
  const ret = $$commonPieOption.mergeDeep({
    color: [colors[1], colors[7]],
    title: {
      text: `${__('Used')}`,
      subtext: `${usedValue || ''}%`,
    },
    legend: {
      data: [usedName, freeName],
      x: '60%',
    },
    series: [
      {
        name: __('Memory Usage'),
        type: 'pie',
      },
    ],
  }).toJS();

  ret.series[0].data = [
    { value: usedValue, name: usedName },
    { value: freeValue, name: freeName },
  ];

  return ret;
}

function getStoreOption(serverData) {
  const option = {
    color: [colors[1], colors[7]],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {
      data: [__('Used'), __('Unused')],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '0',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      max: serverData.get('storeTotal'),
      position: 'bottom',
    },

    yAxis: [
      {
        type: 'category',
        data: [__('Store')],
      },
    ],
    series: [
      {
        name: __('Used'),
        type: 'bar',
        barWidth: 20,
        stack: __('Store'),
        data: [serverData.get('storeUsed')],
      },
      {
        name: __('Unused'),
        type: 'bar',
        stack: __('Store'),
        data: [serverData.get('storeTotal') - serverData.get('storeUsed')],
      },
    ],
  };

  return option;
}
const propTypes = {
  store: PropTypes.instanceOf(Map).isRequired,
};
const defaultProps = {};

export default class View extends React.PureComponent {
  render() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');

    return (
      <AppScreen
        {...this.props}
        refreshInterval="6000"
      >
        <div className="rw-dashboard row">
          <div className="cols col-2">
            <div className="rw-dashboard-card">
              <h3 className="element">区域选择</h3>
              <div className="element">
                南商区
              </div>
            </div>
            <div className="rw-dashboard-card">
              <h3 className="element">环境监测</h3>
              <div className="element">
                <dl className="rw-description-list">
                  <dt>温度</dt>
                  <dd>30</dd>
                </dl>
                <dl className="rw-description-list">
                  <dt>湿度</dt>
                  <dd>22</dd>
                </dl>
                <dl className="rw-description-list">
                  <dt>PH</dt>
                  <dd>7.01</dd>
                </dl>
                <dl className="rw-description-list">
                  <dt>水质</dt>
                  <dd>二级</dd>
                </dl>
              </div>
            </div>
            <div className="rw-dashboard-card element">
              <h3>洪涝预警</h3>
            </div>
          </div>
          <div className="cols col-5">
            <div className="rw-dashboard-card">
              <h3 className="element">本日客流量</h3>
            </div>
            <div className="rw-dashboard-card">
              <h3 className="element">平均滞留时间</h3>
            </div>
            <div className="rw-dashboard-card">
              <h3 className="element">关键区域客流分析</h3>
            </div>
          </div>
          <div className="cols col-5">
            <div className="rw-dashboard-card">
              <h3 className="element">热力图</h3>
            </div>
            <div className="rw-dashboard-card">
              <h3 className="element">客流轨迹图</h3>
            </div>
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
