import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import validator from 'shared/validator';
import utils from 'shared/utils';
import TIME_ZONE from 'shared/config/timeZone';
import countries from 'shared/config/country.json';
import Navbar from 'shared/components/Navbar';
import Button from 'shared/components/Button/Button';
import FormGroup from 'shared/components/Form/FormGroup';

import urls from 'shared/config/urls';

// self
import Modal from 'shared/components/Modal';
import { FormInput } from 'shared/components/Form';
import ProgressBar from 'shared/components/ProgressBar';
import { bindActionCreators } from 'redux';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';
import * as selfActions from './actions';
import reducer from './reducer';
import imgEn from './modeEN.png';

const _ = window._;
const msg = {
  password: _('Password'),
  country: _('Country'),
  timeZone: _('Time Zone'),
  confirmpasswd: _('Confirm Password'),
  welcomeDes: _('Thank you for purchasing Axilspot enterprise-class products,' +
    ' you will complete the configuration for management system in minutes'),
  passwordDes: _('Please provide an administrator password to login to Axilspot management system'),
  completeDes: _('Please confirm your configuration below.' +
    ' Click back to modify the configuration or click finish to activate the configuration.' +
    ' After finish you will skip to management interface.'),
};
const defaultCountry = ((window.navigator.language || window.navigator.userLanguage ||
    window.navigator.browserLanguage || window.navigator.systemLanguage ||
    'en').toUpperCase().split('-')[1] || '').toString();
const defaultCountryLabel = List(countries).find(item =>
  (item.country === defaultCountry),
)[b28n.getLang()];

const defaultTimeZoneTitle = (((new Date()).getTimezoneOffset() / 60) * -1).toString();
let defaultTimeZoneLabel;
let defaultTimeZoneValue;

TIME_ZONE.forEach((item) => {
  if (item.title === defaultTimeZoneTitle) {
    defaultTimeZoneLabel = item.label;
    defaultTimeZoneValue = item.value;
  }
});

const countryList = List(countries).map(item => ({
  value: item.country,
  label: item[b28n.getLang()],
})).toJS();

const formGroups = Map({
  country: {
    input: {
      type: 'select',
      label: msg.country,
      name: 'country',
      options: countryList,
      maxLength: 21,
      placeholder: msg.country,
    },
  },
  timeZone: {
    input: {
      type: 'select',
      label: msg.timeZone,
      name: 'timeZone',
      options: TIME_ZONE,
      maxLength: 21,
      placeholder: msg.timeZone,
    },
  },
  password: {
    input: {
      type: 'password',
      label: msg.password,
      name: 'password',
      maxLength: 32,
      placeholder: msg.password,
      autoFocus: true,
      required: true,
      style: {
        display: 'block',
      },
    },
    validator: validator({
      label: msg.password,
      rules: 'len:[8, 32]',
    }),
  },
  confirmpasswd: {
    input: {
      label: msg.confirmpasswd,
      type: 'password',
      name: 'confirmpasswd',
      maxLength: 32,
      required: true,
      placeholder: msg.confirmpasswd,
      style: {
        display: 'block',
      },
    },
    validator: validator({
      label: msg.confirmpasswd,
      rules: 'len:[8, 32]',
    }),
  },
});

const propTypes = {
  fetch: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  changeNextMode: PropTypes.func,
  changeNextModeData: PropTypes.func,
  validateAll: PropTypes.func,
  createModal: PropTypes.func,
  changeShowProgressBar: PropTypes.func,
  save: PropTypes.func,
  app: PropTypes.instanceOf(Map),
  validateOption: PropTypes.object,
  changeCurrModeData: PropTypes.func,
  changeShowThinModeConfigModal: PropTypes.func,
};

const validOptions = Map({
  validateIp: validator({
    rules: 'ip',
  }),
});

