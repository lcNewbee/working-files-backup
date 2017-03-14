import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import h337 from 'heatmap.js';
import AppScreen from 'shared/components/Template/AppScreen';
import {
  Button, Table, FormGroup,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

import bkImg from '../../shared/images/map_bg.jpg';
import '../../shared/_map.scss';

let heatmapInstance;

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

const tableOptions = immutableUtils.getTableOptions(listOptions.get('list'));
const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  updateScreenSettings: PropTypes.func,
  validateAll: PropTypes.func,
  onListAction: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);
    this.markers = [];
    this.mapList = fromJS([]);
    this.state = {
      mapOffsetX: 0,
      mapOffsetY: 0,
    };
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
        'renderBulidList',
        'renderBulidMapList',
        'onViewBuild',
        'onChangeBuilding',
        'onChangeMapId',
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
      // console.log('this.mapOptions', this.mapOptions);
      if (typeof (list) !== 'undefined') {
        this.onChangeMapId(this.mapOptions.getIn([0, 'value']));
      }
    });
  }


  componentDidUpdate() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const curMapName = store.getIn([myScreenId, 'curSettings', 'curMapName']);

    if (curMapName) {
      this.renderHeatMap();
    } else {
      this.removeHeatMap();
    }
  }

  // onChangeBuilding(id) {
  //   Promise.resolve().then(() => {
  //     this.props.changeScreenQuery({ buildId: id });
  //   }).then(() => {
  //     this.props.fetchScreenData();
  //   }).then(() => {
  //     const curScreenId = this.props.store.get('curScreenId');
  //     const mapList = this.props.store.getIn([curScreenId, 'data', 'list']);
  //     this.mapOptions = mapList.map(item => fromJS({ label: item.get('mapName'), value: item.get('id') }));
  //   });
  // }

  onChangeBuilding(id) {
    this.props.changeScreenQuery({ buildId: id });
    this.setState({ buildId: id });
    this.props.fetch('goform/group/map/list', { buildId: id })
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.mapOptions = fromJS(json.data.list).map(item => fromJS({ label: item.get('mapName'), value: item.get('id') }));
            this.mapList = fromJS(json.data.list);
          }
          console.log('this.mapOptions', this.mapOptions);
        }).then(() => {
          this.onChangeMapId(this.mapOptions.getIn([0, 'value']));
        });
  }

  onChangeMapId(id) {
    console.log('id', id);
    Promise.resolve().then(() => {
      this.props.changeScreenQuery({ curMapId: id });
      this.setState({ curMapId: id });
    }).then(() => {
      this.props.fetchScreenData();
    });
  }

  // onSave() {
  //   this.props.validateAll()
  //     .then((errMsg) => {
  //       if (errMsg.isEmpty()) {
  //         this.props.onListAction();
  //       }
  //     });
  // }
  // updateState(data) {
  //   this.setState(utils.extend({}, data));
  // }

  removeHeatMap() {
    const heatCanvas = document.querySelectorAll('.heatmap-canvas');
    const len = heatCanvas.length;
    let i = 0;

    for (i = 0; i < len; i++) {
      this.mapContent.removeChild(heatCanvas[i]);
    }
    heatmapInstance = null;
  }

  renderCurMap(list, curMapId) {
    const curItem = list.find(item => item.get('id') === curMapId);
    const imgUrl = curItem ? curItem.get('backgroundImg') : '';
    return (
      <div
        className="o-map-container"
        // onDrop={e => this.onDrop(e, curMapName)}
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
          width: '100%',
          height: '600px',
          background: `url(${imgUrl}) 0 0 no-repeat`,
        }}
        // onMouseDown={this.onMapMouseDown}
        // onMouseUp={this.onMapMouseUp}
        // onMouseMove={this.onMapMouseMove}
      />
    );
  }
  renderHeatMap() {
    // now generate some random data
    const points = [];
    let max = 0;
    const width = this.mapWidth;
    const height = this.mapHeight;
    let len = 200;

    while (len--) {
      const val = Math.floor(Math.random() * 100);
      // now also with custom radius
      const radius = Math.floor(Math.random() * 70);

      max = Math.max(max, val);
      const point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        value: val,
        // radius configuration on point basis
        radius,
      };
      points.push(point);
    }
    // heatmap data format
    const data = {
      max,
      data: points,
    };

    if (!heatmapInstance) {
      heatmapInstance = h337.create({
        // only container is required, the rest will be defaults
        container: this.mapContent,
      });
      heatmapInstance.setData(data);
    } else {
      heatmapInstance.repaint();
    }
  }

  render() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    // const curMapName = store.getIn([myScreenId, 'curSettings', 'curMapName']);

    return (
      <AppScreen
        {...this.props}
      >
        <div className="m-action-bar clearfix">
          <FormGroup
            type="select"
            className="fl"
            label={_('Building')}
            value={this.state.buildId}
            options={this.buildOptions ? this.buildOptions.toJS() : []}
            onChange={data => this.onChangeBuilding(data.value)}
          />
          <FormGroup
            type="select"
            className="fl"
            label={_('Map Name')}
            value={this.state.curMapId}
            options={this.mapOptions ? this.mapOptions.toJS() : []}
            onChange={data => this.onChangeMapId(data.value)}
          />
        </div>
        <div style={{ position: 'relative' }}>
          {this.renderCurMap(this.mapList, this.state.curMapId)}
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
