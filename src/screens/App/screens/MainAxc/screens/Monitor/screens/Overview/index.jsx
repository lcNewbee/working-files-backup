import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Map } from 'immutable';
import {
  PureComponent, EchartReact,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

function getTerminalTypeOption(serverData) {
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      y: 'bottom',
      data: [_('Offline'), _('Online')],
    },
    title: {
      text: _('Terminal Type'),
      x: 'center',
    },
    series: [
      {
        name: _('Producer'),
        type: 'pie',
        radius: ['40%', '70%'],
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
    { value: serverData.get('cpuUsed'), name: _('Offline') },
    { value: serverData.get('cpuTotal') - serverData.get('cpuUsed'), name: _('Online') },
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
      text: _('AP Status'),
      x: 'center',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      y: 'bottom',
      data: [_('Offline'), _('Online')],
    },
    series: [
      {
        name: _('Status'),
        type: 'pie',
        radius: ['40%', '70%'],
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
    { value: serverData.get('memoryUsed'), name: _('Offline') },
    { value: serverData.get('memoryTotal') - serverData.get('memoryUsed'), name: _('Online') },
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
  screens: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  initScreen: PropTypes.func,
  leaveScreen: PropTypes.func,
  fetchScreenData: PropTypes.func,

};
const defaultProps = {};
export default class View extends PureComponent {
  constructor(props) {
    super(props);

    this.binds('getCpuOption');

    props.initScreen({
      id: props.route.id,
      formUrl: props.route.formUrl,
      path: props.route.path,
      isFetchInfinite: true,
      fetchIntervalTime: 5000,
    });
  }

  componentWillMount() {
    this.props.fetchScreenData();
  }

  componentWillUnmount() {
    this.props.leaveScreen();
  }

  render() {
    const { screens, route } = this.props;
    const curScreenId = screens.get('curScreenId');
    const serverData = screens.getIn([curScreenId, 'data']);
    const memoryStatusOption = getMemoryOption(serverData);
    const terminalTypeStatusOption = getTerminalTypeOption(serverData);
    const storeStatusOption = getStoreOption(serverData);

    return (
      <div>
        <h3 className="t-main__content-title">{route.text}</h3>
        <div className="stats-group clearfix" >
          <div className="cols col-4" >
            <div className="stats-group-cell">
              <h3>{ _('AP') }</h3>
            </div>
            <div className="stats-group-cell">
              <EchartReact
                option={memoryStatusOption}
                className="stats-group-canvas"
                style={{
                  width: '100%',
                  minHeight: '200px',
                }}
              />
            </div>
          </div>
          <div className="cols col-8">
            <div className="stats-group-cell">
              <h3>{ _('Clients') }</h3>
            </div>
            <div className="stats-group-cell row">
              <EchartReact
                option={terminalTypeStatusOption}
                className="stats-group-canvas cols col-6"
                style={{
                  minHeight: '200px',
                }}
              />
              <EchartReact
                option={terminalTypeStatusOption}
                className="stats-group-canvas cols col-6"
                style={{
                  minHeight: '200px',
                }}
              />
            </div>
          </div>
        </div>
        <div className="stats-group clearfix" >
          <div className="stats-group-cell">
            <h3>{ _('Flow') }</h3>
          </div>
          <div className="stats-group-cell">
            <EchartReact
              option={storeStatusOption}
              className="stats-group-canvas"
              style={{
                width: '100%',
                minHeight: '120px',
              }}
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
    screens: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
