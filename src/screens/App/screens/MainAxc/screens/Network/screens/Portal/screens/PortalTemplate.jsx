import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import AppScreen from 'shared/components/Template/AppScreen';
import FileUploads from 'shared/components/FileUpload';
import FormGroup from 'shared/components/Form/FormGroup';
import { Button, SaveButton } from 'shared/components/Button';
import FormContainer from 'shared/components/Organism/FormContainer';
import * as appActions from 'shared/actions/app';
import * as screenActions from 'shared/actions/screens';

import '../style.scss';

const MSG = {
  Seconds: _('Seconds'),
  minutes: _('Minutes'),
  hour: _('Hour'),
  hours: _('Hours'),
  days: _('Days'),
  userDef: _('User Defined'),
  imageDes: _('Select 1-3 slide pictures of dimension 640px*640px'),
};
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
// minutes
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
const screenOptions = fromJS([
  {
    id: 'template_name',
    label: _('Portal Name'),
    formProps: {
      type: 'text',
      maxLength: '32',
      required: true,
    },
  }, {
    id: 'authRedirectUrl',
    label: _('Auth Redirect URL'),
    defaultValue: '0',
    formProps: {
      type: 'text',
    },
  }, {
    id: 'portalTitle',
    label: _('Portal Title'),
    formProps: {
      type: 'text',
    },
  }, {
    id: 'expiration',
    label: _('Expiration'),
    options: expirationOptions,
    formProps: {
      type: 'select',
    },
  }, {
    id: 'imagesSlideInterval',
    label: _('Images Slide Interval'),
    options: refreshtimeOtions,
    formProps: {
      type: 'select',
    },
  },
]);
const formOptions = immutableUtils.getFormOptions(screenOptions);
const defaultSettingData = immutableUtils.getDefaultData(screenOptions);
const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  saveSettings: PropTypes.func,
  updateScreenSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
  createModal: PropTypes.func,
};
const defaultProps = {};

export default class PortalProfile extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    utils.binds(this, ['onSave', 'selectShowImage']);
    this.state = {
      activeImageIndex: 1,
    };
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }

  onSave() {
    this.props.saveSettings();
  }

  selectShowImage(i) {
    this.setState({
      activeImageIndex: i,
    });
  }

  render() {
    const { store, app, updateScreenSettings } = this.props;
    const myFormOptions = formOptions;
    const myScreenId = store.get('curScreenId');
    const curSettings = store.getIn([myScreenId, 'curSettings']);
    const activeIndex = this.state.activeImageIndex;
    const curImgUrl = store.getIn(
      [myScreenId, 'curSettings', 'images', activeIndex - 1, 'url'],
    ) || '';

    return (
      <AppScreen
        {...this.props}
        defaultSettingData={defaultSettingData}
        actionable={false}
        customSettingForm
        noTitle
      >
        <div className="row">
          <iframe id="imagesIf" name="imagesIf" className="none" />
          <div className="cols col-7">
            <FormContainer
              options={myFormOptions}
              data={curSettings}
              onChangeData={updateScreenSettings}
              onSave={this.onSaveSettings}
              invalidMsg={app.get('invalid')}
              validateAt={app.get('validateAt')}
              isSaving={app.get('saving')}
              hasSaveButton={false}
            />
            <div className="o-form">
              <p className="o-form__p">{MSG.imageDes}</p>
              <FormGroup label=" ">
                <FileUploads
                  url="goform/uploadPortalImage"
                  name="image1"
                  target="imagesIf"
                  acceptExt="png,gif,jpg,bmp"
                  createModal={this.props.createModal}
                  buttonText={`${_('Upload Image')} 1`}
                  onUploaded={
                    () => this.selectShowImage(1)
                  }
                />
              </FormGroup>
              <FormGroup label=" ">
                <FileUploads
                  url="goform/uploadPortalImage"
                  name="image2"
                  acceptExt="png,gif,jpg,bmp"
                  createModal={this.props.createModal}
                  buttonText={`${_('Upload Image')} 2`}
                  onUploaded={
                    () => this.selectShowImage(2)
                  }
                />
              </FormGroup>
              <FormGroup label=" ">
                <FileUploads
                  url="goform/uploadPortalImage"
                  name="image3"
                  target="imagesIf"
                  acceptExt="png,gif,jpg,bmp"
                  createModal={this.props.createModal}
                  buttonText={`${_('Upload Image')} 3`}
                  onUploaded={
                    () => this.selectShowImage(3)
                  }
                />
              </FormGroup>
              <div className="form-group form-group--save">
                <div className="form-control">
                  <SaveButton
                    text={_('Save')}
                    id="online"
                  />
                </div>
              </div>
            </div>
          </div>
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
                            >
                              {val}
                            </li>
                          );
                        },
                      )
                    }
                  </ul>
                </div>
                <h4 className="o-preview-iphone__body-title">{curSettings.get('portalTitle')}</h4>
                <Button
                  type="button"
                  icon="sphere"
                  theme="primary"
                  text={_('Click on Internet')}
                  id="online"
                />
              </div>
            </div>
          </div>
        </div>
      </AppScreen>
    );
  }
}

PortalProfile.propTypes = propTypes;
PortalProfile.defaultProps = defaultProps;

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
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PortalProfile);
