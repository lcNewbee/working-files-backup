import React from 'react'; import PropTypes from 'prop-types';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import Select from 'shared/components/Select';
import Table from 'shared/components/Table';
// import EchartReact from 'shared/components/EchartReact';

import { FormGroup, FormInput } from 'shared/components/Form';
import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';
import { colors } from 'shared/config/axc';

const flowRateFilter = utils.filter('flowRate');
const propTypes = {
  route: PropTypes.object,
  initScreen: PropTypes.func,
};

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

// function getFlowOption(serverData, timeType) {
//   const option = {
//     color: [colors[0], colors[1]],
//     tooltip: {
//       trigger: 'axis',
//     },
//     legend: {
//       data: [__('Upload'), __('Download')],
//     },
//     grid: {
//       left: '0',
//       right: '7%',
//       bottom: '3%',
//       containLabel: true,
//     },
//     calculable: true,
//     xAxis: [{
//       type: 'category',
//       interval: 1,
//       nameGap: 5,
//       nameTextStyle: {
//         fontWeight: 'bolder',
//       },
//       splitLine: {
//         show: false,
//         interval: 0,
//       },
//       axisLine: {
//         show: false,
//       },
//       axisTick: {
//         show: false,
//       },
//       axisLabel: {
//         interval: 0,
//       },
//     }],
//     yAxis: [{
//       type: 'value',
//       name: __('KB'),
//       splitNumber: 5,
//       min: 0,
//       axisLabel: {
//         formatter: '{value}',
//       },
//       splitLine: {
//         show: true,
//         lineStyle: {
//           type: 'dotted',
//           color: '#e1e6e9',
//         },
//       },
//       axisTick: {
//         show: false,
//       },
//       axisLine: {
//         show: false,
//       },
//     }],
//     series: [
//       {
//         name: __('Upload'),
//         type: 'line',
//         // smooth: true,
//         // itemStyle: {
//         //   normal: {
//         //     areaStyle: {
//         //       type: 'default',
//         //       opacity: 0.3,
//         //     },
//         //   },
//         // },
//       },
//       {
//         name: __('Download'),
//         type: 'line',
//         // smooth: true,
//         // itemStyle: {
//         //   normal: {
//         //     areaStyle: {
//         //       type: 'default',
//         //       opacity: 0.4,
//         //     },
//         //   },
//         // },
//       },
//     ],
//   };
//   let xAxisData;
//   let xAxisName = __('Days');
//   let $$upDataList = serverData.getIn(['upFlowList']);
//   let $$downDataList = serverData.getIn(['downFlowList']);
//   let maxVal = 0;
//   let maxVal1 = 0;
//   let utilObj = {};

//   if (!$$upDataList || !$$downDataList) {
//     return null;
//   }
//   maxVal = $$upDataList.max();
//   maxVal1 = $$downDataList.max();

//   if (maxVal1 > maxVal) {
//     maxVal = maxVal1;
//   }

//   utilObj = getFlowUnit(maxVal);

//   $$upDataList = $$upDataList.toJS();
//   $$downDataList = $$downDataList.toJS();

//   if (timeType === '0' ||
//     timeType === '1') {
//     xAxisData = List(new Array(25)).map(
//       (val, i) => `${i}:00`,
//     ).toJS();
//     xAxisName = __('Hours');
//   } else if (timeType === '7') {
//     xAxisData = List(new Array(8)).map(
//       (val, i) => i,
//     ).toJS();
//   } else if (timeType === '15') {
//     xAxisData = List(new Array(16)).map(
//       (val, i) => i,
//     ).toJS();
//   } else {
//     xAxisData = List(new Array(31)).map(
//       (val, i) => i,
//     ).toJS();
//   }

//   option.xAxis[0].data = xAxisData;
//   option.xAxis[0].name = xAxisName;
//   option.yAxis[0].name = utilObj.label;

//   option.series[0].data = $$upDataList.map(
//     val => parseFloat(val / utilObj.val).toFixed(3),
//   );
//   option.series[1].data = $$downDataList.map(
//     val => parseFloat(val / utilObj.val).toFixed(3),
//   );

