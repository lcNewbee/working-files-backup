import React, { PropTypes, PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import utils from 'shared/utils';
import { Map, fromJS } from 'immutable';
import EchartReact from 'shared/components/EchartReact';
import Table from 'shared/components/Table';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';
import { colors, $$commonPieOption } from 'shared/config/axc';

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
  const outlineCount = serverData.get('outlineCount') || 0;
  const onlineCount = serverData.get('onlineCount') || 0;
  const onlineText = _('Online');
  const offlineText = _('Offline');
  const ret = $$commonPieOption.mergeDeep({
    color: [colors[7], colors[1]],
    legend: {
      data: [onlineText, offlineText],
      x: '60%',
    },
    title: {
      text: _('Connect Status'),
      subtext: `${onlineCount} / ${outlineCount}`,
    },
    series: [
      {
        name: _('Status'),
      },
    ],
  }).toJS();

  ret.series[0].data = [
    { value: onlineCount, name: onlineText },
    { value: outlineCount, name: offlineText },
  ];

  return ret;
}
function getApStatusOption(serverData) {
  const lockText = _('Locked');
  const unlockText = _('Unlocked');
  const lockCount = serverData.get('lockCount') || 0;
  const unlockCount = serverData.get('trueCount') || 0;
  const ret = $$commonPieOption.mergeDeep({
    color: [colors[7], colors[1]],
    legend: {
      data: [unlockText, lockText],
      x: '60%',
    },
    title: {
      text: _('Lock Status'),
      subtext: `${lockCount} / ${unlockCount}`,
    },
    series: [
      {
        name: _('Status'),
      },
    ],
  }).toJS();

  ret.series[0].data = [
    { value: unlockCount, name: unlockText },
    { value: lockCount, name: lockText },
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
        <div className="t-overview row">
          <div className="t-overview__section">
            <div
              className="element t-overview__section-header"
            >
              <h3>{ _('Users') }</h3>
            </div>

            <div className="cols col-7">
              <div className="element row">
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
                  >{_('Total Number')}</h3>
                  <p
                    style={{
                      fontSize: '30px',
                      marginTop: '10px',
                      padding: '56px 0',
                      textAlign: 'center',
                      color: 'green',
                      border: '1px solid #e5e5e5',
                      borderRadius: '4px',
                    }}
                  >
                    {serverData.get('accCount') || 0}
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
              <div className="element">
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
          </div>

          <div
            className="element t-overview__header"
          >
            <h3>
              { _('Authentication logs') }
            </h3>
          </div>
          <div
            className="t-overview__section"
          >
            <div className="element">
              <Table
                options={recordOptions}
                className="table table--light"
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
