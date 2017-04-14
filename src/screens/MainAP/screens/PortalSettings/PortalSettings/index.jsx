import React, { Component } from 'react'; import PropTypes from 'prop-types';
import FormGroup from 'shared/components/Form/FormGroup';
import FileUpload from 'shared/components/FileUpload';
import { Button, SaveButton } from 'shared/components/Button';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import { actions as settingActions } from 'shared/containers/settings';
import * as selfActions from './actions';
// import reducer from './reducer';
import './style.scss';

const MSG = {
  Seconds: __('Seconds'),
  minutes: __('Minutes'),
  hour: __('Hour'),
  hours: __('Hours'),
  days: __('Days'),
  userDef: __('User Defined'),
  imageDes: __('Select 1-3 slide pictures of dimension 640px*640px'),
};

const expirationOptions = [
  {
    value: '600',
    label: `10 ${MSG.minutes}`,
  }, {
    value: '1200',
    label: `20 ${MSG.minutes}`,
  }, {
    value: '1800',
    label: `30 ${MSG.minutes}`,
  }, {
    value: '3600',
    label: `1 ${MSG.hour}`,
  }, {
    value: '14400',
    label: `4 ${MSG.hours}`,
  }, {
    value: '28800',
    label: `8 ${MSG.hours}`,
  }, {
    value: '86400',
    label: `24 ${MSG.hours}`,
  }, {
    value: '172800',
    label: `2 ${MSG.days}`,
  }, {
    value: '259200',
    label: `3 ${MSG.days}`,
  }, {
    value: '432000',
    label: `5 ${MSG.days}`,
  }, {
    value: '604800',
    label: `7 ${MSG.days}`,
  }, {
    value: '1296000',
    label: `15 ${MSG.days}`,
  }, {
    value: '2592000',
    label: `30 ${MSG.days}`,
  },
];

const refreshtimeOtions = [
  {
    value: '2',
    label: `2 ${MSG.Seconds}`,
  }, {
    value: '3',
    label: `3 ${MSG.Seconds}`,
  }, {
    value: '5',
    label: `5 ${MSG.Seconds}`,
    default: true,
  }, {
    value: '10',
    label: `10 ${MSG.Seconds}`,
  }, {
    value: '20',
    label: `20 ${MSG.Seconds}`,
  },
];

const propTypes = {
  fetchSettings: PropTypes.func,
  initSettings: PropTypes.func,
  route: PropTypes.object,
  app: PropTypes.object,
  save: PropTypes.func,
  store: PropTypes.instanceOf(Map),
  updateItemSettings: PropTypes.func,
};

const defaultProps = {
};

