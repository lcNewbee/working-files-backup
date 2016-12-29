import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Map, List, fromJS } from 'immutable';
import PureComponent from 'shared/components/Base/PureComponent';
import EchartReact from 'shared/components/EchartReact';
import Table from 'shared/components/Table';
import Switchs from 'shared/components/Switchs';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

const msg = {
  days: _('Days'),
};
const timeTypeSwitchs = fromJS([
  {
    value: 'today',
    label: _('Today'),
  },
  {
    value: 'yesterday',
    label: _('Yesterday'),
  },
  {
    value: 'week',
    label: `7 ${msg.days}`,
  },
  {
    value: 'half_month',
    label: `15 ${msg.days}`,
  },
  {
    value: 'month',
    label: `30 ${msg.days}`,
  },
]);
const ssidTableOptions = fromJS([
  {
    id: 'mac',
    text: _('MAC'),
    width: '30%',
  }, {
    id: 'ssid',
    text: _('SSID'),
    width: '30%',
  }, {
    id: 'channel',
    text: _('Channel'),
    width: '20%',
  }, {
    id: 'rssi',
    text: _('rssi'),
    width: '20%',
  },
]);

function getTerminalTypeOption(serverData) {
  let dataList = serverData.get('terminalType');
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} ({d}%)',
    },
    title: {
      text: _('Clients'),
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
        radius: ['0%', '60%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            //position: 'center',
          },
          emphasis: {
            show: false,
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
    dataList = dataList.map(item => item.set('name', `${item.get('name')}: ${item.get('value')}`));
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
      show: true,
      orient: 'vertical',
      x: 'left',
      y: 'bottom',
      data: [_('Offline'), _('Online')],
    },
    series: [
      {
        name: _('Status'),
        type: 'pie',
        radius: ['0%', '60%'],
        avoidLabelOverlap: false,
        label: {
          formatter: '{b}: {c}',
          normal: {
            show: true,
            //position: 'center',
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
            show: true,
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

function getFlowOption(serverData, timeType) {
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['AP', _('Wireless')],
    },
    xAxis: [{
      type: 'category',
      interval: 1,
      splitLine: {
        interval: 0,
      },
      axisLabel: {
        interval: 0,
      },
    }],
    yAxis: [{
      type: 'value',
      name: _('KB'),
      minInterval: 1,
      splitNumber: 5,
      axisLabel: {
        formatter: '{value}',
      },
      axisLine: {
        lineStyle: {},
      },
    }],
    series: [
      {
        name: 'AP',
        type: 'line',
      },
      {
        name: _('Wireless'),
        type: 'line',
      },
    ],
  };
  let xAxisData;
  let xAxisName = _('Days');
  let $$dataList = serverData.getIn(['flowList']);

  if (!$$dataList) {
    return null;
  }

  $$dataList = $$dataList.toJS();

  if (timeType === 'yesterday' ||
      timeType === 'today') {
    xAxisData = List(new Array(24)).map(
      (val, i) => `${i}:00`,
    ).toJS();
    xAxisName = _('Hours');
  } else if (timeType === 'week') {
    xAxisData = List(new Array(7)).map(
      (val, i) => i + 1,
    ).toJS();
  } else if (timeType === 'half_month') {
    xAxisData = List(new Array(15)).map(
      (val, i) => i + 1,
    ).toJS();
  } else {
    xAxisData = List(new Array(30)).map(
      (val, i) => i + 1,
    ).toJS();
  }

  option.xAxis[0].data = xAxisData;
  option.xAxis[0].name = xAxisName;

  option.series[0].data = $$dataList[0].data;
  option.series[1].data = $$dataList[1].data;

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

    utils.binds(this, [
      'onChangeTimeType',
    ]);
    props.initScreen({
      id: props.route.id,
      formUrl: props.route.formUrl,
      path: props.route.path,
      isFetchInfinite: true,
      fetchIntervalTime: 5000,
      query: {
        groupid: props.groupid,
        timeType: 'today',
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

  onChangeTimeType(data) {
    this.props.changeScreenQuery({
      timeType: data.value,
    });
    this.props.fetchScreenData();
  }

  render() {
    const { screens, route } = this.props;
    const curScreenId = screens.get('curScreenId');
    const serverData = screens.getIn([curScreenId, 'data']);
    const apStatusOption = getApStatusOption(serverData);
    const terminalTypeOption = getTerminalTypeOption(serverData);
    const flowOption = getFlowOption(serverData, screens.getIn([curScreenId, 'query', 'timeType']));

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
              <h2>{ _('Historical Graphs') }</h2>
            </div>
            <div className="o-box__cell">
              <h3>
                { _('Traffic') }
                <Switchs
                  options={timeTypeSwitchs}
                  value={screens.getIn([curScreenId, 'query', 'timeType'])}
                  onChange={this.onChangeTimeType}
                />
              </h3>

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
              <h3>{ _('Rogue SSID List') }</h3>
            </div>
            <div className="o-box__cell">
              <Table
                className="table"
                options={ssidTableOptions}
                list={serverData.getIn(['neighborsAps', 'list']) || fromJS([])}
                page={serverData.getIn(['neighborsAps', 'page'])}
              />
            </div>
          </div>
          <div className="cols col-12">
            <div className="o-box__cell">
              <h3>{ _('Around SSID List') }</h3>
            </div>
            <div className="o-box__cell">
              <Table
                className="table"
                options={ssidTableOptions}
                list={serverData.getIn(['aroundAps', 'list']) || fromJS([])}
                page={serverData.getIn(['aroundAps', 'page'])}
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
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
