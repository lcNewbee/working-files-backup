import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import validator from 'shared/utils/lib/validator';
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
  validateOption: PropTypes.object,
};

const defaultProps = {};

const devicemodeOptions = [
  { value: 'ap', label: _('AP') },
  { value: 'sta', label: _('Station') },
  { value: 'repeater', label: _('Repeater') },
];

const countryOptions = [
  { value: 'CN', label: 'China' },
  { value: 'US', label: 'America' },
];

const rateOptions = [
  { value: '0', label: 'MSC0' },
  { value: '1', label: 'MSC1' },
  { value: '2', label: 'MCS2' },
  { value: '3', label: 'MCS3' },
  { value: '4', label: 'MCS4' },
  { value: '5', label: 'MCS5' },
  { value: '6', label: 'MCS6' },
  { value: '7', label: 'MCS7' },
];

const staAndApSecurityOptions = [
  { value: 'none', label: 'None' },
  { value: 'wpa', label: 'WPA-AES' },
  { value: 'wpa2', label: 'WPA2-AES' },
  { value: 'wpa-mixed', label: 'WPA-Mixed-AES' },
];

const repeaterSecurityOptions = [
  { value: 'none', label: 'None' },
  { value: 'wep', label: 'WEP' },
];

const wepAuthenOptions = [
  { value: 'open', label: 'Open' },
  { value: 'shared', label: 'Shared' },
];

const wepKeyLengthOptions = [
  { value: '64', label: '64bit' },
  { value: '128', label: '128bit' },
];

const keyIndexOptions = [
  { value: 'key1', label: 'key 1' },
  { value: 'key2', label: 'key 2' },
  { value: 'key3', label: 'key 3' },
  { value: 'key4', label: 'key 4' },
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

const frequencyWith13Options = [
  { value: 'auto', label: 'Auto' }, { value: '1', label: 'CH1' },
  { value: '2', label: 'CH2' }, { value: '3', label: 'CH3' },
  { value: '4', label: 'CH4' }, { value: '5', label: 'CH5' },
  { value: '6', label: 'CH6' }, { value: '7', label: 'CH7' },
  { value: '8', label: 'CH8' }, { value: '9', label: 'CH9' },
  { value: '10', label: 'CH10' }, { value: '11', label: 'CH11' },
  { value: '12', label: 'CH12' }, { value: '13', label: 'CH13' },
];

const validOptions = Map({
  ssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]',
  }),
  apmac: validator({
    rules: 'mac',
  }),
  outpower: validator({
    rules: 'num:[-4, 27]',
  }),
});

