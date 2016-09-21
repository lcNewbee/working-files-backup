import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  SaveButton, FormGroup,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as settingsActions from 'shared/actions/settings';
import utils from 'shared/utils';
import * as selfActions from './actions';
import reducer from './reducer';
import { timezone } from './TimeZone.js';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,

  fetch: PropTypes.func,
  updateItemSettings: PropTypes.func,
  initSettings: PropTypes.func,
  changeTimeZone: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  save: PropTypes.func,
};

function createTimezoneOption(zone) {
  const options = [];
  for (const key of zone.keys()) {
    const option = {
      value: key,
      label: key,
    };
    options.push(option);
  }
  return options;
}

export default class TimeSettings extends Component {
  constructor(props) {
    super(props);
    this.onTimeZoneChange = this.onTimeZoneChange.bind(this);
    this.onSaveTimeSettings = this.onSaveTimeSettings.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      defaultData: {
        ntpEnable: '0',
      },
    });
    utils.fetch('goform/get_ntp_info')
              .then((json) => {
                if (json.state && json.state.code === 2000) {
                  this.props.updateItemSettings({
                    ntpEnable: json.data.ntpEnable,
                    ntpServer: json.data.ntpServer,
                    zoneName: json.data.zoneName,
                  });
                  this.props.changeTimeZone({
                    zoneName: json.data.zoneName,
                    timeZone: timezone.get(json.data.zoneName),
                  });
                }
              });
  }

  onTimeZoneChange(data) {
    const zoneName = data.value;
    const timeZone = timezone.get(zoneName);
    this.props.updateItemSettings({
      zoneName,
    });
    this.props.changeTimeZone({
      zoneName,
      timeZone,
    });
  }

  onSaveTimeSettings() {
    const ntpEnable = this.props.store.getIn(['curData', 'ntpEnable']);
    const ntpServer = this.props.store.getIn(['curData', 'ntpServer']);
    const zoneName = this.props.store.getIn(['curData', 'zoneName']);
    const timeZone = this.props.selfState.get('timeZone');
    const saveData = {
      ntpEnable, ntpServer, zoneName, timeZone,
    };
    this.props.save('goform/set_ntp', saveData);
  }

  render() {
    const timezoneOptions = createTimezoneOption(timezone);
    // console.log('timezone', timezone);
    const { ntpEnable, ntpServer } = this.props.store.get('curData').toJS();
    return (
      <div>
        <div>
          <h3>{_('Time Settings')}</h3>
          <FormGroup
            type="checkbox"
            label={_('NTP Client')}
            checked={ntpEnable === '1'}
            onChange={(data) => this.props.updateItemSettings({
              ntpEnable: data.value,
            })}
          />
          <FormGroup
            type="text"
            label={_('NTP Server')}
            value={ntpServer}
            disabled={ntpEnable === '0'}
            onChange={(data) => this.props.updateItemSettings({
              ntpServer: data.value,
            })}
          />
          <FormGroup
            type="select"
            label={_('Time Zone')}
            options={timezoneOptions}
            value={this.props.store.getIn(['curData', 'zoneName'])}
            onChange={(data) => this.onTimeZoneChange(data)}
            style={{
              width: '200px',
            }}
          />
        </div>
        <FormGroup>
          <SaveButton
            loading={this.props.app.get('saving')}
            onClick={this.onSaveTimeSettings}
          />
        </FormGroup>

      </div>
    );
  }
}

TimeSettings.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.timesettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, settingsActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeSettings);

export const timesettings = reducer;
