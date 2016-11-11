import React, { PropTypes } from 'react';
import utils, { immutableUtils, dom } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import Button from 'shared/components/Button/Button';
import Icon from 'shared/components/Icon';
import Modal from 'shared/components/Modal';
import { FormGroup } from 'shared/components/Form';
import FileUploads from 'shared/components/FileUpload';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

import bkImg from '../../shared/images/map_bg.jpg';
import '../../shared/_map.scss';

const listOptions = fromJS({
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
        display: 'inline',
      },
    }, {
      id: 'markerTitle',
      label: _('Marker Title'),
      formProps: {
        required: true,
        type: 'text',
        display: 'inline',
      },
    }, {
      id: 'markerAddress',
      label: _('Marker Address'),
      formProps: {
        type: 'text',
        display: 'inline',
      },
    },
  ],
});

const defaultEditData = immutableUtils.getDefaultData(listOptions.get('list'));

const propTypes = {
  store: PropTypes.instanceOf(Map),
  router: PropTypes.object,
  updateScreenSettings: PropTypes.func,
  addToPropertyPanel: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
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
        'renderCurMap',
        'updateState',
      ]
    );
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

    this.props.updateCurEditListItem({
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
    const radius = 38;
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
                    top: isOpen ? (Math.cos((ahd * index)) * radius) : 13,
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
                    {
                      maps ?
                        maps.map(
                          item => this.renderDeployedDevice(item, item.get('_index'))
                        ) :
                        null
                    }
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
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const list = store.getIn([myScreenId, 'data', 'list']);
    const isLocked = store.getIn([myScreenId, 'curSettings', 'isLocked']);
    const myZoom = store.getIn([myScreenId, 'curSettings', 'zoom']);
    const actionQuery = store.getIn([myScreenId, 'actionQuery']);
    let curMapName = store.getIn([myScreenId, 'curSettings', 'curMapName']);
    const actionBarChildren = [
      <Button
        icon="arrow-left"
        theme="primary"
        text={_('Back')}
        key="back"
        onClick={() => {
          if (curMapName) {
            this.props.updateScreenSettings({
              curMapName: '',
            });
          } else {
            this.props.router.push('/main/group/map/live/list')
          }
        }}
      />,
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
        .groupBy(item => item.getIn(['map', 'buildId']))
        .toList();

    const isModalShow = actionQuery.get('action') === 'add' || actionQuery.get('action') === 'edit';
    const buildId = this.props.params.id;

    if (mapList.size === 1) {
      curMapName = mapList.getIn([0, 'map', 'mapName']);
    }

    return (
      <AppScreen
        {...this.props}
        actionable={false}
      >
        <div className="m-action-bar">
          {
            actionBarChildren
          }
        </div>

        <div className="o-map-warp">
          {
            curMapName ? this.renderCurMap(list, curMapName, myZoom) : this.renderMapList(mapList)
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
        <div className="o-devices-list" >
          {
            list ?
              list.map(this.renderUndeployDevice) :
              null
          }
        </div>

        <Modal
          title={_('Add')}
          isShow={isModalShow}
          onClose={() => this.props.closeListItemModal()}
        >
          <FormGroup
            label={_('Map Name')}
          />
          <FormGroup label=" ">
            <FileUploads
              url="/goform/uploadPortalImage"
              name="image2"
              acceptExt="png,gif,jpg,bmp"
              createModal={this.props.createModal}
              buttonText={_('Upload Image')}
            />
          </FormGroup>
          <p>
            <img src="" alt="" />
          </p>
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
