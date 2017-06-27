import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';
import { EchartReact, FormGroup, Select } from 'shared/components/';
import echarts from 'echarts/lib/echarts';

import './index.scss';
import portsusedimg from './PortsUsed@2x.png';
import throughputimg from './Throughput@2x.png';
import dhcpimg from './DHCP@2x.png';
import natstrategyimg from './NATstrategy@2x.png';
import onportimg from './OnPort@2x.png';
import offportimg from './OffPort@2x.png';

const flowRateFilter = utils.filter('flowRate');
const propTypes = {
  store: PropTypes.object,
  changeScreenQuery: PropTypes.func,
  fetchScreenData: PropTypes.func,
};

function generatePortNameOption(list) { // list为immutable类型
  if (typeof list === 'undefined') return [];
  return list.map(item => ({ value: item.get('name'), label: item.get('name').toUpperCase() })).toJS();
}

function translateBytesToReadable(numStr) {
  const ret = flowRateFilter.transform(numStr);
  const num = ret.match(/[0-9]*[.]*[0-9]*/)[0];
  const unit = ret.match(/[a-zA-Z]+/)[0];
  return { num, unit };
}

function getUnit(rate) {
  const UNIT_GB = 1024 * 1024 * 1024;
  const UNIT_MB = 1024 * 1024;
  const UNIT_KB = 1024;
  const unitSize = parseInt(rate, 10);
  let unit;

  if (unitSize > UNIT_GB) {
    unit = { str: 'GB', value: UNIT_GB };
  } else if (unitSize > UNIT_MB) {
    unit = { str: 'MB', value: UNIT_MB };
  } else if (unitSize > UNIT_KB) {
    unit = { str: 'KB', value: UNIT_KB };
  } else {
    unit = { str: 'B', value: 1 };
  }

  return unit;
}

