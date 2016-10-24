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
      textStyle: {
        fontSize: '18',
      },
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
  let dataList = serverData.get('flowList');
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {},
    grid: {
      left: '6%',
      right: '6%',
      bottom: '4%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: [],
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
        data: [],
      },
    ],
  };

  if (List.isList(dataList)) {
    dataList = dataList.sort(
      (prev, next) => prev.get('value') < next.get('value')
    );
    option.xAxis[0].data = dataList.map(item => item.get('name')).toJS();
    option.series[0].data = dataList.map(item => item.get('value')).toJS();
  }
  return option;
}
function getSafeAlarmOption(serverData) {
  let dataList = serverData.get('safeAlarmEvents');
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {},
    grid: {
      left: '6%',
      right: '6%',
      bottom: '4%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: [],
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
        data: [],
      },
    ],
  };

  if (List.isList(dataList)) {
    dataList = dataList.sort(
      (prev, next) => prev.get('value') < next.get('value')
    );
    option.xAxis[0].data = dataList.map(item => item.get('name')).toJS();
    option.series[0].data = dataList.map(item => item.get('value')).toJS();
  }
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

    this.binds('getCpuOption');

    props.initScreen({
      id: props.route.id,
      formUrl: props.route.formUrl,
      path: props.route.path,
      isFetchInfinite: true,
      fetchIntervalTime: 5000,
      query: {
        groupid: props.groupid,
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

  render() {
    const { screens, route } = this.props;
    const curScreenId = screens.get('curScreenId');
    const serverData = screens.getIn([curScreenId, 'data']);
    const apStatusOption = getApStatusOption(serverData);
    const terminalTypeOption = getTerminalTypeOption(serverData);
    const flowOption = getFlowOption(serverData);
    const safeAlarmOption = getSafeAlarmOption(serverData);

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
              <div
                className="cols col-4"
                style={{
                  paddingRight: '6px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    lineHeight: '30px',
                    textAlign: 'center',
                    fontWeight: '400',
                  }}
                >{_('Online Number')}</h3>

                <p
                  style={{
                    fontSize: '30px',
                    marginTop: '10px',
                    padding: '56px 0',
                    textAlign: 'center',
                    color: 'green',
                    border: '1px solid #e5e5e5',
                  }}
                >
                  {serverData.get('clientsNumber') || 0}
                </p>
              </div>
              <EchartReact
                option={terminalTypeOption}
                className="o-box__canvas cols col-8"
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
          <div className="cols col-12">
            <div className="o-box__cell">
              <h3>{ _('Safe Alarm Events') }</h3>
            </div>
            <div className="o-box__cell">
              <EchartReact
                option={safeAlarmOption}
                className="o-box__canvas"
                style={{
                  width: '100%',
                  minHeight: '180px',
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
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
