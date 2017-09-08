import React from 'react'; import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Map } from 'immutable';
import { Icon, EchartReact, Table } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions, AppScreen } from 'shared/containers/appScreen';
import echarts from 'echarts/lib/echarts';
import h337 from 'heatmap.js';
import { colors, $$commonPieOption } from 'shared/config/axc';

import Rain from './Rain';
import Bar from './Bar';
import MapContainer from './MapContainer';

const REFRESH_INTERVAR = 10000;

function createHeatMapPoints(num, width, height) {
  // now generate some random data
  const points = [];
  const curHeight = height || 100;
  const curWidth = width || 100;
  let len = num || 400;
  let max = 0;
  let point;

  while (len--) {
    const val = Math.floor(Math.random() * 100);
    // now also with custom radius
    const radius = Math.floor(Math.random() * 70);

    max = Math.max(max, val);
    point = {
      x: Math.floor(Math.random() * curWidth),
      y: Math.floor(Math.random() * curHeight),
      value: val,

      // radius configuration on point basis
      radius,
    };
    points.push(point);
  }

  return points;
}

function getClientFlowEchartOption($$serverData) {
  const unit = {
    str: '人',
  };
  let data = $$serverData;

  if (!data) return null;

  const date = data.map((val, index) => {
    let ret = index;

    if (ret < 10) {
      ret = `0${ret}`;
    } else {
      ret = `${ret}`;
    }

    return ret;
  }).toJS();

  let dataMax = $$serverData.max((a, b) => (a - b));

  dataMax += (50 - (dataMax % 10));

  data = data.toJS();

  const option = {
    tooltip: {
      trigger: 'axis',
      position(pt, params, dom, rect, size) {
        let diff = 0;
        if (pt[0] > size.viewSize[0] / 2) {
          diff = 160;
        }
        return [pt[0] - diff, '10%'];
      },
      formatter: `{b} <br/> {a}: {c} ${unit.str}`,
    },
    toolbox: {},
    grid: {
      left: 40,
      right: 10,
      top: 30,
      bottom: 36,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date,
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ffffff',
        },
      },
    },
    yAxis: {
      type: 'value',
      max: 'dataMax',
      name: `${unit.str}`,
      axisTick: {
        show: false,
      },
      splitNumber: 5,
      splitLine: {
        lineStyle: {
          // 使用深浅的间隔色
          color: ['#323c55'],
          type: 'dashed',
        },
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ffffff',
        },
      },
    },
    series: [
      {
        name: __('客流'),
        type: 'line',
        sampling: 'average',
        itemStyle: {
          normal: {
            color: '#eee',
          },
        },
        lineStyle: {
          normal: {
            width: 1,
          },
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgb(19, 61, 101)',
            }, {
              offset: 1,
              color: 'rgb(1, 10, 41)',
            }]),
          },
        },
        data,
      },
    ],
  };

  return option;
}
function getClientTetentionTimeOption($$serverData) {
  const unit = {
    str: '人',
  };
  const data = [];
  const xAxisData = [];
  const backgroundData = [];
  let max = 0;

  if ($$serverData) {
    max = $$serverData.max((a, b) => a - b);
    $$serverData.sortBy(
      (val, key) => key.replace(/\D/g, ''),
      (a, b) => b - a,
    ).forEach((val, key) => {
      xAxisData.unshift(`${key}`);
      data.unshift(parseInt(val, 10));
      backgroundData.unshift(max);
    });
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      position(pt, params, dom, rect, size) {
        let diff = 0;
        if (pt[0] > size.viewSize[0] / 2) {
          diff = 160;
        }
        return [pt[0] - diff, '10%'];
      },
      formatter: `滞留{b}分钟人数 <br/> {c} ${unit.str}`,
    },
    toolbox: {},
    grid: {
      left: 40,
      right: 0,
      top: 30,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: xAxisData,
      name: __('分钟'),
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ffffff',
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
      max: 'dataMax',
      name: `${unit.str}`,
      splitNumber: 4,
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ffffff',
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
        lineStyle: {
          // 使用深浅的间隔色
          color: ['#323c55'],
        },
      },
    },
    series: [
      {
        name: __('Client'),
        type: 'bar',
        barWidth: 16,
        silent: false,
        z: 2,
        itemStyle: {
          normal: {
            color: '#2ea9e5',
          },
        },
        data,
      },
      {
        name: __('Max'),
        type: 'bar',
        silent: true,
        barWidth: 16,
        z: 1,
        barGap: '-100%',
        itemStyle: {
          normal: {
            color: '#eee',
          },
        },
        data: backgroundData,
      },

    ],
  };

  return option;
}
function getClientsTimeOption($$serverData, total) {
  const myData = [
    {
      value: 0,
      name: '小于60分钟',
    },
    {
      value: 0,
      name: '超过60分钟',
    },
  ];
  const ret = $$commonPieOption.mergeDeep({
    color: ['#249ad7', '#ffba03'],
    tooltip: {
      show: false,
    },
    title: {
      text: `${__('总记')}`,
      subtext: `${total || ''} 人`,
      x: '48.2%',
      y: '25%',
      textStyle: {
        fontSize: '14',
        color: '#fff',
      },
      subtextStyle: {
        fontSize: '18',
        fontWeight: 'bolder',
        color: '#fff',
      },
    },
    legend: {
      orient: 'horizontal',
      x: 'center',
      y: '72%',
      textStyle: {
        color: '#fff',
      },
    },
    series: [
      {
        name: __('滞留时间人数'),
        type: 'pie',
        center: ['50%', '38%'],
        radius: ['38%', '62%'],
      },
    ],
  }).toJS();
  let totalNum = total;

  if ($$serverData) {
    $$serverData.forEach((val, key) => {
      if (key < 60) {
        myData[0].value += parseInt(val, 10);
      } else {
        myData[1].value += parseInt(val, 10);
      }
    });
  }
  totalNum = myData[0].value + myData[1].value;

  myData[0].name = `${myData[0].name}人数：${myData[0].value}`;
  myData[1].name = `${myData[1].name}人数：${myData[1].value}`;

  ret.title.subtext = `${totalNum || ''} 人`;
  ret.series[0].data = myData;
  ret.legend.data = [myData[0].name, myData[1].name];

  return ret;
}

