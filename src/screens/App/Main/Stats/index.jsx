import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

// components
import { Input, FormGruop } from 'components/Form/Input';
import Table from 'components/Table';

import * as actions from './actions';
import reducer from './reducer';
import echarts from 'echarts';
import './index.scss';

let myChart, statsChart, clientsChannelChart, clientsProducerChart;


const tooltip = {
  trigger: 'item',
  formatter: "{a} <br/>{b} : {c} 台 ({d}%)"
}

function renderCharts(elem, data) {
  const options = {
    tooltip,
      title: {
        text: _('AP Status Characterize'),
        subtext: _('Total: '),
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
}


// 原生的 react 页面
export const Status = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
    this.props.fetchStatus();
  },

  componentDidMount() {
    myChart = echarts.init(document.getElementById('echartsContent'));
    statsChart = echarts.init(document.getElementById('clientsStats'));
    clientsChannelChart = echarts.init(document.getElementById('clientsChannelStats'));
    clientsProducerChart = echarts.init(document.getElementById('clientsProducerStats'));
    
    this.renderApNumber();
    this.renderClientNumber();
    this.renderClientStatistics();
  },
  
  renderApNumber() {
    const apOption = {
      tooltip,
      title: {
        text: _('AP Status Characterize'),
        subtext: _('Total: '),
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
    };
    
    apOption.series[0].data = [
      {
        value: 335,
        name: _('Online')
      }, {
        value: 310,
        name: _('Offline')
      }, {
        value: 102,
        name: _('Default')
      },
    ].sort(function (a, b) {
      return a.value - b.value
    });
    
    myChart.setOption(apOption);
  },
  
  renderClientNumber() {
    const clientNetworkOption = {
      tooltip,

      title: {
        text: _('Clients Frequency Characterize'),
        subtext: _('Total: '),
        x: 'center'
      },

      series: [
        {
          name: 'Frequency',
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
        text: _('Clients Producter Characterize'),
        subtext: _('Total: '),
        x: 'center'
      },

      series: [
        {
          name: 'Producter',
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
    
    clientProducterOption.series[0].data = [
      {
        value: 335,
        name: _('HuaWei')
      }, {
        value: 310,
        name: 'ZTE'
      }, {
        value: 274,
        name: _('Xiao Mi')
      }, {
        value: 235,
        name: _('Apple')
      }, {
        value: 400,
        name: _('lenovo')
      }
    ].sort(function (a, b) {
      return a.value - b.value
    });
    
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
    
    clientsChannelChart.setOption(clientNetworkOption);
    clientsProducerChart.setOption(clientProducterOption);
  },
  
  renderClientStatistics() {
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
          name: _('Number'),
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value}'
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
    statsChart.setOption(ClientsStatsOption);
  },

  render() {

    return (
      <div>
        <h2>{ _('Statistics') }</h2>
        <div className="stats-group clearfix" >
          <div className="stats-group-small" >
            <div className="stats-group-cell">
              <h3>{ _('AP Number') }</h3>
            </div>
            <div className="stats-group-cell">
              <div
                id="echartsContent"
                className="stats-group-canvas"
                >
              </div>
            </div>
          </div>
          <div className="stats-group-medium" >
            <div className="stats-group-cell">
              <h3>{ _('Clients Number') }</h3>
            </div>
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
            <div className="stats-group-cell">
              <h3>{ _('Clients Statistics') }
                <div className="btn-group">
                  <button className="btn active">{ _('Today') }</button>
                  <button className="btn">{ _('Yesterday') }</button>
                  <button className="btn">{ _('7 Days') }</button>
                  <button className="btn">{ _('15 Days') }</button>
                  <button className="btn">{ _('30 Days') }</button>
                </div>
              </h3>
            </div>
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
            <div className="stats-group-cell">
              <h3>{_('Clients Ranklist')}
                <div className="btn-group">
                  <button className="btn active">{_('Activity')}</button>
                  <button className="btn">{_('Connect Time')}</button>
                </div>
              </h3>
            </div>
            <div className="stats-group-cell">
              
            </div>
          </div>
          
          <div className="stats-group-large">
            <div className="stats-group-cell">
              <h3>{ _('AP Activity Ranklist') }</h3>
            </div>
            <div className="stats-group-cell">
              
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
    fetching: myState.get('fetching'),
    data: myState.get('data')
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Status);

export const status = reducer;
