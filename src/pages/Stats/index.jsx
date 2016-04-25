import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table, Column, Cell} from 'fixed-data-table';
import {
  connect
} from 'react-redux';
import {
  bindActionCreators
} from 'redux';

import {
  Input, FormGruop
} from '../../components/form/Input';
import * as actions from './actions';
import reducer from './reducer';
import echarts from 'echarts';
import './index.scss';


let myChart, statsChart, clientsChannelChart, clientsProducerChart;

const rows = [
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  // .... and more
];

const tooltip = {
  trigger: 'item',
  formatter: "{a} <br/>{b} : {c} 台 ({d}%)"
}

const clientNetworkOption = {
  tooltip,

  title: {
    text: '客户端频段分布',
    subtext: '纯属虚构',
    x: 'center'
  },

  series: [
    {
      name: '设备产商',
      type: 'pie',
      radius: '45%',
      center: ['50%', '58%'],

      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

const clientProducterOption = {
  tooltip,

  title: {
    text: '厂商分布图',
    subtext: '纯属虚构',
    x: 'center'
  },

  series: [
    {
      name: '设备产商',
      type: 'pie',
      radius: '45%',
      center: ['50%', '58%'],

      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
};

const apOption = {
  tooltip,
  title: {
    text: 'Ap状态分布',
    subtext: '纯属虚构',
    x: 'center'
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: '45%',
      center: ['50%', '58%'],

      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
}

//
const ClientsStatsOption = {
  tooltip: {
    trigger: 'axis'
  },
  toolbox: {
    feature: {
      dataView: { show: true }
    }
  },
  xAxis: [{
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  }],
  yAxis: [{
    type: 'value',
    name: '数量',
    min: 0,
    max: 250,
    interval: 50,
    axisLabel: {
      formatter: '{value} 台'
    }
  }],
  series: [
    {
      name: '5G',
      type: 'bar',
      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
    },
    {
      name: '2.4G',
      type: 'bar',
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    }
  ]
};


// 原生的 react 页面
export const Status = React.createClass({
  mixins: [PureRenderMixin],

  componentDidMount() {
    myChart = echarts.init(document.getElementById('echartsContent'));
    statsChart = echarts.init(document.getElementById('clientsStats'));
    clientsChannelChart = echarts.init(document.getElementById('clientsChannelStats'));
    clientsProducerChart = echarts.init(document.getElementById('clientsProducerStats'));

    clientNetworkOption.series[0].data = [
      {
        value: 335,
        name: '2.4G'
      }, {
        value: 200,
        name: '5G'
      }
    ].sort(function (a, b) {
      return a.value - b.value
    });

    clientProducterOption.series[0].data = [
      {
        value: 335,
        name: '华为'
      }, {
        value: 310,
        name: '中兴'
      }, {
        value: 274,
        name: '小米'
      }, {
        value: 235,
        name: '苹果'
      }, {
        value: 400,
        name: '联想'
      }
    ].sort(function (a, b) {
      return a.value - b.value
    });

    apOption.series[0].data = [
      {
        value: 335,
        name: '运行中'
      }, {
        value: 310,
        name: '已关机'
      }, {
        value: 102,
        name: '未初始化'
      },
    ].sort(function (a, b) {
      return a.value - b.value
    });

    myChart.setOption(apOption);
    clientsChannelChart.setOption(clientNetworkOption);
    clientsProducerChart.setOption(clientProducterOption);
    statsChart.setOption(ClientsStatsOption);
  },

  componentDidUpdate() {

    clientNetworkOption.series[0].data = [
      {
        value: 335,
        name: '2.4G'
      }, {
        value: 200,
        name: '5G'
      }
    ].sort(function (a, b) {
      return a.value - b.value
    });

    clientProducterOption.series[0].data = [
      {
        value: 335,
        name: '华为'
      }, {
        value: 310,
        name: '中兴'
      }, {
        value: 274,
        name: '小米'
      }, {
        value: 235,
        name: '苹果'
      }, {
        value: 400,
        name: '联想'
      }
    ].sort(function (a, b) {
      return a.value - b.value
    });

    apOption.series[0].data = [
      {
        value: 335,
        name: '运行中'
      }, {
        value: 310,
        name: '已关机'
      }, {
        value: 102,
        name: '未初始化'
      },
    ].sort(function (a, b) {
      return a.value - b.value
    });

    myChart.setOption(apOption);
    clientsChannelChart.setOption(clientNetworkOption);
    clientsProducerChart.setOption(clientProducterOption);
    statsChart.setOption(ClientsStatsOption);
  },

  render() {

    return (
      <div>
        <h2>热点统计</h2>
        <div className="stats-group clearfix" >
          <div className="stats-group-small" >
            <header className="stats-group-cell">
              <h3>AP数量</h3>
            </header>
            <div className="stats-group-cell">
              <div
                id="echartsContent"
                className="stats-group-canvas"
                >
              </div>
            </div>
          </div>
          <div className="stats-group-medium" >
            <header className="stats-group-cell">
              <h3>客户端数量</h3>
            </header>
            <div className="stats-group-cell">
              <div
                id="clientsChannelStats"
                className="stats-group-canvas"
                style={{
                  width: '50%'
                }}
                >
              </div>
              <div id="clientsProducerStats"
                className="stats-group-canvas"
                style={{
                  width: '50%'
                }}
                >
              </div>
            </div>
          </div>
          <div className="stats-group-large" >
            <header className="stats-group-cell">
              <h3>客户端数量统计
                <div className="btn-group">
                  <button className="btn active">今天</button>
                  <button className="btn">昨天</button>
                  <button className="btn">一周</button>
                  <button className="btn">15天</button>
                  <button className="btn">30天</button>
                </div>
              </h3>
            </header>
            <div className="stats-group-cell">
              <div
                id="clientsStats"
                className="stats-group-canvas"
                style={{
                  width: '100%'
                }}
                >
              </div>
            </div>
          </div>
          <div className="stats-group-large">
            <header className="stats-group-cell">
              <h3>客户端排行榜
                <div className="btn-group">
                  <button className="btn active">活跃度</button>
                  <button className="btn">流量</button>
                </div>
                排序
              </h3>
            </header>
            <div className="stats-group-cell">
              <table className="table">
                <thead>
                  <tr>
                    <th>设备名</th>
                    <th>ip/Mac地址</th>
                    <th>上/下行流量</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    rows.map(function (item, i) {
                      return (
                        <tr key={i} >
                          <td>{item[0]}</td>
                          <td>{item[1]}</td>
                          <td>{item[2]}</td>
                        </tr>
                      );
                    })
                  ) }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

function mapStateToProps(state) {
  const myState = state.status;

  return {
    logined: myState.get('logined'),
    data: myState.get('data')
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Status);

export const status = reducer;
