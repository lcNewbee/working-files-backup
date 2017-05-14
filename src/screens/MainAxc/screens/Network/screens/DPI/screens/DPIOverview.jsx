import React from 'react'; import PropTypes from 'prop-types';
import { fromJS, List, Map } from 'immutable';
import { $$commonPieOption } from 'shared/config/axc';
import EchartReact from 'shared/components/EchartReact';

import Select from 'shared/components/Select';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';

const flowRateFilter = utils.filter('flowRate');
const msg = {
  days: __('Days'),
};
const timeTypeSwitchs = fromJS([
  {
    value: '-1',
    label: __('Current'),
  },
  {
    value: '0',
    label: __('Today'),
  },
  {
    value: '1',
    label: __('Yesterday'),
  },
  {
    value: '7',
    label: `7 ${msg.days}`,
  },
  {
    value: '15',
    label: `15 ${msg.days}`,
  },
  {
    value: '30',
    label: `30 ${msg.days}`,
  },
]);
function getEchartOptionByName(serverData, listName) {
  let dataList = serverData.get(listName);
  const ret = $$commonPieOption.mergeDeep({
    title: {
      text: (() => {
        let title;
        switch (listName) {
          case 'ethInterface':
            title = __('Ethernet'); break;
          case 'proto':
            title = __('Applications'); break;
          case 'mac':
            title = __('Clients'); break;
          default:
        }
        return title;
      })(),
      left: '24%',
      top: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {d}%',
    },
    legend: {
      orient: 'vertical',
      x: '50%',
      y: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 7,
      height: 200,
      textStyle: {
        fontSize: 12,
      },
      tooltip: {
        show: true,
      },
      formatter: (name) => {
        const num = serverData.get(listName)
          .find($$item => $$item.get('name') === name)
          .get('value');
        // return listName === 'mac' ? `${name.substring(0, 8)}... : ${num}%` : `${name} : ${num}%`;
        return name.length > 7 ? `${name.substring(0, 7)}... : ${flowRateFilter.transform(num)}` :
                                 `${name} : ${flowRateFilter.transform(num)}`;
      },
    },
    series: [
      {
        name: __('Traffic'),
        center: ['25%', '50%'],
      },
    ],
  }).toJS();


  if (List.isList(dataList)) {
    dataList = dataList.sort(($$a, $$b) => {
      const a = $$a.get('value');
      const b = $$b.get('value');

      if (a < b) { return 1; }
      if (a > b) { return -1; }
      if (a === b) { return 0; }
    });
    ret.legend.data = dataList.map(item => item.get('name')).toJS();
    ret.series[0].data = dataList.toJS();
  }

  return ret;
}

const propTypes = {
  store: PropTypes.instanceOf(Map),
};
const defaultProps = {};

export default class DPIOverview extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onChangeTimeType',
    ]);
  }

  onChangeTimeType(data) {
    this.props.changeScreenQuery({ timeType: data.value });
    this.props.fetchScreenData();
  }

  render() {
    const curScreenId = this.props.store.get('curScreenId');
    const serverData = this.props.store.getIn([curScreenId, 'data']);
    const store = this.props.store;

    return (
      <AppScreen
        {...this.props}
        initOption={{
          isFetchInfinite: true,
          fetchIntervalTime: 10000,
          query: {
            timeType: '0',
          },
        }}
      >
        {
          this.props.store.getIn([curScreenId, 'curSettings', 'ndpiEnable']) === '1' ? (
            <div className="t-overview" style={{ minWidth: '1100px' }}>
              {/* <div className="element t-overview__section-header">
                <h3>
                  <span
                    style={{
                      marginRight: '10px',
                    }}
                  >
                    {__('Time')}
                  </span>
                  <Select
                    options={timeTypeSwitchs.toJS()}
                    value={store.getIn([curScreenId, 'query', 'timeType'])}
                    onChange={this.onChangeTimeType}
                    clearable={false}
                  />
                </h3>
              </div>*/}
              <div className="t-overview__section row">
                <div className="cols col-6" >
                  <div className="element clearfix" style={{ minWidth: '550px' }}>
                    <h3 className="fl">{__('Clients')}</h3>
                    <span
                      className="fr"
                      style={{
                        marginRight: '40px',
                        cursor: 'pointer',
                        color: 'blue',
                        fontSize: '14px',
                      }}
                      onClick={() => {
                        window.location.href = '#/main/network/dpi/macstatistic';
                      }}
                    >
                      {__('More Details >>')}
                    </span>
                  </div>
                  <div className="element row" style={{ minWidth: '550px' }}>
                    <EchartReact
                      option={getEchartOptionByName(serverData, 'mac')}
                      className="o-box__canvas"
                      style={{
                        width: '100%',
                        minHeight: '200px',
                      }}
                    />
                  </div>
                </div>
                <div className="cols col-6">
                  <div className="element clearfix" style={{ minWidth: '550px' }}>
                    <h3 className="fl">{__('Applications')}</h3>
                    <span
                      className="fr"
                      style={{
                        marginRight: '40px',
                        cursor: 'pointer',
                        color: 'blue',
                        fontSize: '14px',
                      }}
                      onClick={() => {
                        window.location.href = '#/main/network/dpi/protoinfo';
                      }}
                    >
                      {__('More Details >>')}
                    </span>
                  </div>
                  <div className="element">
                    <EchartReact
                      option={getEchartOptionByName(serverData, 'proto')}
                      className="o-box__canvas"
                      style={{
                        width: '100%',
                        minHeight: '200px',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="t-overview__section row">
                <div className="cols col-6" >
                  <div className="element clearfix">
                    <h3 className="fl">{__('Ethernet')}</h3>
                    <span
                      className="fr"
                      style={{
                        marginRight: '40px',
                        cursor: 'pointer',
                        color: 'blue',
                        fontSize: '14px',
                      }}
                      onClick={() => {
                        window.location.href = '#/main/network/dpi/ethstatistic';
                      }}
                    >
                      {__('More Details >>')}
                    </span>
                  </div>
                  <div className="element" style={{ minWidth: '550px' }}>
                    <EchartReact
                      option={getEchartOptionByName(serverData, 'ethInterface')}
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
          ) : (
            this.props.store.getIn([curScreenId, 'curSettings', 'ndpiEnable']) === '0' ? (
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '20px',
                  paddingLeft: '230px',
                  marginTop: '30px',
                  color: '#CCC',
                }}
              >
                {__('NDPI Disabled')}
              </div>
            ) : null
          )
        }
      </AppScreen>
    );
  }
}

DPIOverview.propTypes = propTypes;
DPIOverview.defaultProps = defaultProps;

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
)(DPIOverview);

