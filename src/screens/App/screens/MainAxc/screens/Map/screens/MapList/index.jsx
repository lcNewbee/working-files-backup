import React, { PropTypes } from 'react';
import utils, { immutableUtils, dom } from 'shared/utils';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import Button from 'shared/components/Button/Button';
import SaveButton from 'shared/components/Button/SaveButton';
import Icon from 'shared/components/Icon';
import { FormGroup } from 'shared/components/Form';
import FileUploads from 'shared/components/FileUpload';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';
import * as axcActions from '../../../../actions';

import '../../shared/_map.scss';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  groupid: PropTypes.any,
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
  fetch: PropTypes.func,
  reciveScreenData: PropTypes.func,
  saveFile: PropTypes.func,

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
        'onToggleUnplacedList',
        'onSaveMap',
        'transformServerData',
        'savePlaceDevice',
        'fetchMapApList',
      ],
    );
    this.url = 'goform/group/map/apPlan';
  }

  componentWillMount() {
    this.fetchMapApList();
  }
  componentWillUpdate(nextProps) {
    // Server Data Update
    if (this.props.store.getIn([this.curScreenId, 'data', 'mapAps']) !==
        nextProps.store.getIn([this.curScreenId, 'data', 'mapAps'])) {
      this.transformServerData(nextProps.store);
    }
  }
  onSaveMap() {
    const url = 'goform/group/map/list';
    const formElem = this.formElem;
    this.props.saveFile(url, formElem)
      .then(() => {
        this.props.closeListItemModal();
        this.props.fetchScreenData();
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
      this.setState({
        mapOffsetX: (this.state.mapOffsetX + e.clientX) - this.mapClientX,
        mapOffsetY: (this.state.mapOffsetY + e.clientY) - this.mapClientY,
      });
      this.mapClientX = e.clientX;
      this.mapClientY = e.clientY;
    }
  }
  fetchMapApList() {
    this.props.fetch(this.url, {
      groupid: this.props.groupid,
      buildId: this.props.params.id,
    }).then(
      (json) => {
        if (json && json.state && json.state.code === 2000) {
          this.props.reciveScreenData({
            mapAps: json.data,
          });
        }
      },
    );
  }
  savePlaceDevice(type) {
    this.props.changeScreenActionQuery({
      action: type,
    });
  }
  transformServerData($$newStore) {
    const $$list = $$newStore.getIn([this.curScreenId, 'data', 'mapAps', 'list']);

    this.$$mapApList = $$list
      .map((item, i) => item.set('_index', i))
      .filter(
        item => item.getIn(['map', 'buildId']) === this.curBuildId,
      )
      .groupBy(item => item.getIn(['map', 'id']))
      .toList();
  }
  startDrag(ev, i) {
    ev.dataTransfer.setData('Text', ev.target.id);
    this.props.editListItemByIndex(i, 'move');
  }
  renderDeployedDevice($$device, i, curMapId) {
    const xpos = $$device.getIn(['map', 'xpos']);
    const ypos = $$device.getIn(['map', 'ypos']);
    const coverage = $$device.getIn(['map', 'coverage']);
    const isLocked = $$device.getIn(['map', 'locked']) === '1';
    const deviceMac = $$device.get('mac');
    const isOpen = this.state.curShowOptionDeviceMac === deviceMac;
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
        onClick: mac => this.props.addToPropertyPanel({
          mac,
        }),
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
    const isCur = !curMapId || (curMapId === $$device.getIn(['map', 'id']));

    let ret = null;
    let deviceClassName = 'm-device';
    let avatarClass = 'm-device__avatar';

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

  render() {
    const { store, mapId } = this.props;
    const $$mapAps = this.$$mapApList.get(mapId);

    return (
      <div className="o-map-ap-plan">

      </div>
    );
  }
}

View.propTypes = propTypes;
View.defaultProps = defaultProps;
