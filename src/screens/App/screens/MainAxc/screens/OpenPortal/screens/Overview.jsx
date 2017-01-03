import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
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
const recordOptions = [
  {
    id: 'recDate',
    text: _('Time'),
    transform(timeStr) {
      return moment(timeStr).format('YYYY-MM-DD');
    },
  }, {
    id: 'info',
    text: _('Describe'),
  },
];

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

function getOnlineOption(serverData) {
  const ret = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} ({d}%)',
    },
    title: {
      text: _('Connection Status'),
      x: 'center',
      textStyle: {
        fontSize: '18',
      },
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

  ret.series[0].data = [
    { value: serverData.get('outlineCount'), name: _('Offline') },
    { value: serverData.get('onlineCount'), name: _('Online') },
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
      text: _('Lock Status'),
      x: 'center',
    },
    legend: {
      show: true,
      orient: 'vertical',
      x: 'left',
      y: 'bottom',
      data: [_('Locked'), _('Unlocked')],
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
    { value: serverData.get('lockCount'), name: _('Locked') },
    { value: serverData.get('trueCount'), name: _('Unlocked') },
  ];

  return ret;
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
    const onlineOption = getOnlineOption(serverData);

    return (
      <div>
        <div className="o-box row">
          <div className="cols col-12 o-box__cell">
            <h3>{ _('Users') }</h3>
          </div>
          <div className="cols col-7">
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
                  {serverData.get('onlineCount') || 0}
                </p>
              </div>
              <EchartReact
                option={onlineOption}
                className="o-box__canvas cols col-8"
                style={{
                  minHeight: '200px',
                }}
              />
            </div>
          </div>
          <div className="cols col-5" >
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
          <div className="cols col-12">
            <div className="o-box__cell">
              <h3>
                { _('Authentication logs') }
              </h3>

            </div>
            <div className="o-box__cell">
              <Table
                options={recordOptions}
                list={serverData.get('operationRecords')}
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