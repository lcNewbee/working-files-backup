import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import h337 from 'heatmap.js';
import AppScreen from 'shared/components/Template/AppScreen';
import {
  Button, Table,
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

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.markers = [];

    this.state = {
      mapOffsetX: 0,
      mapOffsetY: 0,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
      ],
    );
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

  onSave() {
    this.props.validateAll()
      .then((errMsg) => {
        if (errMsg.isEmpty()) {
          this.props.onListAction();
        }
      });
  }
  updateState(data) {
    this.setState(utils.extend({}, data));
  }
  onViewBuild(i) {
    this.updateState({
      buildIndex: i,
    });
  }
  removeHeatMap() {
    const heatCanvas = document.querySelectorAll('.heatmap-canvas');
    const len = heatCanvas.length;
    let i = 0;

    for (i = 0; i < len; i++) {
      this.mapContent.removeChild(heatCanvas[i]);
    }
    heatmapInstance = null;
  }

  renderFloorList(mapList) {
    return (
      <div className="row">
        {
          mapList.map((maps) => {
            const mapName = maps.getIn(['mapName']);

            return (
              <div className="cols col-3">
                <div className="m-thumbnail">
                  <div
                    className="m-thumbnail__content"
                  >
                    <img
                      src={bkImg}
                      draggable="false"
                      alt="d"
                      onClick={() => this.props.updateScreenSettings({
                        curMapName: mapName,
                        curList: maps,
                      })}
                    />
                  </div>
                  <div className="m-thumbnail__caption">
                    <h3>{mapName}</h3>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }
  renderCurMap(list, curMapName, myZoom) {
    return (
      <div
        className="o-map-container"
        onDrop={e => this.onDrop(e, curMapName)}
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
        onMouseDown={this.onMapMouseDown}
        onMouseUp={this.onMapMouseUp}
        onMouseMove={this.onMapMouseMove}
      >
        <img
          src={bkImg}
          draggable="false"
          alt="d"
        />
      </div>
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
  renderBulidList() {
    const { store, app } = this.props;
    const myScreenId = store.get('curScreenId');
    const list = store.getIn([myScreenId, 'data', 'list']);
    const page = store.getIn([myScreenId, 'data', 'page']);

    return (
      <Table
        className="table"
        options={tableOptions}
        list={list}
        page={page}
        onPageChange={this.onPageChange}
        loading={app.get('fetching')}
        onRowClick={(e, i) => this.onViewBuild(i, e)}
      />
    );
  }
  renderBulidMapList() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const list = store.getIn([myScreenId, 'data', 'list', this.state.buildIndex, 'floorList']);
    const curMapName = store.getIn([myScreenId, 'curSettings', 'curMapName']);
    return (
      <div className="o-map-warp">
        {
          curMapName ?
            this.renderCurMap(list, curMapName, '100%') :
            this.renderFloorList(list)
        }
      </div>
    );
  }
  render() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const curMapName = store.getIn([myScreenId, 'curSettings', 'curMapName']);
    const actionBarChildren = [
      curMapName || this.state.buildIndex >= 0 ? (
        <Button
          icon="arrow-left"
          theme="primary"
          key="back"
          text={_('Back')}
          onClick={() => {
            if (curMapName) {
              this.props.updateScreenSettings({
                curMapName: '',
              });
            } else {
              this.updateState({
                buildIndex: -1,
              });
            }
          }}
        />
      ) : null,
      <span
        className="a-help"
        key="help"
        data-help={_('Help')}
        data-help-text={_('Help text')}
      />,
    ];

    return (
      <AppScreen
        {...this.props}
      >
        <div className="m-action-bar">
          {
            actionBarChildren
          }
        </div>
        {
          this.state.buildIndex >= 0 ?
            this.renderBulidMapList() :
            this.renderBulidList()
        }
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
