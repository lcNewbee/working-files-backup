import React, { PropTypes } from 'react';
import utils, { gps } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import { FormGroup, Icon, AppScreen } from 'shared/components';
import moment from 'moment';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';
import './orbitTrace.scss';

function getDistance(p1, p2) {
  return Math.sqrt(((p1[0] - p2[0]) * (p1[0] - p2[0])) + ((p1[1] - p2[1]) * (p1[1] - p2[1])));
}

const propTypes = {
  store: PropTypes.object,
  changeScreenQuery: PropTypes.func,
  fetch: PropTypes.func,
  fetchScreenData: PropTypes.func,
  reciveScreenData: PropTypes.func,
};
const defaultProps = {};
const defaultQuery = {
  buildId: '',
  curMapId: '',
  mac: '',
  date: moment().format('YYYY-MM-DD'),
  fromTime: '00:00:00',
  toTime: '23:59:59',
};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.curvePath = [];
    this.timeoutVal = [];
    this.pathList = [];
    this.mapMouseDown = false;
    this.colors = ['#c23531', '#2f4554', '#0093dd', '#d48265', '#91c7ae'];
    this.state = {
      mapList: fromJS([]),
      zoom: 100,
      mapOffsetX: 0,
      mapOffsetY: 0,
      mapWidth: 1,
      mapHeight: 1,
    };
    utils.binds(this,
      [
        'onSave',
        'renderCurMap',
        'updateState',
        'onChangeBuilding',
        'onChangeMapId',
        'onSearch',
        'stationaryPoint',
        'onMapMouseUp',
        'onMapMouseDown',
        'onMapMouseMove',

        'drawLinePath',
        'smoothSpline',
        'getOffsetPoint',
        'getPointList',
        'interpolate',
        // 'drawCurvePath',
        'drawCurveAnimPath',
        'drawLineBetweenPoints',
        'clearTimeout',
        'updateCanvas',
      ],
    );
  }
  componentWillMount() {
    // if (this.curvePath) console.log('componentWillMount:this.curvePath', this.curvePath.length);
    // if (this.pathList) console.log('componentWillMount:this.pathList', this.pathList.length);
    this.preScreenId = this.props.store.get('curScreenId');
    this.props.fetch('goform/group/map/building').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.buildOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('name'), value: item.get('id') }));
      }
      this.onChangeBuilding(this.buildOptions.getIn([0, 'value']));
    });
    // console.log('will mount this.curvePath', this.curvePath);
  }
  // componentDidMount() {
  //   if (typeof (this.canvasElem) === 'undefined') return;
  //   const store = this.props.store;
  //   const curScreenId = store.get('curScreenId');
  //   // const curMapId = store.getIn([curScreenId, 'query', 'curMapId']);
  //   const curMapId = this.state.curMapId;
  //   const $$pathList = store.getIn([curScreenId, 'data', 'list']);
  //   console.log('did mount curScreenId & pathlist', curScreenId, $$pathList);
  //   const mapList = this.mapList;
  //   const ctx = this.canvasElem.getContext('2d');
  //   if (typeof (mapList) !== 'undefined') {
  //     this.updateCanvas($$pathList, mapList, curMapId);
  //     this.drawCurveAnimPath(ctx, this.curvePath);
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    const curScreenId = this.props.store.get('curScreenId');
    const thisData = this.props.store.getIn([curScreenId, 'data']);
    const nextData = nextProps.store.getIn([curScreenId, 'data']);
    if (!thisData.equals(nextData)) this.clearTimeout();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    if (!store.getIn([curScreenId, 'data']).equals(nextProps.store.getIn([curScreenId, 'data']))) {
      return true;
    }
    if (!fromJS(this.state).equals(fromJS(nextState))) {
      return true;
    }
    if (!store.getIn([curScreenId, 'query']).equals(nextProps.store.getIn([curScreenId, 'query']))) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    if (typeof (this.canvasElem) === 'undefined') return;
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');

    /** *********hack: 暂时解决store中curScreenId更新不及时引起的bug**********/
    if (this.preScreenId !== curScreenId) {
      // console.log('In hack code', this.preScreenId, curScreenId);
      this.onChangeBuilding(this.buildOptions.getIn([0, 'value']));
      this.preScreenId = curScreenId;
    }
    /** *********************hack over*************************************/

    // const curMapId = store.getIn([curScreenId, 'query', 'curMapId']);
    const curMapId = this.state.curMapId;
    const $$pathList = store.getIn([curScreenId, 'data', 'list']);
    const mapList = this.mapList;
    const ctx = this.canvasElem.getContext('2d');
    ctx.clearRect(0, 0, this.state.mapWidth, this.state.mapHeight);
    this.stationaryPoint(ctx, this.pathList);
    // this.mapMouseDown用来检测是否是拖动引起的页面重绘，如果是，则坐标点位置没有变化无需重新计算
    if (typeof (mapList) !== 'undefined' && !this.mapMouseDown) {
      // console.log('did update curScreenId & pathlist', curScreenId, $$pathList);
      this.updateCanvas($$pathList, mapList, curMapId);
      this.drawCurveAnimPath(ctx, this.curvePath);
    }
  }

  componentWillUnmount() {
    // console.log('orbitTrace componentWillUnmount');
    const curScreenId = this.props.store.get('curScreenId');
    this.clearTimeout();
    // delete this.curvePath;
    // delete this.pathList;
    // 清空数据，解决首次进入，在请求未返回之前使用历史数据绘图问题
    this.props.reciveScreenData(fromJS({
      list: [],
      macList: [],
    }), curScreenId);
  }

  onChangeBuilding(id) {
    this.props.changeScreenQuery(fromJS({ buildId: id }));
    this.setState({ buildId: id });
    this.props.fetch('goform/group/map/list', { buildId: id })
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.mapOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('mapName'), value: item.get('id') }));
            this.mapList = fromJS(json.data.list);
          }
        }).then(() => {
          this.onChangeMapId(this.mapOptions.getIn([0, 'value']));
        });
  }
  onChangeMapId(id) {
    const curScreenId = this.props.store.get('curScreenId');
    Promise.resolve().then(() => {
      this.props.changeScreenQuery(fromJS({ curMapId: id }));
      this.setState({ curMapId: id });
    }).then(() => {
      this.props.fetchScreenData().then(() => {
        const mac = this.props.store.getIn([curScreenId, 'query', 'mac']);
        // 如果query参数有mac地址，则无需处理
        // 如果query参数没有mac，或mac为空，则后台返回第一条Mac的轨迹，需做特殊处理
        if (typeof (mac) === 'undefined' || mac === '') {
          const firstMac = this.props.store.getIn([curScreenId, 'data', 'macList', '0']);
          // this.onChangeMac(firstMac);
          // 如果后台默认返回第一条Mac地址的数据，则使用下面的操作，否则使用上面的onChangeMac
          // 目的是减少一次数据请求
          this.props.changeScreenQuery(fromJS({ mac: firstMac }));
        }
      });
    });
  }
  onChangeMac(value) {
    const curScreenId = this.props.store.get('curScreenId');
    Promise.resolve().then(() => {
      // 清空历史数据，解决修改参数后，在数据返回之前使用历史数据绘图问题
      this.props.reciveScreenData(fromJS({
        list: [],
        macList: [],
      }), curScreenId);
    }).then(() => {
      this.props.changeScreenQuery(fromJS({ mac: value }));
    }).then(() => {
      this.props.fetchScreenData();
    });
  }

  onMapMouseUp() {
    this.mapMouseDown = false;
    if (this.posXBeforeMove !== this.state.mapOffsetX ||
        this.posYBeforeMove !== this.state.mapOffsetY) {
      // console.log('onmapmouseup', this.posXBeforeMove, this.state.mapOffsetX);
      const ctx = this.canvasElem.getContext('2d');
      this.drawCurveAnimPath(ctx, this.curvePath);
    }
  }
  onMapMouseDown(e) {
    // console.log('onmapmousedown running');
    this.mapMouseDown = true;
    this.mapClientX = e.clientX;
    this.mapClientY = e.clientY;
    this.posXBeforeMove = this.state.mapOffsetX;
    this.posYBeforeMove = this.state.mapOffsetY;
  }
  onMapMouseMove(e) {
    if (this.mapMouseDown) {
      this.setState({
        mapOffsetX: (this.state.mapOffsetX + e.clientX) - this.mapClientX,
        mapOffsetY: (this.state.mapOffsetY + e.clientY) - this.mapClientY,
      });
      this.mapClientX = e.clientX;
      this.mapClientY = e.clientY;
      if (this.posXBeforeMove !== this.state.mapOffsetX ||
          this.posYBeforeMove !== this.state.mapOffsetY) {
        this.clearTimeout();
      }
    }
  }
  onSearch() {
    clearTimeout(this.querySaveTimeout);

    this.querySaveTimeout = setTimeout(() => {
      this.onFetchList();
    }, 200);
  }
  getNaturalWidthAndHeight(url) {
    const image = new Image();
    image.src = url;
    this.naturalWidth = image.width;
    this.naturalHeight = image.height;
  }

  getPointList(from, to) {
    let points = [
      [from.x, from.y],
      [to.x, to.y],
    ];
    const ex = points[1][0];
    const ey = points[1][1];
    points[3] = [ex, ey];
    points[1] = this.getOffsetPoint(points[0], points[3]);
    points[2] = this.getOffsetPoint(points[3], points[0]);
    points = this.smoothSpline(points, false);
    // 修正最后一点在插值产生的偏移
    points[points.length - 1] = [ex, ey];
    return points;
  }

  getOffsetPoint(start, end) {
    const distance = getDistance(start, end) / 3; // 除以3？
    let angle; let dX; let dY;
    const mp = [start[0], start[1]];
    const deltaAngle = start[1] >= end[1] ? -0.1 : 0.1; // 偏移0.2弧度
    if (start[0] !== end[0] && start[1] !== end[1]) { // 斜率存在
      const k = (end[1] - start[1]) / (end[0] - start[0]);
      angle = Math.atan(k);
    } else if (start[0] === end[0]) { // 垂直线
      angle = (start[1] <= end[1] ? 1 : -1) * (Math.PI / 2);
    } else { // 水平线
      angle = 0;
    }
    if (start[0] <= end[0]) {
      angle -= deltaAngle;
      dX = Math.round(Math.cos(angle) * distance);
      dY = Math.round(Math.sin(angle) * distance);
      mp[0] += dX;
      mp[1] += dY;
    } else {
      angle += deltaAngle;
      dX = Math.round(Math.cos(angle) * distance);
      dY = Math.round(Math.sin(angle) * distance);
      mp[0] -= dX;
      mp[1] -= dY;
    }
    return mp;
  }

  handleChangeQuery(name, data) {
    const curScreenId = this.props.store.get('curScreenId');
    Promise.resolve().then(() => {
      // 清空历史数据，解决修改参数后，在数据返回之前使用历史数据绘图问题
      this.props.reciveScreenData(fromJS({
        list: [],
        macList: [],
      }), curScreenId);
    }).then(() => {
      this.props.changeScreenQuery(fromJS({ [name]: data.value }));
    }).then(() => {
      this.props.fetchScreenData();
    });
  }

  stationaryPoint(ctx, pathList) { // pathList为数组
    if (typeof pathList === 'undefined' || pathList.length === 0) return null;
    pathList.forEach((point) => {
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  drawLineBetweenPoints(ctx, point1, point2) {
    // ctx.moveTo(point1[0], point1[1]);
    // console.log('drawLineBetweenPoints');
    ctx.lineTo(point2[0], point2[1]);
    ctx.stroke();
    // sleep(1);
  }

  // drawLineBetweenPoints(ctx, pathArr) {
  //   console.log('drawLineBetweenPoints');
  //   if (pathArr.length < 1) return null;
  //   ctx.lineTo(pathArr[0][0], pathArr[0][1]);
  //   ctx.stroke();
  //   pathArr.splice(0, 1);
  //   this.timeout = setTimeout(this.drawLineBetweenPoints(ctx, pathArr), 10);
  // }

  clearTimeout() {
    let timeoutLen = this.timeoutVal.length;
    // console.log('clearTimeout total length', timeoutLen);
    // if (timeoutLen === 0) return;
    while (timeoutLen) {
      clearTimeout(this.timeoutVal[--timeoutLen]);
      // if (timeoutLen === 0) console.log('timeout clear');
    }
    this.timeoutVal = [];
    // clearTimeout(this.timeout);
  }

  // 动态画线
  drawCurveAnimPath(ctx, curvePath) {
    const len = curvePath.length;
    if (len === 0) return null;
    // 清除之前没有画完的定时器
    // let timeoutLen = this.timeoutVal.length;
    // while (timeoutLen--) {
    //   clearTimeout(this.timeoutVal[timeoutLen]);
    // }
    this.clearTimeout();
    const colorsLen = this.colors.length;
    ctx.beginPath();
    let point1 = curvePath[0];
    ctx.strokeStyle = this.colors[Math.floor(colorsLen * Math.random())];
    ctx.lineWidth = 2;
    // 使用setTimeOut可以主动管理UI线程，但是下面的做法好像并没有达到线程管理以使页面更加流畅的目的。
    // 要达到管理线程的目的，需要当一个函数执行完成后再注册下一个定时器
    const start = (new Date()).getTime();
    curvePath.forEach((point) => {
      const a = setTimeout(() => {
        this.drawLineBetweenPoints(ctx, point1, point);
        point1 = point;
      }, 25);
      this.timeoutVal.push(a);
      // const end = (new Date()).getTime();
      // console.log('time run', end - start);
    });

    // ctx.moveTo(curvePath[0][0], curvePath[0][1]);
    // this.drawLineBetweenPoints(ctx, curvePath);

    const endend = (new Date()).getTime();
    // console.log('total time', endend - start);
  }

  updateCanvas($$pathList, mapList, curMapId) {
    // console.log('updateCanvas, curScreenId', this.props.store.get('curScreenId'));
    // console.log('updateCanvas, original path', $$pathList);
    // if (typeof $$pathList === 'undefined' || typeof mapList === 'undefined') { return null; }
    let arguLen = arguments.length;
    while (arguLen--) {
      if (typeof arguments[arguLen] === 'undefined') return null;
    }
    let ctx = this.canvasElem;
    if (!ctx) return null;
    ctx = this.canvasElem.getContext('2d');
    ctx.clearRect(0, 0, this.state.mapWidth, this.state.mapHeight);
    const curItem = mapList.find(item => item.get('id') === curMapId);
    if (typeof curItem === 'undefined') return null;
    // 经纬度转换为画布上的像素
    const start = (new Date()).getTime();
    const pathListPixel = $$pathList.toJS().map(($$point) => {
      const ret = gps.getOffsetFromGpsPoint($$point, curItem.toJS());
      const x = Math.floor((ret.x * this.state.mapWidth) / 100);
      const y = Math.floor((ret.y * this.state.mapHeight) / 100);
      return { x, y };
    });
    const end = (new Date()).getTime();
    // console.log('list data to map data time', end - start);
    this.pathList = pathListPixel; // 存储起来，避免在没有请求数据的情况下做多余的计算。
    this.stationaryPoint(ctx, pathListPixel);

    const len = pathListPixel.length;
    this.curvePath = [];
    const start1 = (new Date()).getTime();
    pathListPixel.forEach((item, index, arr) => {
      if (index === len - 1) return;
      const crvPoints = this.getPointList(item, arr[index + 1]);
      this.curvePath = this.curvePath.concat(crvPoints);
      // this.drawCurvePath(ctx, crvPoints);
    });
    const end1 = (new Date()).getTime();
    // console.log('interpolate time spent', end1 - start1);
    // console.log('total points on curve path', this.curvePath.length);
    // this.drawCurveAnimPath(ctx, this.curvePath);
    // this.oribitPath(ctx, startX, startY, fromJS(pathListPixel));
  }

  smoothSpline(points, isLoop) {
    const len = points.length;
    const ret = [];
    let distance = 0;
    for (let i = 1; i < len; i++) {
      distance += getDistance(points[i - 1], points[i]);
    }
    let segs = distance / 2;
    segs = segs < len ? len : segs;
    for (let i = 0; i < segs; i++) {
      const pos = (i / (segs - 1)) * (isLoop ? len : len - 1);
      const idx = Math.floor(pos);
      const w = pos - idx;
      let p0;
      const p1 = points[idx % len];
      let p2;
      let p3;
      if (!isLoop) {
        p0 = points[idx === 0 ? idx : idx - 1];
        p2 = points[idx > len - 2 ? len - 1 : idx + 1];
        p3 = points[idx > len - 3 ? len - 1 : idx + 2];
      } else {
        p0 = points[((idx - 1) + len) % len];
        p2 = points[(idx + 1) % len];
        p3 = points[(idx + 2) % len];
      }
      const w2 = w * w;
      const w3 = w * w2;

      ret.push([
        this.interpolate(p0[0], p1[0], p2[0], p3[0], w, w2, w3),
        this.interpolate(p0[1], p1[1], p2[1], p3[1], w, w2, w3),
      ]);
    }
    return ret;
  }

  interpolate(p0, p1, p2, p3, t, t2, t3) {
    const v0 = (p2 - p0) * 0.5;
    const v1 = (p3 - p1) * 0.5;
    return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
  }

  generateMacOptions() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const macList = store.getIn([curScreenId, 'data', 'macList']) || fromJS([]);
    return macList.toJS().map(mac => ({ value: mac, label: mac }));
  }
  renderCurMap(mapList, curMapId, myZoom) {
    const curItem = mapList.find(item => item.get('id') === curMapId);
    const imgUrl = curItem ? curItem.get('backgroundImg') : '';
    // 获取图片的原始大小
    // 如果使用百分比设置canvas的宽高，当浏览器放大缩小时，画布不会重绘，导致画布图案超出图片
    this.getNaturalWidthAndHeight(imgUrl);
    return (
      <div
        className="o-map-container"
        ref={(mapContent) => {
          if (mapContent) {
            this.mapContent = mapContent;
            this.setState({
              mapWidth: mapContent.offsetWidth,
              mapHeight: mapContent.offsetHeight,
            });
          }
        }}
        style={{
          left: this.state.mapOffsetX,
          top: this.state.mapOffsetY,
          width: `${((myZoom * this.naturalWidth) / 100)}px`,
          height: `${((myZoom * this.naturalHeight) / 100)}px`,
        }}
        onMouseDown={this.onMapMouseDown}
        onMouseUp={this.onMapMouseUp}
        onMouseMove={this.onMapMouseMove}
      >
        <img src={imgUrl} className="auto" alt={curMapId} />
        <canvas
          ref={(canvasElem) => {
            if (canvasElem && this.canvasElem !== canvasElem) {
              this.canvasElem = canvasElem;
            }
          }}
          width={this.state.mapWidth}
          height={this.state.mapHeight}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
      </div>
    );
  }

  render() {
    const myZoom = this.state.zoom;
    const { store } = this.props;
    const curScreenId = store.get('curScreenId');
    const $$screenQuery = store.getIn([curScreenId, 'query']);
    if (!this.mapList) return null;

    return (
      <AppScreen
        {...this.props}
        initOption={{
          query: defaultQuery,
        }}
      >
        <div
          className="o-form o-form--flow"
          style={{
            minWidth: '850px',
          }}
        >
          <FormGroup
            type="select"
            className="fl"
            label={__('Building')}
            options={this.buildOptions ? this.buildOptions.toJS() : []}
            value={this.state.buildId}
            onChange={data => this.onChangeBuilding(data.value)}
          />
          <FormGroup
            type="select"
            className="fl"
            label={__('Map')}
            options={this.mapOptions ? this.mapOptions.toJS() : []}
            value={this.state.curMapId}
            onChange={data => this.onChangeMapId(data.value)}
          />
          <FormGroup
            type="select"
            className="fl"
            label={__('Client')}
            options={this.generateMacOptions()}
            value={store.getIn([curScreenId, 'query', 'mac'])}
            onChange={data => this.onChangeMac(data.value)}
            searchable
          />
          <FormGroup
            type="date"
            className="fl"
            label={__('Date')}
            value={$$screenQuery.get('date')}
            onChange={(data) => {
              this.handleChangeQuery('date', data);
            }}
            isOutsideRange={() => false}
          />
          <FormGroup
            type="time"
            className="fl"
            label={__('Start Time')}
            value={$$screenQuery.get('fromTime')}
            onChange={(data) => {
              this.handleChangeQuery('fromTime', data);
            }}
            // showSecond={false}
          />

          <FormGroup
            type="time"
            className="fl"
            label={__('End Time')}
            value={$$screenQuery.get('toTime')}
            onChange={(data) => {
              this.handleChangeQuery('toTime', data);
            }}
            // showSecond={false}
          />
        </div>
        <div
          className="o-map-warp"
          style={{
            top: '5rem',
            minWidth: '850px',
          }}
        >
          {this.renderCurMap(this.mapList, this.state.curMapId, this.state.zoom)}
          <div className="o-map-zoom-bar">
            <Icon
              name="minus"
              className="o-map-zoom-bar__minus"
              onClick={() => {
                this.setState({
                  zoom: (myZoom - 10) < 10 ? 10 : (myZoom - 10),
                });
              }}
            />
            <div className="o-map-zoom-bar__thmp" >{myZoom}%</div>
            <Icon
              name="plus"
              className="o-map-zoom-bar__plus"
              onClick={() => {
                this.setState({
                  zoom: (myZoom + 10) > 200 ? 200 : (myZoom + 10),
                });
              }}
            />
          </div>
        </div>
      </AppScreen>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
    // product: state.product,
    groupid: state.product.getIn(['group', 'selected', 'id']),
    // isShowPanel: state.properties.get('isShowPanel'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
    propertiesActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
