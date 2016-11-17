import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import validator from 'shared/utils/lib/validator';
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
const defaultCountryLabel = List(countries).find((item) =>
  (item.country === defaultCountry)
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

const countryList = List(countries).map((item) => {
  return {
    value: item.country,
    label: item[b28n.getLang()],
  };
}).toJS();

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

// 原生的 react 页面
export const SignUp = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      password: '',
      confirmpasswd: '',
      country: defaultCountry,
      countryLabel: defaultCountryLabel,
      timeZone: defaultTimeZoneValue,
      timeZoneLabel: defaultTimeZoneLabel,
      currStep: 1,
    };
  },


  onNext() {
    const MAX_STEP = 3;
    let currStep = this.state.currStep;
    let checkResult;

    if (currStep < MAX_STEP) {
      currStep += 1;

      if (this.state.currStep === 2) {
        checkResult = this.checkStepTwo();

        if (!checkResult) {
          this.updateState({
            currStep,
            status: 'ok',
          });
        } else {
          this.updateState({
            status: checkResult,
          });
        }
      } else if (this.state.currStep === 1) {
        checkResult = this.checkStepOne();

        if (!checkResult) {
          this.updateState({
            currStep,
            status: 'ok',
          });
        } else {
          this.updateState({
            status: checkResult,
          });
        }
      } else {
        this.updateState({
          currStep,
        });
      }
    } else {
      this.signUp();
    }
  },

  onPrev() {
    let currStep = this.state.currStep;

    if (currStep > 1) {
      currStep -= 1;
      this.updateState({
        currStep,
        status: '',
      });
    }
  },

  onChangeData(name) {
    return function changeData(options) {
      const data = {};

      data[name] = options.value;

      if (options.label) {
        data[`${name}Label`] = options.label;
      }

      this.updateState(data);
    }.bind(this);
  },

  onInputKeyUp(e) {
    if (e.which === 13) {
      if (e.target.id === 'password') {
        document.getElementById('confirmpasswd').focus();
      } else {
        this.onNext();
      }
    }
  },
  onSignUp() {
    const checkResult = this.checkData();

    // 如果有验证错误信息
    if (checkResult) {
      this.updateState({
        status: checkResult,
      });

    //
    } else {
      this.signUp();
    }
  },
  getDataValue(name) {
    return this.state[name] || '';
  },

  checkStepTwo() {
    const data = this.state;
    const groupPass = formGroups.get('password');
    let checkResult;

    checkResult = groupPass.validator.check(data.password);

    if (!checkResult) {
      if (data.password !== data.confirmpasswd) {
        checkResult = _('Password and confirm password must match');
      }
    }

    return checkResult;
  },

  checkStepOne() {
    const data = this.state;
    let checkResult;

    if (!data.country || data.country.length < 1) {
      return _('Please select a country');
    }

    if (!data.timeZone || data.timeZone.length < 1) {
      return _('Please select time zone');
    }

    return checkResult;
  },

  signUp() {
    utils.save(urls.regist, {
      country: this.state.country,
      timeZone: this.state.timeZone,
      password: this.state.password,
      confirmpasswd: this.state.confirmpasswd,
    })
    .then((json) => {
      if (json.state && json.state.code === 2000) {
        window.location.hash = '';
      }
    });
  },

  updateState(data) {
    this.setState(utils.extend({}, this.state, data));
  },

  createFormGruop(name) {
    const myGroup = formGroups.get(name);
    const input = myGroup.input;

    return (
      <FormGroup
        {...input}
        key={input.name}
        id={input.name}
        value={this.getDataValue(input.name)}
        onChange={this.onChangeData(input.name)}
        onKeyUp={this.onInputKeyUp}
      />
    );
  },

// Mine

  componentDidMount() {
    this.props.fetch('goform/get_firstLogin_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        const currMode = json.data.manageMode;
        this.props.changeCurrentMode(currMode);
        this.props.changeNextMode(currMode);
      }
    });
  },

  onOkButtonClick() {
    const currMode = this.props.selfState.get('currMode');
    const nextMode = this.props.selfState.get('nextMode');
    if (currMode === nextMode) {
      window.location.href = '#/main/status';
    } else if (currMode !== nextMode) {
      this.props.createModal({
        id: 'settings',
        role: 'alert',
        text: _('Mode Changed ! Reboot to take effect ?'),
        apply: this.comfirmModeChange,
      });
    }
  },

  onSkipButtonClick() {
    const currMode = this.props.selfState.get('currMode');
    if (currMode === '0') {
      window.location.href = '#/main/status';
    } else if (currMode === 'thin') {
      window.location.href = '#/ThinModeNotice';
    }
  },

  comfirmModeChange() {
    const query = { manageMode: this.props.selfState.get('nextMode') };
    this.props.save('goform/set_ap_mode', query);
    this.props.changeShowProgressBar(true);
  },

  render() {
    const btnInfoRole = 'info';
    const { version, guiName } = this.props.app.toJS();
    const currMode = this.props.selfState.get('currMode');
    const nextMode = this.props.selfState.get('nextMode');
    const imgWrapStyle = {
      width: '50%',
      height: '100px',
      border: '1px solid #000',
      textAlign: 'center',
    };
    const radioWrapStyle = {
      width: '50%',
      border: '1px solid #FFF',
      textAlign: 'center',
    };
    const selectedWrapStyle = {
      width: '50%',
      height: '100px',
      border: '1px solid #000',
      textAlign: 'center',
      boxShadow: '0px 1px 3px rgba(34, 25, 25, 0.2)',
    };
    return (
      <div>
        <Navbar
          title={guiName}
          version={version}
        />
        <div className="t-wizard">
          <h2>{_('Quick Mode Change')}</h2>

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
                'Notice: You see this page only when you first login. You can select the device operation mode(Fat/Thin) as you need. The current mode is '
                + currMode + '. And it\'s ok if you skip this step.'
              }
            </div>
            <div className="row">
              <label htmlFor="fatSelectRadio">
                <div
                  className="cols cols-6"
                  style={nextMode === '0' ? selectedWrapStyle : radioWrapStyle}
                >
                  <img alt="img for fat AP" />
                  <div>
                    { 'Some introduction to fat AP.' }
                  </div>
                </div>
              </label>
              <label htmlFor="thinSelectRadio">
                <div
                  className="cols cols-6"
                  style={nextMode === '1' ? selectedWrapStyle : radioWrapStyle}
                >
                  <img alt="img for thin AP" />
                  <div>
                    { 'Some introduction to thin AP.' }
                  </div>
                </div>
              </label>
            </div>
            <div
              className="row"
              style={{
                marginTop: '5px',
              }}
            >
              <div
                className="cols cols-6"
                style={radioWrapStyle}
              >
                <FormInput
                  type="radio"
                  id="fatSelectRadio"
                  checked={nextMode === '0'}
                  onClick={() => { this.props.changeNextMode('0'); }}
                />
              </div>
              <div
                className="cols cols-6"
                style={radioWrapStyle}
              >
                <FormInput
                  type="radio"
                  id="thinSelectRadio"
                  checked={nextMode === '1'}
                  onClick={() => { this.props.changeNextMode('1'); }}
                />
              </div>
            </div>
          </div>
          <div className="t-wizard__footer">
            <Button
              onClick={this.onSkipButtonClick}
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
          className="excUpgradeBar"
          isShow={this.props.selfState.get('showProgressBar')}
          style={{
            top: '200px',
            borderRadius: '20px',
          }}
          noFooter
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
  },
});

function mapStateToProps(state) {
  return {
    app: state.app,
    selfState: state.wizard,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch
  );
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);

export const wizard = reducer;
