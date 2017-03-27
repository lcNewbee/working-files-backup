import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  SaveButton, FormGroup, FormInput,
} from 'shared/components';
import Modal from 'shared/components/Modal';
import ProgressBar from 'shared/components/ProgressBar';
import validator from 'shared/validator';
import { actions as appActions } from 'shared/containers/app';
import { actions as sharedActions } from 'shared/containers/settings';
import * as selfActions from './actions';
import reducer from './reducer';

// 可配置功能项
/**
network: {
  router: false, // 是否有router模式
},
 */

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  selfState: PropTypes.instanceOf(Map),
  // route: PropTypes.object,
  // initSettings: PropTypes.func,
  // fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  // leaveSettingsScreen: PropTypes.func,
  validateOption: PropTypes.object,
  validateAll: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  changeProgressModalShowStatus: PropTypes.func,
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
    // this.onVlanBtnClick = this.onVlanBtnClick.bind(this);
    this.noErrorThisPage = this.noErrorThisPage.bind(this);
    this.firstInAndRefresh = this.firstInAndRefresh.bind(this);
    this.apMode = '0';
  }

  componentWillMount() {
    this.props.fetch('goform/get_firstLogin_info')
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.apMode = json.data.enable;
          }
        });
    this.firstInAndRefresh();
  }

  componentDidUpdate(prevProps) {
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      this.firstInAndRefresh();
      this.props.resetVaildateMsg();
    }
  }

  onSave() {
    const that = this;
    const { ip, mask, gateway, dns1, dns2, proto } = this.props.store.get('curData').toJS();
    let msg;
    function showError(_msg) {
      that.props.createModal({
        id: 'settings',
        role: 'alert',
        text: _msg,
      });
    }
    this.props.validateAll()
      .then((mg) => {
        if (mg.isEmpty()) {
          if (proto === 'static') {
            if (ip !== '' && typeof (ip) !== 'undefined' && mask !== '' && typeof (mask) !== 'undefined') {
              msg = validator.combine.noBroadcastIp(ip, mask);
              if (msg) {
                showError(msg);
                return;
              }
            }
            if (gateway !== '' && typeof (gateway) !== 'undefined' && mask !== '' && typeof (mask) !== 'undefined') {
              msg = validator.combine.noBroadcastIp(gateway, mask);
              if (proto === 'static' && msg) {
                showError(__('Gateway can not be broadcast IP address!'));
                return;
              }
            }
            if (ip !== '' && typeof (ip) !== 'undefined' &&
                mask !== '' && typeof (mask) !== 'undefined' &&
                gateway !== '' && typeof (gateway) !== 'undefined') {
              msg = validator.combine.needStaticIP(ip, mask, gateway);
              if (proto === 'static' && gateway !== '' && msg) {
                showError(msg);
                return;
              }
            }
            msg = __('Primary and Secondary DNS can not be the same !');
            if (dns1 !== '' && typeof (dns1) !== 'undefined' &&
                dns2 !== '' && typeof (dns2) !== 'undefined' &&
                validator.combine.notEqual(dns1, dns2, msg)) {
              showError(msg);
              return;
            }
          }
          this.props.saveSettings();
          this.props.changeProgressModalShowStatus(true);
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

  firstInAndRefresh() {
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
      //   fallbackIp: '192.168.1.11', // fallback ip
      //   fallbackMask: '255.255.255.0',
      //   ip: '192.168.1.10',
      //   mask: '255.255.255.0',
      //   gateway: '192.168.1.1',
      //   dns1: '192.168.1.1', // 主dns
      //   dns2: '8.8.8.8', // 次dns
      //   mtu: '1500',
        vlanEnable: '1',  // 管理vlan开关,默认关
        vlanId: '1', // 2-4094 // vlan id
      },
    });
    props.fetchSettings().then(() => {
      this.curProto = this.props.store.getIn(['curData', 'proto']);
      console.log('curProto', this.curProto);
    });
    // 初始化页面状态
    props.changeProgressModalShowStatus(false);
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
      mngVlanId, utgVlanId, fallbackMask, vlanEnable,
    } = this.props.store.get('curData').toJS();
    const {
      lanIp, lanMask, firstDNS, secondDNS, validGateway, validVlanId1, validVlanId2,
    } = this.props.validateOption;
    const nextIpAddr = this.props.store.getIn(['curData', 'ip']);
    return (
      <div>
        <Modal
          isShow={this.props.selfState.get('showProgressModal')}
          cancelButton={false}
          noFooter
          okButton={false}
          draggable
          noHeader
        >
          <ProgressBar
            isShow
            start
            time={60}
            step={600}
            title={__('The configuration is saving now, please wait...')}
            callback={() => {
              const nextProto = this.props.store.getIn(['curData', 'proto']);
              if (this.curProto === nextProto && this.curProto === 'dhcp') {
                window.location = '#';
              } else {
                window.location = nextProto === 'dhcp' ? 'http://192.168.188.1' : `http://${nextIpAddr}`;
              }
            }}
          />
        </Modal>
        <h3>{__('LAN IP Settings')}</h3>
        <FormGroup
          label={__('IP Mode')}
        >
          <div
            style={{
              marginTop: '8px',
            }}
          >
            <FormInput
              type="radio"
              name="networkmode"
              text={__('DHCP')}
              checked={proto === 'dhcp'}
              onChange={this.onDhcpClick}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <FormInput
              type="radio"
              name="networkmode"
              text={__('Static')}
              checked={proto === 'static'}
              onChange={this.onStaticClick}
            />
          </div>
        </FormGroup>
        {
          (proto === 'dhcp') ? (
            <div>
              <FormGroup
                type="text"
                label={__('Fallback IP')}
                value={fallbackIp}
                disabled
              />
              <FormGroup
                type="text"
                label={__('Fallback Netmask')}
                value={fallbackMask}
                disabled
              />
            </div>
          ) : (
            <div>
              <FormGroup
                type="text"
                label={__('IP Address')}
                value={ip || ''}
                onChange={data => this.props.updateItemSettings({
                  ip: data.value,
                })}
                required
                {...lanIp}
              />
              <FormGroup
                type="text"
                label={__('Subnet Mask')}
                value={mask || ''}
                onChange={data => this.props.updateItemSettings({
                  mask: data.value,
                })}
                required
                {...lanMask}
              />
              <FormGroup
                type="text"
                label={__('Gateway')}
                value={gateway}
                onChange={(data) => {
                  this.props.updateItemSettings({ gateway: data.value });
                }}
                {...validGateway}
              />
              <FormGroup
                type="text"
                label={__('Primary DNS')}
                value={dns1}
                onChange={data => this.props.updateItemSettings({
                  dns1: data.value,
                })}
                {...firstDNS}
              />
              <FormGroup
                type="text"
                label={__('Secondary DNS')}
                value={dns2}
                onChange={data => this.props.updateItemSettings({
                  dns2: data.value,
                })}
                {...secondDNS}
              />
            </div>
          )
        }
        {
          this.props.route.funConfig.hasVlan ? (
            <div>
              <h3>{__('VLAN Settings')}</h3>
              <div className="clearfix">
                <FormGroup
                  label={__('VLAN Enable')}
                  className="fl"
                  type="checkbox"
                  disabled={this.apMode === '1'}
                  checked={vlanEnable === '1'}
                  onClick={() => {
                    this.props.updateItemSettings({
                      vlanEnable: vlanEnable === '1' ? '0' : '1',
                    });
                  }}
                />
                {
                  this.apMode === '1' ? (
                    <span
                      className="fl"
                      style={{
                        marginLeft: '10px',
                        marginTop: '7px',
                      }}
                    >
                      {__('Notice: The device is in thin AP mode now, VLAN is enabled by force.')}
                    </span>
                  ) : null
                }
              </div>
              <FormGroup
                type="number"
                min="1"
                max="4094"
                label={__('Management VLAN ID')}
                disabled={vlanEnable === '0'}
                help={`${__('Range: ')}1 - 4094, ${__('Default: ')}1`}
                value={mngVlanId}
                onChange={data => this.props.updateItemSettings({
                  mngVlanId: data.value,
                })}
                required
                {...validVlanId1}
              />
              <FormGroup
                type="number"
                min="1"
                max="4094"
                label={__('Untagged VLAN ID')}
                help={`${__('Range: ')}1 - 4094, ${__('Default: ')}1`}
                value={utgVlanId}
                disabled={vlanEnable === '0'}
                onChange={data => this.props.updateItemSettings({
                  utgVlanId: data.value,
                })}
                required
                {...validVlanId2}
              />
            </div>
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
    selfState: state.networksettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(NetworkSettings);

export const networksettings = reducer;
