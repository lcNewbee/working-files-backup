import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils, gps, dom } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import h337 from 'heatmap.js';
import moment from 'moment';

import {
  FormInput, Icon, FormGroup,
} from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';

import '../../shared/_map.scss';

// 优化点：图片拖动时，canvas图一直在不断的重绘，计算量大，导致拖动时明显卡顿
// 可以监听鼠标按下和移动事件，在拖动的过程中不重绘，而在鼠标停止拖动时重绘，参考轨迹图做法

function calcValueWithinCircle(dataList, centerPoint, radius) {
  let totalValue = 0;
  dataList.forEach((item) => {
    const x = item.x;
    const y = item.y;
    const ox = centerPoint.x;
    const oy = centerPoint.y;
    if (radius > Math.sqrt(((x - ox) * (x - ox)) + ((y - oy) * (y - oy)))) {
      totalValue += item.value;
    }
  });
  return totalValue;
}

const propTypes = {
  store: PropTypes.instanceOf(Map),
  changeScreenQuery: PropTypes.func,
  fetch: PropTypes.func,
  fetchScreenData: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);
    this.markers = [];
    this.mapList = [];
    this.state = {
      mapOffsetX: 0,
      mapOffsetY: 0,
      curMapId: '',
      zoom: 100,
      observeRadius: 5,
      observeValue: 0,
    };
    this.datas = fromJS([]);
    this.totalValue = 0;
    utils.binds(this,
      [
        'onSave',
        'onDrop',
        'renderUndeployDevice',
        'onMapMouseUp',
        'onMapMouseDown',
        'onMapMouseMove',
        'renderMapList',
        'removeHeatMap',
        'renderCurMap',
        'updateState',
        'renderHeatMap',
        'savePlaceDevice',
        'renderBulidList',
        'renderBulidMapList',
        'onViewBuild',
        'onChangeBuilding',
        'onChangeMapId',
        'renderBackgroundImg',
        'bindCanvasEvent',
        'renderBlankCanvas',
        'removeShowerDiv',
      ],
    );
  }

  componentWillMount() {
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    if (store.getIn([curScreenId, 'data']) !== nextProps.store.getIn([curScreenId, 'data'])) {
      return true;
    }
    if (!fromJS(this.state).equals(fromJS(nextState))) {
      return true;
    }
    if (store.getIn([curScreenId, 'query']) !== nextProps.store.getIn([curScreenId, 'query'])) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    this.removeShowerDiv();
    Promise.resolve().then(() => {
      this.renderHeatMap();
    }).then(() => {
      this.bindCanvasEvent();
    });
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

  removeShowerDiv() {
    const showers = document.querySelectorAll('.observeShower');
    const len = showers.length;
    for (let i = len; i;) {
      this.mapContent.removeChild(showers[--i]);
    }
  }

  bindCanvasEvent() {
    const doc = window.document;
    const canvas = doc.querySelectorAll('.heatmap-canvas')[0];
    const blankCanvas = doc.querySelectorAll('.blankCanvas')[0];
    const radius = this.state.observeRadius; // 实际的圈定半径
    // const context = canvas.getContext('2d');
    if (!canvas) return null;

    // 将实际的圈定半径转化为图形上的像素半径
    const mapId = this.state.curMapId;
    const buildingWidth = this.mapList.find(item => item.get('id') === mapId).get('length');
    const mapPxWidth = canvas.offsetWidth;
    const mapRadius = Math.floor(radius * (mapPxWidth / buildingWidth));

    let x = 0;
    let y = 0;
    blankCanvas.addEventListener('click', (e) => {
      // 删除之前绘制的提示框
      this.removeShowerDiv();
      // 获得鼠标在canvas上的坐标位置
      const bb = canvas.getBoundingClientRect(); // 窗口位置
      x = e.clientX - bb.left;
      y = e.clientY - bb.top;

      // 在canvas上绘制圆形范围
      const context = blankCanvas.getContext('2d');
      // this.mapContent.removeChild(doc.querySelectorAll('.observeShower')[0]);
      context.clearRect(0, 0, bb.width, bb.height);
      context.beginPath();
      context.arc(x, y, mapRadius, 0, 2 * Math.PI);
      context.strokeStyle = '#00f';
      context.stroke();

      // 计算圆形范围内的value之和
      const observeValue = calcValueWithinCircle(this.datas, { x, y }, mapRadius);
      // this.setState({ observeValue }); // 不能在这里更新state，会导致重绘，无法显示结果。

      // 显示计算的结果
      const showDiv = doc.createElement('div');
      const yPosition = (y - mapRadius - 50) < 0 ? (y + mapRadius) : (y - mapRadius - 50);
      const curScreenId = this.props.store.get('curScreenId');
      const mapType = this.props.store.getIn([curScreenId, 'query', 'mapType']);
      showDiv.className = 'observeShower';
      showDiv.style.width = '150px';
      showDiv.style.height = '50px';
      showDiv.style.backgroundColor = '#62b7ed';
      showDiv.style.color = '#000';
      showDiv.style.fontSize = '15px';
      showDiv.style.fontWeight = 'bold';
      showDiv.style.textAlign = 'center';
      showDiv.style.lineHeight = '50px';
      showDiv.style.boxShadow = '5px 5px 5px #888888';
      showDiv.style.borderRadius = '5px';
      showDiv.style.top = `${yPosition}px`;
      showDiv.style.left = `${x + mapRadius}px`;
      showDiv.style.position = 'absolute';
      showDiv.innerHTML = mapType === 'number' ? `${__('Total User')}: ${observeValue}` : `${__('Total Times')}: ${observeValue}`;
      this.mapContent.appendChild(showDiv);
    });
  }

  removeHeatMap() {
    const heatCanvas = document.querySelectorAll('.heatmap-canvas');
    const len = heatCanvas.length;
    let i = 0;

    for (i = 0; i < len; i++) {
      this.mapContent.removeChild(heatCanvas[i]);
    }
  }

  getNaturalWidthAndHeight(url) {
    const image = new Image();
    image.src = url;
    this.naturalWidth = image.width;
    this.naturalHeight = image.height;
  }

  renderCurMap(list, curMapId, myZoom) {
    console.log('renderCurMap');
    const curItem = list.find(item => item.get('id') === curMapId);
    const imgUrl = curItem ? curItem.get('backgroundImg') : '';
    this.getNaturalWidthAndHeight(imgUrl);
    return (
      <div
        className="o-map-container"
        // onDrop={e => this.onDrop(e, curMapId)}
        // onDragOver={e => e.preventDefault()}
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
          width: `${((myZoom * this.naturalWidth) / 100)}px`,
          height: `${((myZoom * this.naturalHeight) / 100)}px`,
        }}
        onMouseDown={this.onMapMouseDown}
        onMouseUp={this.onMapMouseUp}
        onMouseMove={this.onMapMouseMove}
      >
        <img src={imgUrl} className="auto" alt={curMapId} />
      </div>
    );
  }
  renderHeatMap() {
    if (this.mapMouseDown) return null; // 移动图片时不重新计算绘图位置，因为坐标位置并没有改变
    let max = 0;
    const curMapInfo = this.mapList.find(item => item.get('id') === this.state.curMapId);
    if (!curMapInfo) return null;
    const curScreenId = this.props.store.get('curScreenId');
    const points = this.props.store.getIn([curScreenId, 'data', 'list']);
    // 热力图数据生成代码
    this.datas = points.toJS().map((point) => {
      // console.log('renderHeatMap');
      const ret = gps.getOffsetFromGpsPoint(point, curMapInfo.toJS());
      const x = Math.floor((ret.x * this.mapWidth) / 100);
      const y = Math.floor((ret.y * this.mapHeight) / 100);
      max = max > point.value ? max : point.value;
      return { x, y, value: point.value };
    });
    const data = {
      max,
      data: this.datas,
    };
    if (this.mapContent) {
      this.removeHeatMap();
      const heatmapInstance = h337.create({
        container: this.mapContent,
        radius: Math.floor((25 * this.state.zoom) / 100),
        maxOpacity: 0.3,
        minOpacity: 0,
        blur: 0.7,
      });
      heatmapInstance.setData(data);
    }
    // 一个画布，用来绘制可擦除的圆形观察范围，因为热力图不能擦除，故不能在热力图上绘制
    this.renderBlankCanvas(this.mapContent);
  }

  renderBlankCanvas(parentNode) {
    const doc = window.document;
    // 找到已经存在的空画布并删除，防止多张画布存在
    const blankCanvas = parentNode.querySelectorAll('.blankCanvas');
    const len = blankCanvas.length;
    for (let i = 0; i < len; i++) {
      parentNode.removeChild(blankCanvas[i]);
    }
    // 重新绘制空画布
    const canvas = doc.createElement('canvas');
    canvas.className = 'blankCanvas';
    canvas.width = this.mapWidth;
    canvas.height = this.mapHeight;
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.position = 'absolute';
    parentNode.appendChild(canvas);
  }

  render() {
    console.log('rendering');
    const myZoom = this.state.zoom;
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    return (
      <AppScreen
        {...this.props}
        initOption={{
          query: {
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            startTime: '00:00:00',
            endTime: '23:59:59',
            mapType: 'number',
          },
        }}
      >
        <div className="o-form o-form--flow">
          <FormGroup
            type="select"
            label={__('Building')}
            value={this.state.buildId}
            options={this.buildOptions ? this.buildOptions.toJS() : []}
            onChange={data => this.onChangeBuilding(data.value)}
          />
          <FormGroup
            type="select"
            label={__('Map Name')}
            value={this.state.curMapId}
            options={this.mapOptions ? this.mapOptions.toJS() : []}
            onChange={data => this.onChangeMapId(data.value)}
          />
          <FormGroup
            type="select"
            label={__('Observe Radius')}
            value={this.state.observeRadius}
            options={[
              { value: 3, label: '3m' }, { value: 5, label: '5m' },
              { value: 10, label: '10m' }, { value: 15, label: '15m' },
            ]}
            onChange={(data) => { this.setState({ observeRadius: data.value }); }}
          />
          <FormGroup
            label={__('Start Date')}
          >
            <FormInput
              type="date"
              value={store.getIn([curScreenId, 'query', 'startDate'])}
              onChange={(data) => {
                Promise.resolve().then(() => {
                  const now = moment().format('YYYY-MM-DD');
                  let endDate = store.getIn([curScreenId, 'query', 'endDate']) || now;
                  const startDate = data.value;
                  const diff = moment(endDate).isBefore(startDate);
                  endDate = diff ? data.value : endDate;
                  this.props.changeScreenQuery({ startDate, endDate });
                }).then(() => {
                  this.props.fetchScreenData();
                });
              }}
              isOutsideRange={() => false}
            />
            <FormInput
              type="time"
              value={store.getIn([curScreenId, 'query', 'startTime'])}
              onChange={(data) => {
                Promise.resolve().then(() => {
                  this.props.changeScreenQuery({ startTime: data.value });
                }).then(() => {
                  this.props.fetchScreenData();
                });
              }}
              style={{
                marginLeft: '5px',
                verticalAlign: 'middle',
              }}
            />
          </FormGroup>
          <FormGroup
            label={__('End Date')}
          >
            <FormInput
              type="date"
              value={store.getIn([curScreenId, 'query', 'endDate'])}
              onChange={(data) => {
                Promise.resolve().then(() => {
                  const now = moment().format('YYYY-MM-DD');
                  let startDate = store.getIn([curScreenId, 'query', 'endDate']) || now;
                  const endDate = data.value;
                  const diff = moment(endDate).isBefore(startDate);
                  startDate = diff ? data.value : startDate;
                  this.props.changeScreenQuery({ startDate, endDate });
                }).then(() => {
                  this.props.fetchScreenData();
                });
              }}
              isOutsideRange={() => false}
            />
            <FormInput
              type="time"
              value={store.getIn([curScreenId, 'query', 'endTime'])}
              onChange={(data) => {
                Promise.resolve().then(() => {
                  this.props.changeScreenQuery({ endTime: data.value });
                }).then(() => {
                  this.props.fetchScreenData();
                });
              }}
              style={{
                marginLeft: '5px',
                verticalAlign: 'middle',
              }}
            />
          </FormGroup>

          <FormGroup
            type="switch"
            value={store.getIn([curScreenId, 'query', 'mapType'])}
            label={__('Map Type')}
            options={[
              { label: __('User Number'), value: 'number' },
              { label: __('User Times'), value: 'times' },
            ]}
            onChange={(data) => {
              this.props.changeScreenQuery({ mapType: data.value });
              this.props.fetchScreenData();
            }}
          />
        </div>
        <div
          style={{
            position: 'relative',
            border: '1px solid #CCC',
            overflow: 'hidden',
            minHeight: '500px',
            marginTop: '5px',
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
