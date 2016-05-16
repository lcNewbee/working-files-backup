import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {List, fromJS} from 'immutable';

// components
import { Input, FormGruop } from 'components/Form/Input';
import {Table} from 'components/Table';
import Switchs from 'components/Switchs';

import * as actions from './actions';
import reducer from './reducer';
import echarts from 'echarts';
import './index.scss';

let apChart, statsChart, clientsChannelChart, clientsProducerChart;


const tooltip = {
  trigger: 'item',
  formatter: "{a} <br/>{b} : {c} 台 ({d}%)"
}

// 原生的 react 页面
export const Status = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
    this.props.fetchStatus();
  },

  componentDidMount() {
    // apChart = echarts.init(document.getElementById('echartsContent'));
    // statsChart = echarts.init(document.getElementById('clientsStats'));
    // clientsChannelChart = echarts.init(document.getElementById('clientsChannelStats'));
    // clientsProducerChart = echarts.init(document.getElementById('clientsProducerStats'));
    
    // this.renderApNumber();
    // this.renderClientNumber();
    // this.renderClientStatistics();
  },
  
  componentDidUpdate(prevProps) {
    apChart = echarts.init(document.getElementById('echartsContent'));
    statsChart = echarts.init(document.getElementById('clientsStats'));
    clientsChannelChart = echarts.init(document.getElementById('clientsChannelStats'));
    clientsProducerChart = echarts.init(document.getElementById('clientsProducerStats'));
    
    //if(!prevProps.data.equals(this.props.data)) {
      this.renderApNumber();
      this.renderClientNumber();
      this.renderClientStatistics();
    //}
    
  },
  
  renderApNumber() {
    const apInfo = this.props.data.get('apInfo');
    
    let apOption = {
      tooltip,
      title: {
        text: _('AP Status Characterize'),
        subtext: _('Total:') + apInfo.get('total'),
        x: 'center'
      },
      series: [
        {
          name: _('Status:'),
          type: 'pie',
          radius: ['10%', '45%'],
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
    const data = apInfo.delete('total').map(function(val, key) {
      return {
        value: val,
        name: _(key)
      }
    }).toArray();
    
    apOption.series[0].data = data;
    apChart.setOption(apOption);
  },
  
  renderClientNumber() {
    const clientInfo = this.props.data.get('clientInfo');
    const clientNetworkOption = {
      tooltip,

      title: {
        text: _('Clients Frequency Characterize'),
        subtext: _('Total:') + clientInfo.get('total'),
        x: 'center'
      },

      series: [
        {
          name: 'Frequency',
          type: 'pie',
          radius: ['10%', '45%'],
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
        subtext: _('Total:') + clientInfo.get('total'),
        x: 'center'
      },

      series: [
        {
          name: 'Producter',
          type: 'pie',
          radius: ['10%', '45%'],
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
    
    if(clientInfo.get('producerlist')) {
      clientProducterOption.series[0].data = clientInfo.get('producerlist')
        .map(function(val, key) {
          return {
            value: val,
            name: _(key)
          }
        }).toArray();
    }
    
    
    clientNetworkOption.series[0].data = clientInfo.delete('total').delete('producerlist')
      .map(function(val, key) {
        return {
          value: val,
          name: _(key)
        }
      }).toArray();
      
    clientsChannelChart.setOption(clientNetworkOption);
    clientsProducerChart.setOption(clientProducterOption);
  },
  
  renderClientStatistics() {
    const dayText = _('D')
    let xAxisData;
    let xAxisName = _('Days');
    
    if(this.props.query.get('time_type') === 'yesterday' ||
        this.props.query.get('time_type') === 'today') {
      
      xAxisData = List(new Array(24)).map(function(val, i) {
        return i + ':00';
      }).toJS();
      xAxisName = _('Hours');
      
    } else if (this.props.query.get('time_type') === 'week') {
      
      xAxisData = List(new Array(7)).map(function(val, i) {
        return i;
      }).toJS();
    } else if (this.props.query.get('time_type') === 'half_month') {
      
      xAxisData = List(new Array(15)).map(function(val, i) {
        return i;
      }).toJS();
    } else {
      
      xAxisData = List(new Array(30)).map(function(val, i) {
        return i;
      }).toJS();
    }
    
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
          data: xAxisData,
          name: xAxisName,
          max: 24
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
            data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23]
          },
          {
            name: '2.4G',
            type: 'bar',
            data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23]
          }
        ]
      };
    statsChart.setOption(ClientsStatsOption);
  },
  
  toPdf() {
    var doc = new jsPDF();
    var imgData;
    var Context;
    var Canvas = document.getElementsByTagName("canvas")[0];
    
    Context = Canvas.getContext("2d");
    imgData = Canvas.toDataURL('image/png');
    doc.text(20, 20, 'AP数量');
    doc.addImage(imgData, 'png', 20, 30, 50, 50);
    
    doc.save('download1.pdf');
  },
  
  onChangeTime(data) {
    if(data.value) {
      this.props.changeStatsQuery({
        'time_type': data.value
      });
      
      this.props.fetchStatus();
    }
  },
  onChangeClientSortType(data) {
    if(data.value) {
      this.props.changeStatsQuery({
        'sort_type': data.value
      });
      
      this.props.fetchStatus();
    }
  },
  
  createTimeTypeClass(type) {
    var ret = 'btn';
    
    if(this.props.query.get('time_type') === name) {
      ret += ' active';
    }
    
    return ret;
  },
  
  render() {
    const clientsListOption = fromJS([
      {
        'id': 'hostname',
        'text': _('Name')
      }, {
        'id': 'ipaddress',
        'text':  _('IP Address')
      }, {
        'id': 'macaddress',
        'text':  _('MAC Address')
      }, {
        'id': 'softversion',
        'text':  _('UP/Down Flow'),
        transform(item) {
          return item.get('upstream') + '/' + item.get('downstream');
        }
      }, {
        'id': 'connecttime',
        'text':  _('Connect Time')
      }
    ]);
    
    const apListOption = fromJS([
      {
        'id': 'devicename',
        'text': _('Name')
      }, {
        'id': 'ipaddress',
        'text':  _('IP Address')
      }, {
        'id': 'macaddress',
        'text':  _('MAC Address')
      }, {
        'id': 'up/down flow',
        'text':  _('UP/Down Flow'),
        transform(item) {
          return item.get('upstream') + '/' + item.get('downstream');
        }
      }
    ]);
    
    const timeTypeSwitchs = fromJS([
      {
        value: 'today',
        label: _('Today')
      },
      {
        value: 'yesterday',
        label: _('Yesterday')
      },
      {
        value: 'week',
        label: '7 ' + _('Days')
      },
      {
        value: 'half_month',
        label: '15 ' + _('Days')
      },
      {
        value: 'month',
        label: '30 ' + _('Days')
      }
    ]);
    
    const clientTypeSwitchs = fromJS([
      {
        value: '1',
        label: _('Activity')
      },
      {
        value: '2',
        label: _('Connect Time')
      }
    ]);
   
    return (
      <div id="jspdf">
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
                <Switchs
                  options={timeTypeSwitchs}
                  value={this.props.query.get('time_type')}
                  onChange={this.onChangeTime}
                />
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
                <Switchs
                  options={clientTypeSwitchs}
                  value={this.props.query.get('sort_type')}
                  onChange={this.onChangeClientSortType}
                />
              </h3>
            </div>
            <div className="stats-group-cell">
              <Table
                className="table"
                options={clientsListOption}
                list={this.props.data.get('clientlist')}
              />
            </div>
          </div>
          
          <div className="stats-group-large">
            <div className="stats-group-cell">
              <h3>{ _('AP Activity Ranklist') }</h3>
            </div>
            <div className="stats-group-cell">
              <Table
                className="table"
                options={apListOption}
                list={this.props.data.get('aplist')}
              />
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
    data: myState.get('data'),
    query: myState.get('query')
  };
}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Status);

export const status = reducer;
