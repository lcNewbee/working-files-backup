import React, { PropTypes } from 'react';
import { fromJS, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { colors } from 'shared/config/axc';
import Select from 'shared/components/Select';
import Table from 'shared/components/Table';
import Modal from 'shared/components/Modal';
import FormInput from 'shared/components/Form/FormInput';
// import EchartReact from 'shared/components/EchartReact';
import AppScreen from 'shared/components/Template/AppScreen';
import { actions as appActions } from 'shared/containers/app';
import { actions } from 'shared/containers/appScreen';

const flowRateFilter = utils.filter('flowRate');
const propTypes = fromJS({
  route: PropTypes.object,
  initScreen: PropTypes.func,
});

// const flowChartStyle = {
//   width: '100%',
//   minHeight: '300px',
// };

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
// const interfaceSwitchs = fromJS([
//   {
//     value: 'eth0',
//     label: 'Eth0',
//   },
//   {
//     value: 'eth1',
//     label: 'Eth1',
//   },
//   {
//     value: 'eth2',
//     label: 'Eth2',
//   },
//   {
//     value: 'eth3',
//     label: 'Eth3',
//   },
//   {
//     value: 'eth4',
//     label: 'Eth4',
//   },
// ]);

const userModalOptions = fromJS([
  {
    id: 'mac',
    text: __('MAC'),
  }, {
    id: 'ip',
    text: __('IP'),
  },
  // {
  //   id: 'osType',
  //   text: __('OS Type'),
  //   transform(val) {
  //     if (val === '' || val === undefined) {
  //       return '--';
  //     }
  //     return val;
  //   },
  // },
  {
    id: 'application',
    text: __('Applications'),
    transform(val) {
      if (typeof (val) === 'undefined' || val.size === 0) return '--';
      const len = val.size;
      const n1 = len / 10;
      const n2 = len % 10;
      let div = [];
      for (let i = 0; i < n1; i++) {
        const start = i * 10;
        const end = i * 10 + 10;
        const arrStr = val.slice(start, end).join(', ');
        div.push(<span>{arrStr}<br /></span>)
      }
      const lastArrStr = n2 === 0 ? '' : val.slice(n1 * 10, len).join(', ');
      div.push(<span>{lastArrStr}</span>);
      return div;
    },
  }, {
    id: 'curRate',
    text: __('Current Rate'),
    transform(val) {
      return `${flowRateFilter.transform(val)}/s`;
    },
  }, {
    id: 'trafficPercent',
    text: __('Proportion'),
  },
]);

const viewOptions = fromJS([
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '150', value: '150' },
]);


function getFlowUnit(val) {
  let ret = {};

  if (val <= 10240) {
    ret = {
      label: 'B',
      val: 1,
    };
  } else if (val <= (50 * Math.pow(1024, 2))) {
    ret = {
      label: 'KB',
      val: Math.pow(1024, 1),
    };
  } else if (val <= (50 * Math.pow(1024, 2))) {
    ret = {
      label: 'MB',
      val: Math.pow(1024, 2),
    };
  } else if (val <= (50 * Math.pow(1024, 3))) {
    ret = {
      label: 'GB',
      val: Math.pow(1024, 3),
    };
  } else {
    ret = {
      label: 'TB',
      val: Math.pow(1024, 4),
    };
  }
  return ret;
}

