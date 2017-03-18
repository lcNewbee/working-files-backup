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
import bgImg from '../../shared/images/map_bg.jpg';


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
      date: moment().format('YYYY-MM-DD'),
      fromTime: '08:00:11',
      toTime: '20:00:11',
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
        });
      });
  }
  componentDidMount() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const data = store.getIn([curScreenId, 'data', 'settings', 'path']);
    this.updateCanvas(data);
  }

  componentDidUpdate() {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
    const data = store.getIn([curScreenId, 'data', 'settings', 'path']);
    this.updateCanvas(data);
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
  updateCanvas(data) {
    if (typeof (data) === 'undefined') { return null; }
    console.log('data', data);
    let ctx = this.canvasElem;
    if (!ctx) {
      return null;
    }
    ctx = this.canvasElem.getContext('2d');
    // ctx.strokeStyle = '#0093dd';
    // ctx.lineWidth = '3';
    // ctx.moveTo(300, 150);
    // ctx.quadraticCurveTo(200, 250, 100, 150);
    // ctx.quadraticCurveTo(230, 200, 150, 450);
    // ctx.quadraticCurveTo(300, 400, 450, 400);
    // ctx.quadraticCurveTo(700, 300, 700, 200);
    // ctx.stroke();

    // 原点加直线
    // ctx.fillStyle = 'red';
    // ctx.beginPath();
    // ctx.arc(330, 150, 5, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.arc(100, 150, 5, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.arc(150, 450, 5, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.arc(520, 430, 5, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.arc(800, 300, 5, 0, 2 * Math.PI);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.strokeStyle = '#0093dd';
    // ctx.lineWidth = '3';
    // ctx.moveTo(330, 150);
    // ctx.lineTo(100, 150);
    // ctx.lineTo(150, 450);
    // ctx.lineTo(520, 430);
    // ctx.lineTo(800, 300);
    // return ctx.stroke();

    ctx.fillStyle = 'red';
    this.stationaryPoint(ctx, data);
    ctx.strokeStyle = '#0093dd';
    this.oribitPath(ctx, data);
  }

  stationaryPoint(ctx, data) {
    const len = data.size;
    console.log('data', data);
    let i;
    if (len === null) {
      return null;
    }
    ctx.beginPath();
    for (i = 0; i < len; i++) {
      ctx.arc(data[i].x, data[i].y, 5, 0, 2 * Math.PI);
    }
    ctx.fill();
  }
  oribitPath(ctx, data) {
    const len = data.size;
    if (len === 1 || data === null) {
      return null;
    }
    const startX = data[0].x;
    const startY = data[0].y;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    for (let i = 1; i < len; i++) {
      ctx.moveTo(data[i].x, data[i].y);
    }
    ctx.stroke();
  }
  handleChangeQuery(name, data) {
    this.props.changeScreenQuery({ [name]: data.value });
    this.onSearch();
  }
  renderCurMap(curMapId, data) {
    const store = this.props.store;
    const curScreenId = store.get('curScreenId');
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
          height: '600px',
          backgroundImage: `url(${bgImg})`,
        }}
      >
        <canvas
          ref={(canvasElem) => {
            if (canvasElem && this.canvasElem !== canvasElem) {
              this.canvasElem = canvasElem;
            }
          }}
          width={1000}
          height={600}
          data={store.getIn([curScreenId, 'data', 'settings', 'path'])}
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
            name="client"
            label={_('Client')}
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
        <div className="o-map-warp">
          {this.renderCurMap(this.state.curMapId)}
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
