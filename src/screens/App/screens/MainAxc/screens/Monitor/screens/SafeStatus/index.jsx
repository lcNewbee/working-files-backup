import React from 'react';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {List, fromJS} from 'immutable';

// components
import Table from 'shared/components/Table';
import Switchs from 'shared/components/Switchs';
import Button from 'shared/components/Button';
import Icon from 'shared/components/Icon';
import Modal from 'shared/components/Modal';

import * as actions from './actions';
import myReducer from './reducer';
import echarts from 'echarts/lib/echarts';
import './index.scss';

/**
 * echarts图标按需引入
 */
// 引入柱状图
require('echarts/lib/chart/bar');

// 引入折线图
require('echarts/lib/chart/line');
require('echarts/lib/chart/lines');

// 引入折饼图
require('echarts/lib/chart/pie');

// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/legend');
require('echarts/lib/component/title');

const flowRateFilter = utils.filter('flowRate');
const flowRateKbFilter = utils.filter('flowRate:["KB"]');
const tooltip = {
  trigger: 'item',
  formatter: "{a} <br/>{b} : {c} ({d}%)"
}
const msg = {
  ip: _("IP Address"),
  mac: _("MAC Address"),
  days: _("Days"),
  apStatus: _('AP Status'),
  total: _('Total:'),
  apNumber: _('AP Number')

};
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
    label: '7 ' + msg.days
  },
  {
    value: 'half_month',
    label: '15 ' + msg.days
  },
  {
    value: 'month',
    label: '30 ' + msg.days
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

let apChart, statsChart, clientsChannelChart, clientsProducerChart;


// 原生的 react 页面
export const Status = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
     return {
       showOfflineAp: false
     }
  },

  componentWillMount() {
    this.props.fetchStatus();
    this.props.fetchOfflineAp();
  },

  componentDidUpdate(prevProps) {
    statsChart = echarts.init(document.getElementById('clientsStats'));
    this.renderClientStatistics();
  },

  componentWillUnmount() {
    this.props.leaveStatusScreen();
  },

  hideOfflineApp() {
    this.setState({
      showOfflineAp: false
    })
  },

  showOfflineAp() {
    this.props.fetchOfflineAp();
    this.setState({
      showOfflineAp: true
    });
  },

  renderApNumber() {
    const apInfo = this.props.data.get('apInfo');

    let apOption = {
      tooltip:  {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} " + _('apUnit') + " ({d}%)"
      },
      title: {
        text: msg.apStatus,
        subtext: msg.total + apInfo.get('total'),
        x: 'center'
      },
      series: [
        {
          name: _('Status'),
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
    const data = apInfo.delete('total').delete('default').map(function(val, key) {
      return {
        value: val,
        name: _(key)
      }
    }).toArray();

    apOption.series[0].data = data;
    apChart.setOption(apOption);

    apChart.on('click', function(params) {
      if(params.dataIndex === 0) {
        this.showOfflineAp();
      } else {
        window.location.hash = "#/main/devices";
      }

    }.bind(this));
  },

  renderClientStatistics() {
    const apInfo = this.props.data.get('apInfo');
    const clientInfo = this.props.data.get('clientInfo');

    let apOption = {
      tooltip:  {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} " + _('apUnit') + " ({d}%)"
      },
      title: {
        text: _('攻击类型分布图'),
        subtext: _('攻击总数：') + apInfo.get('total'),
        x: 'center'
      },
      series: [
        {
          name: _('Status'),
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
    const data = clientInfo.get('producerlist')
        .map(function(val, key) {
          return {
            value: val,
            name: _(key)
          }
        }).toArray();

    apOption.series[0].data = data;
    statsChart.setOption(apOption);

    statsChart.on('click', function(params) {
      if(params.dataIndex === 0) {
        this.showOfflineAp();
      } else {
        window.location.hash = "#/main/devices";
      }

    }.bind(this));
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

  onOfflineApPageChange(i) {
    this.props.changeOfflineApQuery({
      page: i
    });
    this.props.fetchOfflineAp();
  },

  createTimeTypeClass(type) {
    var ret = 'btn';

    if(this.props.query.get('time_type') === name) {
      ret += ' active';
    }

    return ret;
  },

  getClientsListOption() {
    const ret = fromJS([
      {
        id: 'hostname',
        text: _('Name'),
        transform: function(val, item) {
          return val || item.get('macaddress');
        }
      }, {
        id: 'ipaddress',
        text:  _('IP Address')
      }, {
        id: 'macaddress',
        text:  _('MAC Address')
      }, {
        id: 'softversion',
        text:  _('UP/Down'),
        transform(val, item) {
          return flowRateKbFilter.transform(item.get('upstream')) +
              ' / ' + flowRateKbFilter.transform(item.get('downstream'));
        }
      }, {
        id: 'connecttime',
        text:  _('Connect Time'),
        filter: 'connectTime',
        width: '160',
      }
    ]);

    return ret;
  },

  getApListOption() {
    var ret = fromJS([
      {
        id: 'devicename',
        text: _('Name'),
        transform: function(val, item) {
          return val || item.get('macaddress');
        }
      }, {
        id: 'ipaddress',
        text:  _('IP Address')
      }, {
        id: 'macaddress',
        text:  _('MAC Address')
      }, {
        id: 'up/down flow',
        text:  _('UP/Down'),
        transform(val, item) {
          return flowRateFilter.transform(item.get('upstream')) + ' / ' +
              flowRateFilter.transform(item.get('downstream'));
        }
      }
    ]);

    return ret;
  },

  getOfflineApListOption() {
    var ret = fromJS([
      {
        id: 'devicename',
        text: _('Name'),
        transform: function(val, item) {
          return val || item.get('mac');
        }
      }, {
        id: 'model',
        text: _('Model')
      }, {
        id: 'softversion',
        text: _('Version')
      }, {
        id: 'channel',
        text: _('Channel'),
        transform: function(val, item) {
          var ret = val;

          if(val == 0) {
            ret = _('auto');
          }
          return ret;
        }
      }, {
        id: 'op',
        text: _('Actions'),
        transform: function(val, item) {
          var mac = item.get('mac');
          return (
            <Button
              icon="bomb"
              size="sm"
              text={_('Delete')}
              onClick={this.onDeleteOfflineDev.bind(this, mac)}
            />
          );
        }.bind(this)
      }
    ]);

    return ret;
  },

  onDeleteOfflineDev: function(mac) {
    this.props.deleteOfflineAp(mac);
  },

  render() {
    const clientsListOption = this.getClientsListOption();
    const apListOption = this.getApListOption();
    const offlineApOption = this.getOfflineApListOption();

    return (
      <div className="Stats">
        <h2>{ _('Statistics') }</h2>
        <div className="stats-group clearfix" >
          <div className="stats-group-large" >
            <div className="stats-group-cell">
              <h3>{ _('攻击类型') }</h3>
            </div>
            <div className="stats-group-cell">
              <div
                id="clientsStats"
                className="stats-group-canvas"
                style={{
                  width: '100%'
                }}
              />
            </div>
          </div>

          <div className="stats-group-large">
            <div className="stats-group-header">
              <h3>{ _('最近安全事件列表') }</h3>
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

        <Modal
          isShow={this.state.showOfflineAp}
          title={_("Offline Ap List")}
          onClose={this.hideOfflineApp}
          onOk={this.hideOfflineApp}
        >
          <Table
            className="table"
            options={offlineApOption}
            list={this.props.offlineAp.get('list')}
            page={this.props.offlineAp.get('page')}
            onPageChange={this.onOfflineApPageChange}
          />

        </Modal>
      </div>
    );
  }
});

function mapStateToProps(state) {
  const myState = state.safeStatus;
  return {
    app: state.app,
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    offlineAp: myState.get('offlineAp'),
    query: myState.get('query')
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions
)(Status);

export const reducer = myReducer;
