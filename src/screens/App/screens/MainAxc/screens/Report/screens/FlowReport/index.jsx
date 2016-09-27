import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { List } from 'immutable';
import moment from 'moment';
import {
  PureComponent, EchartReact, Button, FormGroup,
  FormInput,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as actions from './actions';
import myReducer from './reducer';

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
        value: 232,
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
        value: 232,
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
          type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
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
          type: 'category',
          data: ['2016-2-3', '2016-2-4', '2016-2-5', '2016-2-6', '2016-2-7', '2016-2-8', '2016-2-9'],
          axisTick: {
            alignWithLabel: true,
            length: 2,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',

          splitNumber: 3,
          splitLine: {
            show: false,
          },
        },

      ],
      series: [
        {
          name: '数量',
          type: 'line',
          barWidth: '60%',
          data: [100, 52, 23, 232, 323, 33, 323],
        },
      ],
    };

    return ret;
  }
  render() {
    const usersStatusOption = this.getUsersOption();
    const cpuStatusOption = this.getCpuOption();
    const systemOption = this.getSystemOption();

    return (
      <div className="t-stats">
        <h3 className="t-main__content-title">{_('Flow Report') }</h3>
        <div className="t-stats__cell">
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
        <div className="stats-group clearfix" >
          <div className="cols col-6" >
            <div className="t-stats__cell">
              <h3>{ _('用户数') }</h3>
            </div>
            <div className="t-stats__cell">
              <EchartReact
                option={usersStatusOption}
                className="t-stats__canvas"
              />
            </div>
          </div>
          <div className="cols col-6" >
            <div className="t-stats__cell">
              <h3>{ _('应用流量') }</h3>
            </div>
            <div className="t-stats__cell">
              <EchartReact
                option={cpuStatusOption}
                className="t-stats__canvas"
              />
            </div>
          </div>
          <div className="t-stats__cell">
            <h3>{ _('流量趋势') }</h3>
          </div>
          <div className="t-stats__cell">
            <EchartReact
              option={systemOption}
              className="t-stats__canvas"
            />
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
