import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Map, List } from 'immutable';
import PureComponent from 'shared/components/Base/PureComponent';
import EchartReact from 'shared/components/EchartReact';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

function getTerminalTypeOption(serverData) {
  const dataList = serverData.get('terminalType');
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    title: {
      text: _('Terminal Type'),
      x: 'center',
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      y: 'bottom',
    },
    series: [
      {
        name: 'Type',
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '12',
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

  if (List.isList(dataList)) {
    ret.legend.data = dataList.map(item => item.get('name')).toJS();
    ret.series[0].data = dataList.toJS();
  }

  return ret;
}
function getClientsStatusOption(serverData) {
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
      text: _('Clients Status'),
      x: 'center',
    },
    series: [
      {
        name: _('Status'),
        type: 'pie',
        radius: ['30%', '60%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '12',
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
function getApStatusOption(serverData) {
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
        radius: ['30%', '60%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '12',
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
function getFlowOption(serverData) {
  const dataList = serverData.get('flowList');
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '0',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
      },
    ],
    yAxis: {
      type: 'value',
      position: 'bottom',
    },
    series: [
      {
        name: '直接访问',
        type: 'bar',
        barWidth: '60%',
      },
    ],
  };

  if (List.isList(dataList)) {
    option.xAxis[0].data = dataList.map(item => item.get('name')).toJS();
    option.series[0].data = dataList.map(item => item.get('value')).toJS();
  }
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
    const apStatusOption = getApStatusOption(serverData);
    const clientStatusOption = getClientsStatusOption(serverData);
    const terminalTypeOption = getTerminalTypeOption(serverData);
    const flowOption = getFlowOption(serverData);

    return (
      <div>
        <h3 className="t-main__content-title">{route.text}</h3>
        <div className="o-box row">
          <div className="cols col-4" >
            <div className="o-box__cell">
              <h3>{ _('AP') }</h3>
            </div>
            <div className="o-box__cell">
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
          <div className="cols col-8">
            <div className="o-box__cell">
              <h3>{ _('Clients') }</h3>
            </div>
            <div className="o-box__cell row">
              <EchartReact
                option={clientStatusOption}
                className="o-box__canvas cols col-6"
                style={{
                  minHeight: '200px',
                }}
              />
              <EchartReact
                option={terminalTypeOption}
                className="o-box__canvas cols col-6"
                style={{
                  minHeight: '200px',
                }}
              />
            </div>
          </div>
          <div className="cols col-12">
            <div className="o-box__cell">
              <h3>{ _('Flow') }</h3>
            </div>
            <div className="o-box__cell">
              <EchartReact
                option={flowOption}
                className="o-box__canvas"
                style={{
                  width: '100%',
                  minHeight: '200px',
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
