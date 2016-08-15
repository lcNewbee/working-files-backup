import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { fromJS, List } from 'immutable';
import moment from 'moment';
import {
  PureComponent, EchartReact, Button, Table, Switchs,
  FormInput,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as actions from './actions';
import myReducer from './reducer';

const tableOptions = fromJS([
  {
    id: 'Name',
    text: _('时间'),
  }, {
    id: 'Ip',
    text: _('累积到店'),
  }, {
    id: 'MTU',
    text: _('首次到店'),
  }, {
    id: 'TxBytes',
    text: _('新登记用户'),
  }, {
    id: 'RxBytes',
    text: _('未入店用户'),
  }, {
    id: 'TxErrorPackets',
    text: _('接入用户数'),
  }, {
    id: 'RxErrorPackets',
    text: _('非首次到店'),
  }, {
    id: 'RxErrorPackets',
    text: _('进店率'),
  }, {
    id: 'RxErrorPackets',
    text: _('返店率'),
  }, {
    id: 'RxErrorPackets',
    text: _('平均停留时间'),
  },
]);

export default class View extends PureComponent {
  constructor(props) {
    super(props);

    this.binds('getCpuOption');
  }

  getCpuOption() {
    const dataList = [
      {
        name: 'QQ',
        value: 232,
      }, {
        name: 'Weixin',
        value: 2323,
      }, {
        name: 'Chrome',
        value: 2323,
      }, {
        name: '爱奇艺',
        value: 2323,
      },
    ];
    const ret = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: List(dataList).map(item => item.name).toJS(),
      },
      title: {
        text: _('应用流量占比'),
        x: 'center',
      },
      series: [
        {
          name: 'CPU使用率',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },

        },
      ],
    };

    ret.series[0].data = dataList;

    return ret;
  }

  getUsersOption() {
    const dataList = [
      {
        name: 'Xiaomi',
        value: 2323,
      }, {
        name: 'Huaiwei',
        value: 2323,
      }, {
        name: 'Apple',
        value: 2323,
      }, {
        name: 'Google',
        value: 2323,
      },
    ];
    const ret = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      title: {
        text: _('终端类型分布'),
        x: 'center',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: List(dataList).map(item => item.name).toJS(),
      },
      series: [
        {
          name: '终端类型',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '20',
                fontWeight: 'bold',
              },
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },

        },
      ],
    };

    ret.series[0].data = dataList;

    return ret;
  }

  getSystemOption() {
    const ret = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      legend: {
        x: 'center',
        data: ['在线用户数', '会话数'],
      },
      xAxis: [
        {
          type: 'category',
          data: ['2016-2-3', '2016-2-4', '2016-2-5', '2016-2-6', '2016-2-7', '2016-2-8', '2016-2-9'],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '数量',
          type: 'bar',
          barWidth: '60%',
          data: [100, 523, 23, 232, 323, 33, 323],
        },
      ],
    };

    return ret;
  }
  render() {
    const usersStatusOption = this.getUsersOption();
    const cpuStatusOption = this.getCpuOption();

    return (
      <div>
        <div className="stats-group clearfix" >
          <div className="m-action-bar stats-group-cell">
            <div className="cols col-6">
              <label style={{ marginRight: '20px' }}>{_('日期范围')}</label>
              <FormInput
                type="date"
                dateFormat="YYYY-MM-DD"
                todayButton={_('Today')}
                selected={moment()}
                style={{ marginRight: '.5em' }}
              />
              <span style={{ margin: '0 .5em' }}>{_('To')}</span>
              <FormInput
                type="date"
                dateFormat="YYYY-MM-DD"
                todayButton={_('Today')}
                selected={moment()}
                label={_('日期')}
                style={{ marginLeft: '.5em' }}
              />
            </div>
            <div className="cols col-6">
              <Button
                theme="primary"
                icon="download"
                text={`${_('Download Report')}(PDF)`}
              />
            </div>
          </div>
          <Table
            className="table"
            options={tableOptions}
            list={[]}
          />
          <div
            className="stats-group-cell"
            style={{
              marginTop: '10px',
            }}
          >
            <Switchs
              options={[
                _('累积到店'),
                _('首次到店'),
                _('新登记用户'),
                _('未入店用户'),
                _('进店率'),
                _('返店率'),
                _('平均停留时间'),
                _('驻留时间分别'),
              ]}
              value="1"
            />
          </div>
          <div className="cols col-6" >
            <div className="stats-group-cell">
              <EchartReact
                option={usersStatusOption}
                className="stats-group-canvas"
                style={{
                  width: '100%',
                }}
              />
            </div>
          </div>
          <div className="cols col-6" >
            <div className="stats-group-cell">
              <EchartReact
                option={cpuStatusOption}
                className="stats-group-canvas"
                style={{
                  width: '100%',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.system,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);

export const reducer = myReducer;
