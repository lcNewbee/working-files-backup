import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import {
  PureComponent, EchartReact,
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
    const ret = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['已使用', '未使用'],
      },
      title: {
        text: _('CPU 使用情况'),
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

    ret.series[0].data = [
      { value: 335, name: '已使用' },
      { value: 310, name: '未使用' },
    ];

    return ret;
  }

  getApOption() {
    const ret = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      title: {
        text: _('存储状态'),
        x: 'center',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['已使用', '未使用'],
      },
      series: [
        {
          name: '存储状态',
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

    ret.series[0].data = [
      { value: 335, name: '已使用' },
      { value: 310, name: '未使用' },
    ];

    return ret;
  }

  render() {
    const apStatusOption = this.getApOption();
    const cpuStatusOption = this.getCpuOption();

    return (
      <div>
        <h3 className="t-main__content-title">{_('System Status') }</h3>
        <div className="stats-group clearfix" >
          <div className="cols col-6" >
            <div className="stats-group-cell">
              <h3>{ _(' 存储空间') }</h3>
            </div>
            <div className="stats-group-cell">
              <EchartReact
                option={apStatusOption}
                className="stats-group-canvas"
                style={{
                  width: '100%',
                }}
              />
            </div>
          </div>
          <div className="cols col-6" >
            <div className="stats-group-cell">
              <h3>{ _('设备资源') }</h3>
            </div>
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
