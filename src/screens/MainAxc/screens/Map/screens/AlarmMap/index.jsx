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
    this.preScreenId = this.props.store.get('curScreenId');
    this.props.fetch('goform/group/map/building').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.buildOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('name'), value: item.get('id') }));
      }
      this.onChangeBuilding(this.buildOptions.getIn([0, 'value']));
    });
  }

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
      this.onChangeBuilding(this.buildOptions.getIn([0, 'value']));
      this.preScreenId = curScreenId;
    }
    /** *********************hack over*************************************/
  }

  componentWillUnmount() {
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
      if (this.posXBeforeMove !== this.state.mapOffsetX ||
          this.posYBeforeMove !== this.state.mapOffsetY) {
        this.clearTimeout();
      }
    }
  }
  getNaturalWidthAndHeight(url) {
    const image = new Image();
    image.src = url;
    this.naturalWidth = image.width;
    this.naturalHeight = image.height;
  }

  clearTimeout() {
    let timeoutLen = this.timeoutVal.length;
    // if (timeoutLen === 0) return;
    while (timeoutLen) {
      clearTimeout(this.timeoutVal[--timeoutLen]);
    }
    this.timeoutVal = [];
    // clearTimeout(this.timeout);
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