//   return option;
// }

const listOptions = fromJS([
  {
    id: 'mac',
    text: __('Clients'),
  }, {
    id: 'ip',
    text: __('IP'),
  },
  // {
  //   id: 'osType',
  //   text: __('OS Type'),
  //   render(val) {
  //     if (val === '' || val === undefined) {
  //       return '--';
  //     }
  //     return val;
  //   },
  // },
  {
    id: 'application',
    text: __('Applications'),
    render(val) {
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
    render(val) {
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


export default class MacStatistic extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'initOptions',
      'onChangeTimeType',
      'onChangeSearchMac',
      'onChangePage',
      'onSelectRow',
      // 'getMacOptions',
      'onChangeView',
      // 'selectMac',
    ]);
    // this.deleteMac = fromJS([]);
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


  // componentDidUpdate() {
  //   const curScreenId = this.props.store.get('curScreenId');
  //   let graphMac = this.props.store.getIn([curScreenId, 'query', 'graphMac']);
  //   this.deleteMac.forEach((val) => {
  //     graphMac = graphMac.delete(val);
  //   });
  //   this.props.changeScreenQuery({ graphMac });
  // }

  onChangeTimeType(data) {
    this.props.changeScreenQuery({ timeType: data.value });
    this.props.fetchScreenData();
  }

  onChangeSearchMac(data) {
    this.props.changeScreenQuery({ search: data.value });
    if ((/^([0-9a-fA-F]{2}(:|-)){5}[0-9a-fA-F]{2}$/).test(data.value) || data.value === '') { // 目前只能搜索完整的MAC地址
      this.props.fetchScreenData();
    }
  }

  // onSelectRow(data) { // 最多允许勾选三个列表项进行绘图
  //   const that = this;
  //   const curScreenId = this.props.store.get('curScreenId');
  //   const ifSelected = this.props.store.getIn([curScreenId, 'data', 'list', data.index, '__selected__']);
  //   const list = this.props.store.getIn([curScreenId, 'data', 'list']);
  //   if (data.index === -1) return;
  //   /** *************** 注释的这段是单选的代码 ******************/
  //   // this.props.selectListItem({
  //   //   keyName: 'index',
  //   //   index: data.index,
  //   //   selected: !ifSelected,
  //   // });
  //   // if (!ifSelected) { // 单选，如果是勾将已经勾选的勾去
  //   //   list.forEach((item, index) => {
  //   //     if (index !== data.index) {
  //   //       this.props.selectListItem({
  //   //         keyName: 'index',
  //   //         selected: false,
  //   //         index,
  //   //       });
  //   //     }
  //   //   });
  //   // }
  //   /** ********************** 单选代码完毕 **************************/

  //   /** *********************** 多选代码 ****************************/
  //   function selectGraphItem(num) {
  //     if (!ifSelected) {
  //       const checkedNum = list.count((item) => {
  //         if (item.get('__selected__')) return true;
  //         return false;
  //       });
  //       if (checkedNum < num) {
  //         that.props.selectListItem({
  //           keyName: 'index',
  //           index: data.index,
  //           selected: true,
  //         });
  //       }
  //     } else {
  //       that.props.selectListItem({
  //         keyName: 'index',
  //         index: data.index,
  //         selected: false,
  //       });
  //     }
  //   }
  //   /** ******************* 多选代码完成 *************************** */
  //   // 将选择的MAC加入query
  //   Promise.resolve(3).then((n) => { selectGraphItem(n); }).then(() => {
  //     const graphMac = this.props.store.getIn([curScreenId, 'data', 'list']).map((item) => {
  //       if (item.get('__selected__')) return item.get('mac');
  //       return '';
  //     }).filter(mac => mac !== '');
  //     this.props.changeScreenQuery({ graphMac });
  //   });
  // }

  onChangeView(data) {
    this.props.changeScreenQuery({ size: data.value });
    this.props.fetchScreenData();
  }

  onChangePage(data) {
    this.props.changeScreenQuery({ page: data });
    this.props.fetchScreenData();
  }

  // getMacOptions() {
  //   const curScreenId = this.props.store.get('curScreenId');
  //   const list = this.props.store.getIn([curScreenId, 'data', 'list']);
  //   const options = list.map(item => ({
  //     value: item.get('mac'),
  //     label: item.get('mac'),
  //   }));
  //   return options.toJS();
  // }

  initOptions(props) {
    const { store } = props;
    const curScreenId = store.get('curScreenId');
    const serverData = store.getIn([curScreenId, 'data']);

    this.serverData = serverData;
    // this.flowOption = getFlowOption(serverData, store.getIn([curScreenId, 'query', 'timeType']));
  }

  // selectMac() {
  //   const store = this.props.store;
  //   const curScreenId = store.get('curScreenId');
  //   const graphMac = store.getIn([curScreenId, 'query', 'graphMac']);
  //   const list = store.getIn([curScreenId, 'data', 'list']);
  //   let newList = list;

  //   // let newGraphMac = fromJS([]);
  //   if (graphMac && graphMac.size > 0) {
  //     newList = list.map((item) => {
  //       if (graphMac.includes(item.get('mac'))) return item.set('__selected__', true);
  //       return item;
  //     });
  //     graphMac.forEach((mac) => {
  //       const index = list.find(item => item.get('mac') === mac);
  //       if (index === -1) { // 不存在则在graphMac中删除该Mac
  //         this.deleteMac = this.deleteMac.push(mac);
  //       }
  //     });
  //   }
  //   this.newList = newList;
  // }

  render() {
    // const flowOption = this.flowOption;
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    // const serverData = store.getIn([curScreenId, 'data']);

    // this.selectMac();
    return (
      <AppScreen
        {...this.props}
        // listOptions={listOptions}
        initOption={{
          isFetchInfinite: true,
          fetchIntervalTime: 10000,
          query: {
            timeType: '0',
            size: 50,
            page: 1,
          },
        }}
        // listTitle={__('Statistics Within 30 Seconds')}
      >
        <div className="t-overview">
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
                style={{
                  width: '180px',
                }}
              />
              <span
                style={{
                  marginRight: '10px',
                  marginLeft: '20px',
                }}
              >
                {__('Search MAC')}
              </span>
              <FormInput
                // options={this.getMacOptions()}
                value={store.getIn([curScreenId, 'query', 'search'])}
                onChange={this.onChangeSearchMac}
                placeholder={__('Complete MAC Address')}
              />
            </h3>
          </div>
          <div className="t-overview__section">
            <Table
              // selectable
              className="table"
              options={listOptions}
              // list={this.newList}
              list={store.getIn([curScreenId, 'data', 'list'])}
              page={store.getIn([curScreenId, 'data', 'page'])}
              pageQuery={{
                size: store.getIn([curScreenId, 'query', 'size']),
              }}
              onPageChange={this.onChangePage}
              onPageSizeChange={this.onChangeView}
              // onRowSelect={this.onSelectRow}
            />
          </div>
          {/* <h3 className="element t-overview__header">{__('Historical Graphs')}</h3>
          <div className="t-overview__section">
            <div className="element t-overview__section-header">
              <h3>
                <span
                  style={{
                    marginRight: '10px',
                  }}
                >
                  {__('Traffic')}
                </span>
                <Select
                  options={timeTypeSwitchs.toJS()}
                  value={store.getIn([curScreenId, 'query', 'timeType'])}
                  onChange={this.onChangeTimeType}
                  clearable={false}
                />
                <span
                  style={{
                    marginRight: '10px',
                    marginLeft: '20px',
                  }}
                >
                  {__('MAC')}
                </span>
                <Select
                  options={this.getMacOptions()}
                  value={store.getIn([curScreenId, 'query', 'mac'])}
                  onChange={this.onChangeSearchMac}
                  clearable={false}
                />
              </h3>
            </div>
            <div className="element">
              <EchartReact
                option={flowOption}
                className="o-box__canvas"
                style={flowChartStyle}
              />
            </div>
          </div>*/}
        </div>
      </AppScreen>
    );
  }
}

MacStatistic.propTypes = propTypes;

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
)(MacStatistic);