export default class NetWorkDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onHoverId: '',
      flowLeft: 0,
      flowTop: 0,
    };

    this.generateEchartOption = this.generateEchartOption.bind(this);
  }

  generateEchartOption() {
    const curScreenId = this.props.store.get('curScreenId');
    const rateHis = this.props.store.getIn([curScreenId, 'data', 'rateHis']);
    if (!rateHis) return null;

    const { flowData, timeData } = rateHis.toJS();
    // 时间轴数据
    const date = timeData.map(val => val.split(' ')[1]).slice(1);
    // 计算两个时间之间的时间差，单位为秒
    const timeInterval = timeData.map((val, i) => {
      if (i > 0) return (new Date(val) - new Date(timeData[i - 1])) / 1000;
      return 9999;
    }).slice(1);
    console.log('timeInterval', timeInterval);
    // 计算速率值
    const ratePerInterval = flowData.map((val, i) => {
      if (i > 0) {
        const flow = (val - flowData[i - 1]) > 0 ? (val - flowData[i - 1]) : 0;
        return (flow / timeInterval[i - 1]).toFixed(2);
      }
      return 0;
    }).slice(1);
    console.log('flowData', flowData);
    console.log('ratePerInterval', ratePerInterval);
    const maxRate = Math.max.apply(null, ratePerInterval); // 速率最大值
    console.log('maxRate', maxRate);
    const unit = getUnit(maxRate);
    console.log('unit', unit);
    // 速率统一为最大值对应的单位
    const data = ratePerInterval.map((val) => {
      const rate = (val / unit.value).toFixed(2);
      return rate;
    });

    const option = {
      tooltip: {
        trigger: 'axis',
        position(pt) {
          return [pt[0], '10%'];
        },
        formatter: `{b} <br/> {a}: {c} ${unit.str}/s`,
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
        },
      },
      grid: {
        right: '4%',
        left: '4%',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date,
        name: 'Time',
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        max: 'dataMax',
        name: `${unit.str}/s`,
      },
      series: [
        {
          name: __('Throughput'),
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            normal: {
              color: 'rgb(255, 70, 131)',
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(255, 158, 68)',
              }, {
                offset: 1,
                color: 'rgb(255, 70, 131)',
              }]),
            },
          },
          data,
        },
      ],
    };

    return option;
  }

  render() {
    const curScreenId = this.props.store.get('curScreenId');
    const interfaceList = this.props.store.getIn([curScreenId, 'data', 'interfaceList']);
    const upFlow = this.props.store.getIn([curScreenId, 'data', 'upFlow']) || '0';
    const downFlow = this.props.store.getIn([curScreenId, 'data', 'downFlow']) || '0';
    const query = this.props.store.getIn([curScreenId, 'query']);

    return (
      <AppScreen
        {...this.props}
        refreshInterval="30000"
        initOption={{
          query: {
            portName: 'eth0',
            timeRange: 1,
          },
        }}
      >
        <div className="container-grid t-overview">

          <div className="ntw-dsb-section-block row">

            <div className="ntw-dsb-card-wrap cols col-3">
              <div className="ntw-dsb-card">
                <h2 className="ntw-dsb-card-title">{__('External Throughput')}</h2>
                <img
                  src={throughputimg}
                  alt="throughput"
                  className="ntw-dsb-card-img"
                />
                <div className="ntw-dsb-card-content clearfix">
                  <div className="ntw-dsb-content-l fl clearfix">
                    <div className="ntw-dsb-content-ll fl">
                      {translateBytesToReadable(upFlow).num}
                    </div>
                    <div className="ntw-dsb-content-lr down-bg fr">
                      <p>{translateBytesToReadable(upFlow).unit}</p>
                    </div>
                  </div>
                  <div className="ntw-dsb-content-r fr clearfix">
                    <div className="ntw-dsb-content-rl fl">
                      {translateBytesToReadable(downFlow).num}
                    </div>
                    <div className="ntw-dsb-content-rr up-bg fr">
                      <p>{translateBytesToReadable(downFlow).unit}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ntw-dsb-card-wrap cols col-3">
              <div className="ntw-dsb-card">
                <h2 className="ntw-dsb-card-title">{__('DHCP Pool Counts')}</h2>
                <img
                  src={portsusedimg}
                  alt="portsused"
                  className="ntw-dsb-card-img"
                />
                <p className="ntw-dsb-card-num">{this.props.store.getIn([curScreenId, 'data', 'dhcpPool'])}</p>
              </div>
            </div>


            <div className="ntw-dsb-card-wrap cols col-3">
              <div className="ntw-dsb-card">
                <h2 className="ntw-dsb-card-title">{__('DHCP Pool Usage')}</h2>
                <img
                  src={dhcpimg}
                  alt="dhcp"
                  className="ntw-dsb-card-img"
                />
                <div className="ntw-dsb-card-content clearfix">
                  <div className="ntw-dsb-content-l fl clearfix">
                    <div className="ntw-dsb-content-ll fl">
                      {this.props.store.getIn([curScreenId, 'data', 'dhcpUsed'])}
                    </div>
                    <div className="ntw-dsb-content-lr fr">
                      <p>{__('Used')}</p>
                    </div>
                  </div>
                  <div className="ntw-dsb-content-r fr clearfix">
                    <div className="ntw-dsb-content-rl fl">
                      {this.props.store.getIn([curScreenId, 'data', 'dhcpTotal'])}
                    </div>
                    <div className="ntw-dsb-content-rr fr">
                      <p>{__('Total')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ntw-dsb-card-wrap cols col-3">
              <div className="ntw-dsb-card">
                <h2 className="ntw-dsb-card-title">{__('NAT Strategy Counts')}</h2>
                <img
                  src={natstrategyimg}
                  alt="natstrategy"
                  className="ntw-dsb-card-img"
                />
                <p className="ntw-dsb-card-num">{this.props.store.getIn([curScreenId, 'data', 'natNum'])}</p>
              </div>
            </div>

          </div>

          <h2 className="element t-overview__header ntw-dsb-section-title">{__('Interface')}</h2>
          <div className="t-overview__section">
            <div className="row">
              <div
                className="ntw-dsb-interface-wrap cols col-10 col-offset-1"
                ref={(wrap) => { this.wrap = wrap; }}
              >
                <div className="cols col-10 col-offset-1">
                  {
                    [0, 1, 2, 3, 4, 5].map((i) => {
                      const status = interfaceList ? interfaceList.getIn([i, 'enable']) : '0';
                      return (
                        <div className="cols col-2" key={interfaceList ? interfaceList.getIn([i, 'name']) : i}>
                          <div className="ntw-dsb-interface-name">
                            {__(`ETH${i}`)}
                          </div>
                          <div className="ntw-dsb-interface">
                            <img
                              src={status === '1' ? onportimg : offportimg}
                              alt="interface"
                              onMouseEnter={(e) => {
                                const position = utils.dom.getAbsPoint(e.target);
                                const wrapPosition = utils.dom.getAbsPoint(this.wrap);
                                this.setState({
                                  onHoverId: i,
                                  flowLeft: (position.x - wrapPosition.x) + e.target.offsetWidth,
                                  flowTop: (position.y - wrapPosition.y) + e.target.offsetHeight,
                                });
                              }}
                              onMouseLeave={() => {
                                this.setState({
                                  onHoverId: '',
                                  flowLeft: '',
                                  flowTop: '',
                                });
                              }}
                            />
                          </div>
                          <div className="ntw-dsb-interface-status">
                            {
                              interfaceList && interfaceList.getIn([i, 'enable']) === '1' ?
                                interfaceList.getIn([i, 'negoSpeed']) : __('DOWN')
                            }
                          </div>
                        </div>
                      );
                    })
                  }
                  {
                    this.state.onHoverId !== '' && interfaceList &&
                    interfaceList.getIn([this.state.onHoverId, 'enable']) === '1' && (
                      <div
                        className="ntw-dsb-flowboard o-description-list o-description-list--lg"
                        style={{
                          left: this.state.flowLeft,
                          top: this.state.flowTop,
                        }}
                      >
                        <dl className="o-description-list-row">
                          <dt>IP</dt>
                          <dd>{interfaceList.getIn([this.state.onHoverId, 'ip'])}</dd>
                        </dl>
                        <dl className="o-description-list-row">
                          <dt>MAC</dt>
                          <dd>{interfaceList.getIn([this.state.onHoverId, 'mac'])}</dd>
                        </dl>
                        <dl className="o-description-list-row">
                          <dt>{__('Upload Rate')}</dt>
                          <dd>{interfaceList.getIn([this.state.onHoverId, 'upRate'])}</dd>
                        </dl>
                        <dl className="o-description-list-row">
                          <dt>{__('Download Rate')}</dt>
                          <dd>{interfaceList.getIn([this.state.onHoverId, 'downRate'])}</dd>
                        </dl>
                        <dl className="o-description-list-row">
                          <dt>{__('Users Number')}</dt>
                          <dd>{interfaceList.getIn([this.state.onHoverId, 'users'])}</dd>
                        </dl>
                      </div>
                    )
                  }
                  {
                    this.state.onHoverId !== '' && interfaceList &&
                    interfaceList.getIn([this.state.onHoverId, 'enable']) === '0' && (
                      <div
                        className="ntw-dsb-flowboard o-description-list o-description-list--lg"
                        style={{
                          left: this.state.flowLeft,
                          top: this.state.flowTop,
                        }}
                      >
                        <dl className="o-description-list-row">
                          <dt>{__('Status')}</dt>
                          <dd>{__('Down')}</dd>
                        </dl>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>

          <h2 className="element t-overview__header ntw-dsb-section-title">{__('Throughput')}</h2>
          <div className="t-overview__section">
            <div className="element t-overview__section-header">
              <h3>
                <span
                  style={{
                    marginRight: '16px',
                  }}
                >
                  {__('The Past Hours')}
                </span>
                <Select
                  options={[
                    { value: 1, label: __('1 Hour') },
                    { value: 10, label: __('10 Hours') },
                    { value: 24, label: __('24 Hours') },
                    { value: 48, label: __('48 Hours') },
                  ]}
                  value={query.get('timeRange')}
                  onChange={(data) => {
                    this.props.changeScreenQuery({ timeRange: data.value });
                    this.props.fetchScreenData();
                  }}
                  clearable={false}
                />
                <span
                  style={{
                    marginRight: '16px',
                    marginLeft: '30px',
                  }}
                >
                  {__('Port Name')}
                </span>
                <Select
                  options={generatePortNameOption(interfaceList)}
                  value={query.get('portName')}
                  onChange={(data) => {
                    this.props.changeScreenQuery({ portName: data.value });
                    this.props.fetchScreenData();
                  }}
                  clearable={false}
                />
              </h3>
            </div>
            <div className="element">
              <EchartReact
                option={this.generateEchartOption()}
                className="o-box__canvas ntw-dsb-throughput-echart"
              />
            </div>
          </div>

        </div>
      </AppScreen>
    );
  }
}

NetWorkDashBoard.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NetWorkDashBoard);
