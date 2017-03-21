import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import Button from 'shared/components/Button/Button';
import Icon from 'shared/components/Icon';
import { getActionable } from 'shared/axc';
import FormContainer from 'shared/components/Organism/FormContainer';
import Table from 'shared/components/Table';
import Modal from 'shared/components/Modal';
import Switchs from 'shared/components/Switchs';
import AppScreen from 'shared/components/Template/AppScreen';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';
import h337 from 'heatmap.js';

import '../../shared/_map.scss';
import buildingIconImg from '../../shared/images/building_3d.png';

const LIVE_GOOGLE_MAP = '0';
const LOCAL_BUILDING_LIST = '1';

const listOptions = fromJS({
  settings: [],
  list: [
    {
      id: 'name',
      label: _('Name'),
      defaultValue: 'building',
      formProps: {
        type: 'text',
        required: true,
      },
    }, {
      id: 'mapNumber',
      label: _('Map Number'),
      noForm: true,
      formProps: {
        required: true,
        type: 'number',
      },
    }, {
      id: 'address',
      label: _('Address'),
      formProps: {
        required: true,
        type: 'text',
      },
    }, {
      id: 'lat',
      label: _('lat'),
      formProps: {
        type: 'text',
      },
    }, {
      id: 'lng',
      label: _('lng'),
      formProps: {
        type: 'text',
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
  route: PropTypes.object,
  updateScreenSettings: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  validateAll: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  onListAction: PropTypes.func,
  reportValidError: PropTypes.func,
  closeListItemModal: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
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
      'renderGoogleMap',
      'renderActionBar',
      'addMarkerToMap',
      'onViewBuildingInfo',
      'renderGooglePlaceInput',
      // 'renderHeatMap',
    ]);

    this.loadingGoogleMap = true;
  }

  componentWillMount() {
    this.actionable = getActionable(this.props);

    if (!window.google || (window.google && !window.google.maps)) {
      utils.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBGOC8axWomvnetRPnTdcuNW-a558l-JAU&libraries=places',
        (error) => {
          if (!error) {
            this.renderGoogleMap();
            this.loadingGoogleMap = false;
          } else {
            this.props.updateScreenSettings({
              type: '1',
            });
          }
        },
      8000);
    } else if (this.mapContent) {
      this.renderGoogleMap();
      this.loadingGoogleMap = false;
    }

    if (this.actionable) {
      this.listTableOptions = listTableOptions.push(fromJS({
        id: 'actions',
        text: _('Actions'),
        width: '180',
        transform: (val, $$item, index) => (
          <div className="action-btns">
            <Button
              icon="edit"
              text={_('Edit')}
              size="sm"
              onClick={() => {
                this.props.editListItemByIndex(index);
              }}
            />
            <Button
              icon="trash"
              text={_('Delete')}
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

    // console.log('didmount', this.mapContent);
    // this.heatmap = h337.create({
    //   container: this.mapContent,
    //   radius: 10,
    //   maxOpacity: .3,
    //   minOpacity: 0,
    //   blur: .75
    // });
  }

  componentDidMount() {
    if (this.mapContent) {
      this.heatmap = h337.create({
        container: this.mapContent,
        radius: 10,
        maxOpacity: .3,
        minOpacity: 0,
        blur: .75
      });
      // this.renderHeatMap();
    }
  }

  componentWillUpdate(nextProps) {
    this.actionable = getActionable(nextProps);
  }

  componentDidUpdate(prevProps) {
    const $$thisData = getCurAppScreenState(this.props.store);
    const $$prevData = getCurAppScreenState(prevProps.store);
    const curScreenId = this.props.store.get('curScreenId');
    const curType = this.props.store.getIn([curScreenId, 'curSettings', 'type']);

    // google 实时地图
    if (curType === '0') {
      if (typeof window.google !== 'undefined' && this.mapContent) {
        if (!this.map) {
          this.renderGoogleMap();
        } else if ($$thisData !== $$prevData) {
          // 服务器数据更新需要清空地图
          this.map = null;
          this.renderGoogleMap();
        }

        if (this.isGoogleMapAdd) {
          this.renderGooglePlaceInput();
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

  setMapOnAll(map) {
    const markers = this.markers;

    for (let i = 0; i < markers.length; i += 1) {
      markers[i].setMap(map);
    }
  }
  addMarkerToMap(item, map, index) {
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
      position: {
        lat: item.get('lat'),
        lng: item.get('lng'),
      },
      icon: item.get('markerType') === 'ap' ?
          apIcon : buildingIcon,
      title: item.get('markerTitle') || '',
      label: {
        text: item.get('markerTitle') || `${index}`,
      },
      draggable: item.get('isLocked') !== '1',
      animation: google.maps.Animation.DROP,
    });
    const markerId = item.get('id');
    const contentString = `${'<div class="m-map__marker-infowindow">' +
                            '<h4>'}${  item.get('name')  }</h4>` +
                            `<div class="o-description-list">` +
                              `<dl class="o-description-list-row">` +
                                `<dt>${  _('Address')  }</dt>` +
                                `<dd>${  item.get('address')  }</dd>` +
                              `</dl>` +
                              `<dl class="o-description-list-row">` +
                                `<dt>${  _('Map Number')  }</dt>` +
                                `<dd>${  item.get('mapNumber')  }</dd>` +
                              `</dl>` +
                            `</div>` +
                            `<div class="m-map__marker-infowindow-footer">${
                              this.actionable ? ('<button class="a-btn a-btn--primary" id="editBulid' + markerId + '">' + _('Edit') + '</button>') : ''
                              }<button class="a-btn a-btn--info" id="viewBulid${  markerId  }">${  _('View')  }</button>` +
                            `</div>` +
                          `</div>`;
    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 500,
    });
    let editButtonElem = document.getElementById(`editBulid${markerId}`);
    let viewButtonElem = document.getElementById(`viewBulid${markerId}`);

    marker.addListener('click', () => {
      infowindow.open(map, marker);
      editButtonElem = document.getElementById(`editBulid${markerId}`);
      viewButtonElem = document.getElementById(`viewBulid${markerId}`);

      if (!editButtonElem.inited) {
        editButtonElem.addEventListener('click', () => {
          this.props.editListItemByIndex(index);
        });
        viewButtonElem.addEventListener('click', () => {
          this.props.history.push(`/main/group/map/building/${index}`);
        });
      }
    });
    marker.addListener('mouseup', () => {
      // console.log(e.latLng.toJSON());
    });

    this.map.addListener('click', () => {
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
    const list = getCurAppScreenState(store, 'list');
    const settings = getCurAppScreenState(store, 'settings');
    const google = window.google;
    const markers = [];
    let center = {
      lat: -34.397,
      lng: 150.644,
    };

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
     // console.log('init Map = ', this.map)
    }

    this.setMapOnAll(null);
    list.forEach((item, index) => {
      markers.push(this.addMarkerToMap(item.merge(settings), this.map, index));
    });
    this.markers = markers;
    this.setMapOnAll(this.map);
  }

  renderActionBar() {
    const { store } = this.props;
    const myScreenId = store.get('curScreenId');
    const settings = store.getIn([myScreenId, 'curSettings']);
    const lockButton = null;
    // const lockButton = (
    //   settings.get('isLocked') === '1' ? (
    //     <Button
    //       icon="lock"
    //       key="0"
    //       text={_('Unlock Map')}
    //       onClick={() => {
    //         this.props.updateScreenSettings({
    //           isLocked: '0',
    //         });
    //       }}
    //     />
    //   ) : (
    //     <Button
    //       icon="unlock-alt"
    //       key="2"
    //       text={_('Lock Map')}
    //       onClick={() => {
    //         this.props.updateScreenSettings({
    //           isLocked: '1',
    //         });
    //       }}
    //     />
    //   )
    // );

    return (
      <div className="m-action-bar" key="actionBar">
        <Switchs
          options={[
            {
              value: '0',
              label: _('Live Google Map'),
            }, {
              value: '1',
              label: _('Local Building List'),
            },
          ]}
          key="list"
          value={settings.get('type')}
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
        {
          this.actionable ? (
            <Button
              icon="plus"
              text={_('Add')}
              theme="primary"
              onClick={
                () => this.props.changeScreenActionQuery({
                  action: 'add',
                  myTitle: _('Add Building'),
                })
              }
            />
          ) : null
        }
        { ((settings.get('type') === '0') && this.actionable) ? lockButton : null }
      </div>
    );
  }

  // renderHeatMap() {
  //   const heatmap = h337.create({
  //     container: this.mapContent,
  //     radius: 10,
  //     maxOpacity: .3,
  //     minOpacity: 0,
  //     blur: .75
  //   });
  //   console.log(this.mapContent.getElementsByTagName('canvas'));
  //   const width = this.mapContent.offsetWidth;
  //   const height = this.mapContent.offsetHeight;
  //   const data = [];
  //   for (let i = 0; i < 100; i++) {
  //     for (let j = 0; j < 100; j++) {
  //       data.push({ x: Math.floor(width * Math.random()), y: Math.floor(height * Math.random()), value: Math.floor(Math.random() * 100) });
  //     }
  //   }
  //   heatmap.setData({
  //     max: 100,
  //     min: 0,
  //     data: data,
  //   });

  //   let nodes = this.mapContent.getElementsByTagName('canvas');
  //   for ( let i = 0; i < nodes.length - 1; i++) {
  //     this.mapContent.removeChild(nodes[1]);
  //   }
  // }

  render() {
    const { app, store } = this.props;
    const myScreenId = store.get('curScreenId');
    const settings = store.getIn([myScreenId, 'curSettings']);
    const actionQuery = store.getIn([myScreenId, 'actionQuery']);
    const list = store.getIn([myScreenId, 'data', 'list']);
    const page = store.getIn([myScreenId, 'data', 'page']);
    const editData = store.getIn([myScreenId, 'curListItem']);
    const isOpenHeader = actionQuery.get('action') === 'add' || actionQuery.get('action') === 'edit';
    let mapClassName = 'o-map';

    if (isOpenHeader) {
      mapClassName = 'o-map o-map--open';
    }

    this.isGoogleMapAdd = isOpenHeader && settings.get('type') === LIVE_GOOGLE_MAP;
    return (
      <AppScreen
        {...this.props}
        defaultSettingsData={{
          type: '0',
        }}
        actionable
        noTitle
        addable
      >
        {
          this.renderActionBar()
        }
        {
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
                        formOptions.deleteIn([-1]).deleteIn([-1])
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
                    <Icon name="spinner" size="2x" spin />
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
                options={formOptions}
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
  return {
    app: state.app,
    store: state.screens,
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
