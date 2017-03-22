import React, { PropTypes } from 'react';
import utils, { gps } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS} from 'immutable';
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
    this.updateCanvas(startX, startY, $$pathList, curMapId);
  }

  componentDidUpdate() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const curMapId = store.getIn([curScreenId, 'query', 'curMapId']);
    const $$pathList = store.getIn([curScreenId, 'data', 'list']);
    const startX = store.getIn([curScreenId, 'data', 'list', 0, 'x']);
    const startY = store.getIn([curScreenId, 'data', 'list', 0, 'y']);
    this.updateCanvas(startX, startY, $$pathList, curMapId);
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
    // console.log('curMapId', curMapId)
    // const curItem = mapList.find(item => item.get('id') === curMapId);
    // 经纬度转换为画布上的像素
    // console.log('curItem', curItem)
    // const pathListPixel = $$pathList.toJS().map(($$point) => {
    //   const ret = gps.getOffsetFromGpsPoint($$point, curItem.toJS());
    //   const x = Math.floor((ret.x * this.mapWidth) / 100);
    //   const y = Math.floor((ret.y * this.mapHeight) / 100);
    //   return { x, y };
    // });
    // console.log('pathListPixel', pathListPixel);
    this.stationaryPoint(ctx, $$pathList);
    this.oribitPath(ctx, startX, startY, $$pathList);
  }

  stationaryPoint(ctx, $$pathList) {
    const len = $$pathList.size;
    if (len === null) {
      return null;
    }
    $$pathList.forEach(
      ($$point) => {
        // 默认值为source-over
        const prev = ctx.globalCompositeOperation;
        //  只显示canvas上原图像的重叠部分
        ctx.globalCompositeOperation = 'destination-in';
        //  设置主canvas的绘制透明度
        ctx.globalAlpha = 0.9;
        //  这一步目的是将canvas上的图像变的透明
        ctx.fillRect(0, 0, 1144, 700);
        //  在原图像上重叠新图像
        ctx.globalCompositeOperation = prev;
        //  在主canvas上画新圆
        ctx.save();
        ctx.beginPath();
        ctx.arc($$point.get('x'), $$point.get('y'), 4, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = 'red';
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
          width={1144}
          height={700}
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
          {this.renderCurMap(this.state.mapList, this.state.curMapId, this.state.zoom)}
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
