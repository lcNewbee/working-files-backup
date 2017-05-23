/* eslint-disable no-alert */

import React from 'react'; import PropTypes from 'prop-types';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  Icon, FormGroup, Button,
} from 'shared/components';
import { getActionable } from 'shared/axc';
import FormContainer from 'shared/components/Organism/FormContainer';
import Table from 'shared/components/Table';
import Modal from 'shared/components/Modal';
import Switchs from 'shared/components/Switchs';

import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as propertiesActions } from 'shared/containers/properties';

import '../../shared/_map.scss';
import buildingIconImg from '../../shared/images/building_3d.png';

const LIVE_GOOGLE_MAP = '0';
const LOCAL_BUILDING_LIST = '1';
let isMoniterAc = false;

// axcMonitor: 监控模式
if (window.guiConfig.versionCode >= 30900 && window.guiConfig.versionCode < 30949) {
  isMoniterAc = true;
}

const listOptions = fromJS({
  settings: [],
  list: [
    {
      id: 'name',
      label: __('Name'),
      defaultValue: 'building',
      formProps: {
        type: 'text',
        required: true,
      },
    }, {
      id: 'mapNumber',
      label: __('Map Number'),
      noForm: true,
      formProps: {
        required: true,
        type: 'number',
      },
    }, {
      id: 'address',
      label: __('Address'),
      formProps: {
        required: true,
        type: 'text',
        notEditable: true,
      },
    }, {
      id: 'lng',
      label: __('Longitude'),
      formProps: {
        type: 'number',
        min: '-180',
        max: '180',
        defaultValue: '0',
        required: true,
        help: __('e.g. %s', 123.23123231),
      },
    }, {
      id: 'lat',
      label: __('Latitude'),
      formProps: {
        type: 'number',
        min: '-90',
        max: '90',
        defaultValue: '0',
        required: true,
        help: __('e.g. %s', 43.23123231),
      },
    },
  ],
});

const listTableOptions = immutableUtils.getTableOptions(listOptions.get('list'));
const formOptions = immutableUtils.getFormOptions(listOptions.get('list'));
// const liveMapFormOptions = formOptions.re

function getCurAppScreenState(listStore, name) {
  const myStore = listStore || Map({});
  const myScreenId = myStore.get('curScreenId');
  let ret = myStore.getIn([myScreenId, 'data']);

  if (name) {
    ret = myStore.getIn([myScreenId, 'data', name]);
  }

  return ret || Map({});
}
const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  curStore: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  updateScreenSettings: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  updateScreenCustomProps: PropTypes.func,
  validateAll: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  onListAction: PropTypes.func,
  reportValidError: PropTypes.func,
  closeListItemModal: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  addListItem: PropTypes.func,
  createModal: PropTypes.func,
  saveScreenSettings: PropTypes.func,
  history: PropTypes.object,
};
const defaultProps = {};

