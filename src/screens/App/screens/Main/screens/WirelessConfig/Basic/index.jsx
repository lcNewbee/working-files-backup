import React, { PropTypes } from 'react';
import Select from 'react-select';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map, List } from 'immutable';
import { bindActionCreators } from 'redux';
import { FormGroup, FormInput } from 'shared/components';
import Button from 'shared/components/Button';
import * as appActions from 'shared/actions/app';
import * as actions from 'shared/actions/settings';
import reducer from './reducer.js';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
};

const defaultProps = {};

const devicemodeOptions = [
  { value: 'AP', label: _('AP') },
  { value: 'sta', label: _('Station') },
  { value: 'Repeater', label: _('Repeater') },
];

const countryOptions = [
  { value: 'CN', label: 'China' },
  { value: 'US', label: 'America' },
];

const rateOptions = [
  { value: 'MCS0', label: 'MSC0' },
  { value: 'MCS1', label: 'MSC1' },
  { value: 'MCS2', label: 'MCS2' },
  { value: 'MCS3', label: 'MCS3' },
  { value: 'MCS4', label: 'MCS4' },
  { value: 'MCS5', label: 'MCS5' },
  { value: 'MCS6', label: 'MCS6' },
  { value: 'MCS7', label: 'MCS7' },
];

const staAndApSecurityOptions = [
  { value: 'none', label: 'None' },
  { value: 'wpa-aes', label: 'WPA-AES' },
  { value: 'wpa2-aes', label: 'WPA2-AES' },
];

const repeaterSecurityOptions = [
  { value: 'none', label: 'None' },
  { value: 'wep', label: 'WEP' },
]

const wepAuthenOptions = [
  { value: 'open', label: 'Open' },
  { value: 'shared', label: 'Shared' },
];

const wepKeyLengthOptions = [
  { value: '64', label: '64bit' },
  { value: '128', label: '128bit' },
];

const keyIndexOptions = [
  { value: 'key 1', label: 'key 1' },
  { value: 'key 2', label: 'key 2' },
  { value: 'key 3', label: 'key 3' },
  { value: 'key 4', label: 'key 4' },
];

const keyTypeOptions = [
  { value: 'Hex', label: 'Hex' },
  { value: 'ASCII', label: 'ASCII' },
];

const ieeeModeOptions = [
  { value: 'A/N mixed', label: 'A/N mixed' },
  { value: 'B/G/N/AC mixed', label: 'B/G/N/AC mixed' },
];

const channelWidthOptions = [
  { value: '20', label: '20MHz' },
  { value: '40', label: '40MHz' },
  { value: '80', label: '80MHz' },
];

export default class Basic extends React.Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    const groupId = props.groupId || -1;

    props.initSettings({
      settingId: props.route.id,
      formUrl: props.route.formUrl,
      query: {
        groupId,
      },
      saveQuery: {},
    });

    props.fetchSettings();
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }

  onSave() {
    this.props.saveSettings();
  }

  render() {
    const {
      WirelessMode, SSID, ApMac, CountryCode, RadioMode, ChannelWidth,
    } = this.props.store.get('curData').toJS();
    const { security } = this.props.store.getIn(['curData']).toJS();
    // console.log(security);
    const Mode = this.props.store.getIn(['curData', 'security', 'Mode']);
    const Key = this.props.store.getIn(['curData', 'security', 'Key']);
    // console.log('dd=', this.props.store.toJS())

    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }
    return (
      <div>
        <div>
          <h3>{_('Basic Wireless Settings')}</h3>
          <FormGroup
            label={_('Wireless Mode')}
          >
            <Select
              name="devicemode"
              options={devicemodeOptions}
              value={WirelessMode}
            />
          </FormGroup>
          <FormGroup
            label="SSID"
          >
            <FormInput
              type="text"
              value={SSID}
            />
            <span>&nbsp;&nbsp;</span>
            <Button
              text={_('Scan')}
            />
          </FormGroup>
          <FormGroup
            label={_('Lock To AP')}
            value={ApMac}
          />
          <FormGroup
            label={_('Hide SSID')}
            type="checkbox"
          />
          <FormGroup
            label={_('Country Code')}
          >
            <Select
              name="countryCode"
              options={countryOptions}
              value={CountryCode}
            />
          </FormGroup>
          <FormGroup
            label={_('IEEE 802.11 Mode')}
          >
            <Select
              name="ieeeMode"
              options={ieeeModeOptions}
              value={RadioMode}
            />
          </FormGroup>
          <FormGroup
            label={_('Channel Bandwidth')}
          >
            <Select
              name="channelWidth"
              options={channelWidthOptions}
              value={ChannelWidth}
            />
          </FormGroup>
          <FormGroup
            label={_('Outpower Power')}
          >
            <FormInput
              type="number"
            />
          </FormGroup>
          <FormGroup
            label={_('Max TX Rate')}
          >
            <Select
              name="maxtxrate"
              value="MCS7"
              options={rateOptions}
            />
          </FormGroup>

          <FormGroup
            label={_('Authentication Type')}
          >
            <Select
              name="authenticationType"
              options={wepAuthenOptions}
              value={security.Auth}
            />
          </FormGroup>
          <FormGroup
            label={_('WEP Key Length')}
          >
            <Select
              name="wepKeyLength"
              options={wepKeyLengthOptions}
              value={security.KeyLength}
            />
          </FormGroup>
          <FormGroup
            label={_('Key Index')}
          >
            <Select
              name="keyIndex"
              options={keyIndexOptions}
            />
          </FormGroup>
          <FormGroup
            label={_('Key 1')}
          >
            <span className="fl">{_('Type')}</span>
            <Select
              className="fl"
              name="keyType"
              options={keyTypeOptions}
            />
            <span>{_('Keys')}</span>
            <FormInput
              type="password"
            />
          </FormGroup>
          <FormGroup
            label={_('Key 2')}
          >
            <span className="fl">{_('Type')}</span>
            <Select
              className="fl"
              name="keyType"
              options={keyTypeOptions}
            />
            <span>{_('Keys')}</span>
            <FormInput
              type="password"
            />
          </FormGroup>
          <FormGroup
            label={_('Key 3')}
          >
            <span className="fl">{_('Type')}</span>
            <Select
              className="fl"
              name="keyType"
              options={keyTypeOptions}
            />
            <span>{_('Keys')}</span>
            <FormInput
              type="password"
            />
          </FormGroup>
          <FormGroup
            label={_('Key 4')}
          >
            <span className="fl">{_('Type')}</span>
            <Select
              className="fl"
              name="keyType"
              options={keyTypeOptions}
            />
            <span>{_('Keys')}</span>
            <FormInput
              type="password"
            />
          </FormGroup>
        </div>
        <div>
          <h3>{_('Wireless Security')}</h3>
          {
            (WirelessMode === 'sta' || WirelessMode === 'ap') ? (
              <div>
                <FormGroup
                  label={_('Security')}
                >
                  <Select
                    name="securityMode"
                    options={staAndApSecurityOptions}
                    value={Mode}
                  />
                </FormGroup>
                <FormGroup
                  label={_('Keys')}
                  type="password"
                  value={Key}
                />
              </div>
            ):''
          }

        </div>
      </div>
    );
  }
}

Basic.propTypes = propTypes;
Basic.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Basic);

export const basic = reducer;
