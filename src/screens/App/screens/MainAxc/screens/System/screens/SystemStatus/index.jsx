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
      color: ['#27BCF7', '#fff'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [_('Used'), _('Free')],
      },
      title: {
        text: _('CPU Activity Monitor'),
        x: 'center',
      },
      series: [
        {
          name: _('CPU Activity Monitor'),
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
      { value: 335, name: _('Used') },
      { value: 310, name: _('Free') },
    ];

    return ret;
  }

  getApOption() {
    const ret = {
      color: ['#27BCF7', '#fff'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      title: {
        text: _('Memory Activity Monitor'),
        x: 'center',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: [_('Used'), _('Free')],
      },
      series: [
        {
          name: _('Memory Activity Monitor'),
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
      { value: 335, name: _('Used') },
      { value: 310, name: _('Free') },
    ];

    return ret;
  }

  getStoreOption() {
    const option = {
      color: ['#27BCF7', '#fff'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
          type: 'line',        // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      legend: {
        data: [_('Used'), _('Free')],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '0',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        max: 100,
        position: 'bottom',
      },

      yAxis: [
        {
          type: 'category',
          data: [_('Store')],
        },
      ],
      series: [
        {
          name: _('Used'),
          type: 'bar',
          barWidth: 20,
          stack: _('Store'),
          data: [40],
        },
        {
          name: _('Free'),
          type: 'bar',
          stack: _('Store'),
          data: [60],
        },
      ],
    };

    return option;
  }

  render() {
    const apStatusOption = this.getApOption();
    const cpuStatusOption = this.getCpuOption();
    const storeStatusOption = this.getStoreOption();

    return (
      <div>
        <h3 className="t-main__content-title">{_('System Status') }</h3>
        <div className="stats-group clearfix" >
          <div className="cols col-6" >
            <div className="stats-group-cell">
              <h3>{ _('Memory') }</h3>
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
              <h3>{ _('CPU') }</h3>
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
        <div className="stats-group clearfix" >
          <div className="stats-group-cell">
            <h3>{ _('Store') }</h3>
          </div>
          <div className="stats-group-cell">
            <EchartReact
              option={storeStatusOption}
              className="stats-group-canvas"
              style={{
                width: '100%',
                minHeight: '120px',
              }}
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
