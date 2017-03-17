import React, { PropTypes } from 'react';
import utils, { immutableUtils, gps, dom } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import h337 from 'heatmap.js';
import AppScreen from 'shared/components/Template/AppScreen';
import {
  Button, Table, FormInput, Icon,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

import '../../shared/_map.scss';

// let heatmapInstance;

const listOptions = fromJS({
  settings: [],
  list: [
    {
      id: 'name',
      label: _('Name'),
      defaultValue: 'building',
      formProps: {
        type: 'switch',
        options: [
          {
            value: 'building',
            label: _('Building'),
          }, {
            value: 'ap',
            label: _('AP'),
          },
        ],
        display: 'inline',
      },
    }, {
      id: 'floorNumber',
      label: _('Floor Number'),
      formProps: {
        required: true,
        type: 'text',
        display: 'inline',
      },
    }, {
      id: 'address',
      label: _('Address'),
      formProps: {
        type: 'text',
        display: 'inline',
      },
    },
  ],
});

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
  console.log('totalValue', totalValue);
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
      zoom: 50,
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


  componentDidUpdate() {
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
      // 获得鼠标在canvas上的坐标位置
      const bb = canvas.getBoundingClientRect(); // 窗口位置
      x = e.clientX - bb.left;
      y = e.clientY - bb.top;

      // 在canvas上绘制圆形范围
      const context = blankCanvas.getContext('2d');
      context.clearRect(0, 0, bb.width, bb.height);
      context.beginPath();
      context.arc(x, y, mapRadius, 0, 2 * Math.PI);
      context.strokeStyle = '#00f';
      context.stroke();

      // 计算圆形范围内的value之和
      const observeValue = calcValueWithinCircle(this.datas, { x, y }, mapRadius);
      // this.setState({ observeValue }); // 不能在这里更新state
    });
  }

  // onDrop(ev, curMapId) {
  //   const mapOffset = dom.getAbsPoint(this.mapContent);
  //   const offsetX = (ev.clientX - mapOffset.x - 13);
  //   const offsetY = (ev.clientY - mapOffset.y - 13);
  //   const curOffset = {
  //     x: (offsetX * 100) / this.mapContent.offsetWidth,
  //     y: (offsetY * 100) / this.mapContent.offsetHeight,
  //   };
  //   const curMapItem = this.mapList.find(item => item.get('id') === curMapId);
  //   const gpsPoint = gps.getGpsPointFromOffset(curOffset, curMapItem);

  //   ev.preventDefault();

  //   this.props.updateCurEditListItem({
  //     map: { ...gpsPoint },
  //     mapId: curMapId,
  //     ...gpsPoint,
  //   }, true);

  //   this.savePlaceDevice('place');
  // }
  // onMapMouseUp() {
  //   this.mapMouseDown = false;
  // }
  // onMapMouseDown(e) {
  //   if (e.target.className.indexOf('o-map-container') !== -1) {
  //     this.mapMouseDown = true;
  //     this.mapClientX = e.clientX;
  //     this.mapClientY = e.clientY;
  //   }
  // }
  // onMapMouseMove(e) {
  //   if (this.mapMouseDown) {
  //     this.updateState({
  //       mapOffsetX: (this.state.mapOffsetX + e.clientX) - this.mapClientX,
  //       mapOffsetY: (this.state.mapOffsetY + e.clientY) - this.mapClientY,
  //     });
  //     this.mapClientX = e.clientX;
  //     this.mapClientY = e.clientY;
  //   }
  // }
  // startDrag(ev, i) {
  //   ev.dataTransfer.setData('Text', ev.target.id);
  //   this.props.editListItemByIndex(i, 'move');
  // }
  // savePlaceDevice(type) {
  //   this.props.changeScreenActionQuery({
  //     action: type,
  //   });

  //   if (this.actionable) {
  //     this.props.onListAction('', {
  //       needMerge: true,
  //     });
  //   }
  // }

  removeHeatMap() {
    const heatCanvas = document.querySelectorAll('.heatmap-canvas');
    const len = heatCanvas.length;
    let i = 0;

    for (i = 0; i < len; i++) {
      this.mapContent.removeChild(heatCanvas[i]);
    }
  }

  renderCurMap(list, curMapId, myZoom) {
    const curItem = list.find(item => item.get('id') === curMapId);
    const imgUrl = curItem ? curItem.get('backgroundImg') : '';
    return (
      <div
        className="o-map-container"
        // onDrop={e => this.onDrop(e, curMapId)}
        onDragOver={e => e.preventDefault()}
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
        // onMouseDown={this.onMapMouseDown}
        // onMouseUp={this.onMapMouseUp}
        // onMouseMove={this.onMapMouseMove}
      >
        <img src={imgUrl} className="auto" alt={curMapId} />
      </div>
    );
  }
  renderHeatMap() {
    // now generate some random data
    let max = 0;
    const curMapInfo = this.mapList.find(item => item.get('id') === this.state.curMapId);
    if (!curMapInfo) return null;
    const curScreenId = this.props.store.get('curScreenId');
    const points = this.props.store.getIn([curScreenId, 'data', 'list']);
    // 实际数据生成代码
    this.datas = points.toJS().map((point) => {
      const ret = gps.getOffsetFromGpsPoint(point, curMapInfo.toJS());
      const x = Math.floor((ret.x * this.mapWidth) / 100);
      const y = Math.floor((ret.y * this.mapHeight) / 100);
      max = max > point.value ? max : point.value;
      return { x, y, value: point.value };
    });

    // 模拟代码
    // let n = 200;
    // while (n--) {
    //   this.datas = this.datas.push({
    //     x: Math.floor(Math.random() * this.mapWidth),
    //     y: Math.floor(Math.random() * this.mapHeight),
    //     value: Math.floor(Math.random() * 20),
    //   });
    // }
    const data = {
      max,
      data: this.datas,
    };
    if (this.mapContent) {
      this.removeHeatMap();
      const heatmapInstance = h337.create({
        // only container is required, the rest will be defaults
        container: this.mapContent,
        radius: Math.floor((30 * this.state.zoom) / 100),
        maxOpacity: 0.3,
        minOpacity: 0,
        blur: 0.7,
      });
      heatmapInstance.setData(data);
    }

    this.renderBlankCanvas(this.mapContent);
  }

  renderBlankCanvas(parentNode) {
    const doc = window.document;
    // 找到已经存在的空画布并删除，放置多张画布存在
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
    const myZoom = this.state.zoom;
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    return (
      <AppScreen
        {...this.props}
      >
        <div className="m-action-bar">
          <span
            style={{
              marginRight: '10px',
            }}
          >
            {_('Building')}
          </span>
          <FormInput
            type="select"
            label={_('Building')}
            value={this.state.buildId}
            options={this.buildOptions ? this.buildOptions.toJS() : []}
            onChange={data => this.onChangeBuilding(data.value)}
          />
          <span
            style={{
              marginRight: '10px',
              marginLeft: '20px',
            }}
          >
            {_('Map Name')}
          </span>
          <FormInput
            type="select"
            label={_('Map Name')}
            value={this.state.curMapId}
            options={this.mapOptions ? this.mapOptions.toJS() : []}
            onChange={data => this.onChangeMapId(data.value)}
          />
          <span
            style={{
              marginRight: '10px',
              marginLeft: '20px',
            }}
          >
            {_('Time')}
          </span>
          <FormInput
            type="select"
            value={store.getIn([curScreenId, 'query', 'time'])}
          />
          <span
            style={{
              marginRight: '10px',
              marginLeft: '20px',
            }}
          >
            {_('Observe Radius')}
          </span>
          <FormInput
            type="select"
            value={this.state.observeRadius}
            options={[
              { value: 3, label: '3m' }, { value: 5, label: '5m' },
              { value: 10, label: '10m' }, { value: 15, label: '15m' },
            ]}
            onChange={(data) => { this.setState({ observeRadius: data.value }); }}
          />
        </div>
        <div style={{ position: 'relative' }}>
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
