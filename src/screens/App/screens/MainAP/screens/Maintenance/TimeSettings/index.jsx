import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SaveButton from 'shared/components/Button/SaveButton';
import FormGroup from 'shared/components/Form/FormGroup';
import utils from 'shared/utils';
import * as appActions from 'shared/actions/app';
import * as settingsActions from 'shared/actions/settings';
import moment from 'moment';
import * as selfActions from './actions';
import reducer from './reducer';
import { timezone } from './TimeZone';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  fetchSettings: PropTypes.func,

  fetch: PropTypes.func,
  updateItemSettings: PropTypes.func,
  initSettings: PropTypes.func,
  changeTimeZone: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  save: PropTypes.func,
  restoreSelfState: PropTypes.func,
  createModal: PropTypes.func,
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
    const timeZone = this.props.selfState.get('timeZone');
    const saveData = this.props.store.get('curData').set('timeZone', timeZone)
                      .delete('zoneName').toJS();
    const ntpStrValid = saveData.ntpServer.match(/^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/);
    const ntpIpValid = saveData.ntpServer.match(/^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/);
    const ntpEnable = this.props.store.getIn(['curData', 'ntpEnable']);
    // if (!ntpIpValid && ntpStrValid && ntpStrValid[0] === saveData.ntpServer) {
    //   console.log('ntp valid');
    //   this.props.save('goform/set_ntp', saveData);
    // } else {
    //   console.log('ntp not valid');
    //   this.props.createModal({
    //     role: 'alert',
    //     text: _('Please input a valid ntp server!'),
    //   });
    // }
    function validIp(str) {
      const ipArr = str.split('.');
      const ipHead = ipArr[0];
      if (ipArr[0] === '127') {
        return _('IP address begin with 127 is a reserved loopback address, please input another value between 1 to 233');
      }
      if (ipArr[0] > 223) {
        return `${_('Address begin with ')}${_('%s', ipHead)}${_(' is invalid, please input a value between 1 to 223.')}`;
      }
      return '';
    }
    let msg = '';
    if (ntpEnable === '1' && !ntpIpValid && !ntpStrValid) {
      msg = _('Please input a valid ntp server!');
    } else if (ntpEnable === '1' && ntpIpValid && ntpIpValid[0] === saveData.ntpServer) {
      msg = validIp(saveData.ntpServer);
    } else if (ntpEnable === '1' && ntpStrValid && ntpStrValid[0] !== saveData.ntpServer) {
      msg = _('Please input a valid ntp server!');
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
    this.props.fetchSettings('goform/get_ntp_info')
        .then(() => {
          const zoneName = this.props.store.getIn(['curData', 'zoneName']);
          this.props.changeTimeZone({
            zoneName,
            timeZone: timezone.get(zoneName),
          });
        });
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
            checked={this.props.store.getIn(['curData', 'ntpEnable']) === '1'}
            onChange={data => this.props.updateItemSettings({
              ntpEnable: data.value,
            })}
          />
          <FormGroup
            type="text"
            label={_('NTP Server')}
            value={ntpServer}
            disabled={ntpEnable === '0'}
            onChange={data => this.props.updateItemSettings({
              ntpServer: data.value,
            })}
          />
          <FormGroup
            type="select"
            label={_('Time Zone')}
            options={timezoneOptions}
            disabled={ntpEnable === '0'}
            value={this.props.store.getIn(['curData', 'zoneName'])}
            onChange={(data) => { this.onTimeZoneChange(data); }}
          />
        </div>
        <div>
          <FormGroup
            type="date"
            label={_('Date')}
            displayFormat="YYYY-MM-DD"
            disabled={ntpEnable === '1'}
            value={this.props.store.getIn(['curData', 'date'])}
            onChange={data => this.props.updateItemSettings({
              date: data.value,
            })}
          />
          <FormGroup
            type="time"
            label={_('Time')}
            disabled={ntpEnable === '1'}
            value={
              moment(
                (this.props.store.getIn(['curData', 'time']) || '00:00:00')
                  .replace(':', ''),
                'hms',
              )
            }
            format="HH:mm:ss"
            onChange={data => this.props.updateItemSettings({
              time: data.value,
            })}
            inputStyle={{
              width: '110px',
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
