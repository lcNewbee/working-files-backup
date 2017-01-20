import React, { PropTypes } from 'react';
import { fromJS, List, Map } from 'immutable';
import { $$commonPieOption } from 'shared/config/axc';
import EchartReact from 'shared/components/EchartReact';
import AppScreen from 'shared/components/Template/AppScreen';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/screens';

function getEchartOptionByName(serverData, listName) {
  let dataList = serverData.get(listName);
  const ret = $$commonPieOption.mergeDeep({
    title: {
      text: _(listName),
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {d}%',
    },
    legend: {
      orient: 'vertical',
      x: '56%',
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
        // return echarts.format.truncateText(`${name.substring(0, 8)}: ${num}%`, 150, '12px Microsoft Yahei', '…');
        return listName === 'mac' ? `${name.substring(0, 8)}... : ${num}%` : `${name} : ${num}%`;
      },
    },
    series: [
      {
        name: _('Percentage'),
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
  // route: PropTypes.object,
  // groupid: PropTypes.any,
  // initScreen: PropTypes.func,
  // leaveScreen: PropTypes.func,
  // fetchScreenData: PropTypes.func,
  // changeScreenQuery: PropTypes.func,
};
const defaultProps = {};

export default class DPIOverview extends React.Component {
  constructor(props) {
    super(props);

    // props.initScreen({
    //   id: props.route.id,
    //   formUrl: props.route.formUrl,
    //   path: props.route.path,
    //   isFetchInfinite: true,
    //   fetchIntervalTime: 5000,
    // });
  }

  // componentWillMount() {
  //   this.props.fetchScreenData();
  // }

  render() {
    const curScreenId = this.props.store.get('curScreenId');
    const serverData = this.props.store.getIn([curScreenId, 'data']);
    return (
      <AppScreen
        {...this.props}
        initOption={{
          isFetchInfinite: true,
          fetchIntervalTime: 10000,
        }}
        settingsFormOptions={fromJS([
          {
            id: 'ndpiEnable',
            label: _('NDPI Enable'),
            type: 'checkbox',
            saveOnChange: true,
          },
        ])}
      >
        {
          this.props.store.getIn([curScreenId, 'curSettings', 'ndpiEnable']) === '1' ? (
            <div className="t-overview">
              <div className="t-overview__section row">
                <div className="cols col-6" >
                  <div className="element">
                    <h3>{_('ethInterface')}</h3>
                  </div>
                  <div className="element">
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
                <div className="cols col-6">
                  <div className="element">
                    <h3>{_('proto')}</h3>
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
                  <div className="element">
                    <h3>{_('mac')}</h3>
                  </div>
                  <div className="element row">
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
              </div>
            </div>
          ) : null
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

