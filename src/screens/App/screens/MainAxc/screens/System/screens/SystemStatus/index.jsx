import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Map } from 'immutable';
import PureComponent from 'shared/components/Base/PureComponent';
import EchartReact from 'shared/components/EchartReact';
import Progress from 'shared/components/Progress';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

const uptimeFilter = utils.filter('connectTime');

function getCpuOption(serverData) {
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data: [_('Used'), _('Free')],
    },
    title: {
      text: _('CPU Usage'),
      x: 'center',
    },
    series: [
      {
        name: _('CPU Usage'),
        type: 'pie',
        radius: ['36%', '60%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '20',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },

      },
    ],
  };

  ret.series[0].data = [
    { value: serverData.get('cpuUsed'), name: _('Used') },
    { value: serverData.get('cpuTotal') - serverData.get('cpuUsed'), name: _('Free') },
  ];

  return ret;
}
function getMemoryOption(serverData) {
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    title: {
      text: _('Memory Usage'),
      x: 'center',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      data: [_('Used'), _('Free')],
    },
    series: [
      {
        name: _('Memory Usage'),
        type: 'pie',
        radius: ['36%', '60%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '20',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
      },
    ],
  };

  ret.series[0].data = [
    { value: serverData.get('memoryUsed'), name: _('Used') },
    { value: serverData.get('memoryTotal') - serverData.get('memoryUsed'), name: _('Free') },
  ];

  return ret;
}

function getStoreOption(serverData) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {
      data: [_('Used'), _('Free')],
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
        data: [_('Store')],
      },
    ],
    series: [
      {
        name: _('Used'),
        type: 'bar',
        barWidth: 20,
        stack: _('Store'),
        data: [serverData.get('storeUsed')],
      },
      {
        name: _('Free'),
        type: 'bar',
        stack: _('Store'),
        data: [serverData.get('storeTotal') - serverData.get('storeUsed')],
      },
    ],
  };

  return option;
}

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};

export default class View extends PureComponent {
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
        <div className="o-box row">
          <div className="cols col-4" >
            <div className="o-box__cell">
              <h3>{ _('Details') }</h3>
            </div>
            <div
              className="o-box__cell"
              style={{
                minHeight: '177px',
              }}
            >
              <div className="o-description-list o-description-list--lg">
                <dl className="o-description-list-row">
                  <dt>{_('CPU ID')}</dt>
                  <dd>{serverData.get('system_cpuid')}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('Memory ID')}</dt>
                  <dd>{serverData.get('system_memid')}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('Flash ID')}</dt>
                  <dd>{serverData.get('system_sdaid')}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('Frimware Version')}</dt>
                  <dd>{serverData.get('version') || ''}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('Uptime')}</dt>
                  <dd>{uptimeFilter.transform(serverData.get('running_time') || 0)}</dd>
                </dl>
                <dl className="o-description-list-row">
                  <dt>{_('Storage')}</dt>
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
            <div className="o-box__cell">
              <h3>{ _('Memory') }</h3>
            </div>
            <div className="o-box__cell">
              <EchartReact
                option={memoryStatusOption}
                className="o-box__canvas"
                style={{
                  width: '100%',
                  minHeight: '160px',
                }}
              />
            </div>
          </div>
          <div className="cols col-4" >
            <div className="o-box__cell">
              <h3>{ _('CPU') }</h3>
            </div>
            <div className="o-box__cell">
              <EchartReact
                option={cpuStatusOption}
                className="o-box__canvas"
                style={{
                  width: '100%',
                  minHeight: '160px',
                }}
              />
            </div>
          </div>
          <div className="cols col-12" >
            <div className="o-box__cell">
              <h3>{ _('Storage') }</h3>
            </div>
            <div className="o-box__cell">
              <EchartReact
                option={storeStatusOption}
                className="o-box__canvas"
                style={{
                  width: '100%',
                  minHeight: '120px',
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
