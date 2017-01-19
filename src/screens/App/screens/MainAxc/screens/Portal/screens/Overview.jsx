import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import utils from 'shared/utils';
import { Map, fromJS } from 'immutable';
import PureComponent from 'shared/components/Base/PureComponent';
import EchartReact from 'shared/components/EchartReact';
import Table from 'shared/components/Table';
import AppScreen from 'shared/components/Template/AppScreen';
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
        fontSize: '14',
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
      textStyle: {
        fontSize: '14',
      },
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
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};
export default class View extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onChangeTimeType',
    ]);
  }

  render() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);
    const apStatusOption = getApStatusOption(serverData);
    const onlineOption = getOnlineOption(serverData);

    return (
      <AppScreen
        {...this.props}
        noTitle
      >
        <div className="o-box row">
          <div
            className="o-box__cell"
          >
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
                    fontSize: '14px',
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
          <div
            className="cols col-12"
          >
            <div
              className="o-box__cell"
            >
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