export default class LiveMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.markers = [];

    this.state = {
      isOpenHeader: true,
      buildingIndex: -1,
    };

    utils.binds(this, [
      'onSave',
      'onCloseEditModal',
      'onRemoveItem',
      'renderActionBar',
      'onViewBuildingInfo',

      // Google Map
      'renderGoogleMap',
      'renderMarkerToGoogleMap',
      'renderGooglePlaceInput',
      'loadMapScript',

      // Baidu Map
      'renderBaiduMap',
      'renderMarkerToBaiduMap',
    ]);
  }

  componentWillMount() {
    this.actionable = getActionable(this.props);

    this.loadMapScript();

    if (this.actionable) {
      this.listTableOptions = listTableOptions.push(fromJS({
        id: 'actions',
        text: __('Actions'),
        width: 180,
        render: (val, $$item, $$option) => (
          <div className="action-btns">
            <Button
              icon="edit"
              text={__('Edit')}
              size="sm"
              onClick={() => {
                this.props.editListItemByIndex($$option.get('__index__'));
              }}
            />
            <Button
              icon="trash"
              text={__('Delete')}
              size="sm"
              onClick={() => {
                this.onRemoveItem($$item.get('id'));
              }}
            />
          </div>
        ),
      }));
    } else {
      this.listTableOptions = listTableOptions;
    }
  }

  componentWillUpdate(nextProps) {
    this.actionable = getActionable(nextProps);
  }

  componentDidUpdate(prevProps) {
    const { store } = this.props;
    const $$thisData = getCurAppScreenState(store);
    const $$prevData = getCurAppScreenState(prevProps.store);
    const curScreenId = store.get('curScreenId');
    const actionType = store.getIn([curScreenId, 'actionQuery', 'action']);
    const curType = store.getIn([curScreenId, 'curSettings', 'type']);
    const prevActionType = $$prevData.getIn([curScreenId, 'actionQuery', 'action']);
    const prevIsOpenHeader = prevActionType === 'add' || prevActionType === 'edit';
    const isOpenHeader = actionType === 'add' || actionType === 'edit';
    const thisLiveMapType = store.getIn([curScreenId, 'curSettings', 'liveMapType']);

    // 实时地图
    if (curType === '0' && this.mapContent) {
      if ($$thisData !== $$prevData) {
        this.map = null;
        this.loadMapScript();
      } else if (!this.map) {
        this.loadMapScript();
      }
      if (prevIsOpenHeader !== isOpenHeader) {
        if (thisLiveMapType === 'Google') {
          if (isOpenHeader) {
            this.renderGooglePlaceInput();
          }
        } else if (thisLiveMapType === 'Baidu') {
          if (isOpenHeader) {
            this.renderBaiduPlaceInput(actionType);
          } else if (this.placeInput) {
            this.placeInput.dispose();
            this.placeInput = null;
          }
        }
      }
    // 本地建筑列表
    } else {
      this.map = null;
    }


    // this.renderHeatMap()
  }

  onViewBuildingInfo(e, i) {
    const list = this.props.store.getIn([this.props.route.id, 'data', 'list']);
    const buildId = list.getIn([i, 'id']);

    // 过滤Button元素的点击
    if (e.target.nodeName.toLowerCase() !== 'button' &&
        e.target.parentNode.nodeName.toLowerCase() !== 'button') {
      this.props.history.push(`/main/group/map/building/${buildId}`);
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

  onRemoveItem(id) {
    this.props.changeScreenActionQuery({
      action: 'delete',
      selectedList: [id],
    });
    this.props.onListAction();
  }
  onCloseEditModal() {
    if (this.props.closeListItemModal) {
      this.props.closeListItemModal();
    }
    if (this.props.resetVaildateMsg) {
      this.props.resetVaildateMsg();
    }
  }
  loadMapScript() {
    const liveMapType = this.props.curStore.getIn(['curSettings', 'liveMapType']);

    // Google 地图
    if (liveMapType === 'Google' && this.mapContent) {
      if (window.google && window.google.maps) {
        this.renderGoogleMap();
        this.props.updateScreenCustomProps({
          loadMapStatus: 'ok',
        });
      } else {
        this.props.updateScreenCustomProps({
          loadMapStatus: 'loading',
        });
        utils.loadScript(
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyBGOC8axWomvnetRPnTdcuNW-a558l-JAU&libraries=places',
          {
            timeout: 8000,
          },
        )
        .then(
          (error) => {
            if (error) {
              this.props.updateScreenCustomProps({
                loadMapStatus: 'fail',
              });
            } else {
              this.renderGoogleMap();
              this.props.updateScreenCustomProps({
                loadMapStatus: 'ok',
              });
            }
          },
        );
      }

    // 百度地图
    } else if (liveMapType === 'Baidu' && this.mapContent) {
      if (window.BMap && window.BMap.Map) {
        this.props.updateScreenCustomProps({
          loadMapStatus: 'ok',
        });
        this.renderBaiduMap();
      } else {
        this.props.updateScreenCustomProps({
          loadMapStatus: 'loading',
        });
        utils.loadScript(
          'https://api.map.baidu.com/api?v=2.0&ak=po9QoGKxy9nyplgmTHh7SrEPGl48lzDE&callback=initializeBaidu',
          {
            timeout: 8000,
          },
        )
        .then(
          (error) => {
            if (error) {
              this.props.updateScreenCustomProps({
                loadMapStatus: 'fail',
              });
            }
          },
        );
        window.initializeBaidu = () => {
          this.renderBaiduMap();
          this.props.updateScreenCustomProps({
            loadMapStatus: 'ok',
          });
        };
      }
    }
  }

  // Baidu Map
  renderMarkerToBaiduMap(item, map, index) {
    const myIcon = new BMap.Icon(
      buildingIconImg,
      new BMap.Size(50, 50),
    );
    const point = new BMap.Point(item.get('lng'), item.get('lat'));
    // 创建标注对象并添加到地图
    const marker = new BMap.Marker(
      point,
      {
        icon: myIcon,
      },
    );
    const markerId = item.get('id');
    const contentString = `
      <div class="m-map__marker-infowindow">
        <h4>${item.get('name')}</h4>
        <div class="o-description-list">
          <dl class="o-description-list-row">
            <dt>${__('Address')}</dt>
            <dd>${item.get('address')}</dd>
          </dl>
          <dl class="o-description-list-row">
            <dt>${__('Map Number')}</dt>
            <dd>${item.get('mapNumber')}</dd>
          </dl>
        </div>
        <div class="m-map__marker-infowindow-footer">
        ${this.actionable ? (
          `<button class="a-btn a-btn--primary" id="editBulid${markerId}">
            ${__('Edit')}
          </button>`
        ) : ''}
        <button class="a-btn a-btn--info" id="viewBulid${markerId}">
          ${__('View')}
        </button>
        </div>
      </div>
    `;
    const infoWindow = new BMap.InfoWindow(contentString, {
      maxWidth: 500,
      offset: new BMap.Size(-2, -18),
    });  // 创建信息窗口对象
    const geoc = new BMap.Geocoder();
    let editButtonElem = document.getElementById(`editBulid${markerId}`);
    let viewButtonElem = document.getElementById(`viewBulid${markerId}`);

    infoWindow.addEventListener('open',
      () => {
        editButtonElem = document.getElementById(`editBulid${markerId}`);
        viewButtonElem = document.getElementById(`viewBulid${markerId}`);

        editButtonElem.addEventListener('click', () => {
          this.props.editListItemByIndex(index);

          // @@product(axcMonitor): AXC监控模式下不可修改 地址
          if (!isMoniterAc) {
            marker.enableDragging();
          }
        });
        viewButtonElem.addEventListener('click', () => {
          this.props.history.push(`/main/group/map/building/${markerId}`);
        });
      },
    );
    marker.addEventListener('click', (e) => {
      map.openInfoWindow(infoWindow, e.point);
    });

    marker.addEventListener('dragend', (e) => {
      const curPoint = e.point;

      marker.removeEventListener('click');

      geoc.getLocation(curPoint, (rs) => {
        const addComp = rs.addressComponents;
        const address = addComp.province + addComp.city + addComp.district +
            addComp.street + addComp.streetNumber;
        const newInfoWindow = new BMap.InfoWindow(address, {
          maxWidth: 300,
          height: 0,
          offset: new BMap.Size(-2, -18),
        });

        marker.addEventListener('click', (event) => {
          map.openInfoWindow(newInfoWindow, event.point);
        });

        this.props.updateCurEditListItem({
          address,
          lng: curPoint.lng,
          lat: curPoint.lat,
        });
        this.map.openInfoWindow(newInfoWindow, curPoint);
        this.placeInput.setInputValue(address);
      });
    });

    map.addOverlay(marker);

    return marker;
  }
  renderBaiduPlaceInput() {
    const myIcon = new BMap.Icon(
      buildingIconImg,
      new BMap.Size(50, 50),
    );
    const geoc = new BMap.Geocoder();
    // 创建标注对象并添加到地图
    let marker = null;

    if (!this.placeInput) {
      this.placeInput = new BMap.Autocomplete({
        input: 'address',
        location: this.map,
      });

      this.placeInput.addEventListener('onconfirm', (e) => {
        const curValue = e.item.value;
        const address = curValue.province + curValue.city + curValue.district +
            curValue.street + curValue.business;

        const local = new BMap.LocalSearch(this.map, {
          onSearchComplete: () => {
            const pp = local.getResults().getPoi(0).point;

            if (!marker) {
              marker = new BMap.Marker(
                pp,
                {
                  icon: myIcon,
                  enableDragging: true,
                },
              );
              this.map.addOverlay(marker);
              marker.addEventListener('dragend', (event) => {
                const curPoint = event.point;

                marker.removeEventListener('click');

                geoc.getLocation(curPoint, (rs) => {
                  const addComp = rs.addressComponents;
                  const curAddress = addComp.province + addComp.city + addComp.district +
                      addComp.street + addComp.streetNumber;
                  const newInfoWindow = new BMap.InfoWindow(curAddress, {
                    maxWidth: 300,
                    height: 0,
                    offset: new BMap.Size(-2, -18),
                  });

                  marker.addEventListener('click', (event1) => {
                    this.map.openInfoWindow(newInfoWindow, event1.point);
                  });

                  this.props.updateCurEditListItem({
                    address: curAddress,
                    lng: curPoint.lng,
                    lat: curPoint.lat,
                  });
                  this.map.openInfoWindow(newInfoWindow, curPoint);
                  this.placeInput.setInputValue(curAddress);
                });
              });
            } else {
              const infoWindow = new BMap.InfoWindow(address, {
                maxWidth: 300,
                height: 0,
                offset: new BMap.Size(-2, -18),
              });
              marker.setPosition(pp);
              marker.openInfoWindow(infoWindow);
            }

            this.map.centerAndZoom(pp);

            this.props.updateCurEditListItem({
              address,
              lng: pp.lng,
              lat: pp.lat,
            });
            this.placeInput.setInputValue(address);
          },
        });

        local.search(address);
      });
    }
  }
  renderBaiduMap() {
    const store = this.props.store;
    const loadMapStatus = this.props.curStore.getIn(['customProps', 'loadMapStatus']);
    const list = getCurAppScreenState(store, 'list');
    const $$settings = getCurAppScreenState(store, 'settings');
    const markers = [];
    let center = {
      lat: 39.915,
      lng: 116.404,
    };

    if (!BMap.Map || loadMapStatus !== 'ok') {
      return;
    }

    if (list.size > 0) {
      center = {
        lat: list.getIn([0, 'lat']),
        lng: list.getIn([0, 'lng']),
      };
    }

    // Create a map object and specify the DOM element for display.
    if (!this.map) {
      this.map = new BMap.Map(this.mapContent);
    }
    this.map.centerAndZoom(new BMap.Point(center.lng, center.lat), 13);
    this.map.addControl(new BMap.NavigationControl());
    this.map.addControl(new BMap.ScaleControl());
    this.map.addControl(new BMap.GeolocationControl());

    list.forEach((item, index) => {
      markers.push(this.renderMarkerToBaiduMap(item.merge($$settings), this.map, index));
    });
    this.markers = markers;
  }

  // Google Map
  renderMarkerToGoogleMap(item, map, index) {
    const apIcon = {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: '#333',
      strokeColor: '#0093ff',
    };
    const buildingIcon = {
      url: buildingIconImg, // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0), // anchor
    };
    const marker = new google.maps.Marker({
      map,
      position: {
        lat: item.get('lat'),
        lng: item.get('lng'),
      },
      icon: item.get('markerType') === 'ap' ?
          apIcon : buildingIcon,
      title: item.get('markerTitle') || '',
      // label: {
      //   text: item.get('markerTitle') || `${index}`,
      // },
      // draggable: actionType === 'add' || actionType === 'edit',
      //animation: google.maps.Animation.DROP,
    });
    const markerId = item.get('id');
    const contentString = `
      <div class="m-map__marker-infowindow">
        <h4>${item.get('name')}</h4>
        <div class="o-description-list">
          <dl class="o-description-list-row">
            <dt>${__('Address')}</dt>
            <dd>${item.get('address')}</dd>
          </dl>
          <dl class="o-description-list-row">
            <dt>${__('Map Number')}</dt>
            <dd>${item.get('mapNumber')}</dd>
          </dl>
        </div>
        <div class="m-map__marker-infowindow-footer">
        ${this.actionable ? (
          `<button class="a-btn a-btn--primary" id="editBulid${markerId}">
            ${__('Edit')}
          </button>`
        ) : ''}
        <button class="a-btn a-btn--info" id="viewBulid${markerId}">
          ${__('View')}
        </button>
        </div>
      </div>
    `;
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 500,
    });
    let editButtonElem = document.getElementById(`editBulid${markerId}`);
    let viewButtonElem = document.getElementById(`viewBulid${markerId}`);
    infowindow.addListener('domready',
      () => {
        editButtonElem = document.getElementById(`editBulid${markerId}`);
        viewButtonElem = document.getElementById(`viewBulid${markerId}`);

        editButtonElem.addEventListener('click', () => {
          this.props.editListItemByIndex(index);
          marker.setDraggable(true);
        });
        viewButtonElem.addEventListener('click', () => {
          this.props.history.push(`/main/group/map/building/${index}`);
        });
      },
    );
    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });

    map.addListener('click', () => {
      infowindow.close(map, marker);
    });

    return marker;
  }
  renderGooglePlaceInput() {
    const geocoder = new google.maps.Geocoder();
    const infowindow = new google.maps.InfoWindow();
    const buildingIcon = {
      url: buildingIconImg, // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(25, 25), // anchor
    };
    const marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      anchorPoint: new google.maps.Point(0, -29),
    });
    const input = document.getElementsByName('address');

    if (input && input[0] && !input[0].placeholder) {
      const autocomplete = new google.maps.places.Autocomplete(input[0]);
      autocomplete.bindTo('bounds', this.map);
      autocomplete.addListener('place_changed', () => {
        infowindow.close();
        marker.setVisible(false);
        const place = autocomplete.getPlace();

        if (!place.geometry) {
          window.alert("Autocomplete's returned place contains no geometry");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport);
        } else {
          this.map.setCenter(place.geometry.location);
          this.map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setIcon(buildingIcon);
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        let address = '';
        if (place.address_components) {
          address = [
            ((place.address_components[0] && place.address_components[0].short_name) || ''),
            ((place.address_components[1] && place.address_components[1].short_name) || ''),
            ((place.address_components[2] && place.address_components[2].short_name) || ''),
          ].join(' ');
        }

        this.props.updateCurEditListItem({
          address,
          lng: place.geometry.location.lng(),
          lat: place.geometry.location.lat(),
        });
        infowindow.setContent(`<div><strong>${place.name}</strong><br>${address}`);
        infowindow.open(this.map, marker);
      });
      marker.addListener('mouseup', (e) => {
        const latlng = e.latLng.toJSON();
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              infowindow.setContent(results[1].formatted_address);
              this.props.updateCurEditListItem(utils.extend({
                address: results[1].formatted_address,
              }, latlng));
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert(`Geocoder failed due to: ${status}`);
          }
        });
        infowindow.open(this.map, marker);
      });
    }
  }
  renderGoogleMap() {
    const store = this.props.store;
    const googleMapStatus = this.props.curStore.getIn(['customProps', 'loadMapStatus']);
    const list = getCurAppScreenState(store, 'list');
    const settings = getCurAppScreenState(store, 'settings');
    const google = window.google;
    const markers = [];
    let center = {
      lat: 22.554255,
      lng: 113.878773,
    };

    if (googleMapStatus !== 'ok' || (google.maps && !google.maps.Map)) {
      return;
    }

    if (list.size > 0) {
      center = {
        lat: list.getIn([0, 'lat']),
        lng: list.getIn([0, 'lng']),
      };
    }

    // Create a map object and specify the DOM element for display.
    if (!this.map) {
      this.map = new google.maps.Map(this.mapContent, {
        center,
        zoom: 13,
      });
    }
    list.forEach((item, index) => {
      markers.push(this.renderMarkerToGoogleMap(item.merge(settings), this.map, index));
    });
    if (this.isChangeMapBuilding) {
      this.renderGooglePlaceInput();
    }
    this.markers = markers;
  }

  // 头部
  renderActionBar() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const $$settings = store.getIn([myScreenId, 'curSettings']);

    return (
      <div className="m-action-bar o-form o-form--flow">
        <FormGroup className="fl">
          <Switchs
            options={[
              {
                value: '0',
                label: __('Live %s Map', $$settings.get('liveMapType')),
              }, {
                value: '1',
                label: __('Local Building List'),
              },
            ]}
            value={$$settings.get('type')}
            style={{
              marginLeft: 0,
              marginRight: '12px',
            }}
            onChange={(data) => {
              this.onCloseEditModal();
              this.props.updateScreenSettings({
                type: data.value,
              });
            }}
          />
        </FormGroup>

        {
          this.actionable ? (
            <Button
              icon="plus"
              text={__('Add')}
              theme="primary"
              onClick={
                () => {
                  this.props.addListItem();
                }
              }
            />
          ) : null
        }
        {
          $$settings.get('type') === '0' ? (
            <FormGroup
              label={__('Live Map Type')}
              type="select"
              className="fr"
              value={$$settings.get('liveMapType')}
              options={[
                {
                  value: 'Baidu',
                  label: 'Baidu',
                },
                {
                  value: 'Google',
                  label: 'Google',
                },
              ]}
              onChange={(data) => {
                this.props.createModal({
                  type: 'confirm',
                  text: __('Switching the live map type will clear all deployed AP data, are you sure you want to switch?'),
                  apply: () => {
                    this.props.updateScreenSettings({
                      liveMapType: data.value,
                    });
                    this.props.saveScreenSettings();
                  },
                });
              }}
            />
          ) : null
        }
      </div>
    );
  }
  render() {
    const { app, store } = this.props;
    const myScreenId = store.get('curScreenId');
    const settings = store.getIn([myScreenId, 'curSettings']);
    const actionQuery = store.getIn([myScreenId, 'actionQuery']);
    const list = store.getIn([myScreenId, 'data', 'list']);
    const page = store.getIn([myScreenId, 'data', 'page']);
    const editData = store.getIn([myScreenId, 'curListItem']);
    const isOpenHeader = actionQuery.get('action') === 'add' || actionQuery.get('action') === 'edit';
    const googleMapStatus = this.props.curStore.getIn(['customProps', 'loadMapStatus']);
    let myFormOptions = formOptions;
    let mapClassName = 'o-map';

    if (isOpenHeader) {
      mapClassName = 'o-map o-map--open';
    }

    // @@product(axcMonitor): 地理位置设置为不可修改
    if (isMoniterAc && actionQuery.get('action') === 'edit') {
      myFormOptions = myFormOptions.map(
        ($$item) => {
          const itemId = $$item.get('id');

          switch (itemId) {
            case 'lng':
            case 'lat':
            case 'address':
              return $$item.set('readOnly', true);

            default:
              break;
          }

          return $$item;
        },
      );
    }
    this.isChangeMapBuilding = isOpenHeader && settings.get('type') === LIVE_GOOGLE_MAP;
    return (
      <AppScreen
        {...this.props}
        initOption={{
          defaultSettingsData: {
            type: '0',
          },
        }}
        actionable
        noTitle
        addable
      >
        {
          this.renderActionBar()
        }
        {
          // 实时google地图
          settings.get('type') === LIVE_GOOGLE_MAP ? (
            <div className={mapClassName}>
              <div className="o-map__header">
                <Icon
                  name="arrow-circle-up"
                  className="o-map__header-close"
                  onClick={() => this.props.closeListItemModal()}
                />
                {
                  // 实时地图中添加建筑
                  isOpenHeader ? (
                    <FormContainer
                      data={editData}
                      options={
                        myFormOptions.deleteIn([-1]).deleteIn([-1])
                      }
                      onSave={this.onSave}
                      onChangeData={this.props.updateCurEditListItem}
                      onValidError={this.props.reportValidError}
                      invalidMsg={app.get('invalid')}
                      validateAt={app.get('validateAt')}
                      isSaving={app.get('saving')}
                      className="o-form--flow container"
                      hasSaveButton
                    />
                  ) : null
                }
              </div>
              <div className="o-map__content">
                <div
                  className="o-map__body"
                  id="liveMapContainer"
                  ref={(elem) => {
                    if (elem) {
                      this.mapContent = elem;
                    }
                  }}
                >
                  <div className="o-map__body-loading">
                    {
                      googleMapStatus === 'fail' ? (
                        <Button
                          className="fail"
                          theme="primary"
                          text={__('Reload')}
                          onClick={() => {
                            this.loadMapScript(this.props.curStore.getIn(['curSettings', 'liveMapType']));
                          }}
                        />
                      ) : null
                    }
                    {
                      googleMapStatus !== 'ok' && googleMapStatus !== 'fail' ? <Icon name="spinner" size="2x" spin /> : null
                    }
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <Table
              className="table"
              options={this.listTableOptions}
              list={list}
              page={page}
              onPageChange={this.onPageChange}
              onRowClick={this.onViewBuildingInfo}
              loading={app.get('fetching')}
            />
          )
        }
        {
          // 本地地图中添加或编辑建筑
          settings.get('type') === LOCAL_BUILDING_LIST ? (
            <Modal
              isShow={
                actionQuery.get('action') === 'edit' ||
                actionQuery.get('action') === 'add'
              }
              title={actionQuery.get('myTitle')}
              onOk={this.onSave}
              onClose={this.onCloseEditModal}
              size="md"
              noFooter
              draggable
            >
              <FormContainer
                data={editData}
                options={myFormOptions}
                onSave={this.onSave}
                onChangeData={this.props.updateCurEditListItem}
                onValidError={this.props.reportValidError}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                isSaving={app.get('saving')}
                hasSaveButton
              />
            </Modal>
          ) : null
        }
      </AppScreen>
    );
  }
}

LiveMap.propTypes = propTypes;
LiveMap.defaultProps = defaultProps;

function mapStateToProps(state) {
  const curScreenId = state.screens.get('curScreenId');
  return {
    app: state.app,
    store: state.screens,
    curStore: state.screens.get(curScreenId),
    groupid: state.product.getIn(['group', 'selected', 'id']),
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
)(LiveMap);
