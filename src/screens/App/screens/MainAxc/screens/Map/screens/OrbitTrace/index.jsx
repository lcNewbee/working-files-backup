import React, { PropTypes } from 'react';
import utils, { gps } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import { FormGroup } from 'shared/components';
import { Icon } from 'shared/components';
import moment from 'moment';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';
import './orbitTrace.scss';


function getBuildingName() {
  return utils.fetch('goform/group/map/building')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.name,
          }),
        ),
      }
    ),
  );
}
function getLayerMap() {
  return utils.fetch('/goform/group/map/list')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.mapName,
          }),
        ),
        list: json.data.list,
      }
    ),
  );
}

function getClientMac() {
  return utils.fetch('/goform/group/user')
    .then(json => (
      {
        options: json.data.list.map(
          item => ({
            value: item.id,
            label: item.mac,
          }),
        ),
      }
    ),
  );
}

function getDistance(p1, p2) {
  return Math.sqrt(((p1[0] - p2[0]) * (p1[0] - p2[0])) + ((p1[1] - p2[1]) * (p1[1] - p2[1])));
}

const propTypes = {
  store: PropTypes.object,
  changeScreenQuery: PropTypes.func,
  fetch: PropTypes.func,
  fetchScreenData: PropTypes.func,
};
const defaultProps = {};
const defaultQuery = {
  buildId: 2,
  curMapId: 1,
  mac: 1,
  date: moment().format('YYYY-MM-DD'),
  fromTime: '08:00:11',
  toTime: '20:00:11',
};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.colors = ['#c23531', '#2f4554', '#0093dd', '#d48265', '#91c7ae'];
    this.state = {
      buildingNameOptions: fromJS([]),
      layerMapOptions: fromJS([]),
      clientMacOptions: fromJS([]),
      mapList: fromJS([]),
      date: moment().format('YYYY-MM-DD'),
      curMapId: 1,
      fromTime: '08:00:11',
      toTime: '20:00:11',
      zoom: 50,
      mapOffsetX: 0,
      mapOffsetY: 0,
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
        'oribitPath',
        'drawCircle',
        'onMapMouseUp',
        'onMapMouseDown',
        'onMapMouseMove',

        'drawLinePath',
        'smoothSpline',
        'getOffsetPoint',
        'getPointList',
        'interpolate',
        'drawCurvePath',
      ],
    );
  }
  componentWillMount() {
    getBuildingName()
      .then((data) => {
        this.setState({
          buildingNameOptions: fromJS(data.options),
        });
      });
    getLayerMap()
      .then((data) => {
        this.setState({
          layerMapOptions: fromJS(data.options),
          mapList: fromJS(data.list),
        });
      });
    getClientMac()
      .then((data) => {
        this.setState({
          clientMacOptions: fromJS(data.options),
        });
      });
    this.props.fetch('goform/group/map/building').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.buildOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('name'), value: item.get('id') }));
      }
      this.onChangeBuilding(this.buildOptions.getIn([0, 'value']));
    }).then((list) => {
      if (typeof (list) !== 'undefined') {
        this.onChangeMapId(this.mapOptions.getIn([0, 'value']));
      }
    });
    this.props.fetch('/goform/group/user').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.macOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('mac'), value: item.get('id') }));
      }
      this.onChangeMac(this.macOptions.getIn([0, 'value']));
    });
  }
  componentDidMount() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const curMapId = store.getIn([curScreenId, 'query', 'curMapId']);
    const $$pathList = store.getIn([curScreenId, 'data', 'list']);
    const startX = store.getIn([curScreenId, 'data', 'list', 0, 'x']);
    const startY = store.getIn([curScreenId, 'data', 'list', 0, 'y']);
    const mapList = this.mapList;
    if (typeof (mapList) !== 'undefined') {
      this.updateCanvas(startX, startY, $$pathList, mapList, curMapId);
    }
  }

  componentDidUpdate() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const curMapId = store.getIn([curScreenId, 'query', 'curMapId']);
    const $$pathList = store.getIn([curScreenId, 'data', 'list']);
    const startX = store.getIn([curScreenId, 'data', 'list', 0, 'x']);
    const startY = store.getIn([curScreenId, 'data', 'list', 0, 'y']);
    const mapList = this.mapList;
    if (typeof (mapList) !== 'undefined') {
      this.updateCanvas(startX, startY, $$pathList, mapList, curMapId);
    }
  }
  onChangeBuilding(id) {
    this.props.changeScreenQuery({ buildId: id });
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
    Promise.resolve().then(() => {
      this.props.changeScreenQuery({ curMapId: id });
      this.setState({ curMapId: id });
    }).then(() => {
      this.props.fetchScreenData();
    });
  }
  onChangeMac(id) {
    this.props.changeScreenQuery({ macId: id });
    this.setState({ macId: id });
    this.props.fetch('goform/group/user', { macId: id })
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.macOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('mac'), value: item.get('id') }));
          }
        });
  }
  onMapMouseUp() {
    this.mapMouseDown = false;
  }
  onMapMouseDown(e) {
    this.mapMouseDown = true;
    this.mapClientX = e.clientX;
    this.mapClientY = e.clientY;
  }
  onMapMouseMove(e) {
    if (this.mapMouseDown) {
      this.setState({
        mapOffsetX: (this.state.mapOffsetX + e.clientX) - this.mapClientX,
        mapOffsetY: (this.state.mapOffsetY + e.clientY) - this.mapClientY,
      });
      this.mapClientX = e.clientX;
      this.mapClientY = e.clientY;
    }
  }
  onSearch() {
    clearTimeout(this.querySaveTimeout);

    this.querySaveTimeout = setTimeout(() => {
      this.onFetchList();
    }, 200);
  }
  updateCanvas(startX, startY, $$pathList, mapList, curMapId) {
    if (typeof $$pathList === 'undefined') { return null; }
    let ctx = this.canvasElem;
    if (!ctx) {
      return null;
    }
    ctx = this.canvasElem.getContext('2d');
    const curItem = mapList.find(item => item.get('id') === curMapId);
    // 经纬度转换为画布上的像素
    const pathListPixel = $$pathList.toJS().map(($$point) => {
      const ret = gps.getOffsetFromGpsPoint($$point, curItem.toJS());
      const x = Math.floor((ret.x * this.mapWidth) / 100);
      const y = Math.floor((ret.y * this.mapHeight) / 100);
      return { x, y };
    });

    const len = pathListPixel.length;
    pathListPixel.forEach((item, index, arr) => {
      if (index === len - 1) return;
      const crvPoints = this.getPointList(item, arr[index + 1]);
      this.drawCurvePath(ctx, crvPoints);
    })
    
    this.stationaryPoint(ctx, pathListPixel);
    // this.oribitPath(ctx, startX, startY, fromJS(pathListPixel));
  }

  drawCurvePath(ctx, crvPoints) {
    const len = crvPoints.length;
    const colorsLen = this.colors.length;
    if (len === null)  return null;
    ctx.moveTo(crvPoints[0][0], crvPoints[0][1]);
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.colors[Math.floor(colorsLen * Math.random())];
    ctx.lineWidth = 2;
    crvPoints.forEach((point, index) => {
      ctx.lineTo(point[0], point[1]);
    });
    ctx.stroke();
    ctx.restore();
  }

  stationaryPoint(ctx, $$pathList) {
    const len = $$pathList.size;
    if (len === null) {
      return null;
    }
    // console.log('$$pathList', $$pathList);
    $$pathList.forEach(
      ($$point) => {
        // 默认值为source-over
        // const prev = ctx.globalCompositeOperation;
        //  只显示canvas上原图像的重叠部分
        // ctx.globalCompositeOperation = 'destination-in';
        //  设置主canvas的绘制透明度
        // ctx.globalAlpha = 0.9;
        //  这一步目的是将canvas上的图像变的透明
        // ctx.fillRect(0, 0, 1144, 700);
        //  在原图像上重叠新图像
        // ctx.globalCompositeOperation = prev;
        //  在主canvas上画新圆
        // console.log('$$point', $$point);
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'red';
        // console.log('$$point.x', $$point.x);
        ctx.arc($$point.x, $$point.y, 4, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      },
    );
  }
  drawCircle(ctx, $$point) {
    ctx.beginPath();
    ctx.arc($$point.get('x'), $$point.get('y'), 1, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = 'red';
    ctx.fill();
  }
  oribitPath(ctx, startX, startY, $$pathList) {
    const len = $$pathList.size;
    if (len === 1 || $$pathList === null) {
      return null;
    }
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    $$pathList.forEach(
      ($$point) => {
        ctx.lineTo($$point.get('x'), $$point.get('y'));
      },
    );
    ctx.strokeStyle = 'red';
    ctx.lineWidth = '1';
    ctx.stroke();
    ctx.restore();
  }
  handleChangeQuery(name, data) {
    this.props.changeScreenQuery({ [name]: data.value });
    this.onSearch();
  }
  renderCurMap(mapList, curMapId, myZoom) {
    const curItem = mapList.find(item => item.get('id') === curMapId);
    const imgUrl = curItem ? curItem.get('backgroundImg') : '';
    return (
      <div
        className="o-map-container"
        ref={(mapContent) => {
          if (mapContent) {
            this.mapContent = mapContent;
            this.mapWidth = mapContent.offsetWidth;
            this.mapHeight = mapContent.offsetHeight;
          }
        }}
        style={{
          left: this.state.mapOffsetX,
          top: this.state.mapOffsetY,
          width: `${myZoom}%`,

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
          width={this.mapWidth}
          height={this.mapHeight}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        />
      </div>
    );
  }

  getPointList(from, to) {
    // console.log('from.x, to.x', from.x, to.x);
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
    const deltaAngle = -0.2; // 偏移0.2弧度
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
    var v0 = (p2 - p0) * 0.5;
    var v1 = (p3 - p1) * 0.5;
    return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
  }

  drawLinePath(context) {
    this.path = this.getPointList(map.pointToPixel(this.from.location), map.pointToPixel(this.to.location));
    const pointList = this.path;
    const len = pointList.length;
    context.save();
    context.beginPath();
    context.lineWidth = options.lineWidth;
    context.strokeStyle = options.colors[this.id];

    if (!options.lineType || options.lineType === 'solid') {
      context.moveTo(pointList[0][0], pointList[0][1]);
      for (let i = 0; i < len; i++) {
        context.lineTo(pointList[i][0], pointList[i][1]);
      }
    } else if (options.lineType === 'dashed' || options.lineType === 'dotted') {
      for (let i = 1; i < len; i += 2) {
        context.moveTo(pointList[i - 1][0], pointList[i - 1][1]);
        context.lineTo(pointList[i][0], pointList[i][1]);
      }
    }
    context.stroke();
    context.restore();
    this.step = 0; // 缩放地图时重新绘制动画
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
        <div className="m-action-bar">
          <FormGroup
            type="select"
            className="fl"
            label={__('Building')}
            options={this.state.buildingNameOptions.toJS()}
            value={this.state.buildId}
            onChange={data => this.onChangeBuilding(data.value)}
          />
          <FormGroup
            type="select"
            className="fl"
            label={__('Map')}
            options={this.state.layerMapOptions.toJS()}
            value={this.state.curMapId}
            onChange={data => this.onChangeMapId(data.value)}
          />
          <FormGroup
            type="select"
            className="fl"
            label={__('Client')}
            options={this.state.clientMacOptions.toJS()}
            value={this.state.macId}
            onChange={data => this.onChangeMac(data.value)}
          />
          <FormGroup
            type="date"
            className="fl"
            label={__('Date')}
            value={$$screenQuery.get('date')}
            onChange={(data) => {
              this.handleChangeQuery('date', data);
            }}
          />
          <FormGroup
            type="time"
            className="fl"
            label={__('Time from')}
            value={$$screenQuery.get('fromTime')}
            onChange={(data) => {
              this.handleChangeQuery('fromTime', data);
            }}
            showSecond={false}
          />

          <FormGroup
            type="time"
            className="fl"
            label={__('to')}
            value={$$screenQuery.get('toTime')}
            onChange={(data) => {
              this.handleChangeQuery('toTime', data);
            }}
            showSecond={false}
          />
        </div>
        <div className="o-map-warp">
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
    product: state.product,
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
