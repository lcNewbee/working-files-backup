import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { bindActionCreators } from 'redux';
import {
  Button, ListInfo, Icon, FormContainer,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';
import * as propertiesActions from 'shared/actions/properties';

import './_map.scss';

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
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.markers = [];

    this.state = {
      isOpenHeader: true,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSave = this.onSave.bind(this);
    this.renderGoogleMap = this.renderGoogleMap.bind(this);
    this.addMarkerToMap = this.addMarkerToMap.bind(this);
  }

  componentDidMount() {
    utils.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyBGOC8axWomvnetRPnTdcuNW-a558l-JAU&libraries=places',
      () => {
        this.renderGoogleMap();
      }
    );
  }

  componentDidUpdate(prevProps) {
    const thisList = this.getCurListInfoState(this.props.store, 'list');
    const prevList = this.getCurListInfoState(prevProps.store, 'list');
    const thisSettings = this.getCurListInfoState(this.props.store, 'settings');
    const prevSettings = this.getCurListInfoState(prevProps.store, 'settings');

    if (typeof window.google !== 'undefined' && this.mapContent) {
      if (!this.map) {
        this.renderGoogleMap();
      } else if (!prevSettings.equals(thisSettings) || !prevList.equals(thisList)) {
        this.renderGoogleMap();
      }
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

  getCurListInfoState(listStore, name) {
    const myStore = listStore || Map({});
    const myListId = myStore.get('curListId');
    let ret = myStore.getIn([myListId, 'data']);

    if (name) {
      ret = myStore.getIn([myListId, 'data', name]);
    }
    return ret || Map({});
  }
  setMapOnAll(map) {
    const markers = this.markers;

    for (let i = 0; i < markers.length; i++) {
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
      path: google.maps.SymbolPath.CIRCLE,
      scale: 12,
      fillColor: '#333',
      strokeColor: 'green',
    };
    const marker = new google.maps.Marker({
      position: {
        lat: item.get('lat'),
        lng: item.get('lng'),
      },
      icon: item.get('markerType') === 'ap' ?
          apIcon : buildingIcon,
      title: item.get('markerTitle'),
      label: {
        text: item.get('markerTitle'),
      },
      draggable: item.get('isLocked') !== '1',
      // animation: google.maps.Animation.DROP,
    });
    const contentString = '<div id="content">' +
                            '<h4>测试</h4>' +
                            '<dl><dt>当前流量</dt>' +
                            '<dd>15.23Mbps</dd></dl>' +
                          '</div>';

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 500,
    });

    marker.addListener('click', () => {
      infowindow.open(map, marker);

      if (item.get('markerType') === 'ap') {
        this.props.addToPropertyPanel();
      } else {
        this.props.editListItemByIndex(index);
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

  renderGoogleMap() {
    const store = this.props.store;
    const list = this.getCurListInfoState(store, 'list');
    const settings = this.getCurListInfoState(store, 'settings');
    const google = window.google;
    const geocoder = new google.maps.Geocoder();
    const markers = [];
    let center = {
      lat: -34.397,
      lng: 150.644,
    };
    const infowindow = new google.maps.InfoWindow();


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
        zoom: 8,
      });
     // console.log('init Map = ', this.map)
    }
    const marker = new google.maps.Marker({
      map: this.map,
      draggable: true,
      anchorPoint: new google.maps.Point(0, -29),
    });
    const input = document.getElementsByName('markerAddress');

    if (input && input[0]) {
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
        marker.setIcon(/** @type {google.maps.Icon} */({
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(35, 35),
        }));
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

        infowindow.setContent(`<div><strong>${place.name}</strong><br>${address}`);
        infowindow.open(this.map, marker);
      });
      marker.addListener('mouseup', (e) => {
        const latlng = e.latLng.toJSON();
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
              infowindow.setContent(results[1].formatted_address);
              this.props.updateEditListItem({
                markerAddress: results[1].formatted_address,
              });
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert(`Geocoder failed due to: ${status}`);
          }
        });
      });
    }

    this.setMapOnAll(null);
    list.forEach((item, index) => {
      markers.push(this.addMarkerToMap(item.merge(settings), this.map, index));
    });
    this.markers = markers;
    this.setMapOnAll(this.map);
  }

  render() {
    const { app, store } = this.props;
    const settings = this.getCurListInfoState(store, 'settings');
    const editData = this.getCurListInfoState(store, 'edit');
    const actionBarChildren = [
      settings.get('isLocked') === '1' ? (<Button
        icon="lock"
        key="0"
        text={_('Unlock Map')}
        onClick={() => {
          this.props.updateListSettings({
            isLocked: '0',
          });
        }}
      />) : (<Button
        icon="unlock-alt"
        key="0"
        text={_('Lock Map')}
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
    const isOpenHeader = !editData.isEmpty();
    let mapClassName = 'o-map';

    if (isOpenHeader) {
      mapClassName = 'o-map o-map--open';
    }

    return (
      <ListInfo
        {...this.props}
        defaultEditData={defaultEditData}
        actionBarChildren={actionBarChildren}
        actionable
      >
        <div className={mapClassName}>
          <div className="o-map__header">
            <Icon
              name="arrow-circle-up"
              size="1x"
              className="o-map__header-close"
              onClick={() => this.props.closeListItemModal()}
            />
            {
              !editData.isEmpty() ? (
                <FormContainer
                  data={editData}
                  options={formOptions}
                  onSave={this.onSave}
                  onChangeData={this.props.updateEditListItem}
                  onValidError={this.props.reportValidError}
                  invalidMsg={app.get('invalid')}
                  validateAt={app.get('validateAt')}
                  isSaving={app.get('saving')}
                  className="o-form--block"
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
