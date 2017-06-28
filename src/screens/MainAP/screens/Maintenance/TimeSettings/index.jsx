import React, { Component } from 'react'; import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SaveButton from 'shared/components/Button/SaveButton';
import FormGroup from 'shared/components/Form/FormGroup';
import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import { actions as settingsActions } from 'shared/containers/settings';
import moment from 'moment';
import { timezoneMap } from './TimeZone';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  fetchSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  initSettings: PropTypes.func,
  save: PropTypes.func,
  createModal: PropTypes.func,
};

function createTimezoneOption(zone) {
  const options = [];
  for (const key of zone.keys()) {
    const option = { value: key, label: key };
    options.push(option);
  }
  return options;
}

export default class TimeSettings extends Component {
  constructor(props) {
    super(props);
    this.onTimeZoneChange = this.onTimeZoneChange.bind(this);
    this.onSaveTimeSettings = this.onSaveTimeSettings.bind(this);
    this.firstInAndRefresh = this.firstInAndRefresh.bind(this);
  }

  componentWillMount() {
    this.firstInAndRefresh();
  }

  componentDidUpdate(prevProps) {
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      this.firstInAndRefresh();
    }
  }

  onTimeZoneChange(data) {
    const zoneName = data.value;
    const timezone = timezoneMap.get(zoneName);
    this.props.updateItemSettings({ zoneName, timezone });
  }

  onSaveTimeSettings() {
    const saveData = this.props.store.get('curData').toJS();
    const ntpStrValid = saveData.ntpServer.match(/^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/);
    const ntpIpValid = saveData.ntpServer.match(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/);
    const ntpEnable = this.props.store.getIn(['curData', 'ntpEnable']);

    function validIp(str) {
      const ipArr = str.split('.');
      const ipHead = ipArr[0];
      if (ipArr[0] === '127') {
        return __('IP address begin with 127 is a reserved loopback address, please input another value between 1 to 233');
      }
      if (ipArr[0] > 223) {
        return __('IP Address begin with %s is invalid, please input a value between 1 to 223.', ipHead);
      }
      return '';
    }
    let msg = '';
    if (ntpEnable === '1' && !ntpIpValid && !ntpStrValid) {
      msg = __('Please input a valid ntp server!');
    } else if (ntpEnable === '1' && ntpIpValid && ntpIpValid[0] === saveData.ntpServer) {
      msg = validIp(saveData.ntpServer);
    } else if (ntpEnable === '1' && ntpStrValid && ntpStrValid[0] !== saveData.ntpServer) {
      msg = __('Please input a valid ntp server!');
    }
    if (msg === '') {
      this.props.save('goform/set_ntp', saveData);
    } else {
      this.props.createModal({
        role: 'alert',
        text: msg,
      });
    }
  }

  firstInAndRefresh() {
    this.props.initSettings({
      settingId: this.props.route.id,
      defaultData: {
        ntpEnable: '0',
      },
    });
    this.props.fetchSettings('goform/get_ntp_info');
  }

  render() {
    const timezoneOptions = createTimezoneOption(timezoneMap);
    const { ntpEnable, ntpServer } = this.props.store.get('curData').toJS();
    return (
      <div>
        <div>
          <h3>{__('Time Settings')}</h3>
          <FormGroup
            type="checkbox"
            label={__('NTP Client')}
            checked={this.props.store.getIn(['curData', 'ntpEnable']) === '1'}
            onChange={data => this.props.updateItemSettings({
              ntpEnable: data.value,
            })}
          />
          <FormGroup
            type="text"
            label={__('NTP Server')}
            value={ntpServer}
            disabled={ntpEnable === '0'}
            onChange={data => this.props.updateItemSettings({
              ntpServer: data.value,
            })}
          />
          <FormGroup
            type="select"
            label={__('Time Zone')}
            options={timezoneOptions}
            disabled={ntpEnable === '0'}
            value={this.props.store.getIn(['curData', 'zoneName'])}
            onChange={(data) => { this.onTimeZoneChange(data); }}
          />
        </div>
        <div>
          <FormGroup
            type="date"
            label={__('Date')}
            displayFormat="YYYY-MM-DD"
            disabled={ntpEnable === '1'}
            value={this.props.store.getIn(['curData', 'date'])}
            onChange={data => this.props.updateItemSettings({ date: data.value })}
          />
          <FormGroup
            type="time"
            label={__('Time')}
            disabled={ntpEnable === '1'}
            value={
              moment(
                (this.props.store.getIn(['curData', 'time']) || '00:00:00')
                  .replace(':', ''),
                'hms',
              )
            }
            format="HH:mm:ss"
            onChange={data => this.props.updateItemSettings({ time: data.value })}
            inputStyle={{ width: '110px' }}
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
    utils.extend({}, appActions, settingsActions),
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeSettings);
