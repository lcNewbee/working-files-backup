import React, { PropTypes } from 'react';
import utils, { immutableUtils } from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import ListInfo from 'shared/components/Template/ListInfo';
import FileUploads from 'shared/components/FileUpload';
import FormGroup from 'shared/components/Form/FormGroup';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';
import * as listActions from 'shared/actions/list';

import './index.scss';

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
  },
];
const screenOptions = fromJS([
  {
    id: 'portalName',
    label: _('Portal Name'),
    legend: _('Base Settings'),
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

  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
  createModal: PropTypes.func,
};
const defaultProps = {};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }

  onSave() {
    this.props.saveSettings();
  }

  render() {
    const { store } = this.props;
    const myFormOptions = formOptions;
    const myListId = store.get('curListId');
    const images = store.getIn([myListId, 'curSettings', 'images']);

    return (
      <ListInfo
        {...this.props}
        settingsFormOption={myFormOptions}
        defaultSettingData={defaultSettingData}
        actionable={false}
        hasSettingsSaveButton
        noTitle
      >
        <iframe id="imagesIf" name="imagesIf" className="none" />
        <div className="o-form">
          <fieldset className="o-form__fieldset">
            <legend className="o-form__legend">{_('Upload Image')}</legend>
            <p className="o-form__p">{MSG.imageDes}</p>
            <div className="images-list">
              {
                images ? images.map(
                  (item, i) => <img alt={`image ${i + 1}`} src={item.get('url')} key={item.get('count')} />
                ) : null
              }
            </div>
            <FormGroup label=" ">
              <FileUploads
                url="/goform/uploadPortalImage"
                name="image1"
                target="imagesIf"
                formData={{

                }}
                acceptExt="png,gif,jpg,bmp"
                createModal={this.props.createModal}
                buttonText={_('Upload Image') + ' 1'}
              />
            </FormGroup>
            <FormGroup label=" ">
              <FileUploads
                url="/goform/uploadPortalImage"
                name="image2"
                acceptExt="png,gif,jpg,bmp"
                createModal={this.props.createModal}
                buttonText={_('Upload Image') + ' 2'}
              />
            </FormGroup>
            <FormGroup label=" ">
              <FileUploads
                url="/goform/uploadPortalImage"
                name="image3"
                target="imagesIf"
                acceptExt="png,gif,jpg,bmp"
                createModal={this.props.createModal}
                buttonText={_('Upload Image') + ' 3'}
              />
            </FormGroup>
          </fieldset>
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
    actions,
    listActions
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(View);
