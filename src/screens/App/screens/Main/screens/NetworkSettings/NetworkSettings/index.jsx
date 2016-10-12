import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  SaveButton, FormGroup, FormInput,
} from 'shared/components';
import validator from 'shared/utils/lib/validator';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';
// import * as sharedReducer from 'shared/reducers/settings';
import * as actions from './actions.js';
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
  validateAll: PropTypes.func,
};

const defaultProps = {};

const validOptions = Map({
  lanIp: validator({
    rules: 'ip',
  }),
  lanMask: validator({
    rules: 'mask',
  }),
  firstDNS: validator({
    rules: 'ip',
  }),
  secondDNS: validator({
    rules: 'ip',
  }),
  validGateway: validator({
    rules: 'ip',
  }),
  validSsid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]',
  }),
  validDistance: validator({
    rules: 'num:[1, 10]',
  }),
  validPassword: validator({
    rules: 'pwd|len:[8, 32]',
  }),
  apmac2: validator({
    rules: 'mac',
  }),
  apmac3: validator({
    rules: 'mac',
  }),
  validVlanId1: validator({
    rules: 'num:[1, 4094]',
  }),
  validVlanId2: validator({
    rules: 'num:[1, 4094]',
  }),
});



export default class NetworkSettings extends React.Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onDhcpClick = this.onDhcpClick.bind(this);
    this.onStaticClick = this.onStaticClick.bind(this);
    this.onVlanBtnClick = this.onVlanBtnClick.bind(this);
    this.noErrorThisPage = this.noErrorThisPage.bind(this);
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
      defaultData: {
        proto: 'dhcp', // static or dhcp
        fallbackIp: '192.168.1.11', // fallback ip
        fallbackMask: '255.255.255.0',
        ip: '192.168.1.10',
        mask: '255.255.255.0',
        gateway: '192.168.1.1',
        dns1: '192.168.1.1', // 主dns
        dns2: '8.8.8.8', // 次dns
        mtu: '1500',
        vlanEnable: '1',  // 管理vlan开关,默认关
        vlanId: '2', // 2-4094 // vlan id
      },
    });

    props.fetchSettings();
  }

  onSave() {
    this.props.validateAll()
      .then(msg => {
        if (msg.isEmpty()) {
          this.props.saveSettings();
        }
      });
  }

  onDhcpClick() {
    const val = this.props.store.getIn(['curData', 'proto']);
    if (val === 'static') {
      this.props.updateItemSettings({
        proto: 'dhcp',
      });
    }
  }

  onStaticClick() {
    const val = this.props.store.getIn(['curData', 'proto']);
    if (val === 'dhcp') {
      this.props.updateItemSettings({
        proto: 'static',
      });
    }
  }

  onVlanBtnClick() {
    const val = this.props.store.getIn(['curData', 'vlanEnable']);
    if (val === '0') {
      this.props.updateItemSettings({
        vlanEnable: '1',
      });
    } else {
      this.props.updateItemSettings({
        vlanEnable: '0',
      });
    }
  }

  noErrorThisPage(...args) {
    const errorMsg = this.props.app.get('invalid');
    let flag = true;
    if (errorMsg.isEmpty()) {
      return true;
    }
    for (const name of args) {
      if (errorMsg.has(name)) {
        flag = false;
      }
    }
    return flag;
  }

  render() {
    const {
      proto, fallbackIp, ip, mask, gateway, dns1, dns2,
      mngVlanId, utgVlanId, fallbackMask, vlanTagging,
    } = this.props.store.get('curData').toJS();
    const { lanIp, lanMask, firstDNS, secondDNS,
            validGateway, validVlanId1, validVlanId2} = this.props.validateOption;
    return (
      <div>
        <h3>{_('Lan IP Settings')}</h3>
        <FormGroup
          label={_('IP Mode')}
        >
          <FormInput
            type="radio"
            name="networkmode"
            text={_('DHCP')}
            checked={proto === 'dhcp'}
            onChange={this.onDhcpClick}
          />&nbsp;&nbsp;&nbsp;&nbsp;
          <FormInput
            type="radio"
            name="networkmode"
            text={_('Static')}
            checked={proto === 'static'}
            onChange={this.onStaticClick}
          />
        </FormGroup>
        {
          (proto === 'dhcp') ? (
            <div>
              <FormGroup
                type="text"
                label={_('Fallback IP')}
                value={fallbackIp}
                onChange={(data) => this.props.updateItemSettings({
                  fallbackIp: data.value,
                })}
                {...lanIp}
              />
              <FormGroup
                type="text"
                label={_('Fallback Netmask')}
                value={fallbackMask}
                onChange={(data) => this.props.updateItemSettings({
                  fallbackMask: data.value,
                })}
                {...lanMask}
              />
            </div>
          ) : (
            <div>
              <FormGroup
                type="text"
                label={_('IP address')}
                value={ip}
                onChange={(data) => this.props.updateItemSettings({
                  ip: data.value,
                })}
                required
                {...lanIp}
              />
              <FormGroup
                type="text"
                label={_('Mask')}
                value={mask}
                onChange={(data) => this.props.updateItemSettings({
                  mask: data.value,
                })}
                required
                {...lanMask}
              />
              <FormGroup
                type="text"
                label={_('Gateway')}
                value={gateway}
                onChange={(data) => this.props.updateItemSettings({
                  gateway: data.value,
                })}
                {...validGateway}
              />
              <FormGroup
                type="text"
                label={_('Primary DNS')}
                value={dns1}
                onChange={(data) => this.props.updateItemSettings({
                  dns1: data.value,
                })}
                {...firstDNS}
              />
              <FormGroup
                type="text"
                label={_('Secondary DNS')}
                value={dns2}
                onChange={(data) => this.props.updateItemSettings({
                  dns2: data.value,
                })}
                {...secondDNS}
              />
            </div>
          )
        }
        <h3>{_('Vlan Settings')}</h3>
        <FormGroup
          type="number"
          label={_('Management VLAN ID')}
          help={_('Range: 1 - 4094, Default: 1')}
          value={mngVlanId}
          onChange={(data) => this.props.updateItemSettings({
            mngVlanId: data.value,
          })}
          required
          {...validVlanId1}
        />
        <FormGroup
          label={_('VLAN Tagging')}
        >
          <FormInput
            type="radio"
            text={_('Untagged')}
            name="vlantagging"
            checked={vlanTagging === 'untagged'}
            onClick={() => {
              this.props.updateItemSettings({
                vlanTagging: 'untagged',
              });
            }}
          />&nbsp;&nbsp;&nbsp;&nbsp;
          <FormInput
            type="radio"
            text={_('Tagged')}
            name="vlantagging"
            checked={vlanTagging === 'tagged'}
            onClick={() => {
              this.props.updateItemSettings({
                vlanTagging: 'tagged',
              });
            }}
          />
        </FormGroup>
        <FormGroup
          type="number"
          label={_('Untagged VLAN ID')}
          help={_('Range: 1 - 4094, Default: 1')}
          value={utgVlanId}
          disabled={vlanTagging === 'tagged'}
          onChange={(data) => this.props.updateItemSettings({
            utgVlanId: data.value,
          })}
          required
          {...validVlanId2}
        />
        <div className="form-group form-group--save">
          <div className="form-control">
            <SaveButton
              type="button"
              loading={this.props.app.get('saving')}
              onClick={this.onSave}
            />
          </div>
        </div>
      </div>
    );
  }
}

NetworkSettings.propTypes = propTypes;
NetworkSettings.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(NetworkSettings);

export const networksettings = reducer;
