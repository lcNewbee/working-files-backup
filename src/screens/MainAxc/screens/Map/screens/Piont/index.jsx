import React from 'react'; import PropTypes from 'prop-types';
import utils, { gps } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { FormGroup, Icon, Button } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import validator from 'shared/validator';
import '../AlarmMap/orbitTrace.scss';

const propTypes = {
  store: PropTypes.object,
  $$screenStore: PropTypes.instanceOf(Map),
  changeScreenQuery: PropTypes.func,
  fetch: PropTypes.func,
  fetchScreenData: PropTypes.func,
  save: PropTypes.func,
};
const defaultProps = {};
const defaultQuery = {
  buildId: '',
  curMapId: '',
  mac: '',
};
const $$emptyList = fromJS([]);

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
      pixelPos: $$emptyList,
      mapList: $$emptyList,
      editGpsPos: $$emptyList,
      posList: $$emptyList,
      clientPos: $$emptyList,
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
        'onChangeMac',
        'onMapMouseUp',
        'onMapMouseDown',
        'onMapMouseMove',

        'chunkPosFromGeoToPixel',
        'drawGridByPixelPos',
        'markClientPosOnMap',
        'renderEditLayor',
        'requestChunkPosition',
        'getModalTitle',
        'renderClientPosIcon',
        'getCurLocation',
        'onAddClientPos',
        'onClearPoint',
        'onStopPoint',
      ],
    );
    this.$$dubiousOptions = $$emptyList;
    this.mapOptions = $$emptyList;
    this.buildOptions = $$emptyList;
  }
  componentWillMount() {
    const { $$screenStore } = this.props;
    this.preScreenId = this.props.store.get('curScreenId');

    // 获取建筑列表
    this.props.fetch('goform/group/map/building').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.buildOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('name'), value: item.get('id') }));
      }
      this.onChangeBuilding(this.buildOptions.getIn([0, 'value']));
    });

    // 获取可疑人员列表
    this.props.fetch('/goform/group/map/dubious', $$screenStore.get('query').toJS())
      .then((json) => {
        if (json.state && json.state.code === 2000) {
          this.$$dubiousOptions = fromJS(json.data.list).map(
            item => fromJS({
              label: `${item.get('mac')} (${item.get('description')})`,
              value: item.get('mac'),
            }),
          );
        }
        this.onChangeMac(this.$$dubiousOptions.getIn([0, 'value']));
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

    /** *********************hack over*************************************/
    if (!this.mapMouseDown) {
      this.chunkPosFromGeoToPixel(); // 计算像素坐标点
      const ctx = this.canvasElem.getContext('2d');
      this.drawGridByPixelPos(ctx); // 画方格
      this.markClientPosOnMap(ctx);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearTimeout(this.getCurLocationTimeout);
  }
  onAddClientPos(ev) {
    const mapOffset = utils.dom.getAbsPoint(this.mapContent);
    const offsetX = ev.clientX - mapOffset.x;
    const offsetY = ev.clientY - mapOffset.y;
    const curOffset = {
      x: (offsetX * 100) / this.mapContent.offsetWidth,
      y: (offsetY * 100) / this.mapContent.offsetHeight,
    };
    const curMapId = this.state.curMapId;
    const $$mapList = this.mapList;
    const curItem = $$mapList.find(item => item.get('id') === curMapId).toJS();
    const gpsPoint = gps.getGpsPointFromOffset(curOffset, curItem);

    ev.preventDefault();
    clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
      this.props.save('goform/group/map/point', {
        action: 'add',
        mac: this.state.curDubiouMac,
        lng: gpsPoint.lng,
        lat: gpsPoint.lat,
      }).then(() => {
        this.props.fetchScreenData();
      });
    }, 100);
  }
  onClearPoint() {
    clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
      this.props.save('goform/group/map/point', {
        action: 'clear',
        mac: this.state.curDubiouMac,
      }).then(() => {
        this.props.fetchScreenData();
      });
    }, 100);
  }
  onStopPoint() {
    clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
      this.props.save('goform/group/map/point', {
        action: 'stop',
        mac: this.state.curDubiouMac,
      }).then(() => {
        this.props.fetchScreenData();
      });
    }, 100);
  }
  onChangeBuilding(id) {
    Promise.resolve().then(() => {
      this.props.changeScreenQuery(fromJS({ buildId: id }));
      this.setState({ buildId: id });
    }).then(
      () => {
        this.props.fetch('goform/group/map/list', { buildId: id })
          .then((json) => {
            if (json.state && json.state.code === 2000) {
              this.mapOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('mapName'), value: item.get('id') }));
              this.mapList = fromJS(json.data.list);
            }
          }).then(() => {
            this.onChangeMapId(this.mapOptions.getIn([0, 'value']));
          });
      },
    );
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

  /**
   *
   *
   * @param {string} value MAC地址
   * @param {bool} noFetch 不需要更新数据
   * @memberof View
   */
  onChangeMac(value, noFetch) {
    Promise.resolve().then(() => {
      this.props.changeScreenQuery(fromJS({ mac: value }));
      this.setState({
        curDubiouMac: value,
      });
    }).then(() => {
      if (!noFetch) {
        this.props.fetchScreenData();
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
  generateMacOptions() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const macList = store.getIn([curScreenId, 'data', 'macList']) || $$emptyList;
    return macList.toJS().map(mac => ({ value: mac, label: mac }));
  }

  // 标记坐标点和显示告警动画
  markClientPosOnMap() {
    const pixelPos = this.state.pixelPos;
    const curScreenId = this.props.store.get('curScreenId');
    const clientList = this.props.store.getIn([curScreenId, 'data', 'list']);
    const curMapId = this.state.curMapId;
    const mapList = this.mapList;
    const curItem = mapList.find(item => item.get('id') === curMapId);
    if (typeof pixelPos === 'undefined' || pixelPos.isEmpty()) return null;
    if (typeof curItem === 'undefined') return null;
    // 计算像素坐标点
    const clientPos = clientList.map((item) => {
      const ret = gps.getOffsetFromGpsPoint(item.toJS(), curItem.toJS());
      const x = Math.floor((ret.x * this.state.mapWidth) / 100);
      const y = Math.floor((ret.y * this.state.mapHeight) / 100);
      return fromJS({ x, y, mac: item.get('mac') });
    });
    this.setState({ clientPos });

    // 找出需要告警的区域
    let chunks = $$emptyList;
    clientPos.forEach((item) => {
      const posX = item.get('x');
      const posY = item.get('y');
      const area = pixelPos.find((chunk) => {
        const { endX, startX, endY, startY, level } = chunk.toJS();
        return (posX >= startX && posX < endX && posY >= startY && posY < endY && level !== '0');
      });
      if (typeof area !== 'undefined' && !chunks.includes(area)) chunks = chunks.push(area);
    });
    // 告警动画
    const alarmCtx = this.alarmCanvas.getContext('2d');
    const staPos = pixelPos.get(0).toJS();
    alarmCtx.clearRect(staPos.startX, staPos.startY, this.state.mapWidth, this.state.mapHeight);

    return alarmCtx;
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

    return pixelPos;
  }

  // 利用转化后的坐标信息绘制网格线
  drawGridByPixelPos(ctx) {
    const pixelPos = this.state.pixelPos;
    if (typeof pixelPos === 'undefined' || pixelPos.isEmpty()) return null;
    const colorArr = this.colorArr;
    ctx.clearRect(0, 0, this.state.mapWidth, this.state.mapHeight);
    pixelPos.forEach((item) => {
      const { startX, startY, endX, endY, id, level } = item.toJS();
      // 绘制网格和网格着色
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.strokeStyle = 'rgba(230, 6, 6, .65)';
      ctx.lineWidth = 1;
      ctx.lineTo(endX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineTo(startX, endY);
      ctx.closePath();
      ctx.stroke();
      if (this.state.colorSwitch) {
        const color = +level < colorArr.length ? colorArr[level] : colorArr[colorArr.length - 1];
        ctx.fillStyle = color;
        ctx.fill();
      }
      // 绘制文本，网格显示编号
      if (this.state.showId) {
        const font = Math.min(Math.round((endX - startX) / 5, Math.round(endY - startY) / 5));
        ctx.fillStyle = 'blue';
        ctx.font = `bold ${font}px Courier New`;
        ctx.fillText(id, ((startX + endX) / 2) - Math.round(font / 2),
                    ((startY + endY) / 2) + Math.round(font / 2));
      }
    });

    return pixelPos;
  }

  requestChunkPosition() {
    const curScreenId = this.props.store.get('curScreenId');
    this.setState({ posList: $$emptyList });
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
  renderEditLayor() {
    const editable = this.state.editable;
    const myZoom = this.state.zoom;
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
              const { startX, startY, index, id } = item.toJS();
              return (
                <Icon
                  name="edit"
                  key={id}
                  id={index}
                  className="edit"
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: `${startY + 2}px`,
                    left: `${startX + 4}px`,
                    background: '#333',
                    color: '#fff',
                    padding: '5px',
                    borderRadius: '30px',
                    fontSize: `${Math.round((16 * this.state.zoom) / 100)}px`,
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

  renderClientPosIcon() {
    const myZoom = this.state.zoom;
    const fontsize = Math.round((24 * this.state.zoom) / 100);

    return (
      <div
        className="o-map-container"
        style={{
          left: this.state.mapOffsetX,
          top: this.state.mapOffsetY,
          width: `${((myZoom * this.naturalWidth) / 100)}px`,
          height: `${((myZoom * this.naturalHeight) / 100)}px`,
          position: 'absolute',
          overflow: 'hidden',
        }}
        onMouseDown={this.onMapMouseDown}
        onMouseUp={this.onMapMouseUp}
        onMouseMove={this.onMapMouseMove}
        onClick={this.onAddClientPos}
      >
        {
          this.state.clientPos.isEmpty() ? null : (
            this.state.clientPos.map(item => (
              <Icon
                name="map-pin"
                className="client"
                key={item.get('id')}
                style={{
                  position: 'absolute',
                  color: '#0093DD',
                  cursor: 'pointer',
                  top: `${item.get('y') - fontsize}px`,
                  left: `${item.get('x') - (Math.round((14.3 * this.state.zoom) / 100) / 2)}px`,
                  fontSize: `${fontsize}px`,
                }}
                title={item.get('mac')}
              />
            ))
          )
        }
      </div>
    );
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
          isFetchInfinite: false,
          fetchIntervalTime: 2000,
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
            type="text"
            className="fl"
            label={__('可疑客户端')}
            options={this.$$dubiousOptions.toJS()}
            value={this.state.curDubiouMac}
            onChange={(data) => {
              this.onChangeMac(data.value, true);
            }}
          />
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
          <Button
            text={__('停止')}
            theme="primary"
            onClick={this.onStopPoint}
            style={{
              marginRight: '16px',
            }}
          />

          <Button
            text={__('清除')}
            theme="warning"
            onClick={this.onClearPoint}
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
          {this.renderClientPosIcon()}
          {this.renderEditLayor()}
        </div>
      </AppScreen>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;

function mapStateToProps(state) {
  const $$screens = state.screens;
  const curScreenId = $$screens.get('curScreenId');

  return {
    app: state.app,
    store: state.screens,
    $$screenStore: $$screens.get(curScreenId),
    groupid: state.product.getIn(['group', 'selected', 'id']),
    // isShowPanel: state.properties.get('isShowPanel'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(View);
