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
      subtext: `${usedValue}%`,
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
      subtext: `${usedValue}%`,
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
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);
    const memoryStatusOption = getMemoryOption(serverData);
    const cpuStatusOption = getCpuOption(serverData);
    const storeStatusOption = getStoreOption(serverData);

    return (
      <AppScreen
        {...this.props}
        refreshInterval="6000"
      >
        <div className="t-overview row">
          <div className="t-overview__section">
            <div className="cols col-4" >
              <div className="element t-overview__section-header">
                <h3>{ __('Details') }</h3>
              </div>
              <div
                className="element"
                style={{
                  minHeight: '177px',
                }}
              >
                <div className="o-description-list o-description-list--lg">
                  <dl className="o-description-list-row">
                    <dt>{__('Frimware Version')}</dt>
                    <dd>{serverData.get('version') || ''}</dd>
                  </dl>
                  {
                    serverData.get('system_mac') ? (
                      <dl className="o-description-list-row">
                        <dt>{__('MAC Address')}</dt>
                        <dd>{serverData.get('system_mac')}</dd>
                      </dl>
                    ) : null
                  }
                  {
                    serverData.get('system_sn') ? (
                      <dl className="o-description-list-row">
                        <dt>{__('System SN')}</dt>
                        <dd>{serverData.get('system_sn')}</dd>
                      </dl>
                    ) : null
                  }
                  <dl className="o-description-list-row">
                    <dt>{__('System Time')}</dt>
                    <dd>{serverData.get('system_time')}</dd>
                  </dl>
                  <dl className="o-description-list-row">
                    <dt>{__('Uptime')}</dt>
                    <dd>{uptimeFilter.transform(serverData.get('running_time') || 0)}</dd>
                  </dl>
                  <dl className="o-description-list-row">
                    <dt>{__('Storage')}</dt>
                    <dd>
                      <Progress
                        value={serverData.get('storeUsed')}
                        max="100"
                        theme="success"
                        showText
                      />
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="cols col-4" >
              <div className="element t-overview__section-header">
                <h3>{ __('Memory') }</h3>
              </div>
              <div className="element">
                <EchartReact
                  option={memoryStatusOption}
                  className="o-box__canvas"
                  style={{
                    width: '100%',
                    minHeight: '170px',
                  }}
                />
              </div>
            </div>
            <div className="cols col-4" >
              <div className="element t-overview__section-header">
                <h3>{ __('CPU') }</h3>
              </div>
              <div className="element">
                <EchartReact
                  option={cpuStatusOption}
                  className="o-box__canvas"
                  style={{
                    width: '100%',
                    minHeight: '170px',
                  }}
                />
              </div>
            </div>
          </div>
          <h3 className="element t-overview__header">{ __('Storage') }</h3>
          <div className="t-overview__section">
            <div className="element">
              <EchartReact
                option={storeStatusOption}
                className="o-box__canvas"
                style={{
                  width: '100%',
                  minHeight: '130px',
                }}
              />
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
