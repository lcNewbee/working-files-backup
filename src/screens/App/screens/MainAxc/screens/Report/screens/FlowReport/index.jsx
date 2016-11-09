import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { List } from 'immutable';
import {
  EchartReact, Button,
  FormInput,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as actions from './actions';
import myReducer from './reducer';

const canvasStyle = {
  minHeight: '210px',
};

export default class View extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
      startDate: null,
      endDate: null,
    };

    utils.binds(this, [
      'getCpuOption',
      'onDatesChange',
      'onFocusChange',
    ]);
  }
  onDatesChange(data) {
    this.setState(data);
  }
  getCpuOption() {
    const dataList = [
      {
        name: 'Facebook',
        value: 232,
      }, {
        name: 'Google',
        value: 2323,
      }, {
        name: 'Google Map',
        value: 232,
      }, {
        name: 'Youtube',
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
        text: _('App Flow'),
        x: 'center',
      },
      series: [
        {
          name: _('App Flow'),
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
        name: 'Apple',
        value: 232,
      }, {
        name: 'Google',
        value: 2323,
      }, {
        name: 'Huaiwei',
        value: 2323,
      },
    ];
    const ret = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      title: {
        text: _('Vendor'),
        x: 'center',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: List(dataList).map(item => item.name).toJS(),
      },
      series: [
        {
          name: 'Vendor',
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
    const { focusedInput, startDate, endDate } = this.state;
    return (
      <div className="o-box">
        <h3 className="t-main__content-title">{this.props.route.text}</h3>
        <div className="o-box__cell clearfix">
          <div className="cols col-6">
            <label
              style={{ marginRight: '20px' }}
              htmlFor="dateRange"
            >
              {_('Date Range')}
            </label>
            <FormInput
              type="date-range"
              monthFormat="YYYY-MM-DD"
              id="dateRange"
              onChange={this.onDatesChange}
              isOutsideRange={() => false}
              focusedInput={focusedInput}
              startDate={startDate}
              endDate={endDate}
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
        <div className="row" >
          <div className="cols col-6" >
            <div className="o-box__cell">
              <h3>{ _('Users Number') }</h3>
            </div>
            <div className="o-box__cell">
              <EchartReact
                option={usersStatusOption}
                style={canvasStyle}
              />
            </div>
          </div>
          <div className="cols col-6" >
            <div className="o-box__cell">
              <h3>{ _('App Flow') }</h3>
            </div>
            <div className="o-box__cell">
              <EchartReact
                option={cpuStatusOption}
                style={canvasStyle}
              />
            </div>
          </div>
          <div className="cols col-12 o-box__cell">
            <h3>{ _('Flow Trend') }</h3>
          </div>
          <div className="cols col-12 o-box__cell">
            <EchartReact
              option={systemOption}
              style={canvasStyle}
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
