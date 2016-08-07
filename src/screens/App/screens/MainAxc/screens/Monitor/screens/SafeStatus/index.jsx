import React from 'react';
import utils from 'shared/utils';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS } from 'immutable';

// components
import {
  Table, EchartReact,
} from 'shared/components';

import * as actions from './actions';
import myReducer from './reducer';
import './index.scss';

const flowRateFilter = utils.filter('flowRate');
const flowRateKbFilter = utils.filter('flowRate:["KB"]');
const msg = {
  ip: _('IP Address'),
  mac: _('MAC Address'),
  days: _('Days'),
  apStatus: _('AP Status'),
  total: _('Total:'),
  apNumber: _('AP Number'),
};

// 原生的 react 页面
export const Status = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      showOfflineAp: false,
    };
  },

  componentWillMount() {
    this.props.fetchStatus();
  },

  componentWillUnmount() {
    this.props.leaveStatusScreen();
  },
  getClientsListOption() {
    const ret = fromJS([
      {
        id: 'hostname',
        text: _('Name'),
        transform(val, item) {
          return val || item.get('macaddress');
        },
      }, {
        id: 'ipaddress',
        text: _('IP Address'),
      }, {
        id: 'macaddress',
        text: _('MAC Address'),
      }, {
        id: 'softversion',
        text: _('UP/Down'),
        transform(val, item) {
          return flowRateKbFilter.transform(item.get('upstream')) +
            ' / ' + flowRateKbFilter.transform(item.get('downstream'));
        },
      }, {
        id: 'connecttime',
        text: _('Connect Time'),
        filter: 'connectTime',
        width: '160',
      },
    ]);

    return ret;
  },
  getSafeTypeChartOtion() {
    const apInfo = this.props.data.get('apInfo');
    const clientInfo = this.props.data.get('clientInfo');

    const apOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ' + _('apUnit') + ' ({d}%)',
      },
      title: {
        text: _('攻击类型分布图'),
        subtext: _('攻击总数：') + apInfo.get('total'),
        x: 'center',
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
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    const data = clientInfo.get('producerlist')
        .map((val, key) => ({
          value: val,
          name: _(key),
        })).toArray();

    apOption.series[0].data = data;
    return apOption;
  },

  render() {
    const clientsListOption = this.getClientsListOption();

    return (
      <div className="Stats">
        <h2>{ _('Statistics') }</h2>
        <div className="stats-group clearfix" >
          <div className="stats-group-large" >
            <div className="stats-group-cell">
              <h3>{ _('攻击类型') }</h3>
            </div>
            <div className="stats-group-cell">

              <EchartReact
                option={this.getSafeTypeChartOtion()}
                className="stats-group-canvas"
                style={{
                  width: '100%',
                }}
                onEvents={{
                  click: (params) => {
                    if (params.dataIndex === 0) {
                      this.showOfflineAp();
                    } else {
                      window.location.hash = '#/main/devices';
                    }
                  },
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
                options={clientsListOption}
                list={this.props.data.get('aplist')}
              />
            </div>
          </div>

        </div>
      </div>
    );
  },
});

function mapStateToProps(state) {
  const myState = state.safeStatus;
  return {
    app: state.app,
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    offlineAp: myState.get('offlineAp'),
    query: myState.get('query'),
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions
)(Status);

export const reducer = myReducer;
