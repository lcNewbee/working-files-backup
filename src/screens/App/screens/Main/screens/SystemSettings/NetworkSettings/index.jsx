import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  SaveButton, FormGroup, FormInput,
} from 'shared/components';
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
};

const defaultProps = {};

export default class NetworkSettings extends React.Component {

  constructor(props) {
    super(props);
    this.onSave = this.onSave.bind(this);
    this.onDhcpClick = this.onDhcpClick.bind(this);
    this.onStaticClick = this.onStaticClick.bind(this);
    this.onVlanBtnClick = this.onVlanBtnClick.bind(this);
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
    this.props.saveSettings();
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

  render() {
    const {
      proto, fallbackIp, ip, mask, gateway, dns1, dns2, mtu,
      vlanEnable, vlanId, fallbackMask,
    } = this.props.store.get('curData').toJS();

    return (
      <div>
        <FormGroup
          label={_('IP Mode')}
        >
          <FormInput
            type="radio"
            name="networkmode"
            text="DHCP"
            checked={proto === 'dhcp'}
            onChange={this.onDhcpClick}
          />&nbsp;&nbsp;&nbsp;&nbsp;
          <FormInput
            type="radio"
            name="networkmode"
            text="Static"
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
              />
              <FormGroup
                type="text"
                label={_('Fallback Netmask')}
                value={fallbackMask}
                onChange={(data) => this.props.updateItemSettings({
                  fallbackMask: data.value,
                })}
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
              />
              <FormGroup
                type="text"
                label={_('Netamsk')}
                value={mask}
                onChange={(data) => this.props.updateItemSettings({
                  mask: data.value,
                })}
              />
              <FormGroup
                type="text"
                label={_('Gateway')}
                value={gateway}
                onChange={(data) => this.props.updateItemSettings({
                  gateway: data.value,
                })}
              />
              <FormGroup
                type="text"
                label={_('Primary DNS')}
                value={dns1}
                onChange={(data) => this.props.updateItemSettings({
                  dns1: data.value,
                })}
              />
              <FormGroup
                type="text"
                label={_('Secondary DNS')}
                value={dns2}
                onChange={(data) => this.props.updateItemSettings({
                  dns2: data.value,
                })}
              />
            </div>
          )
        }
        <FormGroup
          type="text"
          label={_('MTU')}
          value={mtu}
          onChange={(data) => this.props.updateItemSettings({
            mtu: data.value,
          })}
        />
        <h3>Vlan Settings</h3>
        <FormGroup
          type="checkbox"
          label={_('Enabled')}
          checked={vlanEnable === '1'}
          onChange={this.onVlanBtnClick}
        />
        {
          (vlanEnable === '1') ? (
            <FormGroup
              type="text"
              label={_('Vlan ID')}
              value={vlanId}
              onChange={(data) => this.props.updateItemSettings({
                vlanId: data.value,
              })}
            />
          ) : null
        }
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
)(NetworkSettings);

export const networksettings = reducer;
