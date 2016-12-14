import React, { Component, PropTypes } from 'react';
import FormGroup from 'shared/components/Form/FormGroup';
import FileUpload from 'shared/components/FileUpload';
import Button from 'shared/components/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import * as settingActions from 'shared/actions/settings';
import * as selfActions from './actions';
import reducer from './reducer';

const MSG = {
  Seconds: _('Seconds'),
  minutes: _('Minutes'),
  hour: _('Hour'),
  hours: _('Hours'),
  days: _('Days'),
  userDef: _('User Defined'),
  imageDes: _('Select 1-3 slide pictures of dimension 640px*640px'),
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
  store: PropTypes.instanceOf(Map),
};

const defaultProps = {

};

export default class PortalSettings extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      saveUrl: this.props.route.saveUrl,
    });
    this.props.fetchSettings();
  }

  render() {
    return (
      <div className="row">
        <h3>{_('Portal Settings')}</h3>
        <div className="cols cols-7">
          <FormGroup
            label={_('Portal Name')}
            type="text"
            maxLength="32"
            required
          />
          <FormGroup
            label={_('Auth Redirect URL')}
            type="text"
            required
          />
          <FormGroup
            label={_('Portal Title')}
            type="text"
            required
          />
          <FormGroup
            label={_('Expiration')}
            type="select"
            options={expirationOptions}
            required
          />
          <FormGroup
            label={_('Images Slide Interval')}
            type="select"
            options={refreshtimeOtions}
            required
          />
          <FormGroup>
            <FileUpload
              url="cgi-bin/upload_file.cgi?id=1"
            />
          </FormGroup>
          <FormGroup>
            <FileUpload
              url="cgi-bin/upload_file.cgi?id=2"
            />
          </FormGroup>
          <FormGroup>
            <FileUpload
              url="cgi-bin/upload_file.cgi?id=3"
            />
          </FormGroup>
        </div>

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

export const portalsettings = reducer;


