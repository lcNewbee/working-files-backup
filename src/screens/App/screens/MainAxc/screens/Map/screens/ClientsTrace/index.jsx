import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import h337 from 'heatmap.js';
import {
  Button, ListInfo, Icon, Table,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

import bkImg from '../../shared/images/map_trace.png';
import '../../shared/_map.scss';

let heatmapInstance;

const screenOptions = fromJS({
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
            label: _('Access Point'),
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

const defaultEditData = immutableUtils.getDefaultData(screenOptions.get('list'));
const tableOptions = immutableUtils.getTableOptions(screenOptions.get('list'));

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  updateScreenSettings: PropTypes.func,
  validateAll: PropTypes.func,
  onListAction: PropTypes.func,
  addListItem: PropTypes.func,
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
        'renderTraceMap',
        'renderBulidList',
        'renderBulidMapList',
        'onViewBuild',
      ]
    );
  }

  componentDidUpdate() {
    const { store } = this.props;
    const myListId = store.get('curListId');
    const curMapName = store.getIn([myListId, 'curSettings', 'curMapName']);

    if (curMapName) {
      this.renderTraceMap();
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
          backgroundImage: `url(${bkImg})`,
          backgroundSize: '100%',
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
  renderTraceMap() {

  }
  renderBulidList() {
    const { store, app } = this.props;
    const myListId = store.get('curListId');
    const list = store.getIn([myListId, 'data', 'list']);
    const page = store.getIn([myListId, 'data', 'page']);

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
    const myListId = store.get('curListId');
    const list = store.getIn([myListId, 'data', 'list', this.state.buildIndex, 'floorList']);
    const curMapName = store.getIn([myListId, 'curSettings', 'curMapName']);
    const myZoom = store.getIn([myListId, 'curSettings', 'zoom']) || 100;

    return (
      <div className="o-map-warp">
        {
          curMapName ?
            this.renderCurMap(list, curMapName, myZoom) :
            this.renderFloorList(list)
        }
        {
          curMapName ? (
            <div className="o-map-zoom-bar">
              <Icon
                name="minus"
                className="o-map-zoom-bar__minus"
                onClick={() => {
                  this.props.updateScreenSettings({
                    zoom: (myZoom - 10) < 0 ? 0 : (myZoom - 10),
                  });
                }}
              />
              <div className="o-map-zoom-bar__thmp" >{myZoom}%</div>
              <Icon
                name="plus"
                className="o-map-zoom-bar__plus"
                onClick={() => {
                  this.props.updateScreenSettings({
                    zoom: (myZoom + 10) > 200 ? 200 : (myZoom + 10),
                  });
                }}
              />
            </div>
          ) : null
        }
      </div>
    );
  }
  render() {
    const { store } = this.props;
    const myListId = store.get('curListId');
    const curMapName = store.getIn([myListId, 'curSettings', 'curMapName']);
    const actionBarChildren = [
      curMapName || this.state.buildIndex >= 0 ? (
        <Button
          icon="arrow-left"
          theme="primary"
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
        data-help={_('Help')}
        data-help-text={_('Help text')}
      />,
    ];

    return (
      <ListInfo
        {...this.props}
        defaultEditData={defaultEditData}
        actionBarChildren={actionBarChildren}
        actionable={false}
      >
        {
          this.state.buildIndex >= 0 ?
            this.renderBulidMapList() :
            this.renderBulidList()
        }
      </ListInfo>
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
    propertiesActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