function getFlowOption(serverData, timeType) {
  const option = {
    color: [colors[0], colors[1]],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [__('Throughput')],
    },
    grid: {
      left: '0',
      right: '7%',
      bottom: '3%',
      containLabel: true,
    },
    calculable: true,
    xAxis: [{
      type: 'category',
      interval: 1,
      nameGap: 5,
      nameTextStyle: {
        fontWeight: 'bolder',
      },
      splitLine: {
        show: false,
        interval: 0,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
      },
    }],
    yAxis: [{
      type: 'value',
      name: __('KB'),
      splitNumber: 5,
      min: '0',
      axisLabel: {
        formatter: '{value}',
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dotted',
          color: '#e1e6e9',
        },
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
    }],
    series: [
      {
        name: __('Throughput'),
        type: 'line',
        // smooth: true,
        // itemStyle: {
        //   normal: {
        //     areaStyle: {
        //       type: 'default',
        //       opacity: 0.3,
        //     },
        //   },
        // },
      },
      // ,
      // {
        // name: __('Download'),
        // type: 'line',
        // smooth: true,
        // itemStyle: {
        //   normal: {
        //     areaStyle: {
        //       type: 'default',
        //       opacity: 0.4,
        //     },
        //   },
        // },
      // },
    ],
  };
  let xAxisData;
  let xAxisName = __('Days');
  let $$upDataList = serverData.getIn(['upFlowList']);
  // let $$downDataList = serverData.getIn(['downFlowList']);
  let maxVal = 0;
  // let maxVal1 = 0;
  let utilObj = {};

  if (!$$upDataList) {
    return null;
  }
  maxVal = $$upDataList.max();
  // maxVal1 = $$downDataList.max();

  // if (maxVal1 > maxVal) {
  //   maxVal = maxVal1;
  // }

  utilObj = getFlowUnit(maxVal);

  $$upDataList = $$upDataList.toJS();
  // $$downDataList = $$downDataList.toJS();

  if (timeType === '0' ||
    timeType === '1') {
    xAxisData = List(new Array(25)).map(
      (val, i) => `${i}:00`,
    ).toJS();
    xAxisName = __('Hours');
  } else if (timeType === '7') {
    xAxisData = List(new Array(8)).map(
      (val, i) => i,
    ).toJS();
  } else if (timeType === '15') {
    xAxisData = List(new Array(16)).map(
      (val, i) => i,
    ).toJS();
  } else {
    xAxisData = List(new Array(31)).map(
      (val, i) => i,
    ).toJS();
  }

  option.xAxis[0].data = xAxisData;
  option.xAxis[0].name = xAxisName;
  option.yAxis[0].name = utilObj.label;

  option.series[0].data = $$upDataList.map( // 基础单位是B
    val => parseFloat(val / utilObj.val).toFixed(3),
  );
  // option.series[1].data = $$downDataList.map(
  //   val => (val / utilObj.val),
  // );

  return option;
}




