import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS} from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import { FormGroup } from 'shared/components';
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
  curMapId: 1,
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
        console.log(clientMacOptions)
      });
  }
  componentDidMount() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const $$pathList = store.getIn([curScreenId, 'data', 'list']);
    const startX = store.getIn([curScreenId, 'data', 'list', 0, 'x']);
    const startY = store.getIn([curScreenId, 'data', 'list', 0, 'y']);
    this.updateCanvas(startX, startY, $$pathList);
  }

  componentDidUpdate() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const $$pathList = store.getIn([curScreenId, 'data', 'list']);
    const startX = store.getIn([curScreenId, 'data', 'list', 0, 'x']);
    const startY = store.getIn([curScreenId, 'data', 'list', 0, 'y']);
    this.updateCanvas(startX, startY, $$pathList);
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
  onSearch() {
    clearTimeout(this.querySaveTimeout);

    this.querySaveTimeout = setTimeout(() => {
      this.onFetchList();
    }, 200);
  }
  updateCanvas(startX, startY, $$pathList) {
    if (typeof $$pathList === 'undefined') { return null; }
    let ctx = this.canvasElem;
    // let backctx = this.canvasBackElem;
    if (!ctx) {
      return null;
    }
    ctx = this.canvasElem.getContext('2d');
    // backctx = this.canvasBackElem.getContext('2d');
    // 实现动画的关键
    // ctx.globalAlpha = 0.85;
    this.stationaryPoint(ctx, $$pathList);
    return this.oribitPath(ctx, startX, startY, $$pathList);
  }
  stationaryPoint(ctx, $$pathList) {
    const len = $$pathList.size;
    if (len === null) {
      return null;
    }
    $$pathList.forEach(
      ($$point) => {
        ctx.beginPath();
        ctx.arc($$point.get('x'), $$point.get('y'), 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
      },
    );
    ctx.fillStyle = 'red';
  }
  oribitPath(ctx, startX, startY, $$pathList) {
    const len = $$pathList.size;
    if (len === 1 || $$pathList === null) {
      return null;
    }
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    $$pathList.forEach(
      ($$point) => {
        ctx.lineTo($$point.get('x'), $$point.get('y'));
      },
    );
    ctx.strokeStyle = '#0093dd';
    return ctx.stroke();
  }
  handleChangeQuery(name, data) {
    this.props.changeScreenQuery({ [name]: data.value });
    this.onSearch();
  }
  renderCurMap(mapList, curMapId) {
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
          width: '100%',
          height: '700px',
          backgroundImage: `url(${imgUrl})`,
        }}
      >
        <canvas
          ref={(canvasElem) => {
            if (canvasElem && this.canvasElem !== canvasElem) {
              this.canvasElem = canvasElem;
            }
          }}
          width={1144}
          height={700}
        />
      </div>
    );
  }

  render() {
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
            label={_('Building')}
            value={this.state.buildId}
            options={this.state.buildingNameOptions.toJS()}
            onChange={data => this.onChangeBuilding(data.value)}
          />
          <FormGroup
            type="select"
            className="fl"
            label={_('Map')}
            value={this.state.curMapId}
            options={this.state.layerMapOptions.toJS()}
            onChange={data => this.onChangeMapId(data.value)}
          />
          <FormGroup
            type="select"
            className="fl"
            label={_('Client')}
            options={this.state.clientMacOptions.toJS()}
            value={$$screenQuery.get('mac')}
            onChange={(data) => {
              this.handleChangeQuery('mac', data);
            }}
          />
          <FormGroup
            type="date"
            className="fl"
            label={_('Date')}
            value={$$screenQuery.get('date')}
            onChange={(data) => {
              this.handleChangeQuery('date', data);
            }}
          />
          <FormGroup
            type="time"
            className="fl"
            label={_('Time from')}
            value={$$screenQuery.get('fromTime')}
            onChange={(data) => {
              this.handleChangeQuery('fromTime', data);
            }}
            showSecond={false}
          />

          <FormGroup
            type="time"
            className="fl"
            label={_('to')}
            value={$$screenQuery.get('toTime')}
            onChange={(data) => {
              this.handleChangeQuery('toTime', data);
            }}
            showSecond={false}
          />
        </div>
        <div
          className="o-map-warp"
          style={{
            top: '6rem',
          }}
        >
          {this.renderCurMap(this.state.mapList, this.state.curMapId)}
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
