import React from 'react'; import PropTypes from 'prop-types';
import { fromJS, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { colors } from 'shared/config/axc';
import Table from 'shared/components/Table';

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
function renderApplication(val) {
  if (typeof (val) === 'undefined' || val.size === 0) return '--';
  const numPerLine = 6;
  const len = val.size;
  const n1 = len / numPerLine;
  const n2 = len % numPerLine;
  const ret = [];

  for (let i = 0; i < n1; i += 1) {
    const start = i * numPerLine;
    const end = (i * numPerLine) + numPerLine;
    const arrStr = val.slice(start, end).join(', ');
    if (i !== n1 - 1) {
      ret.push(<span key={`application${i}`}>{arrStr}<br /></span>);
    } else if (i === n1 - 1) {
      ret.push(<span key={`application${i}`}>{arrStr}</span>);
    }
  }
  const lastArrStr = n2 === 0 ? '' : val.slice(n1 * numPerLine, len).join(', ');
  if (lastArrStr) ret.push(<span key="applicationLast"><br />{lastArrStr}</span>);

  return ret;
}
const userModalOptions = fromJS([
  {
    id: 'mac',
    text: __('MAC'),
  }, {
    id: 'ip',
    text: __('IP'),
  },
  {
    id: 'application',
    text: __('Applications'),
    render: renderApplication,
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

const propTypes = {
  store: PropTypes.object,
  changeScreenQuery: PropTypes.func,
  fetchScreenData: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
};

export default class EthStatistic extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'initOptions',
      'onChangePage',
      'onChangeView',
      'renderViewUsers',
    ]);
    this.state = {
      showModal: false,
      ethId: '0',
    };
  }
  componentWillMount() {
    this.initOptions(this.props);
    this.listOptions = fromJS([
      {
        id: 'ethx_name',
        text: __('Ports'),
      },
      {
        id: 'userNum',
        text: __('User Number'),
        render: (val, item) => (
          <span
            className="link-text"
            title={__('Click for details')}
            onClick={() => {
              const eth = item.get('ethx_name');

              Promise.resolve().then(() => {
                this.props.changeScreenQuery({
                  ethx: eth,
                  page: 1,
                  size: 20,
                });
              }).then(() => {
                this.props.fetchScreenData();
                this.props.changeScreenActionQuery({
                  action: 'viewUsers',
                  myTitle: `${eth} ${__('Clients List')}`,
                });
              });
            }}
          >
            {val || '0'}
          </span>
        ),
      },
      {
        id: 'application',
        text: __('Applications'),
        render: renderApplication,
      },
      {
        id: 'curRate',
        text: __('Current Rate'),
        render(val) {
          return `${flowRateFilter.transform(val)}/s`;
        },
      },
    ]);
  }

  componentWillReceiveProps(nextProps) {
    const curScreenId = nextProps.store.get('curScreenId');

    if (this.props.store.getIn([curScreenId, 'data']) !== nextProps.store.getIn([curScreenId, 'data'])) {
      this.initOptions(nextProps);
    }
  }
  componentWillUpdate(nextProps) {
    const myScreenId = this.props.store.get('curScreenId');
    const thisActionType = this.props.store.getIn([myScreenId, 'actionQuery', 'action']);
    const nextActionType = nextProps.store.getIn([myScreenId, 'actionQuery', 'action']);

    if (thisActionType === 'viewUsers' && (thisActionType !== nextActionType)) {
      this.isCloseCustomModal = true;
    } else if (nextActionType && nextActionType !== 'viewUsers') {
      this.isCloseCustomModal = false;
    }
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
  renderViewUsers() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const actionType = store.getIn([curScreenId, 'actionQuery', 'action']);

    if (actionType !== 'viewUsers' && !this.isCloseCustomModal) {
      return null;
    }

    return (
      <Table
        options={userModalOptions}
        list={store.getIn([curScreenId, 'data', 'ethxClientList'])}
        className="table"
        pageQuery={{
          size: store.getIn([curScreenId, 'query', 'size']),
        }}
        page={store.getIn([curScreenId, 'data', 'page'])}
        onPageChange={this.onChangePage}
        onPageSizeChange={this.onChangeView}
      />
    );
  }
  render() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const notEditListItem = store.getIn([curScreenId, 'actionQuery', 'action']) === 'viewUsers' || this.isCloseCustomModal;

    return (
      <AppScreen
        {...this.props}
        listOptions={this.listOptions}
        paginationType="none"
        initOption={{
          isFetchInfinite: true,
          fetchIntervalTime: 5000,
          query: {
            timeType: '0',
            ethx: 'eth0',
          },
        }}
        queryFormOptions={fromJS([
          {
            id: 'timeType',
            label: __('Time'),
            type: 'select',
            options: timeTypeSwitchs,
            saveOnChange: true,
          },
        ])}
        modalSize={notEditListItem ? 'lg' : 'md'}
        modalChildren={this.renderViewUsers()}
      />
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
