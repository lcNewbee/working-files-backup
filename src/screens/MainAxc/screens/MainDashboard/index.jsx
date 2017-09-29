import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fromJS, Map, List } from 'immutable';
import echarts from 'echarts/lib/echarts';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { Icon, FormInput, EchartReact, Table, MapContainer } from 'shared/components';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import { colors, $$commonPieOption } from 'shared/config/axc';
import onportimg from './OnPort@2x.png';
import offportimg from './OffPort@2x.png';
import apoffline from './ap_offline.png';
import aponline from './ap_online.png';
import mapViewBg1 from './map1.jpg';
import mapViewBg2 from './map2.jpg';
// import mapViewBg1_sate from './map1_sate.jpg';
// import mapViewBg2_sate from './map2_sate.jpg';
import visitorimg from './visitor.png';
import sendingimg from './sending.png';
import statisticimg from './statistic.png';
import bookimg from './book.png';
import dropdownimg from './dropdown.png';
import droprightimg from './dropright.png';
import timeimg from './time.png';
import './index.scss';

const flowRateFilter = utils.filter('flowRate');

const wirelessTrendTimeOptions = [
  { label: 'last 48 hours', value: '48' },
  { label: 'last 24 hours', value: '24' },
  { label: 'last 12 hours', value: '12' },
  { label: 'last 1 hours', value: '1' },
];
const wirelessTrendFlowDirOptions = [
  { label: 'TX', value: 'tx' },
  { label: 'RX', value: 'rx' },
  { label: 'TX+RX', value: 'tx+rx' },
];

const propTypes = {
  store: PropTypes.instanceOf(Map),
  changeScreenQuery: PropTypes.func,
  fetchScreenData: PropTypes.func,
};

function getUnit(rate) {
  const UNIT_GB = 1024 * 1024 * 1024;
  const UNIT_MB = 1024 * 1024;
  const UNIT_KB = 1024;
  const unitSize = parseInt(rate, 10);
  let unit;

  if (unitSize > UNIT_GB) {
    unit = { str: 'GB', value: UNIT_GB };
  } else if (unitSize > UNIT_MB) {
    unit = { str: 'MB', value: UNIT_MB };
  } else if (unitSize > UNIT_KB) {
    unit = { str: 'KB', value: UNIT_KB };
  } else {
    unit = { str: 'B', value: 1 };
  }

  return unit;
}

function generateAlarmTableOption() {
  const alarmInfo = fromJS([
    { name: 'Rogue Device Detected', type: '1', severity: 'High' },
    { name: 'Rogue AP Detected', type: '2', severity: 'High' },
    { name: 'MAC-spoofing AP Detected', type: '3', severity: 'Medium' },
    { name: 'DDos Attacked Detected', type: '4', severity: 'Medium' },
  ]);
  const options = [
    {
      id: 'time',
      text: 'Time',
    },
    {
      id: 'type',
      text: 'Name',
      render(val) {
        const item = alarmInfo.find(it => it.get('type') === val);
        return item.get('name');
      },
    },
    {
      id: 'severity',
      text: 'Severity',
      render(val, item) {
        const destItem = alarmInfo.find(it => it.get('type') === item.get('type'));
        return destItem.get('severity');
      },
    },
    {
      id: 'activities',
      text: 'Activities',
    },
  ];

  return options;
}

const defaultProps = {};

