import React from 'react';
import PropTypes from 'prop-types';
import utils, { gps } from 'shared/utils';
import moment from 'moment';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { FormGroup, Icon, Modal } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';
import validator from 'shared/validator';
import h337 from 'heatmap.js';

import './orbitTrace.scss';

// onChangeMapId和onChangeBuildId还有优化空间，这两个函数可以合并。目前这两个函数的问题是，两者存在联动，导致页面出现多次重绘的问题
// this.setState使用的太过于频繁，而且很分散，每次只能更新一个参数。可以将mapId和buildId一起更新，减少重绘次数。
// 更新state后的后续动作从这两个函数中脱离，放入componentDidUpdate中去（首次绘制不调用，注意可能出现的问题）

const propTypes = {
  save: PropTypes.func,
  store: PropTypes.object,
  changeScreenQuery: PropTypes.func,
  fetch: PropTypes.func,
  fetchScreenData: PropTypes.func,
  validateOption: PropTypes.object,
  validateAll: PropTypes.func,
  groupid: PropTypes.any,
};
const defaultProps = {};

const validOptions = Map({
  validText: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 64]',
  }),
  validMac: validator({
    rules: 'mac',
  }),
  validNum: validator({
    rules: 'num:[1, 1000]',
  }),
});

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.mapMouseDown = false;
    this.colorArr = ['rgba(255, 255, 255, 0)', 'rgba(93, 61, 72, .4)', 'rgba(171, 43, 87, .4)', 'rgba(245, 6, 88, .4)'];
    this.state = {
      pixelPos: fromJS([]),
      mapList: fromJS([]),
      editGpsPos: fromJS([]),
      posList: fromJS([]),
      clientPos: fromJS([]),
      zoom: 100,
      mapOffsetX: 0,
      mapOffsetY: 0,
      mapWidth: 1,
      mapHeight: 1,
      colorSwitch: false,
      showId: true,
      editable: false,
      showEditModal: false,
      onEditId: [0, 0],
    };
    utils.binds(this,
      [
        'onSave',
        'renderCurMap',
        'onChangeBuilding',
        'onChangeMapId',
        'onMapMouseUp',
        'onMapMouseDown',
        'onMapMouseMove',

        'chunkPosFromGeoToPixel',
        'drawGridByPixelPos',
        'markClientPosOnMap',
        'renderEditLayor',
        'requestChunkPosition',
        'getModalTitle',
        'renderHeatMap',
      ],
    );
  }
  componentWillMount() {
    this.preScreenId = this.props.store.get('curScreenId');
    this.props.fetch('goform/group/map/building', { groupid: this.props.groupid }).then((json) => {
      if (json.state && json.state.code === 2000) {
        this.buildOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('name'), value: item.get('id') }));
      }
      this.onChangeBuilding(this.buildOptions.getIn([0, 'value']));
    });
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

    /** *********hack: 暂时解决store中curScreenId更新不及时引起的bug********* */
    if (this.preScreenId !== curScreenId) {
      this.onChangeBuilding(this.buildOptions.getIn([0, 'value']));
      this.preScreenId = curScreenId;
    }
    /** *********************hack over************************************ */
    if (!this.mapMouseDown) {
      this.chunkPosFromGeoToPixel(); // 计算像素坐标点
      const ctx = this.canvasElem.getContext('2d');
      this.drawGridByPixelPos(ctx); // 画方格
      this.markClientPosOnMap(ctx);
      this.renderHeatMap();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearTimeout(this.getCurLocationTimeout);
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
    }).then(() => {
      this.requestChunkPosition();
    });
  }

  onChangeMac(value) {
    Promise.resolve().then(() => {
      this.props.changeScreenQuery(fromJS({ mac: value }));
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
    }
  }

  getNaturalWidthAndHeight(url) {
    const image = new Image();
    image.src = url;
    this.naturalWidth = image.width;
    this.naturalHeight = image.height;
  }

  getModalTitle() {
    const posList = this.state.posList;
    const onEditId = this.state.onEditId;
    if (typeof posList === 'undefined' || posList.isEmpty()) return null;
    return `${__('Edit')}: ${onEditId + 1}`;
  }

  requestChunkPosition() {
    const curScreenId = this.props.store.get('curScreenId');
    this.setState({ posList: fromJS([]) });

    this.props.fetch('goform/alarm_map_chunk_pos', {
      buildId: this.state.buildId,
      curMapId: this.state.curMapId,
      groupid: this.props.store.getIn([curScreenId, 'query', 'groupid']),
    }).then((json) => {
      if (json.state && json.state.code === 2000) {
        const posList = fromJS(json.data.list);
        this.setState({
          posList,
          editable: false,
        });
      }
    });
  }

  generateMacOptions() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const macList = store.getIn([curScreenId, 'data', 'macList']) || fromJS([]);
    return macList.toJS().map(mac => ({ value: mac, label: mac }));
  }

  // 将分块经纬度坐标转化为像素坐标,参数posList为immutable类型
  // mapList为当前建筑物下所有的地图信息
  // curMapId是当前地图id
  chunkPosFromGeoToPixel() {
    const posList = this.state.posList;
    const curMapId = this.state.curMapId;
    const mapList = this.mapList;
    // console.log('curMapId', curMapId);
    if (typeof posList === 'undefined' || typeof curMapId === 'undefined') return null;
    let storeArr = fromJS({}); // 避免重复计算，计算一个点后，将计算结果保存
    const curItem = mapList.find(item => item.get('id') === curMapId);
    const pixelPos = posList.map((item, index) => {
      const staLng = item.get('sta_lng');
      const staLat = item.get('sta_lat');
      const endLng = item.get('end_lng');
      const endLat = item.get('end_lat');
      const level = item.get('level');
      const { describe, id } = item.toJS();
      let startX; let startY; let endX; let endY;
      if (storeArr.get(staLng) && storeArr.get(staLat)) {
        startX = storeArr.get(staLng);
        startY = storeArr.get(staLat);
      } else {
        const startPoint = { lng: staLng, lat: staLat };
        const startRet = gps.getOffsetFromGpsPoint(startPoint, curItem.toJS());
        startX = Math.floor((startRet.x * this.state.mapWidth) / 100);
        startY = Math.floor((startRet.y * this.state.mapHeight) / 100);
        storeArr = storeArr.set(staLng, startX).set(staLat, startY);
      }
      if (storeArr.get(endLng) && storeArr.get(endLat)) {
        endX = storeArr.get(endLng);
        endY = storeArr.get(endLat);
      } else {
        const endPoint = { lng: endLng, lat: endLat };
        const endRet = gps.getOffsetFromGpsPoint(endPoint, curItem.toJS());
        endX = Math.floor((endRet.x * this.state.mapWidth) / 100);
        endY = Math.floor((endRet.y * this.state.mapHeight) / 100);
        storeArr = storeArr.set(endLng, endX).set(endLat, endY);
      }
      return fromJS({ startX, startY, endX, endY, level, id, describe, index });
    });
    this.setState({ pixelPos });

    return this;
  }

  // 利用转化后的坐标信息绘制网格线
  drawGridByPixelPos(ctx) {
    const pixelPos = this.state.pixelPos;
    if (typeof pixelPos === 'undefined' || pixelPos.isEmpty()) return null;
    const colorArr = this.colorArr;
    ctx.clearRect(0, 0, this.state.mapWidth, this.state.mapHeight);

    pixelPos.forEach((item, index) => {
      const { startX, startY, endX, endY, id, level } = item.toJS();
      // 绘制网格和网格着色
      ctx.beginPath(endX, startY);
      // ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(0, 0, 0, .2)';
      ctx.lineWidth = 0.5;
      // ctx.lineTo(endX, startY);

      ctx.moveTo(endX, startY);
      ctx.lineTo(endX, endY);
      // ctx.lineTo(startX, endY);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath(endX, startY);
      // ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(0, 0, 0, .2)';
      ctx.lineWidth = 0.5;
      // ctx.lineTo(endX, startY);

      // ctx.moveTo(endX, startY);
      ctx.moveTo(startX, endY);
      ctx.lineTo(endX, endY);
      ctx.closePath();
      ctx.stroke();

      if (this.state.colorSwitch) {
        const color = +level < colorArr.length ? colorArr[level] : colorArr[colorArr.length - 1];
        ctx.fillStyle = color;
        ctx.fill();
      }
      // 绘制文本，网格显示编号
      if (this.state.showId) {
        const font = Math.min(Math.round((endX - startX) / 6, Math.round(endY - startY) / 6));
        ctx.fillStyle = '#000';
        ctx.font = `300 ${font}px`;
        ctx.textAlign = 'left';
        ctx.fillText(
          id,
          (startX + (font / 2)),
          (startY + font),
          3.6 * font,
        );
      }
    });

    return ctx;
  }

  // 标记坐标点和显示告警动画
  markClientPosOnMap(ctx) {
    const pixelPos = this.state.pixelPos;
    const curScreenId = this.props.store.get('curScreenId');
    const $$areaList = this.props.store.getIn([curScreenId, 'data', 'list']);
    const curMapId = this.state.curMapId;
    const mapList = this.mapList;
    const curItem = mapList.find(item => item.get('id') === curMapId);

    if (typeof pixelPos === 'undefined' || pixelPos.isEmpty() || typeof curItem === 'undefined') {
      return null;
    }


    // 找出需要告警的区域
    let chunks = fromJS([]);

    chunks = $$areaList.filter(
      $$area => $$area.get('total') > $$area.get('gather_threshold'),
    ).map(($$area) => {
      const ret = pixelPos.find($$item => $$item.get('id') === $$area.get('id'));
      return ret;
    });

    // 告警动画
    let startOpacity = 0;
    let step = 0.2;
    const lineWidth = 4 * (this.state.zoom / 100);
    const alarmCtx = this.alarmCanvas.getContext('2d');
    const staPos = pixelPos.get(0).toJS();
    alarmCtx.clearRect(staPos.startX, staPos.startY, this.state.mapWidth, this.state.mapHeight);
    clearInterval(this.timeInterval);
    this.timeInterval = window.setInterval(() => {
      startOpacity += step;
      if (startOpacity <= 0) {
        startOpacity = 0;
        step = Math.abs(step);
      } else if (startOpacity >= 1) {
        startOpacity = 1;
        step = -Math.abs(step);
      }

      // console.log('startOpacity', startOpacity);
      alarmCtx.strokeStyle = `rgba(255, 0, 0, ${startOpacity})`;
      alarmCtx.lineWidth = lineWidth;
      chunks.forEach((chunk) => {
        const startX = chunk.get('startX');
        const startY = chunk.get('startY');
        const endX = chunk.get('endX');
        const endY = chunk.get('endY');
        alarmCtx.clearRect(startX, startY, endX - startX, endY - startY);
        alarmCtx.beginPath();
        alarmCtx.moveTo(startX + (lineWidth / 2), startY + (lineWidth / 2));
        alarmCtx.lineTo(endX - (lineWidth / 2), startY + (lineWidth / 2));
        alarmCtx.lineTo(endX - (lineWidth / 2), endY - (lineWidth / 2));
        alarmCtx.lineTo(startX + (lineWidth / 2), endY - (lineWidth / 2));
        alarmCtx.closePath();
        alarmCtx.stroke();
      });
    }, 100);

    return ctx;
  }

  renderEditLayor() {
    const editable = this.state.editable;
    const myZoom = this.state.zoom;
    const fontSize = Math.round((12 * this.state.zoom) / 100 );

    if (!editable) return null;
    return (
      <div
        ref={(editLayor) => {
          if (editLayor) {
            this.editLayor = editLayor;
          }
        }}
        className="o-map-control-panel"
        style={{
          left: this.state.mapOffsetX,
          top: this.state.mapOffsetY,
          width: `${((myZoom * this.naturalWidth) / 100)}px`,
          height: `${((myZoom * this.naturalHeight) / 100)}px`,
          position: 'absolute',
        }}
        onMouseDown={this.onMapMouseDown}
        onMouseUp={this.onMapMouseUp}
        onMouseMove={this.onMapMouseMove}
      >
        {
          (() => {
            // console.log('this.state.pixelPos', this.state.pixelPos);
            if (this.state.pixelPos.isEmpty()) return null;
            const pixelPos = this.state.pixelPos;
            // const that = this;
            const nodeList = pixelPos.map((item) => {
              const { startX, startY, endX, index, id } = item.toJS();
              return (
                <Icon
                  name="edit"
                  key={id}
                  id={index}
                  className="edit"
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: `${startY + 6}px`,
                    left: `${endX - (fontSize + 16)}px`,
                    background: '#333',
                    color: '#fff',
                    padding: '5px',
                    borderRadius: '30px',
                    fontSize: `${fontSize}px`,
                  }}
                  onClick={() => {
                    const editGpsPos = this.state.posList;
                    this.setState({
                      editGpsPos,
                      showEditModal: true,
                      onEditId: index,
                    });
                  }}
                />
              );
            });
            return nodeList.toJS();
          })()
        }
      </div>
    );
  }

  renderHeatMap() {
    const curScreenId = this.props.store.get('curScreenId');
    const points = this.props.store.getIn([curScreenId, 'data', 'heatList']);
    const curMapInfo = this.mapList.find(item => item.get('id') === this.state.curMapId);
    const { mapWidth, mapHeight } = this.state;
    let max = 0;

    // 移动图片时不重新计算绘图位置，因为坐标位置并没有改变
    if (this.mapMouseDown || !curMapInfo) {
      return null;
    }

    // 热力图数据生成代码
    this.datas = points.toJS().map((point) => {
      const ret = gps.getOffsetFromGpsPoint(point, curMapInfo.toJS());
      const x = Math.floor((ret.x * mapWidth) / 100);
      const y = Math.floor((ret.y * mapHeight) / 100);
      max = max > point.value ? max : point.value;
      return { x, y, value: point.value };
    });
    const data = {
      max: 80,
      data: this.datas,
    };
    if (this.mapContent) {
      if (!this.heatmapInstance) {
        this.heatmapInstance = h337.create({
          container: this.mapContent,
          radius: Math.floor((80 * this.state.zoom) / 100),
          maxOpacity: 0.2,
          minOpacity: 0.02,
          blur: 0.8,
          gradient: {
            '.3': 'blue',
            '.5': 'green',
            '.8': 'yellow',
            1: 'red',
          },
        });
      }

      this.heatmapInstance.setData(data);
    }

    return this.heatmapInstance;
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
        <canvas
          ref={(alarmCanvas) => {
            if (alarmCanvas && this.alarmCanvas !== alarmCanvas) {
              this.alarmCanvas = alarmCanvas;
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

    if (!this.mapList) return null;

    return (
      <AppScreen
        {...this.props}
        initOption={{
          isFetchInfinite: true,
          fetchIntervalTime: 2000,
          query: {
            startDate: moment().format('YYYY-MM-DD'),
            endDate: moment().format('YYYY-MM-DD'),
            startTime: moment().subtract(1, 'm').format('HH:mm:ss'),
            endTime: moment().add(1, 'm').format('HH:mm:ss'),
            mapType: 'number',
          },
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
          {
            /** ***************************************************
             <FormGroup
              type="select"
              className="fl"
              label={__('Client')}
              options={this.generateMacOptions()}
              value={store.getIn([curScreenId, 'query', 'mac'])}
              onChange={data => this.onChangeMac(data.value)}
              searchable
            />
             ***************************************************** */
          }
          <FormGroup
            type="checkbox"
            className="fl"
            label={__('Show ID')}
            checked={this.state.showId}
            onChange={(data) => {
              this.setState({
                showId: data.value === '1',
              });
            }}
          />
          <FormGroup
            type="checkbox"
            className="fl"
            label={__('Priority Editable')}
            checked={this.state.editable}
            onChange={(data) => {
              this.setState({
                editable: data.value === '1',
              });
            }}
          />
        </div>
        <div
          className="o-map-warp"
          style={{
            top: '2.4rem',
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
          {this.renderEditLayor()}
        </div>
        <Modal
          draggable
          isShow={this.state.showEditModal}
          title={this.getModalTitle()}
          onClose={() => {
            this.setState({
              editGpsPos: fromJS([]),
              showEditModal: false,
            });
          }}
          onOk={() => {
            this.props.validateAll('modalsettings').then((msg) => {
              if (msg.isEmpty()) {
                const curScreenId = this.props.store.get('curScreenId');
                this.props.save('goform/change_priority_settings', {
                  list: this.state.editGpsPos.toJS(),
                  buildId: this.state.buildId,
                  curMapId: this.state.curMapId,
                  groupid: this.props.store.getIn([curScreenId, 'query', 'groupid']),
                }).then((json) => {
                  if (json.state && json.state.code === 2000) {
                    this.setState({
                      editGpsPos: fromJS([]),
                      showEditModal: false,
                    });
                  }
                }).then(() => {
                  this.props.fetch('goform/alarm_map_chunk_pos', {
                    buildId: this.state.buildId,
                    curMapId: this.state.curMapId,
                    groupid: this.props.store.getIn([curScreenId, 'query', 'groupid']),
                  }).then((json) => {
                    if (json.state && json.state.code === 2000) {
                      const posList = fromJS(json.data.list);
                      this.setState({ posList });
                    }
                  });
                });
              }
            });
          }}
        >
          <FormGroup
            type="number"
            label={__('Gather Threshold')}
            form="modalsettings"
            value={this.state.editGpsPos.getIn([this.state.onEditId, 'gather_threshold'])}
            help={`${__('Range: ')}1 ~ 4000`}
            min="1"
            max="4000"
            onChange={(data) => {
              let editGpsPos = this.state.editGpsPos;
              const onEditId = this.state.onEditId;
              editGpsPos = editGpsPos.setIn([onEditId, 'gather_threshold'], data.value);
              this.setState({ editGpsPos });
            }}
          />
          <FormGroup
            type="textarea"
            label={__('Description')}
            form="modalsettings"
            value={this.state.editGpsPos.getIn([this.state.onEditId, 'describe'])}
            onChange={(data) => {
              let editGpsPos = this.state.editGpsPos;
              const onEditId = this.state.onEditId;
              editGpsPos = editGpsPos.setIn([onEditId, 'describe'], data.value);
              this.setState({ editGpsPos });
            }}
          />
        </Modal>
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
  validator.mergeProps(validOptions),
)(View);
