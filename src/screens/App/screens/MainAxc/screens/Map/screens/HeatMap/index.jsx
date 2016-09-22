import React, { PropTypes } from 'react';
import utils, { immutableUtils, dom } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import h337 from 'heatmap.js';
import {
  Button, ListInfo, Icon, FormGroup, Modal,
} from 'shared/components';
import FileUploads from 'shared/components/FileUpload';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

import bkImg from '../../shared/images/map_bg.jpg';
import '../../shared/_map.scss';

let heatmapInstance;

const screenOptions = fromJS({
  settings: [],
  list: [
    {
      id: 'markerType',
      label: _('Marker Type'),
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
        dispaly: 'inline',
      },
    }, {
      id: 'markerTitle',
      label: _('Marker Title'),
      formProps: {
        required: true,
        type: 'text',
        dispaly: 'inline',
      },
    }, {
      id: 'markerAddress',
      label: _('Marker Address'),
      formProps: {
        type: 'text',
        dispaly: 'inline',
      },
    },
  ],
});

const defaultEditData = immutableUtils.getDefaultData(screenOptions.get('list'));

const propTypes = {
  store: PropTypes.instanceOf(Map),
  updateScreenSettings: PropTypes.func,
  addToPropertyPanel: PropTypes.func,
  updateEditListItem: PropTypes.func,
  validateAll: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  onListAction: PropTypes.func,
  updateListItemByIndex: PropTypes.func,
  closeListItemModal: PropTypes.func,
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
        'renderDeployedDevice',
        'onMapMouseUp',
        'onMapMouseDown',
        'onMapMouseMove',
        'renderMapList',
        'removeHeatMap',
        'renderCurMap',
        'updateState',
        'renderHeatMap',
      ]
    );
  }

  componentDidUpdate() {
    const { store } = this.props;
    const myListId = store.get('curListId');
    const curMapName = store.getIn([myListId, 'curSettings', 'curMapName']);

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
  onDrop(ev, curMapName) {
    const mapOffset = dom.getAbsPoint(this.mapContent);
    const offsetX = (ev.clientX - mapOffset.x - 13);
    const offsetY = (ev.clientY - mapOffset.y - 13);

    ev.preventDefault();

    this.props.updateEditListItem({
      map: {
        mapName: curMapName,
        xpos: (offsetX * 100) / this.mapContent.offsetWidth,
        ypos: (offsetY * 100) / this.mapContent.offsetHeight,
      },
    }, true);
  }
  onUndeloyDevice(index) {
    this.updateListItemByIndex(index, {
      map: {
        xpos: -99,
        ypos: -99,
        isOpen: false,
        locked: false,
      },
    });
  }
  onMapMouseUp() {
    this.mapMouseDown = false;
  }
  onMapMouseDown(e) {
    if (e.target.className.indexOf('o-map-container') !== -1) {
      this.mapMouseDown = true;
      this.mapClientX = e.clientX;
      this.mapClientY = e.clientY;
    }
  }
  onMapMouseMove(e) {
    if (this.mapMouseDown) {
      this.updateState({
        mapOffsetX: (this.state.mapOffsetX + e.clientX) - this.mapClientX,
        mapOffsetY: (this.state.mapOffsetY + e.clientY) - this.mapClientY,
      });
      this.mapClientX = e.clientX;
      this.mapClientY = e.clientY;
    }
  }
  updateState(data) {
    this.setState(utils.extend({}, data));
  }
  startDrag(ev, i) {
    ev.dataTransfer.setData('Text', ev.target.id);
    this.props.editListItemByIndex(i, 'move');
  }
  renderHeatMap() {
    // now generate some random data
    let points = [];
    let max = 0;
    let width = 840;
    let height = 400;
    let len = 300;

    while (len--) {
      let val = Math.floor(Math.random() * 100);
      // now also with custom radius
      let radius = Math.floor(Math.random() * 70);

      max = Math.max(max, val);
      let point = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
        value: val,
        // radius configuration on point basis
        radius,
      };
      points.push(point);
    }
    // heatmap data format
    let data = {
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
  removeHeatMap() {
    const heatCanvas = document.querySelectorAll('.heatmap-canvas');
    const len = heatCanvas.length;
    let i = 0;

    for (i = 0; i < len; i++) {
      this.mapContent.removeChild(heatCanvas[i]);
    }
    heatmapInstance = null;
  }
  renderDeployedDevice(device, i, curMapName) {
    const xpos = device.getIn(['map', 'xpos']);
    const ypos = device.getIn(['map', 'ypos']);
    const coverage = device.getIn(['map', 'coverage']);
    const isLocked = device.getIn(['map', 'locked']) === '1';
    const isOpen = device.getIn(['map', 'isOpen']);
    const btnsList = [
      {
        id: 'lock',
        icon: isLocked ? 'unlock' : 'lock',
        onClick: () => this.props.updateListItemByIndex(i, {
          map: {
            locked: isLocked ? '0' : '1',
          },
        }),
      }, {
        id: 'config',
        icon: 'cog',
        onClick: () => this.props.addToPropertyPanel(),
      }, {
        icon: 'times',
        id: 'close',
        onClick: () => this.props.updateListItemByIndex(i, {
          map: {
            xpos: -99,
            ypos: -99,
          },
        }),
      },
    ];
    const radius = 28;
    const avd = 220 / btnsList.length;
    const ahd = (avd * Math.PI) / 180;
    const isCur = !curMapName || (curMapName === device.getIn(['map', 'mapName']));

    let ret = null;
    let deviceClassName = 'm-device';
    let avatarClass = 'm-device__avatar';

    if (xpos > -50 && xpos > -50 && isCur) {
      if (isLocked) {
        avatarClass = `${avatarClass} locked`;
      }
      if (device.get('status') === '0') {
        avatarClass = `${avatarClass} danger`;
      }

      if (isOpen) {
        deviceClassName = `${deviceClassName} m-device--open`;
      }
      ret = [
        <div
          id={`deivce${i}`}
          className={deviceClassName}
          style={{
            left: `${xpos}%`,
            top: `${ypos}%`,
          }}
        >
          <div
            className={avatarClass}
            draggable={!isLocked}
            onDragStart={ev => this.startDrag(ev, i)}
            onClick={() => this.props.updateListItemByIndex(i, {
              map: {
                isOpen: !isOpen,
              },
            })}
          />
          <span
            className="m-device__name"
            onClick={() => this.props.updateListItemByIndex(i, {
              map: {
                isOpen: !isOpen,
              },
            })}
          >
            {device.get('devicename') || device.get('mac')}
          </span>

          {
            btnsList.map((info, index) => {
              const btnClassName = `m-device__btn ${info.id}`;
              return (
                <div
                  className={btnClassName}
                  key={info.id}
                  style={{
                    left: isOpen ? (Math.sin((ahd * index)) * radius) + 7 : 13,
                    top: isOpen ? (Math.cos((ahd * index)) * radius) + 6 : 13,
                  }}
                  onClick={info.onClick}
                >
                  <Icon name={info.icon} />
                </div>
              );
            })
          }
        </div>,
        <div
          className="m-device-coverage"
          style={{
            left: `${xpos}%`,
            top: `${ypos}%`,
            width: coverage,
            height: coverage,
          }}
        />,
      ];
    }

    return ret;
  }
  renderUndeployDevice(device, i) {
    const xpos = device.getIn(['map', 'xpos']);
    const ypos = device.getIn(['map', 'ypos']);
    const deviceClassName = 'm-device';
    let avatarClass = 'm-device__avatar';
    let ret = null;

    if (device.get('status') === '0') {
      avatarClass = `${avatarClass} danger`;
    }

    if (xpos < -50 || ypos < -50) {
      ret = (
        <div
          id={`deivce_${i}`}
          className={deviceClassName}
        >
          <div
            className={avatarClass}
            draggable="true"
            onDragStart={ev => this.startDrag(ev, i)}
          />
          <span className="m-device__name">
            {device.get('devicename') || device.get('mac')}
          </span>
        </div>
      );
    }

    return ret;
  }

  renderMapList(mapList) {
    return (
      <div className="row">
        {
          mapList.map((maps) => {
            const mapName = maps.getIn([0, 'map', 'mapName']);

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

        <div
          className="cols col-3 o-map-list__add"
          onClick={this.props.addListItem}
        >
          <Icon
            name="plus"
            size="3x"
          />
        </div>
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
        {
          list ?
            list.map(
              (device, i) => this.renderDeployedDevice(device, i, curMapName)
            ) :
            null
        }
      </div>
    );
  }
  render() {
    const { store, product } = this.props;
    const myListId = store.get('curListId');
    const list = product.getIn(['devices']);
    const isLocked = store.getIn([myListId, 'curSettings', 'isLocked']);
    const myZoom = store.getIn([myListId, 'curSettings', 'zoom']);
    const editData = store.getIn([myListId, 'data', 'edit']);
    const actionQuery = store.getIn([myListId, 'actionQuery']);
    let curMapName = store.getIn([myListId, 'curSettings', 'curMapName']);
    const actionBarChildren = [
      curMapName ? (
        <Button
          icon="arrow-left"
          theme="primary"
          text={_('Back')}
          onClick={() => {
            this.props.updateScreenSettings({
              curMapName: '',
            });
          }}
        />
      ) : null,
      isLocked === '1' ? (<Button
        icon="lock"
        key="0"
        text={_('Unlock All Devices')}
        onClick={() => {
          this.props.updateScreenSettings({
            isLocked: '0',
          });
        }}
      />) : (<Button
        icon="unlock-alt"
        key="0"
        text={_('Lock All Devices')}
        onClick={() => {
          this.props.updateScreenSettings({
            isLocked: '1',
          });
        }}
      />),
      <span
        className="a-help"
        data-help={_('Help')}
        data-help-text={_('Help text')}
      />,
    ];
    const mapList = list
        .map((item, i) => item.merge({
          _index: i,
        }))
        .groupBy(item => item.getIn(['map', 'mapName']))
        .toList();

    const isModalShow = actionQuery.get('action') === 'add' || actionQuery.get('action') === 'edit';

    if (mapList.size === 1) {
      curMapName = mapList.getIn([0, 'map', 'mapName']);
    }

    return (
      <ListInfo
        {...this.props}
        defaultEditData={defaultEditData}
        actionBarChildren={actionBarChildren}
        actionable={false}
      >
        <div className="o-map-warp">
          {
            curMapName ? this.renderCurMap(list, curMapName, myZoom) : this.renderMapList(mapList)
          }
        </div>
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