export default class Basic extends React.Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onHideSsidboxClick = this.onHideSsidboxClick.bind(this);
    this.onAutoRepeatBoxClick = this.onAutoRepeatBoxClick.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    const groupId = props.groupId || -1;

    props.initSettings({
      settingId: props.route.id,
      formUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      query: {
        groupId,
      },
      saveQuery: {},
      defaultData: {
        wirelessMode: 'ap',
        ssid: 'test',
        hideSsid: 0,
        countryCode: 'CN',
        radioMode: 'A/N mixed',
        channelWidth: '40',
        frequency: 'auto',
        txPower: '14',
        maxTxRate: '15',
        security: {
          mode: 'wpa-aes',
          Key: '12345678',
        },
      },
    });

    props.fetchSettings();
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }

  onSave() {
    this.props.saveSettings();
  }

  onHideSsidboxClick() {
    const val = (this.props.store.getIn(['curData', 'hideSsid'])) ? 0 : 1;
    this.props.updateItemSettings({
      hideSsid: val,
    });
  }
  onAutoRepeatBoxClick() {
    const val = (this.props.store.getIn(['curData', 'autoRepeat'])) ? 0 : 1;
    this.props.updateItemSettings({
      autoRepeat: val,
    });
  }

  render() {
    const {
      wirelessMode, ssid, apMac, countryCode, radioMode, channelWidth,
      hideSsid, txPower, frequency, maxTxRate, peers, autoRepeat,
    } = this.props.store.get('curData').toJS();
    const { apmac, outpower } = this.props.validateOption;
    const mode = this.props.store.getIn(['curData', 'security', 'mode']);
    const key = this.props.store.getIn(['curData', 'security', 'key']);
    const Auth = this.props.store.getIn(['curData', 'security', 'Auth']);
    const keyLength = this.props.store.getIn(['curData', 'security', 'keyLength']);
    const keyType = this.props.store.getIn(['curData', 'security', 'keyType']);
    const keyIndex = this.props.store.getIn(['curData', 'security', 'keyIndex']);
    // const peers = this.props.store.getIn(['curData', 'security', 'peers']);
    // console.log('dd=', this.props.store.toJS())

    if (this.props.store.get('curSettingId') === 'base') {
      return null;
    }

    return (
      <div>
        <div>
          <h3>{_('Basic Wireless Settings')}</h3>
          <div className="clearfix">
            <FormGroup
              className="fl"
              type="select"
              options={devicemodeOptions}
              value={wirelessMode}
              onChange={(data) => this.props.updateItemSettings({
                wirelessMode: data.value,
              })}
              label={_('Wireless Mode')}
            />
            <span className="fl">
              {
                (wirelessMode === 'repeater') ? (
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '11px',
                    }}
                  >&nbsp;&nbsp;
                    <input
                      style={{
                        paddingBottom: '-2px',
                      }}
                      type="checkbox"
                      checked={autoRepeat}
                      onClick={this.onAutoRepeatBoxClick}
                    />&nbsp;
                    {_('Auto')}
                  </span>
                ) : null
              }
            </span>
          </div>
          <div className="clearfix">
            <FormGroup
              label="SSID"
              className="fl"
              type="text"
              required
              value={ssid}
              onChange={(data) => this.props.updateItemSettings({
                ssid: data.value,
              })}
              {...this.props.validateOption.ssid}
            />
            <span className="fl">
              {
                (wirelessMode === 'sta') ? (
                  <span
                    style={{
                      paddingTop: '2px',
                    }}
                  >&nbsp;&nbsp;
                    <Button
                      text={_('Scan')}
                    />
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: '11px',
                    }}
                  >&nbsp;&nbsp;
                    <input
                      style={{
                        paddingBottom: '-2px',
                      }}
                      type="checkbox"
                      checked={hideSsid}
                      onClick={this.onHideSsidboxClick}
                    />&nbsp;
                    {_('Hide SSID')}
                  </span>
                )
              }
            </span>
          </div>
          {
              (wirelessMode === 'repeater') ? (
                <div>
                  <div className="clearfix">
                    <FormGroup
                      className="fl"
                      label="WDS Peers"
                      type="text"
                      value={peers[0]}
                      onChange={(data) => this.props.updateItemSettings({
                        peers: [
                          data.value, peers[1], peers[2],
                          peers[3], peers[4], peers[5],
                        ],
                      })}
                    />
                    <FormGroup
                      type="text"
                      className="fl"
                      value={peers[1]}
                      onChange={(data) => this.props.updateItemSettings({
                        peers: [
                          peers[0], data.value, peers[2],
                          peers[3], peers[4], peers[5],
                        ],
                      })}
                      style={{
                        marginLeft: '-160px',
                      }}
                    />
                  </div>
                  <div className="clearfix">
                    <FormGroup
                      className="fl"
                      type="text"
                      value={peers[2]}
                      onChange={(data) => this.props.updateItemSettings({
                        peers: [
                          peers[0], peers[1], data.value,
                          peers[3], peers[4], peers[5],
                        ],
                      })}
                    />
                    <FormGroup
                      type="text"
                      className="fl"
                      value={peers[3]}
                      onChange={(data) => this.props.updateItemSettings({
                        peers: [
                          peers[0], peers[1], peers[2],
                          data.value, peers[4], peers[5],
                        ],
                      })}
                      style={{
                        marginLeft: '-160px',
                      }}
                    />
                  </div>
                  <div className="clearfix">
                    <FormGroup
                      className="fl"
                      type="text"
                      value={peers[4]}
                      onChange={(data) => this.props.updateItemSettings({
                        peers: [
                          peers[0], peers[1], peers[2],
                          peers[3], data.value, peers[5],
                        ],
                      })}
                    />
                    <FormGroup
                      type="text"
                      className="fl"
                      value={peers[5]}
                      onChange={(data) => this.props.updateItemSettings({
                        peers: [
                          peers[0], peers[1], peers[2],
                          peers[3], peers[4], data.value,
                        ],
                      })}
                      style={{
                        marginLeft: '-160px',
                      }}
                    />
                  </div>
                </div>
              ) : null
          }
          {
            (wirelessMode === 'sta') ? (
              <FormGroup
                label={_('Lock To AP')}
                value={apMac}
                onChange={(data) => this.props.updateItemSettings({
                  apMac: data.value,
                })}
                required
                {...apmac}
              />
            ) : null
          }
          <FormGroup
            label={_('Country Code')}
            type="select"
            options={countryOptions}
            value={countryCode}
            onChange={(data) => this.props.updateItemSettings({
              countryCode: data.value,
            })}
          />
          <FormGroup
            label={_('IEEE 802.11 Mode')}
            type="select"
            options={ieeeModeOptions}
            value={radioMode}
            onChange={(data) => this.props.updateItemSettings({
              radioMode: data.value,
            })}
          />
          <FormGroup
            label={_('Channel')}
            type="select"
            options={frequencyWith13Options}
            value={frequency}
            onChange={(data) => this.props.updateItemSettings({
              frequency: data.value,
            })}
          />
          <FormGroup
            label={_('Channel Bandwidth')}
            type="select"
            options={channelWidthOptions}
            value={channelWidth}
            onChange={(data) => this.props.updateItemSettings({
              channelWidth: data.value,
            })}
          />
          <FormGroup
            label={_('Outpower Power')}
            type="number"
            value={txPower}
            onChange={(data) => this.props.updateItemSettings({
              txPower: data.value,
            })}
            {...outpower}
          />
          <FormGroup
            label={_('Max TX Rate')}
            type="select"
            value={maxTxRate}
            options={rateOptions}
            onChange={(data) => this.props.updateItemSettings({
              maxTxRate: data.value,
            })}
          />
        </div>
        <div>
          <h3>{_('Wireless Security')}</h3>
          {
            (wirelessMode === 'sta' || wirelessMode === 'ap') ? (
              <div>
                <FormGroup
                  label={_('Security')}
                  type="select"
                  options={staAndApSecurityOptions}
                  value={mode}
                  onChange={(data) => this.props.updateItemSettings({
                    security: {
                      mode: data.value,
                    },
                  })}
                />
                {
                  (mode === 'none') ? null : (
                    <FormGroup
                      label={_('Keys')}
                      type="password"
                      value={key}
                      onChange={(data) => this.props.updateItemSettings({
                        security: {
                          mode,
                          key: data.value,
                        },
                      })}
                    />
                  )
                }
              </div>
            ) : null
          }
          {
            (wirelessMode === 'repeater') ? (
              <div>
                <FormGroup
                  label={_('Security')}
                  type="select"
                  options={repeaterSecurityOptions}
                  value={mode}
                  onChange={(data) => this.props.updateItemSettings({
                    security: {
                      mode: data.value,
                    },
                  })}
                />
                {
                  (mode === 'none') ? null : (
                    <div>
                      <FormGroup
                        label={_('Authentication Type')}
                        type="select"
                        name="authenticationType"
                        options={wepAuthenOptions}
                        value={Auth}
                        onChange={(data) => this.props.updateItemSettings({
                          security: {
                            mode,
                            Auth: data.value,
                            keyLength,
                            keyType,
                            key,
                            keyIndex,
                          },
                        })}
                      />
                      <FormGroup
                        label={_('WEP Key Length')}
                        type="select"
                        name="wepKeyLength"
                        options={wepKeyLengthOptions}
                        value={keyLength}
                        onChange={(data) => this.props.updateItemSettings({
                          security: {
                            mode,
                            Auth,
                            keyLength: data.value,
                            keyType,
                            key,
                            keyIndex,
                          },
                        })}
                      />
                      <FormGroup
                        label={_('Key Index')}
                        type="select"
                        name="keyIndex"
                        options={keyIndexOptions}
                        value={keyIndex}
                        onChange={(data) => this.props.updateItemSettings({
                          security: {
                            mode,
                            Auth,
                            keyLength,
                            keyType,
                            key,
                            keyIndex: data.value,
                          },
                        })}
                      />
                      <FormGroup
                        label={_('Key Type')}
                        type="select"
                        name="keyType"
                        options={keyTypeOptions}
                        value={keyType}
                        onChange={(data) => this.props.updateItemSettings({
                          security: {
                            mode,
                            Auth,
                            keyLength,
                            keyType: data.value,
                            key,
                            keyIndex,
                          },
                        })}
                      />
                      <FormGroup
                        type="password"
                        label={_('Password')}
                        value={key}
                        onChange={(data) => this.props.updateItemSettings({
                          security: {
                            mode,
                            Auth,
                            keyLength,
                            keyType,
                            key: data.value,
                            keyIndex,
                          },
                        })}
                      />
                    </div>
                  )
                }
              </div>
            ) : null

          }

        </div>
        <div>
          <hr />
          <Button
            icon="save"
            theme="primary"
            text={_('Save')}
            onClick={this.props.saveSettings}
          />
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
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Basic);

export const basic = reducer;
