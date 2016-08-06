import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { FormGroup } from 'shared/components/Form';
import { Map, List } from 'immutable';
import validator from 'shared/utils/lib/validator';
import utils from 'shared/utils';
import TIME_ZONE from 'shared/config/timeZone';
import countries from 'shared/config/country.json';
import Navbar from 'shared/components/Navbar';
import Button from 'shared/components/Button';
import urls from 'shared/config/urls';

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

const defaultTimeZone = (((new Date()).getTimezoneOffset() / 60) * -1).toString();
let defaultTimeZoneLabel;

TIME_ZONE.forEach((item) => {
  if (item.value === defaultTimeZone) {
    defaultTimeZoneLabel = item.label;
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
      timeZone: defaultTimeZone,
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

  render() {
    const { currStep } = this.state;
    const btnInfoRole = 'info';
    const { version, guiName } = this.props.app.toJS();
    let stepOneClass = '';
    let stepTwoClass = '';
    let stepThreeClass = '';

    if (currStep === 1) {
      stepOneClass = 'active';
    } else if (currStep === 2) {
      stepOneClass = 'completed';
      stepTwoClass = 'active';
    } else if (currStep === 3) {
      stepOneClass = 'completed';
      stepTwoClass = 'completed';
      stepThreeClass = 'active';
    }

    return (
      <div>
        <Navbar
          title={guiName}
          version={version}
        />
        <div className="t-wizard">
          <h2>{_('Setup Wizard')}</h2>
          <div className="t-wizard__header">
            <ul>
              <li className={stepOneClass}>
                <span className="icon" />
                <h3>1. {_('Welcome')}</h3>
              </li>
              <li className={stepTwoClass}>
                <span className="icon" />
                <h3>2. {_('Password')}</h3>
              </li>
              <li className={stepThreeClass}>
                <span className="icon" />
                <h3>3. {_('Completed')}</h3>
              </li>
            </ul>
          </div>
          <div className="t-wizard__content">

            {
              this.state.currStep === 1 ? (
                <div className="step-0">
                  <p>{msg.welcomeDes}</p>
                  <div className="row">
                    <div className="cols cols-first col-6">
                      {this.createFormGruop('country')}
                    </div>
                    <div className="cols col-6">
                      {this.createFormGruop('timeZone')}
                    </div>
                  </div>
                  {
                    this.state.status !== 'ok' ?
                      <p className="msg-error ">{this.state.status}</p> :
                      null
                  }
                </div>
              ) : null
            }

            {
              this.state.currStep === 2 ? (
                <div className="step-1">
                  <p>{msg.passwordDes}</p>
                  <div className="row">
                    <div className="cols cols-first col-6">
                      {this.createFormGruop('password')}
                    </div>
                    <div className="cols col-6">
                      {this.createFormGruop('confirmpasswd')}
                    </div>
                  </div>

                  {
                    this.state.status !== 'ok' ?
                      <p className="msg-error ">{this.state.status}</p> :
                      null
                  }
                </div>
              ) : null
            }

            {
              this.state.currStep === 3 ? (
                <div className="step-1">
                  <p>{msg.completeDes}</p>
                  <div className="row">
                    <div className="cols cols-first col-6">

                      <FormGroup
                        label={msg.country}
                      >
                        {this.state.countryLabel}
                      </FormGroup>
                    </div>
                    <div className="cols col-6">
                      <FormGroup
                        label={msg.timeZone}
                      >
                        {this.state.timeZoneLabel}
                      </FormGroup>
                    </div>
                  </div>
                </div>
              ) : null
            }

          </div>
          <div className="t-wizard__footer">
            {
              currStep > 1 ? (
                <Button
                  onClick={this.onPrev}
                  text={_('Back')}
                />
              ) : null
            }

            <Button
              role={btnInfoRole}
              onClick={this.onNext}
              text={this.state.currStep !== 3 ? _('Next Step') : _('Completed')}
            />
          </div>
        </div>
      </div>
    );
  },
});

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps
)(SignUp);
