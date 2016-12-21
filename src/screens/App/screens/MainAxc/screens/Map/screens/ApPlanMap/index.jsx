import React, { PropTypes } from 'react';
import utils, { dom } from 'shared/utils';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { fromJS, Map, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import Button from 'shared/components/Button/Button';
import SaveButton from 'shared/components/Button/SaveButton';
import Icon from 'shared/components/Icon';
import Modal from 'shared/components/Modal';
import { getActionable } from 'shared/axc';
import { FormGroup } from 'shared/components/Form';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';
import * as axcActions from '../../../../actions';

import '../../shared/_map.scss';

function previewFile(file) {
  const retPromise = new Promise((resolve) => {
    let retUrl = '';
    let reader = null;

    // 如果支持 createObjectURL
    if (URL && URL.createObjectURL) {
      const img = new Image();
      retUrl = URL.createObjectURL(file);
      img.src = retUrl;

      img.onload = () => {
        resolve(retUrl);
        // URL.revokeObjectURL(retUrl);
      };

    // 如果支持 FileReader
    } else if (window.FileReader) {
      reader = new FileReader();
      reader.onload = (e) => {
        retUrl = e.target.result;
        resolve(retUrl);
      };
      reader.readAsDataURL(file);

    // 其他放回 Flase
    } else {
      resolve(retUrl);
    }
  });

  return retPromise;
}

const propTypes = {
  store: PropTypes.instanceOf(Map),
  groupDevice: PropTypes.instanceOf(List),
  groupid: PropTypes.any,
  route: PropTypes.object,
  router: PropTypes.object,
  params: PropTypes.object,
  updateScreenSettings: PropTypes.func,
  addToPropertyPanel: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  validateAll: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  onListAction: PropTypes.func,
  updateListItemByIndex: PropTypes.func,
  closeListItemModal: PropTypes.func,
  addListItem: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  saveFile: PropTypes.func,
  save: PropTypes.func,
  fetch: PropTypes.func,
  reciveScreenData: PropTypes.func,
  fetchScreenData: PropTypes.func,

  // AXC actons
  selectManageGroupAp: PropTypes.func,
  fetchModelList: PropTypes.func,
  resetGroupAddDevice: PropTypes.func,
  fetchGroupAps: PropTypes.func,
  showMainModal: PropTypes.func,
};

const defaultProps = {};

export default class View extends React.Component {
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
        'renderCurMap',
        'updateState',
        'onToggleUnplacedList',
        'onSaveMap',
        'transformServerData',
        'savePlaceDevice',
        'fetchMapList',
        'onUppaceDrop',
      ],
    );
    this.curBuildId = parseInt(props.params.id, 10);
    this.curScreenId = props.route.id;
    this.$$mapList = fromJS([]);
    this.$$mapApList = fromJS({});
  }

  componentWillMount() {
    this.actionable = getActionable(this.props);
    this.fetchMapList();
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

  onSaveMap() {
    const url = 'goform/group/map/list';
    const formElem = this.formElem;

    this.props.saveFile(url, formElem)
      .then(() => {
        this.props.closeListItemModal();
        this.fetchMapList();
      });
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

    ev.preventDefault();

    this.props.updateCurEditListItem({
      map: {
        xpos: (offsetX * 100) / this.mapContent.offsetWidth,
        ypos: (offsetY * 100) / this.mapContent.offsetHeight,
      },
      mapId: curMapId,
      xpos: (offsetX * 100) / this.mapContent.offsetWidth,
      ypos: (offsetY * 100) / this.mapContent.offsetHeight,
    }, true);
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
    });
    this.props.onListAction();
  }
  onUndeloyDevice(index) {
    this.updateListItemByIndex(index, {
      map: {
        id: -100,
        xpos: -99,
        ypos: -99,
        isOpen: false,
        locked: false,
      },
    });
    this.savePlaceDevice('unplace');
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
  startDrag(ev, i) {
    ev.dataTransfer.setData('Text', ev.target.id);
    this.props.editListItemByIndex(i, 'move');
  }
  fetchMapList() {
    const url = 'goform/group/map/list';

    this.props.fetch(url, {
      groupid: this.props.groupid,
      buildId: this.props.params.id,
    }).then(
      (json) => {
        if (json && json.state && json.state.code === 2000) {
          this.props.reciveScreenData({
            maps: json.data,
          });
        }
      },
    );
  }
  deleteMapList(mapId) {
    const url = 'goform/group/map/list';

    this.props.save(url, {
      groupid: this.props.groupid,
      action: 'delete',
      selectedList: [mapId],
    }).then(
      (json) => {
        if (json && json.state && json.state.code === 2000) {
          this.fetchMapList();
        }
      },
    );
  }
  savePlaceDevice(type) {
    this.props.changeScreenActionQuery({
      action: type,
    });

    if (this.actionable) {
      this.props.onListAction('', {
        needMerge: true,
      });
    }
  }
  updateState(data) {
    this.setState(utils.extend({}, data));
  }
  transformServerData($$newStore) {
    const $$list = $$newStore.getIn([this.curScreenId, 'data', 'list']);

    if ($$newStore.getIn([this.curScreenId, 'data', 'maps', 'list'])) {
      this.$$mapList = $$newStore.getIn([this.curScreenId, 'data', 'maps', 'list']);
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
    const xpos = $$device.getIn(['map', 'xpos']);
    const ypos = $$device.getIn(['map', 'ypos']);
    const coverage = $$device.getIn(['map', 'coverage']);
    const isLocked = $$device.getIn(['map', 'locked']) === '1';
    const deviceMac = $$device.get('mac');
    const isOpen = this.state.curShowOptionDeviceMac === deviceMac;
    const radius = 38;
    const isCur = !curMapId || (curMapId === $$device.getIn(['map', 'id']));
    let avd = 1;
    let ahd = 1;
    let btnsList = [];

    let ret = null;
    let deviceClassName = 'm-device';
    let avatarClass = 'm-device__avatar';

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
          onClick: mac => this.props.addToPropertyPanel({
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

    // 只在渲染当前 Map 里的 AP
    if (isCur) {
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
              width: coverage,
              height: coverage,
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
  renderMapList($$mapList) {
    return (
      <div className="row">
        {
          $$mapList.map(($$map) => {
            const mapId = $$map.getIn(['id']);
            const mapName = $$map.getIn(['mapName']);
            const imgUrl = $$map.getIn(['backgroudImg']);
            const $$mapAps = this.$$mapApList.get(mapId);

            if (mapId === -100) {
              return null;
            }

            return (
              <div className="cols col-3">
                <div
                  className="m-thumbnail"
                >
                  {
                    this.actionable ? (
                      <Icon
                        name="times"
                        className="close"
                        onClick={
                          () => {
                            this.deleteMapList(mapId);
                          }
                        }
                      />
                    ) : null
                  }

                  <div
                    className="m-thumbnail__content"
                    onClick={() => {
                      this.curMapImgUrl = imgUrl;
                      this.curMapName = mapName;
                      this.curMapId = mapId;
                      this.props.updateScreenSettings({
                        curMapId: mapId,
                        curList: $$mapAps,
                      });
                    }}
                  >
                    <img
                      src={imgUrl}
                      draggable="false"
                      alt={mapName}
                    />
                    {
                      $$mapAps ?
                        $$mapAps.map(
                          item => this.renderDeployedDevice(item, item.get('_index')),
                        ) :
                        null
                    }
                  </div>
                  <div
                    className="m-thumbnail__caption"
                    onClick={() => {
                      this.curMapImgUrl = imgUrl;
                      this.curMapName = mapName;
                      this.props.updateScreenSettings({
                        curMapId: mapId,
                        curList: $$mapAps,
                      });
                    }}
                  >
                    <h3>{mapName}</h3>
                  </div>
                </div>
              </div>
            );
          })
        }
        {
          this.actionable ? (
            <div
              className="cols col-3"
              onClick={this.props.addListItem}
            >
              <div className="o-map-list__add">
                <Icon
                  name="plus"
                  size="3x"
                />
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
  renderCurMap($$list, curMapId, myZoom) {
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
          backgroundImage: `url(${this.curMapImgUrl})`,
        }}
        onMouseDown={this.onMapMouseDown}
        onMouseUp={this.onMapMouseUp}
        onMouseMove={this.onMapMouseMove}
      >
        <img
          src={this.curMapImgUrl}
          draggable="false"
          alt={this.curMapName}
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
    const actionQuery = store.getIn([myScreenId, 'actionQuery']);
    const curMapId = store.getIn([myScreenId, 'curSettings', 'curMapId']);
    const actionBarChildren = [
      <Button
        icon="arrow-left"
        theme="primary"
        text={_('Back')}
        key="back"
        onClick={() => {
          if (curMapId) {
            this.props.updateScreenSettings({
              curMapId: '',
            });
            this.onToggleUnplacedList(true);
          } else {
            this.props.router.push('/main/group/map/live/list');
          }
        }}
      />,
      // isLocked === '1' ? (<Button
      //   icon="lock"
      //   key="0"
      //   text={_('Unlock All Devices')}
      //   onClick={() => {
      //     this.props.updateScreenSettings({
      //       isLocked: '0',
      //     });
      //   }}
      // />) : (<Button
      //   icon="unlock-alt"
      //   key="0"
      //   text={_('Lock All Device')}
      //   onClick={() => {
      //     this.props.updateScreenSettings({
      //       isLocked: '1',
      //     });
      //   }}
      // />),
      // <span
      //   className="a-help"
      //   data-help={_('Help')}
      //   data-help-text={_('Help text')}
      // />,
    ];
    const $$thisMapList = this.$$mapList;
    const isModalShow = actionQuery.get('action') === 'add' || actionQuery.get('action') === 'edit';
    const deviceListClassname = classnames('o-list o-devices-list', {
      active: !!curMapId && this.state.isUnplacedListShow,
    });

    return (
      <AppScreen
        {...this.props}
        actionable={false}
        initOption={{
          query: {
            buildId: this.props.params.id,
          },
        }}
        noTitle
      >
        <div className="m-action-bar">
          {
            actionBarChildren
          }
        </div>
        <div className="o-map-warp">
          {
            curMapId ? this.renderCurMap(list, curMapId, myZoom) : this.renderMapList($$thisMapList)
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
                    title={_('Unplaced AP List')}
                    name="align-justify"
                    size="2x"
                  />
                </div>
              ) : null
            }

            <div className="o-list__header">
              {_('Unplaced AP List')}
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
                    text={_('Add AP to Group')}
                    onClick={
                      () => {
                        this.props.selectManageGroupAp({
                          id: this.props.groupid,
                        });
                        this.props.fetchModelList();
                        this.props.resetGroupAddDevice();
                        this.props.fetchGroupAps(-1);
                        this.props.showMainModal({
                          title: _('Add AP to Group'),
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

        <Modal
          title={_('Add')}
          isShow={isModalShow}
          onClose={() => {
            this.props.closeListItemModal();
            this.setState({
              backgroundImgUrl: '',
            });
          }}
          noFooter
        >
          <form
            action="goform/group/map/list"
            method="POST"
            encType="multipart/form-data"
            ref={(formElem) => {
              if (formElem) {
                this.formElem = formElem;
              }
            }}
          >
            <input
              type="hidden"
              name="groupid"
              value={this.props.groupid}
            />
            <input
              type="hidden"
              name="action"
              value="add"
            />
            <input
              type="hidden"
              name="buildId"
              value={this.props.params.id}
            />

            <FormGroup
              label={_('Map Name')}
              value={this.state.mapName}
              name="mapImg"
              onChange={
                (data) => {
                  this.setState({
                    mapName: data.value,
                  });
                }
              }
              required
            />
            <FormGroup
              label={_('Map Backgroud Image')}
              name="mapImg"
              type="file"
              onChange={(data, evt) => {
                const selectFile = evt.target.files[0];

                previewFile(selectFile).then(
                  (url) => {
                    if (url) {
                      this.setState({
                        backgroundImgUrl: url,
                      });
                    }
                  },
                );
                this.setState({
                  mapImgUrl: data.value,
                });
              }}
              required
            />
            <p
              style={{
                textAlign: 'center',
                marginBottom: '1em',
              }}
            >
              {
                this.state.backgroundImgUrl ? (
                  <img
                    src={this.state.backgroundImgUrl}
                    alt="img"
                    style={{
                      height: '160px',
                      backgroundColor: '#efefef',
                    }}
                    onLoad={
                      () => {
                        if (typeof URL.revokeObjectURL === 'function') {
                          URL.revokeObjectURL(this.state.backgroundImgUrl);
                        }
                      }
                    }
                  />
                ) : null
              }
            </p>
            <div className="form-group form-group--save">
              <div className="form-control">
                <SaveButton
                  type="button"
                  onClick={this.onSaveMap}
                />
              </div>
            </div>
          </form>
        </Modal>
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