export default class MainDashboard extends Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'renderTopCards', 'renderMapView', 'generateGroupOptions', 'onMapViewGroupChange',
      'onWirelessTrendQueryChange', 'generateWirelessTrendEchartOption', 'renderWiredStatus',
      'onWiredStatusInterfaceChange', 'generateWiredStatusEchartOption', 'onClientAnalysisGroupChange',
      'renderClientAnalysis', 'generateClientAnalysisChartOption', 'generateClientTypeChartOption',
      'onSsidAnalysisGroupChange', 'onDropOrTimeIconClick',
    ]);
    this.state = {
      show: {
        mapView: true,
        mapViewBody: true,
        wirelessTrend: true,
        wirelessTrendBody: true,
        wiredStatus: true,
        wiredStatusBody: true,
        clientAnalysis: true,
        clientAnalysisBody: true,
        ssidAnalysis: true,
        ssidAnalysisBody: true,
        alarm: true,
        alarmBody: true,
      },
      mapViewQuery: {
        map: mapViewBg2,
        groupid: '1',
        section: 'mapView',
      },
      wirelessTrendQuery: {
        groupid: '2',
        timeRange: '1',
        direction: 'tx',
        section: 'wirelessTrend',
      },
      wiredStatus: {
        onHoverId: '',
        flowLeft: 0,
        flowTop: 0,
        graphicType: 'down',
        interfaceName: 'eth0',
        section: 'wiredStatus',
      },
      clientAnalysis: {
        groupid: '1',
        section: 'clientAnalysis',
      },
      ssidAnalysis: {
        section: 'ssidAnalysis',
        groupid: '1',
      },
    };
  }

  componentWillMount() {
    this.props.changeScreenQuery({
      section: 'all',
      groupid: 'not',
    });
  }

  onMapViewGroupChange(data) {
    const curGroup = this.state.mapViewQuery.groupid;
    if (curGroup === data.value) return;
    const map = this.state.mapViewQuery.map === mapViewBg1 ? mapViewBg2 : mapViewBg1;
    const mapViewQuery = utils.extend({}, this.state.mapViewQuery,
      { groupid: data.value, map });
    this.setState({ mapViewQuery });
    this.props.changeScreenQuery(mapViewQuery);
    this.props.fetchScreenData();
  }

  onWirelessTrendQueryChange(type) {
    const that = this;
    return (data) => {
      const wirelessTrendQuery = utils.extend(
        {}, that.state.wirelessTrendQuery, { [type]: data.value },
      );
      this.setState({ wirelessTrendQuery });
      this.props.changeScreenQuery(wirelessTrendQuery);
      this.props.fetchScreenData();
    };
  }

  onWiredStatusInterfaceChange(data) {
    const wiredStatusQuery = utils.extend({}, this.state.wiredStatus, {
      onHoverId: undefined,
      flowLeft: undefined,
      flowTop: undefined,
      graphicType: undefined,
      interfaceName: data.value,
    });
    this.setState({ wiredStatus: wiredStatusQuery });
    this.props.changeScreenQuery(wiredStatusQuery);
    this.props.fetchScreenData();
  }

  onClientAnalysisGroupChange(data) {
    const clientAnalysis = utils.extend({}, this.state.clientAnalysis, { groupid: data.value });
    this.setState({ clientAnalysis });
    this.props.changeScreenQuery(clientAnalysis);
    this.props.fetchScreenData();
  }

  onSsidAnalysisGroupChange(data) {
    const ssidAnalysis = utils.extend({}, this.state.ssidAnalysis, { groupid: data.value });
    this.setState({ ssidAnalysis });
    this.props.changeScreenQuery(ssidAnalysis);
    this.props.fetchScreenData();
  }

  onDropOrTimeIconClick(section) {
    return () => {
      const sectionShow = !this.state.show[section];
      const show = utils.extend({}, this.state.show, { [section]: sectionShow });
      this.setState({ show });
    };
  }

  generateWirelessTrendEchartOption() {
    const curScreenId = this.props.store.get('curScreenId');
    const wirelessTrend = this.props.store.getIn([curScreenId, 'data', 'wirelessTrend']);
    if (!wirelessTrend) return null;

    const { flowData, timeData } = wirelessTrend.toJS();
    // // 时间轴数据
    const date = timeData.map(val => val.replace(/-/g, '/'));
    const maxData = Math.max.apply(null, flowData); // 速率最大值
    const unit = getUnit(maxData);
    // 速率统一为最大值对应的单位
    const data = flowData.map((val) => {
      const rate = (val / unit.value).toFixed(2);
      return rate;
    });

    const option = {
      tooltip: {
        trigger: 'axis',
        position(pt, params, dom, rect, size) {
          let diff = 0;
          if (pt[0] > size.viewSize[0] / 2) {
            diff = 160;
          }
          return [pt[0] - diff, '10%'];
        },
        formatter: `{b} <br/> {a}: {c} ${unit.str}`,
      },
      toolbox: {},
      grid: {
        right: '0',
        left: '0.5%',
        top: '10%',
        bottom: '0',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date,
        name: __('Time'),
        axisLabel: {
          show: true,
          inside: true,
          color: '#555',
          margin: 12,
          showMinLabel: false,
          showMaxLabel: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#ccc',
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 'dataMax',
        name: `${unit.str}`,
        axisLabel: {
          show: true,
          inside: true,
          color: '#555',
          showMinLabel: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#ccc',
          },
        },
      },
      series: [
        {
          name: __('Throughput'),
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: '#5cacff',
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#ecf5ff',
              }, {
                offset: 1,
                color: '#81bfff',
              }]),
            },
          },
          data,
        },
      ],
    };

    return option;
  }

  generateWiredStatusEchartOption() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const flowData = store.getIn([curScreenId, 'data', 'wiredStatus', 'flowData']) || fromJS({});
    const { name = '', downloadFlow = [], uploadFlow = [], timeData = [] } = flowData.toJS();
    const maxData = Math.max.apply(null, downloadFlow.concat(uploadFlow));
    const unit = getUnit(maxData);
    const downloadData = downloadFlow.map((val) => {
      const data = (val / unit.value).toFixed(2);
      return data;
    });
    const uploadData = uploadFlow.map((val) => {
      const data = (val / unit.value).toFixed(2);
      return data;
    });
    const option = {
      // title: {
      //   text: name,
      // },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Download', 'Upload'],
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '3%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeData,
        name: __('Time'),
        axisLabel: {
          show: true,
          inside: false,
          color: '#555',
          showMinLabel: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#ccc',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: `${unit.str}`,
        axisLabel: {
          show: true,
          inside: false,
          color: '#555',
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#ccc',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dotted',
            opacity: 0.7,
          },
        },
      },
      series: [
        {
          name: 'Download',
          type: 'line',
          stack: '总量',
          data: downloadData,
        },
        {
          name: 'Upload',
          type: 'line',
          stack: '总量',
          data: uploadData,
        },
      ],
    };
    return option;
  }

  generateClientAnalysisChartOption() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const apClientsTop7 = store.getIn([curScreenId, 'data', 'usrAnalysis', 'apClientsTop7']);
    if (!apClientsTop7) return null;
    const apClientsTop7List = List(apClientsTop7.sort((a, b) => {
      const a1 = parseInt(a, 10);
      const b1 = parseInt(b, 10);
      if (a1 < b1) { return -1; }
      if (a1 > b1) { return 1; }
      return 0;
    }));
    const legendData = apClientsTop7List.map(item => item[0]).toJS();
    const clientData = apClientsTop7List.map(item => item[1]).toJS();

    const option = {
      color: ['#409eff'],
      tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          show: false,
          type: 'value',
        },
      ],
      yAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: legendData,
          axisLine: {
            lineStyle: {
              color: '#888',
            },
          },
        },
      ],
      series: [
        {
          name: 'Clients',
          type: 'bar',
          label: {
            normal: {
              show: true,
              position: 'right',
            },
          },
          data: clientData,
        },
      ],
    };

    return option;
  }

  generateClientTypeChartOption() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const clientType = store.getIn([curScreenId, 'data', 'usrAnalysis', 'clientType']);
    if (!clientType) return null;
    const apClientsTop7List = List(clientType);
    let dataList = apClientsTop7List.map(item => fromJS({ value: item[1], name: item[0] }));
    const ret = $$commonPieOption.mergeDeep({
      title: {
        text: __('Online'),
        subtext: `${store.getIn([curScreenId, 'data', 'usrAnalysis', 'online']) || 0}`,
        left: '34%',
        top: '43%',
      },
      legend: {
        left: '60%',
        top: '50%',
        formatter: (name) => {
          const num = dataList
            .find($$item => $$item.get('name') === name)
            .get('value') || 0;
          if (!name) return null;
          if ((name.split('\n')).length > 1) {
            return `others: ${num}`;
          }
          return `${name}: ${num}`;
        },
        tooltip: {
          show: true,
          formatter: (params) => {
            let str = '';
            if (typeof params.name === 'undefined') return str;
            // console.log('params.name', params.name);
            const arr = params.name.split('\n');
            arr.forEach((item, index) => {
              if (index === arr.length - 1) str += `${item}`;
              else str += `${item}<br />`;
            });
            return str;
          },
          textStyle: {
            fontSize: 10,
          },
        },
      },
      series: [
        {
          name: __('Type'),
          center: ['35%', '50%'],
          radius: ['45%', '75%'],
        },
      ],
      tooltip: {
        show: true,
        formatter: (params) => {
          if (typeof params.name === 'undefined') return null;
          const arr = params.name.split('\n');
          if (arr.length > 1) return `Type:<br /> others: ${params.value}`;
          return `Type:<br /> ${params.name}: ${params.value}`;
        },
      },
    }).toJS();

    if (List.isList(dataList)) {
      if (dataList.size < 1) {
        dataList = fromJS([{
          name: __('None'),
          value: 0,
        }]);
      } else {
        dataList = dataList.sort(($$a, $$b) => {
          const a = parseInt($$a.get('value'), 10);
          const b = parseInt($$b.get('value'), 10);
          let result = 0;

          if (a < b) {
            result = 1;
          } else if (a > b) {
            result = -1;
          }

          return result;
        });
      }
      // 客户端类别如果超过itemCount个，则从itemCount第个开始，个数相加，统称为others
      const size = dataList.size;
      const itemCount = 12;
      let num = 0;
      let othermap = fromJS({});
      let otherNameStr = '';
      if (size > itemCount) {
        let i = itemCount - 1;
        while (i < size) {
          const name = dataList.getIn([i, 'name']);
          const value = parseInt(dataList.getIn([i, 'value']), 10);
          otherNameStr += `${name}: ${value}\n`;
          num += value;
          i += 1;
        }
        othermap = othermap.set('name', otherNameStr);
        othermap = othermap.set('value', num);
        dataList = dataList.slice(0, itemCount - 1);
        dataList = dataList.push(othermap);
      }

      ret.legend.data = dataList.map(item => item.get('name')).toJS();
      ret.series[0].data = dataList.toJS();
    }

    return ret;
  }

  generateSsidFlowChartOption() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const ssidFlow = store.getIn([curScreenId, 'data', 'ssidAnalysis', 'ssidFlow']);
    if (!ssidFlow) return null;
    const ssidFlowList = List(ssidFlow);
    let dataList = ssidFlowList.map(item => fromJS({ value: item[1], name: item[0] }));
    const totalFlow = flowRateFilter.transform(dataList.reduce((pre, cur) => pre + parseInt(cur.get('value'), 10), 0));
    const ret = $$commonPieOption.mergeDeep({
      title: {
        text: __('Total Flow'),
        subtext: totalFlow,
        left: '34%',
        top: '43%',
      },
      legend: {
        left: '60%',
        top: '50%',
        formatter: (name) => {
          const num = dataList
            .find($$item => $$item.get('name') === name)
            .get('value') || 0;
          if (!name) return null;
          if ((name.split('\n')).length > 1) {
            return `others: ${flowRateFilter.transform(num)}`;
          }
          return `${name}: ${flowRateFilter.transform(num)}`;
        },
        tooltip: {
          show: true,
          formatter: (params) => {
            let str = '';
            if (typeof params.name === 'undefined') return str;
            // console.log('params.name', params.name);
            const arr = params.name.split('\n');
            arr.forEach((item, index) => {
              if (index === arr.length - 1) str += `${item}`;
              else str += `${item}<br />`;
            });
            return str;
          },
          textStyle: {
            fontSize: 10,
          },
        },
      },
      series: [
        {
          name: __('Type'),
          center: ['35%', '50%'],
          radius: ['45%', '75%'],
        },
      ],
      tooltip: {
        show: true,
        formatter: (params) => {
          if (typeof params.name === 'undefined') return null;
          const arr = params.name.split('\n');
          if (arr.length > 1) return `Type:<br /> others: ${params.value}`;
          return `Flow:<br /> ${params.name}: ${flowRateFilter.transform(params.value)}`;
        },
      },
    }).toJS();

    if (List.isList(dataList)) {
      if (dataList.size < 1) {
        dataList = fromJS([{
          name: __('None'),
          value: 0,
        }]);
      } else {
        dataList = dataList.sort(($$a, $$b) => {
          const a = parseInt($$a.get('value'), 10);
          const b = parseInt($$b.get('value'), 10);
          let result = 0;

          if (a < b) {
            result = 1;
          } else if (a > b) {
            result = -1;
          }

          return result;
        });
      }
      // 客户端类别如果超过itemCount个，则从itemCount第个开始，个数相加，统称为others
      const size = dataList.size;
      const itemCount = 12;
      let num = 0;
      let othermap = fromJS({});
      let otherNameStr = '';
      if (size > itemCount) {
        let i = itemCount - 1;
        while (i < size) {
          const name = dataList.getIn([i, 'name']);
          const value = parseInt(dataList.getIn([i, 'value']), 10);
          otherNameStr += `${name}: ${value}\n`;
          num += value;
          i += 1;
        }
        othermap = othermap.set('name', otherNameStr);
        othermap = othermap.set('value', num);
        dataList = dataList.slice(0, itemCount - 1);
        dataList = dataList.push(othermap);
      }

      ret.legend.data = dataList.map(item => item.get('name')).toJS();
      ret.series[0].data = dataList.toJS();
    }

    return ret;
  }
  generateSsidClientsChartOption() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const ssidClients = store.getIn([curScreenId, 'data', 'ssidAnalysis', 'ssidClients']);
    if (!ssidClients) return null;
    const ssidClientsList = List(ssidClients);
    let dataList = ssidClientsList.map(item => fromJS({ value: item[1], name: item[0] }));
    const totalClients = dataList.reduce((pre, cur) => pre + parseInt(cur.get('value'), 10), 0);
    const ret = $$commonPieOption.mergeDeep({
      title: {
        text: __('Total Clients'),
        subtext: totalClients,
        left: '34%',
        top: '43%',
      },
      legend: {
        left: '60%',
        top: '50%',
        formatter: (name) => {
          const num = dataList
            .find($$item => $$item.get('name') === name)
            .get('value') || 0;
          if (!name) return null;
          if ((name.split('\n')).length > 1) {
            return `others: ${num}`;
          }
          return `${name}: ${num}`;
        },
        tooltip: {
          show: true,
          formatter: (params) => {
            let str = '';
            if (typeof params.name === 'undefined') return str;
            // console.log('params.name', params.name);
            const arr = params.name.split('\n');
            arr.forEach((item, index) => {
              if (index === arr.length - 1) str += `${item}`;
              else str += `${item}<br />`;
            });
            return str;
          },
          textStyle: {
            fontSize: 10,
          },
        },
      },
      series: [
        {
          name: __('Type'),
          center: ['35%', '50%'],
          radius: ['45%', '75%'],
        },
      ],
      tooltip: {
        show: true,
        formatter: (params) => {
          if (typeof params.name === 'undefined') return null;
          const arr = params.name.split('\n');
          if (arr.length > 1) return `Type:<br /> others: ${params.value}`;
          return `Type:<br /> ${params.name}: ${params.value}`;
        },
      },
    }).toJS();

    if (List.isList(dataList)) {
      if (dataList.size < 1) {
        dataList = fromJS([{
          name: __('None'),
          value: 0,
        }]);
      } else {
        dataList = dataList.sort(($$a, $$b) => {
          const a = parseInt($$a.get('value'), 10);
          const b = parseInt($$b.get('value'), 10);
          let result = 0;

          if (a < b) {
            result = 1;
          } else if (a > b) {
            result = -1;
          }

          return result;
        });
      }
      // 客户端类别如果超过itemCount个，则从itemCount第个开始，个数相加，统称为others
      const size = dataList.size;
      const itemCount = 12;
      let num = 0;
      let othermap = fromJS({});
      let otherNameStr = '';
      if (size > itemCount) {
        let i = itemCount - 1;
        while (i < size) {
          const name = dataList.getIn([i, 'name']);
          const value = parseInt(dataList.getIn([i, 'value']), 10);
          otherNameStr += `${name}: ${value}\n`;
          num += value;
          i += 1;
        }
        othermap = othermap.set('name', otherNameStr);
        othermap = othermap.set('value', num);
        dataList = dataList.slice(0, itemCount - 1);
        dataList = dataList.push(othermap);
      }

      ret.legend.data = dataList.map(item => item.get('name')).toJS();
      ret.series[0].data = dataList.toJS();
    }

    return ret;
  }

  generateGroupOptions() {
    if (this.groupOptions) return this.groupOptions;
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const groups = store.getIn([curScreenId, 'data', 'common', 'groups']) || fromJS([]);
    const groupOptions = groups.map((item) => {
      const label = item.get('name');
      const value = item.get('id');
      return { label, value };
    }).toJS();
    this.groupOptions = groupOptions.length > 0 ? groupOptions : null;
    return groupOptions;
  }

  renderTopCards() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const common = store.getIn([curScreenId, 'data', 'common']) || fromJS({});
    const { groups = [], onlineAp = '0', totalAp = '0', clients = '0', alarms = '0' } = common.toJS();
    return (
      <div className="m-dsb-cards-row row">

        <div className="top-card-wrap cols col-3">
          <div className="top-card cols col-12">
            <div className="top-card-left cols col-5">
              <div className="card-left-img">
                <img
                  className="card-left-icon"
                  alt="usr-icon"
                  src={visitorimg}
                />
              </div>
            </div>
            <div className="top-card-right cols col-7">
              <div className="card-right-title">
                AP Groups
              </div>
              <div className="card-right-data clearfix">
                <div className="right-data-num fl">
                  { groups.length }
                </div>
                <div className="right-data-unit fl" />
              </div>
            </div>
          </div>
        </div>

        <div className="top-card-wrap cols col-3">
          <div className="top-card cols col-12">
            <div className="top-card-left cols col-5">
              <div className="card-left-img">
                <img
                  className="card-left-icon"
                  alt="usr-icon"
                  src={statisticimg}
                />
              </div>
            </div>
            <div className="top-card-right cols col-7">
              <div className="card-right-title">
                Online AP
              </div>
              <div className="card-right-data clearfix">
                <div className="right-data-num fl">
                  { `${onlineAp}/${totalAp}` }
                </div>
                <div className="right-data-unit fl" />
              </div>
            </div>
          </div>
        </div>

        <div className="top-card-wrap cols col-3">
          <div className="top-card cols col-12">
            <div className="top-card-left cols col-5">
              <div className="card-left-img">
                <img
                  className="card-left-icon"
                  alt="usr-icon"
                  src={sendingimg}
                />
              </div>
            </div>
            <div className="top-card-right cols col-7">
              <div className="card-right-title">
                Clients
              </div>
              <div className="card-right-data clearfix">
                <div className="right-data-num fl">
                  { clients }
                </div>
                <div className="right-data-unit fl" />
              </div>
            </div>
          </div>
        </div>

        <div className="top-card-wrap cols col-3">
          <div className="top-card cols col-12">
            <div className="top-card-left cols col-5">
              <div className="card-left-img">
                <img
                  className="card-left-icon"
                  alt="usr-icon"
                  src={bookimg}
                />
              </div>
            </div>
            <div className="top-card-right cols col-7">
              <div className="card-right-title">
                Alarms
              </div>
              <div className="card-right-data clearfix">
                <div className="right-data-num fl">
                  { alarms }
                </div>
                <div className="right-data-unit fl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderMapView() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const mapView = store.getIn([curScreenId, 'data', 'mapView']) || fromJS({});
    const { aps = [], usr5g = '0', clients5g = '0', usr2g = '0', clients2g = '0' } = mapView.toJS();
    const onLineApNum = fromJS(aps).count(item => item.get('enable') === '0');
    const offLineApNum = aps.length - onLineApNum;
    const children = aps.map((item) => {
      const groupitem = fromJS(this.groupOptions || []).find(it => it.get('value') === item.group);
      const groupname = groupitem ? groupitem.get('label') : '';
      return (
        <div
          className="m-dsb-map-view-ap"
          key={item.mac}
          style={{
            left: item.x,
            top: item.y,
          }}
          onMouseEnter={() => {
            const mapViewQuery = utils.extend(
              {}, this.state.mapViewQuery, { onHoverMac: item.mac },
            );
            this.setState({ mapViewQuery });
          }}
          onMouseLeave={() => {
            const mapViewQuery = utils.extend(
              {}, this.state.mapViewQuery, { onHoverMac: undefined },
            );
            this.setState({ mapViewQuery });
          }}
        >
          {
            item.status === '1' ? (
              <img src={aponline} alt="online" />
            ) : (
              <img src={apoffline} alt="offline" />
            )
          }
          {
            this.state.mapViewQuery.onHoverMac &&
            this.state.mapViewQuery.onHoverMac === item.mac && (
              <div className="m-dsb-map-view-hover row">
                <div className="m-dsb-hover-head">
                  AP Information
                </div>
                <div className="cols col-5 m-dsb-hover-left">
                  MAC
                </div>
                <div className="cols col-7 m-dsb-hover-right">
                  {`[ ${item.mac} ]`}
                </div>
                <div className="cols col-5 m-dsb-hover-left">
                  AP Group
                </div>
                <div className="cols col-7 m-dsb-hover-right">
                  {`[ ${groupname} ]`}
                </div>
                <div className="cols col-5 m-dsb-hover-left">
                  IP Addr
                </div>
                <div className="cols col-7 m-dsb-hover-right">
                  {`[ ${item.ip} ]`}
                </div>
              </div>
            )
          }
        </div>
      );
    },
    );

    return (
      <div>
        {/* Map View head */}
        <div className="m-dsb-head-bar row">
          <div className="head-bar-left cols col-11">
            <div className="bar-left-left cols col-3">
              Map View
            </div>
            <div className="bar-left-middle cols col-6">
              <div className="middle-map-view cols col-4">
                <span>On/Off APs</span>
                <span className="rw-label rw-label--on">{ onLineApNum }</span>
                <span className="rw-label rw-label--off">{ offLineApNum }</span>
              </div>
              <div className="middle-map-view cols col-4">
                <span>2.4G</span>
                <span className="rw-label rw-label--on">{ clients2g }</span>
                <span className="rw-label rw-label--off">{ usr2g }</span>
              </div>
              <div className="middle-map-view cols col-4">
                <span>5G</span>
                <span className="rw-label rw-label--on">{ clients5g }</span>
                <span className="rw-label rw-label--off">{ usr5g }</span>
              </div>
            </div>
            <div className="bar-left-right cols col-3">
              <FormInput
                type="select"
                className="fr"
                options={this.groupOptions || this.generateGroupOptions()}
                value={this.state.mapViewQuery.groupid}
                onChange={this.onMapViewGroupChange}
              />
            </div>
          </div>
          <div className="head-bar-right cols col-1">
            <img
              src={this.state.show.mapViewBody ? dropdownimg : droprightimg}
              alt="dropdown-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('mapViewBody')}
            />
            <img
              src={timeimg}
              alt="dropright-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('mapView')}
            />
          </div>
        </div>

        {/* Map View body */}
        {
          this.state.show.mapViewBody && (
            <div className="m-dsb-map-view m-dsb-body-wrap">
              <MapContainer
                backgroundImgUrl={this.state.mapViewQuery.map}
                style={{ width: '100%', height: '100%' }}
                children={children}
              />
            </div>
          )
        }
      </div>
    );
  }

  renderWirelessTrend() {
    return (
      <div>
        {/* Wireless Trend head */}
        <div className="m-dsb-head-bar row">
          <div className="head-bar-left cols col-11">
            <div className="bar-left-left cols col-3">
              Wireless Trend
            </div>
            <div className="bar-left-right cols col-9">
              <FormInput
                type="select"
                style={{ width: '120px' }}
                options={wirelessTrendTimeOptions}
                value={this.state.wirelessTrendQuery.timeRange}
                onChange={this.onWirelessTrendQueryChange('timeRange')}
              />
              <FormInput
                type="select"
                style={{ width: '120px' }}
                options={wirelessTrendFlowDirOptions}
                value={this.state.wirelessTrendQuery.direction}
                onChange={this.onWirelessTrendQueryChange('direction')}
              />
              <FormInput
                type="select"
                style={{ width: '120px' }}
                options={this.groupOptions || this.generateGroupOptions()}
                value={this.state.wirelessTrendQuery.groupid}
                onChange={this.onWirelessTrendQueryChange('groupid')}
              />
            </div>
          </div>
          <div className="head-bar-right cols col-1">
            <img
              src={this.state.show.wirelessTrendBody ? dropdownimg : droprightimg}
              alt="dropdown-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('wirelessTrendBody')}
            />
            <img
              src={timeimg}
              alt="dropright-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('wirelessTrend')}
            />
          </div>
        </div>
        {/* Wireless Trend body */}
        {
          this.state.show.wirelessTrendBody && (
            <div className="m-dsb-wireless-trend t-overview__section">
              <div className="element">
                <EchartReact
                  option={this.generateWirelessTrendEchartOption()}
                  className="o-box__canvas m-dsb-throughput-echart"
                  style={{ width: '100%', height: '300px' }}
                />
              </div>
            </div>
          )
        }
      </div>
    );
  }

  renderWiredStatus() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const interfaceList = store.getIn([curScreenId, 'data', 'wiredStatus', 'interfaceList']) || fromJS([]);
    const options = interfaceList.filter(item => item.get('enable') === '1')
      .map(item => ({ label: item.get('name').toUpperCase(), value: item.get('name') })) || fromJS([]);
    const interfaceNum = interfaceList.size;
    const widthPercent = `${((1 / interfaceNum) * 100)}%`;

    return (
      <div>
        {/* Wired  Status head */}
        <div className="m-dsb-head-bar row">
          <div className="head-bar-left cols col-11">
            <div className="bar-left-left cols col-3">
              Wired Status
            </div>
            <div className="bar-left-right cols col-9">
              <FormInput
                type="select"
                options={options.toJS()}
                value={this.state.wiredStatus.interfaceName}
                onChange={this.onWiredStatusInterfaceChange}
              />
            </div>
          </div>
          <div className="head-bar-right cols col-1">
            <img
              src={this.state.show.wiredStatusBody ? dropdownimg : droprightimg}
              alt="dropdown-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('wiredStatusBody')}
            />
            <img
              src={timeimg}
              alt="dropright-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('wiredStatus')}
            />
          </div>
        </div>
        {/* body */}
        {
          this.state.show.wiredStatusBody && (
            <div className="m-dsb-body-wrap m-dsb-wired-status row">
              <div className="cols col-6">
                <div
                  className="m-dsb-interface-wrap cols col-10 col-offset-1"
                  ref={(wrap) => { this.wrap = wrap; }}
                >
                  <div className="cols col-10 col-offset-1">
                    {
                      interfaceList.map((item, index) => {
                        const status = item.get('enable');
                        return (
                          <div
                            className="fl m-dsb-interface-img"
                            key={item.get('name')}
                            style={{ width: widthPercent }}
                          >
                            <div className="m-dsb-interface-name">
                              {item.get('name')}
                            </div>
                            <div className="m-dsb-interface">
                              <img
                                src={status === '1' ? onportimg : offportimg}
                                alt="interface"
                                onMouseEnter={(e) => {
                                  const position = utils.dom.getAbsPoint(e.target);
                                  const wrapPosition = utils.dom.getAbsPoint(this.wrap);
                                  const mergeData = utils.extend({}, this.state.wiredStatus, {
                                    onHoverId: index,
                                    flowLeft: (position.x - wrapPosition.x) + e.target.offsetWidth,
                                    flowTop: (position.y - wrapPosition.y) + e.target.offsetHeight,
                                  });
                                  this.setState({ wiredStatus: mergeData });
                                }}
                                onMouseLeave={() => {
                                  const mergeData = utils.extend({}, this.state.wiredStatus, {
                                    onHoverId: '',
                                    flowLeft: '',
                                    flowTop: '',
                                  });
                                  this.setState({ wiredStatus: mergeData });
                                }}
                              />
                            </div>
                            <div className="m-dsb-interface-status">
                              {
                                item.get('enable') === '1' ? `${item.get('negoSpeed')} Mbps` : __('DOWN')
                              }
                            </div>
                          </div>
                        );
                      }).toJS()
                    }
                    {
                      this.state.wiredStatus.onHoverId !== '' && interfaceList &&
                      interfaceList.getIn([this.state.wiredStatus.onHoverId, 'enable']) === '1' && (
                        <div
                          className="m-dsb-flowboard row"
                          style={{
                            left: this.state.wiredStatus.flowLeft,
                            bottom: `${parseInt(this.state.wiredStatus.flowTop, 10) + 50}px`,
                          }}
                        >
                          <div className="m-dsb-hover-head">
                            Interface Information
                          </div>
                          <div className="cols col-5 m-dsb-hover-left">
                            IP
                          </div>
                          <div className="cols col-7 m-dsb-hover-right">
                            {interfaceList.getIn([this.state.wiredStatus.onHoverId, 'ip'])}
                          </div>
                          <div className="cols col-5 m-dsb-hover-left">
                            MAC
                          </div>
                          <div className="cols col-7 m-dsb-hover-right">
                            {interfaceList.getIn([this.state.wiredStatus.onHoverId, 'mac'])}
                          </div>
                          <div className="cols col-5 m-dsb-hover-left">
                            {__('Upload Rate')}
                          </div>
                          <div className="cols col-7 m-dsb-hover-right">
                            {`${flowRateFilter.transform(interfaceList.getIn([this.state.wiredStatus.onHoverId, 'upRate']))}/s`}
                          </div>
                          <div className="cols col-5 m-dsb-hover-left">
                            {__('Download Rate')}
                          </div>
                          <div className="cols col-7 m-dsb-hover-right">
                            {`${flowRateFilter.transform(interfaceList.getIn([this.state.wiredStatus.onHoverId, 'downRate']))}/s`}
                          </div>
                          <div className="cols col-5 m-dsb-hover-left">
                            {__('Sessions')}
                          </div>
                          <div className="cols col-7 m-dsb-hover-right">
                            {interfaceList.getIn([this.state.wiredStatus.onHoverId, 'users'])}
                          </div>
                        </div>
                      )
                    }
                    {
                      this.state.wiredStatus.onHoverId !== '' && interfaceList &&
                      interfaceList.getIn([this.state.wiredStatus.onHoverId, 'enable']) === '0' && (
                        <div
                          className="m-dsb-flowboard row"
                          style={{
                            left: this.state.wiredStatus.flowLeft,
                            bottom: `${parseInt(this.state.wiredStatus.flowTop, 10) + 50}px`,
                          }}
                        >
                          <div className="m-dsb-hover-head">
                            Interface Information
                          </div>
                          <div className="cols col-5 m-dsb-hover-left">
                            {__('Status')}
                          </div>
                          <div className="cols col-7 m-dsb-hover-right">
                            {__('Down')}
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
              <div className="t-overview__section cols col-6">
                <div className="element">
                  <EchartReact
                    option={this.generateWiredStatusEchartOption()}
                    className="o-box__canvas m-dsb-throughput-echart"
                    style={{ width: '100%', height: '300px' }}
                  />
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }

  renderClientAnalysis() {
    return (
      <div>
        <div className="m-dsb-head-bar row">
          <div className="head-bar-left cols col-11">
            <div className="bar-left-left cols col-3">
              Client Analysis
            </div>
            <div className="bar-left-right cols col-9">
              <FormInput
                type="select"
                options={this.groupOptions || this.generateGroupOptions()}
                value={this.state.clientAnalysis.groupid}
                onChange={this.onClientAnalysisGroupChange}
              />
            </div>
          </div>
          <div className="head-bar-right cols col-1">
            <img
              src={this.state.show.clientAnalysisBody ? dropdownimg : droprightimg}
              alt="dropdown-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('clientAnalysisBody')}
            />
            <img
              src={timeimg}
              alt="dropright-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('clientAnalysis')}
            />
          </div>
        </div>

        {
          this.state.show.clientAnalysisBody && (
            <div className="m-dsb-body-wrap row">
              <div className="t-overview__section">
                <div className="element cols col-6">
                  <EchartReact
                    option={this.generateClientAnalysisChartOption()}
                    className="o-box__canvas m-dsb-throughput-echart"
                    style={{ width: '100%', height: '300px' }}
                  />
                </div>
                <div className="element cols col-6">
                  <EchartReact
                    option={this.generateClientTypeChartOption()}
                    className="o-box__canvas m-dsb-throughput-echart"
                    style={{ width: '100%', height: '300px' }}
                  />
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }

  renderSsidAnalysis() {
    return (
      <div>
        <div className="m-dsb-head-bar row">
          <div className="head-bar-left cols col-11">
            <div className="bar-left-left cols col-3">
              SSIDs Analysis
            </div>
            <div className="bar-left-right cols col-9">
              <FormInput
                type="select"
                className="fr"
                options={this.groupOptions || this.generateGroupOptions()}
                value={this.state.ssidAnalysis.groupid}
                onChange={this.onSsidAnalysisGroupChange}
              />
            </div>
          </div>
          <div className="head-bar-right cols col-1">
            <img
              src={this.state.show.ssidAnalysisBody ? dropdownimg : droprightimg}
              alt="dropdown-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('ssidAnalysisBody')}
            />
            <img
              src={timeimg}
              alt="dropright-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('ssidAnalysis')}
            />
          </div>
        </div>

        {
          this.state.show.ssidAnalysisBody && (
            <div className="m-dsb-body-wrap row">
              <div className="t-overview__section">
                <div className="element cols col-6">
                  <EchartReact
                    option={this.generateSsidFlowChartOption()}
                    className="o-box__canvas m-dsb-throughput-echart"
                    style={{ width: '100%', height: '300px' }}
                  />
                </div>
                <div className="element cols col-6">
                  <EchartReact
                    option={this.generateSsidClientsChartOption()}
                    className="o-box__canvas m-dsb-throughput-echart"
                    style={{ width: '100%', height: '300px' }}
                  />
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }

  renderAlarmChart() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const tableList = store.getIn([curScreenId, 'data', 'alarms', 'list']) || fromJS([]);
    return (
      <div>
        <div className="m-dsb-head-bar row">
          <div className="head-bar-left cols col-11">
            <div className="bar-left-left cols col-3">
              Alarms
            </div>
            <div className="bar-left-middle cols col-5" />
            <div className="bar-left-right cols col-4" />
          </div>
          <div className="head-bar-right cols col-1">
            <img
              src={this.state.show.alarmBody ? dropdownimg : droprightimg}
              alt="dropdown-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('alarmBody')}
            />
            <img
              src={timeimg}
              alt="dropright-icon"
              className="bar-right-icon cols col-3 col-offset-2"
              onClick={this.onDropOrTimeIconClick('alarm')}
            />
          </div>

        </div>

        {
          this.state.show.alarmBody && (
            <div className="m-dsb-body-wrap">
              <Table
                options={generateAlarmTableOption()}
                list={tableList.toJS()}
              />
            </div>
          )
        }
      </div>
    );
  }

  render() {
    // const query = this.props.store.getIn([curScreenId, 'query']);
    return (
      <AppScreen
        {...this.props}
        className="rw-main-dashboard"
      >
        <div className="m-dsb-wrap">
          {/* 顶部卡片 */
            this.renderTopCards()
          }

          {
            this.state.show.mapView && this.renderMapView()
          }

          {
            this.state.show.wirelessTrend && this.renderWirelessTrend()
          }

          {
            this.state.show.wiredStatus && this.renderWiredStatus()
          }

          {
            this.state.show.clientAnalysis && this.renderClientAnalysis()
          }

          {
            this.state.show.ssidAnalysis && this.renderSsidAnalysis()
          }

          {
            this.state.show.alarm && this.renderAlarmChart()
          }

        </div>
      </AppScreen>
    );
  }
}

MainDashboard.propTypes = propTypes;
MainDashboard.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainDashboard);

