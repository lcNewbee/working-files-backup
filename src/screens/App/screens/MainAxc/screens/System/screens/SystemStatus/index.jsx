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
    const { screens } = this.props;
    const curScreenId = screens.get('curScreenId');
    const serverData = screens.getIn([curScreenId, 'data']);
    const memoryStatusOption = getMemoryOption(serverData);
    const cpuStatusOption = getCpuOption(serverData);
    const storeStatusOption = getStoreOption(serverData);

    return (
      <div>
        <h3 className="t-main__content-title">{_('System Status') }</h3>
        <div className="o-box row">
          <div className="cols col-6" >
            <div className="o-box__cell">
              <h3>{ _('Memory') }</h3>
            </div>
            <div className="o-box__cell">
              <EchartReact
                option={memoryStatusOption}
                className="o-box__canvas"
                style={{
                  width: '80%',
                  minHeight: '180px',
                }}
              />
            </div>
          </div>
          <div className="cols col-6" >
            <div className="o-box__cell">
              <h3>{ _('CPU') }</h3>
            </div>
            <div className="o-box__cell">
              <EchartReact
                option={cpuStatusOption}
                className="o-box__canvas"
                style={{
                  width: '80%',
                  minHeight: '180px',
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