export default class EthStatistic extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'initOptions',
      'onChangeTimeType',
      'onChangeInterface',
      'onChangePage',
      'onChangeView',
    ]);
    this.state = {
      showModal: false,
      ethId: '0',
    };
  }
  componentWillMount() {
    this.initOptions(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const curScreenId = nextProps.store.get('curScreenId');

    if (this.props.store.getIn([curScreenId, 'data']) !== nextProps.store.getIn([curScreenId, 'data'])) {
      this.initOptions(nextProps);
    }
  }

  onChangeTimeType(data) {
    this.props.changeScreenQuery({
      timeType: data.value,
    });
    this.props.fetchScreenData();
  }

  onChangeInterface(data) {
    this.props.changeScreenQuery({
      ethx: data.value,
    });
    this.props.fetchScreenData();
  }

  onChangePage(data) {
    this.props.changeScreenQuery({ page: data });
    this.props.fetchScreenData();
  }
  onChangeView(data) {
    this.props.changeScreenQuery({ size: data.value });
    this.props.fetchScreenData();
  }

  initOptions(props) {
    const { store } = props;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);

    this.serverData = serverData;
    this.flowOption = getFlowOption(serverData, store.getIn([curScreenId, 'query', 'timeType']));
  }
  render() {
    // const flowOption = this.flowOption;
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);
    const listOptions = fromJS([
      {
        id: 'ethx_name',
        text: __('Name'),
      }, {
        id: 'userNum',
        text: __('User Number'),
        transform: function (val, item) {
          return (
            <span
              style={{
                width: '100%',
                color: 'blue',
                cursor: 'pointer',
                display: 'inline-block',
              }}
              title={__('Click for details')}
              onClick={() => {
                const ethList = store.getIn([curScreenId, 'data', 'list']);
                const eth = item.get('ethx_name');
                const index = ethList.findIndex(listItem => listItem.get('ethx_name') === eth);
                this.setState({
                  showModal: true,
                  ethId: index,
                });
                Promise.resolve().then(() => {
                  this.props.changeScreenQuery({
                    ethx: `eth${this.state.ethId}`,
                    page: '1',
                    size: '20',
                  });
                }).then(() => {
                  this.props.fetchScreenData();
                });
              }}
            >
              {val || '0'}
            </span>
          );
        }.bind(this),
      }, {
        id: 'application',
        text: __('Applications'),
        transform(val) {
          if (typeof (val) === 'undefined' || val.size === 0) return '--';
          const len = val.size;
          const n1 = len / 10;
          const n2 = len % 10;
          const div = [];
          for (let i = 0; i < n1; i++) {
            const start = i * 10;
            const end = (i * 10) + 10;
            const arrStr = val.slice(start, end).join(', ');
            div.push(<span>{arrStr}<br /></span>);
          }
          const lastArrStr = n2 === 0 ? '' : val.slice(n1 * 10, len).join(', ');
          div.push(<span>{lastArrStr}</span>);
          return div;
        },
      }, {
        id: 'curRate',
        text: __('Current Rate'),
        transform(val) {
          return `${flowRateFilter.transform(val)}/s`;
        },
      },
      /*{
        id: 'active_eth',
        text: __('Active Status'),
        actionName: 'active',
        type: 'switch',
        transform: function(val, item) {
          return (
            <FormInput
              type="checkbox"
              checked={val === '1'}
              onChange={() => {
                let nextStatus = '1';
                if (val === '1') nextStatus = '0';
                Promise.resolve().then(() => {
                  this.props.changeScreenActionQuery({
                    action: 'active',
                    active_eth: nextStatus,
                    ethx_name: item.get('ethx_name'),
                  });
                }).then(() => {
                  const url = this.props.route.formUrl;
                  const query = this.props.store.getIn([curScreenId, 'actionQuery']).toJS();
                  this.props.save(url, query);
                }).then(() => {
                  this.props.fetchScreenData();
                });
              }}
            />
          );
        }.bind(this),
      },*/
    ]);
    return (
      <AppScreen
        {...this.props}
        // listOptions={listOptions}
        initOption={{
          isFetchInfinite: true,
          fetchIntervalTime: 5000,
          query: {
            timeType: '0',
            ethx: 'eth0',
          },
        }}
        // actionable
        // addable={false}
        // editable={false}
        // deleteable={false}
        // listKey="ethx_name"
        // listTitle={__('Statistics Within 30 Seconds')}
      >
        <div className="t-overview">
          <div className="t-overview__section">
            <div className="element t-overview__section-header">
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
                {/* <span
                  style={{
                    marginRight: '10px',
                    marginLeft: '20px',
                  }}
                >
                  {__('Interface')}
                </span>
                <Select
                  options={interfaceSwitchs.toJS()}
                  value={store.getIn([curScreenId, 'query', 'ethx'])}
                  onChange={this.onChangeInterface}
                  clearable={false}
                />*/}
              </h3>
            </div>
          </div>
          {/* <div className="element">
            <EchartReact
              option={flowOption}
              className="o-box__canvas"
              style={flowChartStyle}
            />
          </div>*/}
          <div className="t-overview__section">
            <Table
              className="table"
              options={listOptions}
              list={serverData.get('list')}
            />
          </div>
        </div>
        <Modal
          isShow={this.state.showModal}
          title={`Eth${this.state.ethId} ${__('Clients List')}`}
          cancelButton={false}
          size="lg"
          draggable
          onOk={() => {
            this.setState({
              showModal: false,
            });
          }}
          onClose={() => {
            this.setState({
              showModal: false,
            });
          }}
        >
          <div className="t-overview">
            <div className="element t-overview__section-header">
              <span
                style={{
                  marginRight: '5px',
                  fontWeight: 'bold',
                }}
              >
                {__('View')}
              </span>
              <FormInput
                label={__('View')}
                options={viewOptions.toJS()}
                type="select"
                value={store.getIn([curScreenId, 'query', 'size'])}
                onChange={this.onChangeView}
              />
            </div>
            <div className="t-overview__section">
              <Table
                options={userModalOptions}
                list={store.getIn([curScreenId, 'data', 'ethxClientList'])}
                className="table"
                page={store.getIn([curScreenId, 'data', 'page'])}
                onPageChange={this.onChangePage}
              />
            </div>
          </div>
        </Modal>
      </AppScreen>
    );
  }
}

EthStatistic.propTypes = propTypes;

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
)(EthStatistic);