// 原生的 react 页面
export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.onOkButtonClick = this.onOkButtonClick.bind(this);
    this.onThinModeImgClick = this.onThinModeImgClick.bind(this);
    this.comfirmModeChange = this.comfirmModeChange.bind(this);
    this.onSkipButtonClick = this.onSkipButtonClick.bind(this);
  }

  // Mine
  componentDidMount() {
    this.props.fetch('goform/get_firstLogin_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        const data = fromJS(json.data).delete('ifFirstLogin');
        this.props.changeCurrModeData(data);
        this.props.changeNextModeData(data);
      }
    }).then(() => {
      // 后台根据是否请求过下面的接口识别是否是第一次登陆
      // 故在此请求该接口，表明已经登陆过，无特殊意义
      this.props.fetch('goform/get_system_info_forTestUse');
    });
  }

  onOkButtonClick() {
    const { currModeData, nextModeData } = this.props.selfState.toJS();
    const showThinModeConfigModal = this.props.selfState.get('showThinModeConfigModal');
    if (nextModeData.enable === '1' && !showThinModeConfigModal) {
      this.props.changeShowThinModeConfigModal(true);
    } else if (currModeData.enable === nextModeData.enable) {
      window.location.href = '#/main/status';
    } else if (currModeData.enable !== nextModeData.enable
      || currModeData.discoveryType !== nextModeData.discoveryType
      || currModeData.acIp !== nextModeData.acIp) {
      this.comfirmModeChange();
    }
  }

  onThinModeImgClick() {
    this.props.changeShowThinModeConfigModal(true);
  }

  onSkipButtonClick() {
    this.props.fetch('goform/get_system_info_forTestUse').then((json) => {
      if (json.state && json.state.code === 2000) {
        window.setTimeout(() => { window.location.href = '#/main/status'; }, 500);
      }
    });
  }

  comfirmModeChange() {
    const query = this.props.selfState.get('nextModeData').toJS();
    this.props.save('goform/set_thin', query);
    this.props.changeShowProgressBar(true);
  }

  render() {
    const btnInfoRole = 'info';
    const { guiName } = this.props.app.toJS();
    const { nextModeData, currModeData } = this.props.selfState.toJS();
    // const imgWrapStyle = {
    //   width: '50%',
    //   height: '100px',
    //   border: '1px solid #000',
    //   textAlign: 'center',
    // };
    // const radioWrapStyle = {
    //   width: '50%',
    //   border: '1px solid #ddd',
    //   textAlign: 'center',
    //   overflow: 'hidden',
    // };
    const selectedWrapStyle = {
      backgroundColor: '#005bcc',
    };
    return (
      <div
        style={{
          overflow: 'auto',
        }}
      >
        <Navbar
          title={guiName}
        />
        <div
          className="t-wizard"
          style={{
            marginTop: '0px',
            overflow: 'auto',
          }}
        >
          <h2>{_('Quick Setup')}</h2>
          <div
            className="t-wizard__content"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                marginTop: '-5px',
                marginBottom: '5px',
                fontSize: '15px',
              }}
            >
              {
                _('Notice: You see this page only when you first login. You can select the device operation mode(Fat/Thin) as you need. And it\'s ok if you skip this step.')
              }
            </div>
            <div
              className="row"
              style={{
                marginTop: '5px',
              }}
            >
              <div
                className="cols cols-6"
                style={{
                  width: '400px',
                  border: '1px solid #ddd',
                  overflow: 'hidden',
                }}
                onClick={() => {
                  this.props.changeNextModeData({ enable: '0' });
                }}
              >
                <div
                  style={nextModeData.enable === '0' ? selectedWrapStyle : {}}
                >
                  <img
                    src={imgEn}
                    alt="img for thin ap"
                    style={{
                      height: '350px',
                      paddingLeft: '20px',
                    }}
                  />
                </div>
                <div
                  style={{
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    height: '50px',
                    lineHeight: '50px',
                    fontSize: '15px',
                    marginTop: '3px',
                  }}
                >
                  <FormInput
                    type="radio"
                    name="modeSelection"
                    checked={nextModeData.enable === '0'}
                    text={_('Fat AP Mode')}
                    onChange={() => {
                      this.props.changeNextModeData({ enable: '0' });
                    }}
                  />
                </div>
              </div>
              <div
                className="cols cols-6"
                style={{
                  width: '400px',
                  border: '1px solid #ddd',
                  overflow: 'hidden',
                }}
                onClick={() => {
                  this.props.changeNextModeData({ enable: '1' });
                  this.props.changeShowThinModeConfigModal(true);
                }}
              >
                <div
                  style={nextModeData.enable === '1' ? selectedWrapStyle : {}}
                >
                  <img
                    src={imgEn}
                    alt="img for thin ap"
                    style={{
                      position: 'relative',
                      left: '-330px',
                      height: '350px',
                    }}
                  />
                </div>
                <div
                  style={{
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    height: '50px',
                    lineHeight: '50px',
                    fontSize: '15px',
                    marginTop: '3px',
                  }}
                >
                  <FormInput
                    type="radio"
                    name="modeSelection"
                    checked={nextModeData.enable === '1'}
                    text={_('Thin AP Mode')}
                    onChange={() => {
                      this.props.changeNextModeData({ enable: '1' });
                      this.props.changeShowThinModeConfigModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="t-wizard__footer">
            <Button
              onClick={() => this.onSkipButtonClick()}
              text={_('Skip')}
            />
            <Button
              theme={btnInfoRole}
              onClick={this.onOkButtonClick}
              text={_('OK')}
            />
          </div>
        </div>
        <Modal
          className="thinModeConfig"
          isShow={this.props.selfState.get('showThinModeConfigModal')}
          draggable
          onOk={() => {
            this.onOkButtonClick();
            this.props.changeShowThinModeConfigModal(false);
          }}
          onClose={() => {
            const data = this.props.selfState.get('currModeData').toJS();
            this.props.changeNextModeData(fromJS(...data));
            this.props.changeShowThinModeConfigModal(false);
          }}
        >
          <FormGroup
            type="switch"
            label={_('Discovery Type')}
            value={nextModeData.discoveryType}
            options={[
              { value: 'dhcp', label: _('DHCP') },
              { value: 'static', label: _('Static') },
            ]}
            minWidth="73px"
            onChange={(data) => {
              this.props.changeNextModeData(fromJS({ discoveryType: data.value }));
            }}
          />
          {
            nextModeData.discoveryType === 'static' && nextModeData.enable === '1' ? (
              <FormGroup
                type="text"
                label={_('AC IP')}
                value={nextModeData.acIp}
                onChange={(data) => {
                  this.props.changeNextModeData(fromJS({ acIp: data.value }));
                }}
                required
                {...this.props.validateOption.validateIp}
              />
            ) : null
          }
          <span>
            {_('Notice: The device will reboot when you click \'OK\' button if the configuration changed! Or, the page will be directed to management web.')}
          </span>
        </Modal>
        <Modal
          className="excUpgradeBar"
          isShow={this.props.selfState.get('showProgressBar')}
          style={{
            top: '200px',
            borderRadius: '20px',
          }}
          noFooter
          draggable
        >
          <ProgressBar
            title={_('rebooting , please wait...')}
            time={60}
            callback={() => {
              this.props.changeShowProgressBar(false);
              window.location.href = '#';
            }}
            start
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          />
        </Modal>
      </div>
    );
  }
}

SignUp.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    selfState: state.wizard,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch,
  );
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(SignUp);

export const wizard = reducer;