export default class PortalSettings extends Component {
  constructor(props) {
    super(props);
    this.selectShowImage = this.selectShowImage.bind(this);
    this.refreshPicture = this.refreshPicture.bind(this);
    this.state = {
      activeImageIndex: 1,
    };
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      saveUrl: this.props.route.saveUrl,
    });
    this.props.fetchSettings();
  }

  selectShowImage(i) {
    this.setState({
      activeImageIndex: i,
    });
  }

  refreshPicture(i) {
    const rand = Math.random();
    const preUrl = this.props.store.getIn(['curData', 'imageList', i, 'url']).split('?')[0];
    const url = `${preUrl}?rand=${rand}`;
    const imageList = this.props.store.getIn(['curData', 'imageList']).setIn([i, 'url'], url);
    this.props.updateItemSettings({ imageList });
  }

  render() {
    const activeIndex = this.state.activeImageIndex;
    const curImgUrl = this.props.store.getIn(['curData', 'imageList', activeIndex - 1, 'url']) || '';
    const {
      enable, redirectUrl, timeout, refreshTime, title, shopId, appId, secretKey, weixinEnable,
    } = this.props.store.get('curData').toJS();

    return (
      <div className="row">
        <h3>{__('Portal Settings')}</h3>
        <div className="cols cols-7">
          <FormGroup
            label={__('Portal Enable')}
            type="checkbox"
            maxLength="32"
            checked={enable === '1'}
            onChange={() => {
              const val = enable === '1' ? '0' : '1';
              this.props.updateItemSettings({ enable: val });
            }}
            required
          />
          <FormGroup
            label={__('Auth Type')}
            type="select"
            value={weixinEnable === '1' ? 'weixin' : 'web'}
            options={[
              { label: __('WEB AUTH'), value: 'web' },
              { label: __('WEIXIN AUTH'), value: 'weixin' },
            ]}
            onChange={(data) => {
              if (data.value === 'weixin') {
                this.props.updateItemSettings({ weixinEnable: '1' });
              } else {
                this.props.updateItemSettings({ weixinEnable: '0' });
              }
            }}
          />
          {
            this.props.store.getIn(['curData', 'weixinEnable']) === '1' ? (
              <div>
                <FormGroup
                  type="text"
                  label={__('shopId')}
                  value={shopId}
                  onChange={(data) => {
                    this.props.updateItemSettings({ shopId: data.value });
                  }}
                />
                <FormGroup
                  type="text"
                  label={__('appId')}
                  value={appId}
                  onChange={(data) => {
                    this.props.updateItemSettings({ appId: data.value });
                  }}
                />
                <FormGroup
                  type="text"
                  label={__('secretKey')}
                  value={secretKey}
                  onChange={(data) => {
                    this.props.updateItemSettings({ secretKey: data.value });
                  }}
                />
              </div>
            ) : (
              <div>
                <FormGroup
                  label={__('Auth Redirect URL')}
                  type="text"
                  value={redirectUrl}
                  onChange={(data) => {
                    this.props.updateItemSettings({ redirectUrl: data.value });
                  }}
                  required
                />
                <FormGroup
                  label={__('Portal Title')}
                  type="text"
                  value={title}
                  onChange={(data) => {
                    this.props.updateItemSettings({ title: data.value });
                  }}
                  required
                />
                <FormGroup
                  label={__('Expiration')}
                  type="select"
                  options={expirationOptions}
                  value={timeout}
                  onChange={(data) => {
                    this.props.updateItemSettings({ timeout: data.value });
                  }}
                  required
                />
                <FormGroup
                  label={__('Images Slide Interval')}
                  type="select"
                  options={refreshtimeOtions}
                  value={refreshTime}
                  onChange={(data) => {
                    this.props.updateItemSettings({ refreshTime: data.value });
                  }}
                  required
                />
                <FormGroup>
                  <FileUpload
                    url="cgi-bin/upload_file.cgi?id=1"
                    buttonText={`${__('Upload Image')} 1`}
                    onUploaded={() => {
                      this.selectShowImage(1);
                      this.refreshPicture(0);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <FileUpload
                    url="cgi-bin/upload_file.cgi?id=2"
                    buttonText={`${__('Upload Image')} 2`}
                    onUploaded={() => {
                      this.selectShowImage(2);
                      this.refreshPicture(1);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <FileUpload
                    url="cgi-bin/upload_file.cgi?id=3"
                    buttonText={`${__('Upload Image')} 3`}
                    onUploaded={() => {
                      this.selectShowImage(3);
                      this.refreshPicture(2);
                    }}
                  />
                </FormGroup>
              </div>
            )
          }
          <div className="form-group form-group--save">
            <div className="form-control">
              <SaveButton
                loading={this.props.app.loading}
                onClick={() => {
                  const saveData = this.props.store.get('curData').delete('imageList').toJS();
                  this.props.save(this.props.route.saveUrl, saveData);
                }}
              />
            </div>
          </div>
        </div>
        {
          weixinEnable === '1' ? null : (
            <div className="cols col-5">
              <div className="o-preview-iphone">
                <div className="o-preview-iphone__body">
                  <div className="carousel">
                    {
                      curImgUrl ? (
                        <img
                          src={curImgUrl}
                          alt={activeIndex}
                        />
                      ) : null
                    }
                    <ul className="carousel-indicators">
                      {
                        [1, 2, 3].map(
                          (val) => {
                            let myClassName = '';

                            if (val === activeIndex) {
                              myClassName = 'active';
                            }

                            return (
                              <li
                                className={myClassName}
                                onClick={() => this.selectShowImage(val)}
                                key={val}
                              >
                                {val}
                              </li>
                            );
                          },
                        )
                      }
                    </ul>
                  </div>
                  <h4 className="o-preview-iphone__body-title">{this.props.store.getIn(['curData', 'title'])}</h4>
                  <Button
                    type="button"
                    icon="sphere"
                    theme="primary"
                    text={__('Click on Internet')}
                    id="online"
                  />
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

PortalSettings.propTypes = propTypes;
PortalSettings.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.portalsettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    settingActions,
    selfActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PortalSettings);

// export const portalsettings = reducer;