/**
 * canvas静态点
 *
 * @param {any} ctx        canvas 2d对象
 * @param {any} pathList   静态点列表
 */
function stationaryPoint(ctx, option) {
  const pointsList = option.points;
  const width = option.width;
  const height = option.height;

  // pathList为数组
  if (pointsList && pointsList.length > 0) {
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;

    pointsList.forEach((point) => {
      ctx.beginPath();
      ctx.arc(
        (parseInt(point.x, 10) * width) / 100,
        (parseInt(point.y, 10) * height) / 100,
        0.5,
        0,
        2 * Math.PI,
      );
      ctx.stroke();
    });
  }
}

const propTypes = {
  store: PropTypes.instanceOf(Map).isRequired,
  fetch: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
const defaultProps = {};

export default class DashboardOverview extends React.PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'renderHeatMap',
      'fetchHeatMapData',
      'renderClientsPathsMap',
      'renderEnvironment',
    ]);
    this.state = {
      heatmapData: [],
      clientsPaths: [],
      heatMapImgIndex: 1,
    };
    utils.dom.removeClass(document.body, 'fixed');
  }

  componentDidMount() {
    // this.fetchHeatMapData();
  }
  componentWillReceiveProps(nextProps) {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const $$serverData = store.getIn([curScreenId, 'data']);
    const $$nextServerData = nextProps.store.getIn([curScreenId, 'data']);

    if ($$serverData !== $$nextServerData) {
      let newIndex = this.state.heatMapImgIndex + 1;

      if (newIndex > 4) {
        newIndex = 1;
      }

      this.setState({
        heatMapImgIndex: newIndex,
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (typeof this.state.heatmapMax !== 'undefined' && this.state.heatmapMax !== nextState.heatmapMax) {
      this.reinitializeHeatMap = true;
    } else {
      this.reinitializeHeatMap = false;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.needUpdateHeatMap !== this.state.needUpdateHeatMap) {
      this.renderHeatMap(this.state.heatmapData);
    }
    if (prevState.needUpdateClientsPathsMap !== this.state.needUpdateClientsPathsMap) {
      this.renderClientsPathsMap(this.clientsPathsCanvas);
    }
  }
  componentWillUnmount() {
    clearTimeout(this.fetchHeatMapTimeout);
    clearTimeout(this.fetchClientsPathsTimeout);
    utils.dom.removeClass(document.body, 'fixed');
  }

  fetchHeatMapData() {
    clearTimeout(this.fetchHeatMapTimeout);

    this.props.fetch('goform/dashboard/heatmap')
      .then((json) => {
        let newIndex = this.state.heatMapImgIndex + 1;

        if (newIndex > 4) {
          newIndex = 1;
        }
        if (json && json.data && json.data.heatMap) {
          this.setState({
            heatmapData: json.data.heatMap,
            needUpdateHeatMap: Date.now(),
            heatMapImgIndex: newIndex,
          });
        }
        this.fetchHeatMapTimeout = setTimeout(() => {
          this.fetchHeatMapData();
        }, REFRESH_INTERVAR);
      });
  }

  fetchClientsPathsMapData() {
    clearTimeout(this.fetchClientsPathsTimeout);

    this.props.fetch('goform/dashboard/clientsPaths')
      .then((json) => {
        if (json && json.data && json.data.paths) {
          this.setState({
            clientsPaths: json.data.paths,
            needUpdateClientsPathsMap: Date.now(),
          });
        }
        this.fetchClientsPathsTimeout = setTimeout(() => {
          this.fetchClientsPathsMapData();
        }, REFRESH_INTERVAR);
      });
  }

  renderHeatMap() {
    const newData = [];
    const data = createHeatMapPoints(400);

    // const data = this.state.heatmapData;

    if (this.heatMapContent && this.heatMapContent.offsetWidth > 0) {
      // this.removeHeatMap();
      this.heatMapContentWidth = this.heatMapContent.offsetWidth;
      this.heatMapContentHeight = this.heatMapContent.offsetHeight;

      if (!this.heatmapInstance) {
        this.heatmapInstance = h337.create({
          container: this.heatMapContent,
          radius: 24,
          blur: 0.9,
        });
      } else {
        data.forEach((item) => {
          newData.push({
            x: (item.x * this.heatmapInstance._renderer._width) / 100,
            y: (item.y * this.heatmapInstance._renderer._height) / 100,
            value: item.value,
          });
        });
      }

      this.heatmapInstance.setData({
        data: newData,
      });
      this.setState({
        heatMapDataUrl: this.heatmapInstance.getDataURL(),
      });
    }
  }

  renderClientsPathsMap(elem) {
    const { clientsPaths } = this.state;
    let loopStep = null;

    if (elem && elem.offsetWidth > 0 && clientsPaths.length > 0) {
      const ctx = elem.getContext('2d');
      const width = elem.offsetWidth;
      const height = elem.offsetHeight;
      const len = clientsPaths.length;

      ctx.clearRect(0, 0, width, height);

      // 画线前先清除 以前划线定时器
      cancelAnimationFrame(this.drawAnimationFrame);

      loopStep = (startIndex = 0) => {
        let curIndex = startIndex;

        stationaryPoint(ctx, {
          width,
          height,
          points: clientsPaths[curIndex].clients,
        });

        curIndex += 1;
        if (curIndex < len) {
          this.dClientPathsAnimationFrame = requestAnimationFrame(() => {
            loopStep(curIndex);
          });
        }
      };

      loopStep(0);
    }
  }

  renderEnvironment() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const $$serverData = store.getIn([curScreenId, 'data']);
    const headerNode = (
      <h3
        className="element link-header"
        onClick={() => this.props.history.push('/dashboard/environment')}
      >
        环境监测
        <Icon name="angle-double-right" className="link-more" />
      </h3>
    );
    const contentNode = (
      <div className="rw-dashboard-environment" key="environment">
        <div className="element">
          <ul>
            <li className="fl col-5">
              <Icon name="thermometer-half" size="5x" />
            </li>
            <li className="fl col-7">
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                {$$serverData.getIn(['environment', 'temperature'])} °
                <Icon name="cloud" style={{ marginLeft: '12px' }} />
              </div>
              <div style={{ fontSize: '20px' }}>深圳</div>
            </li>
          </ul>
        </div>
        <div className="row element">
          <div className="fl col-3">
            <dl>
              <dt>湿度</dt>
              <dt><Icon name="tint" size="2x" /></dt>
              <dd>{$$serverData.getIn(['environment', 'humidity']) || 0}</dd>
            </dl>
          </div>
          <div className="fl col-3">
            <dl>
              <dt>PM2.5</dt>
              <dt><Icon name="leaf" size="2x" /></dt>
              <dd>{$$serverData.getIn(['environment', 'ph']) || 0}</dd>
            </dl>
          </div>
          <div className="fl col-3">
            <dl>
              <dt>噪声</dt>
              <dt><Icon name="bullhorn" size="2x" /></dt>
              <dd>{$$serverData.getIn(['environment', 'noise']) || 0}</dd>
            </dl>
          </div>
          <div className="fl col-3">
            <dl>
              <dt>水质</dt>
              <dt><Icon name="flask" size="2x" /></dt>
              <dd>{$$serverData.getIn(['environment', 'water']) || 0}</dd>
            </dl>
          </div>
        </div>
      </div>
    );

    return [headerNode, contentNode];
  }
  renderFloodWarning() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const $$serverData = store.getIn([curScreenId, 'data']);
    const warningLevel = Math.ceil(($$serverData.getIn(['environment', 'rainfall']) - 40) / 45);
    const headerNode = (
      <h3 className="element">洪涝预警</h3>
    );
    const contentNode = (
      <div className="element row">
        <div className="cols col-5" >
          <Rain warningLevel="4" text="暴雨" active={warningLevel === 4} />
          <Rain warningLevel="3" text="暴雨" active={warningLevel === 3} />
          <Rain warningLevel="2" text="暴雨" active={warningLevel === 2} />
          <Rain warningLevel="1" text="暴雨" active={warningLevel === 1} />
        </div>
        <div className="fl col-7">
          <Bar
            min="0"
            max="240"
            value={$$serverData.getIn(['environment', 'rainfall'])}
            scale={6}
            style={{
              height: '182px',
            }}
          />
        </div>
        <div className="cols col-12 ">
          <div className="rain-description">
            降水量：<span>{$$serverData.getIn(['environment', 'rainfall'])}</span> mm
          </div>
        </div>
      </div>
    );

    return [headerNode, contentNode];
  }
  renderPark() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const $$serverData = store.getIn([curScreenId, 'data']);
    const headerNode = (
      <h3 className="element">车位信息</h3>
    );
    const contentNode = (
      <div className="element">
        <dl className="rw-description-list">
          <dt><Icon name="square" style={{ color: '#007bff' }} />闲置车位</dt>
          <dd>{$$serverData.getIn(['parking', 'total']) - $$serverData.getIn(['parking', 'used'])}</dd>
        </dl>
        <dl className="rw-description-list">
          <dt><Icon name="square" style={{ color: '#ffc107' }} />预定车位</dt>
          <dd>{$$serverData.getIn(['parking', 'booked'])}</dd>
        </dl>
        <dl className="rw-description-list">
          <dt>
            <Icon name="square" style={{ color: '#fd7e14' }} />已停车位
          </dt>
          <dd>{$$serverData.getIn(['parking', 'used'])}</dd>
        </dl>
      </div>
    );

    return [headerNode, contentNode];
  }
  renderClientsTetentionTime(type) {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const $$serverData = store.getIn([curScreenId, 'data']);
    const headerNode = (
      <h3
        className="element link-header"
        onClick={() => this.props.history.push('/dashboard/flowanalysis')}
      >
        平均滞留时间
        <Icon name="angle-double-right" className="link-more" />
      </h3>
    );
    let option = getClientsTimeOption(
      $$serverData.getIn(['clients', 'retentionTime']),
      $$serverData.getIn(['clients', 'total']),
    );
    let contentNode = null;

    if (type === 'bar') {
      option = getClientTetentionTimeOption($$serverData.getIn(['clients', 'retentionTime']));
    }

    contentNode = (
      <EchartReact
        className="chart-container"
        option={option}
        style={{
          height: '216px',
        }}
      />
    );

    return [headerNode, contentNode];
  }

  renderClientsFlow() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const $$serverData = store.getIn([curScreenId, 'data']);
    const headerNode = (
      <h3
        className="element link-header"
        onClick={() => this.props.history.push('/dashboard/flowanalysis')}
      >
        本日客流量
        <Icon name="angle-double-right" className="link-more" />
      </h3>
    );
    const option = getClientFlowEchartOption($$serverData.getIn(['clients', 'today']));
    let contentNode = null;

    contentNode = (
      <div className="element">
        <EchartReact
          className="chart-container"
          style={{
            height: '180px',
          }}
          option={option}
        />
      </div>
    );

    return [headerNode, contentNode];
  }
  renderClientsAnalysis() {
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const $$serverData = store.getIn([curScreenId, 'data']);
    const headerNode = (
      <h3
        className="element link-header"
        onClick={() => this.props.history.push('/dashboard/flowanalysis')}
      >
        关键区域客流分析
        <Icon name="angle-double-right" className="link-more" />
      </h3>
    );
    const contentNode = (
      <div className="element" style={{ height: '270px' }}>
        <Table
          options={[
            {
              id: 'location',
              text: '位置',
            }, {
              id: 'live',
              text: ' 实时游客',
            }, {
              id: 'total',
              text: '今日总游客',
            }, {
              id: 'new',
              text: '今日新游客',
            }, {
              id: 'newRate',
              text: '今日新游客占比',
            }, {
              id: 'retentionTime',
              text: '平均逗留时间',
              render: val => parseInt(val, 10),
            },
          ]}
          scroll={{
            y: '180px',
          }}
          list={$$serverData.getIn(['clientsAnalysis'])}
          paginationType="none"
        />
      </div>
    );

    return [headerNode, contentNode];
  }

  render() {
    const { store } = this.props;
    const { heatMapDataUrl, clientsMapwidth, clientsMapHeight } = this.state;
    const curScreenId = store.get('curScreenId');
    const $$serverData = store.getIn([curScreenId, 'data']);

    return (
      <AppScreen
        {...this.props}
        refreshInterval={REFRESH_INTERVAR}
        noLoading
      >
        <div className="rw-dashboard row">
          <div className="cols col-2">
            <div className="rw-dashboard-card rw-dashboard-card--lg">
              { this.renderEnvironment() }
            </div>
            <div className="rw-dashboard-card rw-dashboard-card--lg">
              { this.renderClientsTetentionTime() }
            </div>
            <div className="rw-dashboard-card rw-dashboard-card--lg">
              { this.renderFloodWarning() }
            </div>
            <div
              className="rw-dashboard-card rw-dashboard-card--lg"
              style={{
                height: '306px',
              }}
            >
              { this.renderPark() }
            </div>
          </div>
          <div className="cols col-5">
            <div className="rw-dashboard-card">
              { this.renderClientsFlow() }
            </div>
            <div className="rw-dashboard-card">
              {
                this.renderClientsTetentionTime('bar')
              }
            </div>
            <div className="rw-dashboard-card">
              {
                this.renderClientsAnalysis()
              }
            </div>
            <div className="rw-dashboard-card">
              <h3 className="element">车位信息</h3>
              <div className="element" style={{ height: '270px' }}>
                <Table
                  options={[
                    {
                      id: 'name',
                      text: '停车场',
                    }, {
                      id: 'total',
                      text: '车位',
                    }, {
                      id: 'free',
                      text: '空闲车位',
                    }, {
                      id: 'used',
                      text: '已停车位',
                    }, {
                      id: 'booked',
                      text: '预定车位',
                    }, {
                      id: 'newRate',
                      text: '空闲车位占比',
                      render: (val, $$data) => `${Number(($$data.get('free') / $$data.get('total')) * 100).toFixed(2)} %`,
                    },
                  ]}
                  scroll={{
                    y: '180px',
                  }}
                  list={$$serverData.getIn(['parking', 'list'])}
                  paginationType="none"
                />
              </div>
            </div>
          </div>
          <div className="cols col-5">
            <div
              className={
                this.state.heatmapMax ? 'rw-dashboard-card rw-dashboard-card--max rw-dashboard-card--fixed-header' : 'rw-dashboard-card rw-dashboard-card--fixed-header'
              }
            >
              <h3 className="element rw-dashboard-card__header" >
                热力图
                {
                  this.state.heatmapMax ? (
                    <Icon
                      name="compress"
                      className="fr"
                      onClick={() => {
                        this.setState({
                          heatmapMax: false,
                        });
                        utils.dom.removeClass(document.body, 'fixed');
                      }}
                    />
                  ) : (
                    <Icon
                      name="expand"
                      className="fr"
                      onClick={() => {
                        this.setState({
                          heatmapMax: true,
                        });

                        utils.dom.addClass(document.body, 'fixed');
                      }}
                    />
                  )
                }

              </h3>
              <MapContainer
                style={{
                  height: this.state.heatmapMax ? '100%' : '507px',
                }}
                className="rw-dashboard-card__content"
                backgroundImgUrl={`images/${this.state.heatMapImgIndex}.jpg`}
                reinitialize={this.reinitializeHeatMap}
              />
            </div>
            <div className="rw-dashboard-card rw-dashboard-card--fixed-header">
              <h3 className="element rw-dashboard-card__header">
                实时视频
              </h3>
              <MapContainer
                backgroundImgUrl="images/vide.jpg"
                className="rw-dashboard-card__content"
                noResize
              />
            </div>
            <div className="rw-dashboard-card rw-dashboard-card--fixed-header">
              <h3 className="element rw-dashboard-card__header">
                烟感报警
              </h3>
              <MapContainer
                className="rw-dashboard-card__content"
              >
                <div className="rw-map-warning-icon" >
                  <div className="rw-map-warning-icon__warning" />
                </div>
                <div
                  className="rw-map-normal-icon"
                  style={{
                    top: '18%',
                    left: '20%',
                  }}
                />
                <div
                  className="rw-map-normal-icon"
                  style={{
                    top: '28%',
                    left: '30%',
                  }}
                />
                <div
                  className="rw-map-normal-icon"
                  style={{
                    top: '38%',
                    left: '58%',
                  }}
                />
                <div
                  className="rw-map-normal-icon"
                  style={{
                    top: '20%',
                    left: '56%',
                  }}
                />
              </MapContainer>
            </div>
          </div>
        </div>
      </AppScreen>
    );
  }
}

DashboardOverview.propTypes = propTypes;
DashboardOverview.defaultProps = defaultProps;

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
)(DashboardOverview);
