import React, { PropTypes } from 'react';
import utils, { immutableUtils, dom } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import {
  Button, ListInfo, Icon, FormContainer,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as listActions from 'shared/actions/list';
import * as propertiesActions from 'shared/actions/properties';

import bkImg from './images/map_bk.jpg';
import './_rf.scss';

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
const formOptions = immutableUtils.getFormOptions(screenOptions.get('list'));

const propTypes = {
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  updateListSettings: PropTypes.func,
  addToPropertyPanel: PropTypes.func,
  updateEditListItem: PropTypes.func,
  validateAll: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  onListAction: PropTypes.func,
  reportValidError: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateListItemByIndex: PropTypes.func,
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
        'getCurListInfoState',
        'onDrop',
        'renderUndeployDevice',
        'renderDeployedDevice',
        'onMapMouseUp',
        'onMapMouseDown',
        'onMapMouseMove',
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
  onDrop(ev) {
    const mapOffset = dom.getAbsPoint(this.mapContent);
    const offsetX = (ev.clientX - mapOffset.x - 13);
    const offsetY = (ev.clientY - mapOffset.y - 13);

    ev.preventDefault();

    this.props.updateEditListItem({
      xpos: (offsetX * 100) / this.mapContent.offsetWidth,
      ypos: (offsetY * 100) / this.mapContent.offsetHeight,
    }, true);
  }
  onUndeloyDevice(index) {
    this.updateListItemByIndex(index, {
      xpos: -99,
      ypos: -99,
      isOpen: false,
      locked: false,
    });
  }
  onMapMouseUp(e) {
    this.mapMouseDown = false;
  }
  onMapMouseDown(e) {
    if (e.target.className.indexOf('o-map-rf') !== -1) {
      this.mapMouseDown = true;
      this.mapClientX = e.clientX;
      this.mapClientY = e.clientY;
    }
  }
  onMapMouseMove(e) {
    if (this.mapMouseDown) {
      this.setState({
        mapOffsetX: this.state.mapOffsetX + e.clientX - this.mapClientX,
        mapOffsetY: this.state.mapOffsetY + e.clientY - this.mapClientY,
      });
      this.mapClientX = e.clientX;
      this.mapClientY = e.clientY;
    }
  }
  getCurListInfoState(listStore, name) {
    const myStore = listStore || Map({});
    const myListId = myStore.get('curListId');
    let ret = myStore.getIn([myListId, 'data']);

    if (name) {
      ret = myStore.getIn([myListId, 'data', name]);
    }
    return ret || Map({});
  }
  allowDrop(e) {
    e.preventDefault();
  }
  startDrag(ev, i) {
    ev.dataTransfer.setData('Text', ev.target.id);
    this.props.editListItemByIndex(i);
  }

  renderDeployedDevice(device, i) {
    const xpos = device.get('xpos');
    const ypos = device.get('ypos');
    const isLocked = device.get('locked') === '1';
    const isOpen = device.get('isOpen');
    const btnsList = [
      {
        id: 'lock',
        icon: isLocked ? 'unlock' : 'lock',
        onClick: () => this.props.updateListItemByIndex(i, {
          locked: isLocked ? '0' : '1',
        }),
      }, {
        id: 'config',
        icon: 'cog',
        onClick: () => this.props.addToPropertyPanel(),
      }, {
        icon: 'times',
        id: 'close',
        onClick: () => this.props.updateListItemByIndex(i, {
          xpos: -99,
          ypos: -99,
        }),
      },
    ];
    const radius = 28;
    const avd = 220 / btnsList.length;
    const ahd = (avd * Math.PI) / 180;

    let ret = null;
    let deviceClassName = 'm-device';
    let avatarClass = 'm-device__avatar';

    if (xpos > -50 && xpos > -50) {
      if (isLocked) {
        avatarClass = `${avatarClass} locked`;
      }
      if (device.get('status') === '0') {
        avatarClass = `${avatarClass} danger`;
      }

      if (isOpen) {
        deviceClassName = `${deviceClassName} m-device--open`;
      }
      ret = (
        <div
          id={`deivce${i}`}
          className={deviceClassName}
          style={{
            left: `${xpos}%`,
            top: `${ypos}%`,
          }}
        >
          <div className="m-device__coverage"></div>
          <div
            className={avatarClass}
            draggable={!isLocked}
            onDragStart={(ev) => this.startDrag(ev, i)}
            onClick={() => this.props.updateListItemByIndex(i, {
              isOpen: !isOpen,
            })}
          />
          <span
            className="m-device__name"
            onClick={() => this.props.updateListItemByIndex(i, {
              isOpen: !isOpen,
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
                    left: isOpen ? (Math.sin((ahd * index)) * radius + 7) : 13,
                    top: isOpen ? (Math.cos((ahd * index)) * radius + 6) : 13,
                  }}
                  onClick={info.onClick}
                >
                  <Icon name={info.icon} />
                </div>
              );
            })
          }
        </div>
      );
    }

    return ret;
  }
  renderUndeployDevice(device, i) {
    const xpos = device.get('xpos');
    const ypos = device.get('ypos');
    const deviceClassName = 'm-device';
    let avatarClass = 'm-device__avatar';
    let ret = null;

    if (device.get('status') === '0') {
      avatarClass = `${avatarClass} danger`;
    }

    if (xpos < -50 || xpos < -50) {
      ret = (
        <div
          id={`deivce_${i}`}
          className={deviceClassName}
          style={{
            left: `${xpos}%`,
            top: `${ypos}%`,
          }}
        >
          <div
            className={avatarClass}
            draggable="true"
            onDragStart={(ev) => this.startDrag(ev, i)}
          />
          <span className="m-device__name">
            {device.get('devicename') || device.get('mac')}
          </span>
        </div>
      );
    }

    return ret;
  }
  render() {
    const { store } = this.props;
    const myListId = store.get('curListId');
    const list = store.getIn([myListId, 'data', 'list']);
    const settings = store.getIn([myListId, 'curSettings']);
    const isLocked = store.getIn([myListId, 'curSettings', 'isLocked']);
    const myZoom = store.getIn([myListId, 'curSettings', 'zoom']);
    const actionBarChildren = [
      isLocked === '1' ? (<Button
        icon="lock"
        key="0"
        text={_('Unlock All Devices')}
        onClick={() => {
          this.props.updateListSettings({
            isLocked: '0',
          });
        }}
      />) : (<Button
        icon="unlock-alt"
        key="0"
        text={_('Lock All Devices')}
        onClick={() => {
          this.props.updateListSettings({
            isLocked: '1',
          });
        }}
      />),
      <span
        className="a-help"
        data-help={_('Help')}
        data-help-text="这是帮助文本"
      />,
    ];

    return (
      <ListInfo
        {...this.props}
        defaultEditData={defaultEditData}
        actionBarChildren={actionBarChildren}
        actionable={false}
      >
        <div className="o-map-warp">
          <div className="o-map-zoom-bar">
            <Icon
              name="minus"
              className="o-map-zoom-bar__minus"
              onClick={() => {
                this.props.updateListSettings({
                  zoom: myZoom - 10,
                });
              }}
            />
            <div className="o-map-zoom-bar__thmp" >{myZoom}%</div>
            <Icon
              name="plus"
              className="o-map-zoom-bar__plus"
              onClick={() => {
                this.props.updateListSettings({
                  zoom: myZoom + 10,
                });
              }}
            />
          </div>
          <div
            className="o-map-rf"
            onDrop={this.onDrop}
            onDragOver={this.allowDrop}
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
                list.map(this.renderDeployedDevice) :
                null
            }
          </div>
        </div>

        <div className="o-devices-list" >
          {
            list ?
              list.map(this.renderUndeployDevice) :
              null
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
    store: state.list,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    listActions,
    propertiesActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
