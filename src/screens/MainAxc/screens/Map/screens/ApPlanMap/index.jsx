import React from 'react'; import PropTypes from 'prop-types';
import utils, { dom, gps } from 'shared/utils';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';

import Button from 'shared/components/Button/Button';
import Icon from 'shared/components/Icon';
import { getActionable } from 'shared/axc';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';
import * as axcActions from '../../../../actions';
import MapList from '../../shared/MapList';

import '../../shared/_map.scss';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  groupDevice: PropTypes.instanceOf(List),
  groupid: PropTypes.any,
  route: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  updateScreenSettings: PropTypes.func,
  addPropertyPanel: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  validateAll: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  onListAction: PropTypes.func,
  updateListItemByIndex: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  saveFile: PropTypes.func,
  save: PropTypes.func,
  fetch: PropTypes.func,
  receiveScreenData: PropTypes.func,
  fetchScreenData: PropTypes.func,

  // AXC actons
  selectManageGroupAp: PropTypes.func,
  fetchModelList: PropTypes.func,
  resetGroupAddDevice: PropTypes.func,
  fetchGroupAps: PropTypes.func,
  showMainModal: PropTypes.func,
};

const defaultProps = {};

export default class View extends React.PureComponent {
  constructor(props) {
    super(props);
    this.markers = [];

    this.state = {
      mapOffsetX: 0,
      mapOffsetY: 0,
      isUnplacedListShow: true,
      backgroundImgUrl: '',
      curShowOptionDeviceMac: -100,
      zoom: 100,
    };
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
        'renderCurMap',
        'updateState',
        'onToggleUnplacedList',
        'onSaveMap',
        'transformServerData',
        'savePlaceDevice',
        'onUppaceDrop',
        'fetchMapList',
      ],
    );
    this.curBuildId = parseInt(props.match.params.id, 10);
    this.curScreenId = props.route.id;
    this.curMapItem = {};
    this.$$mapList = fromJS([]);
    this.$$mapApList = fromJS({});
  }

  componentWillMount() {
    this.actionable = getActionable(this.props);
  }

  componentWillUpdate(nextProps) {
    // Server Data Update
    if (this.props.store.getIn([this.curScreenId, 'data']) !==
        nextProps.store.getIn([this.curScreenId, 'data'])) {
      this.transformServerData(nextProps.store);
    }
  }
  componentDidUpdate(prevProps) {
    // 当组内AP数据发生改变时，重新请求地图AP数量
    if (this.props.groupDevice !== prevProps.groupDevice) {
      this.props.fetchScreenData();
    }
  }
  componentWillUnmount() {
    this.props.updateScreenSettings(
      {
        curMapId: '',
      },
      {
        name: this.props.store.get('curScreenId'),
      },
    );
  }


  onToggleUnplacedList(active) {
    let isUnplacedListShow = !this.state.isUnplacedListShow;

    if (active !== undefined) {
      isUnplacedListShow = active;
    }

    this.setState({
      isUnplacedListShow,
    });
  }
  onSave() {
    this.props.validateAll()
      .then((errMsg) => {
        if (errMsg.isEmpty()) {
          this.props.onListAction();
        }
      });
  }
  onDrop(ev, curMapId) {
    const mapOffset = dom.getAbsPoint(this.mapContent);
    const offsetX = (ev.clientX - mapOffset.x - 13);
    const offsetY = (ev.clientY - mapOffset.y - 13);
    const curOffset = {
      x: (offsetX * 100) / this.mapContent.offsetWidth,
      y: (offsetY * 100) / this.mapContent.offsetHeight,
    };
    const gpsPoint = gps.getGpsPointFromOffset(curOffset, this.curMapItem);

    ev.preventDefault();

    this.props.updateCurEditListItem({
      map: { ...gpsPoint },
      mapId: curMapId,
      ...gpsPoint,
    });

    this.savePlaceDevice('place');
  }
  onUppaceDrop() {
    const myScreenId = this.props.route.id;
    const deviceMac = this.props.store.getIn([
      myScreenId, 'curListItem', 'mac',
    ]);
    const curMapId = this.props.store.getIn([myScreenId, 'curSettings', 'curMapId']);

    this.props.changeScreenActionQuery({
      action: 'delete',
      mapId: curMapId,
      selectedList: [deviceMac],
      groupid: this.props.groupid,
    });
    setTimeout(() => {
      this.props.onListAction();
    }, 10);
  }
  // onUndeloyDevice(index) {
  //   this.updateListItemByIndex(index, {
  //     map: {
  //       id: -100,
  //       xpos: -99,
  //       ypos: -99,
  //       isOpen: false,
  //       locked: false,
  //     },
  //   });
  //   this.savePlaceDevice('unplace');
  // }
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
  startDrag(ev, i) {
    ev.dataTransfer.setData('Text', ev.target.id);
    this.props.editListItemByIndex(i, 'move');
  }
  savePlaceDevice(type) {
    this.props.changeScreenActionQuery({
      action: type,
    });

    if (this.actionable) {
      this.props.onListAction({
        needMerge: true,
      });
    }
  }
  updateState(data) {
    this.setState(utils.extend({}, data));
  }
  transformServerData($$newStore) {
    const $$list = $$newStore.getIn([this.curScreenId, 'data', 'list']);
    const curMapId = $$newStore.getIn([this.curScreenId, 'curSettings', 'curMapId']);

    if ($$newStore.getIn([this.curScreenId, 'data', 'maps', 'list'])) {
      this.$$mapList = $$newStore.getIn([this.curScreenId, 'data', 'maps', 'list']);
      this.curMapItem = this.$$mapList.find(
        $$item => $$item.get('id') === curMapId,
      );

      if (this.curMapItem && typeof this.curMapItem.toJS === 'function') {
        this.curMapItem = this.curMapItem.toJS();
      }
    }

    if ($$list) {
      this.$$mapApList = $$list
        .map((item, i) => item.set('_index', i))
        .filter(
          item => item.getIn(['map', 'buildId']) === this.curBuildId,
        )
        .groupBy(item => item.getIn(['map', 'id']))
        .toMap();
    }
  }
  renderDeployedDevice($$device, i, curMapId) {
    const deivceOffset = gps.getOffsetFromGpsPoint(
      $$device.get('map').toJS(), this.curMapItem,
    );
    const coverage = $$device.getIn(['map', 'coverage']);
    const isLocked = $$device.getIn(['map', 'locked']) === '1';
    const deviceMac = $$device.get('mac');
    const isOpen = this.state.curShowOptionDeviceMac === deviceMac;
    const radius = 38;
    const isCur = !curMapId || (curMapId === $$device.getIn(['map', 'id']));
    const xpos = deivceOffset.x;
    const ypos = deivceOffset.y;
    let avd = 1;
    let ahd = 1;
    let btnsList = [];
    let ret = null;
    let deviceClassName = 'm-device';
    let avatarClass = 'm-device__avatar';

    // 只在渲染当前 Map 里的 AP
    if (isCur) {
      if (this.actionable) {
        btnsList = [
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
            onClick: mac => this.props.addPropertyPanel({
              mac,
            }, $$device.toJS()),
          }, {
            icon: 'times',
            id: 'close',
            onClick: () => {
              this.props.changeScreenActionQuery({
                action: 'delete',
                mapId: curMapId,
                selectedList: [deviceMac],
              });
              this.props.onListAction();
            },
          },
        ];
      }

      avd = 220 / btnsList.length;
      ahd = (avd * Math.PI) / 180;
      if (isLocked) {
        avatarClass = `${avatarClass} locked`;
      }
      if ($$device.get('status') === '0') {
        avatarClass = `${avatarClass} danger`;
      }

      if (isOpen) {
        deviceClassName = `${deviceClassName} m-device--open`;
      }
      ret = [
        <div
          id={`deivce${i}`}
          className={deviceClassName}
          key={`deivce${i}`}
          style={{
            left: `${xpos}%`,
            top: `${ypos}%`,
          }}
        >
          <div
            className={avatarClass}
            draggable={!isLocked}
            onDragStart={ev => this.startDrag(ev, i)}
            onClick={() => {
              if (curMapId) {
                this.setState({
                  curShowOptionDeviceMac: isOpen ? -100 : deviceMac,
                });
              }
            }}
          />
          <span
            className="m-device__name"
            onClick={() => {
              if (curMapId) {
                this.setState({
                  curShowOptionDeviceMac: isOpen ? -100 : deviceMac,
                });
              }
            }}
          >
            {$$device.get('devicename') || deviceMac}
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
                    top: isOpen ? (Math.cos((ahd * index)) * radius) : 13,
                  }}
                  onClick={() => info.onClick(deviceMac)}
                >
                  <Icon name={info.icon} />
                </div>
              );
            })
          }
        </div>,
        curMapId ? (
          <div
            key={`deivceCoverage${i}`}
            className="m-device-coverage"
            style={{
              left: `${xpos}%`,
              top: `${ypos}%`,
              width: parseInt(coverage, 10),
              height: parseInt(coverage, 10),
            }}
          />
        ) : null,
      ];
    }

    return ret;
  }
  renderUndeployDevice($$device, i) {
    const deviceClassName = 'm-device';
    const deviceMac = $$device.get('mac');
    let avatarClass = 'm-device__avatar';
    let ret = null;

    if ($$device.get('status') === '0') {
      avatarClass = `${avatarClass} danger`;
    }

    if ($$device.getIn(['map', 'id']) === -100) {
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
            {$$device.get('devicename') || deviceMac}
          </span>
        </div>
      );
    }

    return ret;
  }
  renderCurMap($$list, curMapId, myZoom) {
    const backgroundImgUrl = this.curMapItem && this.curMapItem.backgroundImg;
    const mapName = this.curMapItem && this.curMapItem.mapName;

    if (!this.curMapItem) {
      return null;
    }
    return (
      <div
        className="o-map-container"
        onDrop={e => this.onDrop(e, curMapId)}
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
          minHeight: '300px',
          backgroundColor: '#ccc',
          backgroundImage: `url(${backgroundImgUrl})`,
          backgroundRepeat: 'no-repeat',
        }}
        onMouseDown={this.onMapMouseDown}
        onMouseUp={this.onMapMouseUp}
        onMouseMove={this.onMapMouseMove}
      >
        <img
          src={backgroundImgUrl}
          draggable="false"
          alt={mapName}
        />
        {
          $$list ?
            $$list.map(
              (device, i) => this.renderDeployedDevice(device, i, curMapId),
            ) : null
        }
      </div>
    );
  }
  render() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const list = store.getIn([myScreenId, 'data', 'list']);
    // const isLocked = store.getIn([myScreenId, 'curSettings', 'isLocked']);
    const myZoom = this.state.zoom;
    const curMapId = store.getIn([myScreenId, 'curSettings', 'curMapId']);
    const actionBarChildren = [
      <Button
        icon="arrow-left"
        theme="primary"
        text={__('Back')}
        key="back"
        onClick={() => {
          if (curMapId) {
            this.props.updateScreenSettings({
              curMapId: '',
            });
            this.onToggleUnplacedList(true);
          } else {
            this.props.history.push('/main/group/map/live/list');
          }
        }}
      />,
    ];
    const $$thisMapList = this.$$mapList;
    const deviceListClassname = classnames('o-list o-devices-list', {
      active: !!curMapId && this.state.isUnplacedListShow,
    });
    const mapWarpClassname = classnames('o-map-warp', {
      dsada: false,
    });

    return (
      <AppScreen
        {...this.props}
        actionable={false}
        initOption={{
          query: {
            buildId: this.props.match.params.id,
          },
        }}
        noTitle
      >
        <div className="m-action-bar">
          {
            actionBarChildren
          }
        </div>
        <div className={mapWarpClassname}>
          <MapList
            {...this.props}
            actionable={this.actionable}
            $$mapList={$$thisMapList}
            groupid={this.props.groupid}
            buildId={this.props.match.params.id}
            onSelectMap={($$mapItem) => {
              const mapId = $$mapItem.getIn(['id']);
              const $$mapAps = this.$$mapApList.get(mapId);

              this.curMapItem = $$mapItem.toJS();
              this.props.updateScreenSettings({
                curMapId: mapId,
                curList: $$mapAps,
              });
            }}
            validateAll={this.props.validateAll}
            save={this.props.save}
            fetch={this.props.fetch}
            saveFile={this.props.saveFile}
            receiveScreenData={this.props.receiveScreenData}
            visible={!curMapId}
          />
          {
            curMapId ? this.renderCurMap(list, curMapId, myZoom) : null
          }
          {
            curMapId ? (
              <div className="o-map-zoom-bar">
                <Icon
                  name="minus"
                  className="o-map-zoom-bar__minus"
                  onClick={() => {
                    this.setState({
                      zoom: (myZoom - 10) < 0 ? 0 : (myZoom - 10),
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
            ) : null
          }
          <div
            className={deviceListClassname}
            onDrop={e => this.onUppaceDrop(e)}
            onDragOver={e => e.preventDefault()}
          >
            {
              curMapId ? (
                <div
                  className="toggle-button"
                  onClick={() => this.onToggleUnplacedList()}
                >
                  <Icon
                    title={__('Unplaced AP List')}
                    name="align-justify"
                    size="2x"
                  />
                </div>
              ) : null
            }

            <div className="o-list__header">
              {__('Unplaced AP List')}
              <Icon
                className="fr"
                style={{
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
                name="angle-double-right"
                onClick={() => this.onToggleUnplacedList()}
              />
            </div>
            <div className="o-list__body">
              {
                list ?
                  list.map(this.renderUndeployDevice) :
                  null
              }
            </div>
            <div className="o-list__footer o-devices-list__footer">
              {
                this.actionable ? (
                  <Button
                    icon="plus"
                    theme="primary"
                    text={__('Add AP to Group')}
                    onClick={
                      () => {
                        this.props.selectManageGroupAp({
                          id: this.props.groupid,
                        });
                        this.props.fetchModelList();
                        this.props.resetGroupAddDevice();
                        this.props.fetchGroupAps(-1);
                        this.props.showMainModal({
                          title: __('Add AP to Group'),
                          size: 'md',
                          isShow: true,
                          name: 'groupApAdd',
                        });
                      }
                    }
                  />
                ) : null
              }
            </div>
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
    groupid: state.product.getIn(['group', 'selected', 'id']),
    groupDevice: state.product.getIn(['group', 'devices']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
    propertiesActions,
    axcActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
