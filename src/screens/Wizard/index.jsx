import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import validator from 'shared/validator';
import utils from 'shared/utils';
import TIME_ZONE from 'shared/config/timeZone';
import countries from 'shared/config/country.json';
import Navbar from 'shared/components/Navbar';
import Button from 'shared/components/Button/Button';
import FormGroup from 'shared/components/Form/FormGroup';
import urls from 'shared/config/urls';

const _ = window._;
const msg = {
  password: __('Password'),
  country: __('Country'),
  timeZone: __('Time Zone'),
  confirmpasswd: __('Confirm Password'),
  welcomeDes: __('Thank you for purchasing Axilspot enterprise-class products,' +
    ' you will complete the configuration for management system in minutes'),
  passwordDes: __('Please provide an administrator password to login to Axilspot management system'),
  completeDes: __('Please confirm your configuration below.' +
    ' Click back to modify the configuration or click finish to activate the configuration.' +
    ' After finish you will skip to management interface.'),
};
const defaultCountry = ((window.navigator.language || window.navigator.userLanguage ||
    window.navigator.browserLanguage || window.navigator.systemLanguage ||
    'en').toUpperCase().split('-')[1] || '').toString();
const defaultCountryLabel = List(countries).find(
  item => item.country === defaultCountry,
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
  app: PropTypes.instanceOf(Map).isRequired,
};
const defaultProps = {};

// 原生的 react 页面
export class SignUp extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      password: '',
      confirmpasswd: '',
      country: defaultCountry,
      countryLabel: defaultCountryLabel,
      timeZone: defaultTimeZoneValue,
      timeZoneLabel: defaultTimeZoneLabel,
      currStep: 1,
    };
    utils.binds(this, [
      'onNext', 'onPrev', 'onChangeData', 'onInputKeyUp', 'signUp',
      'onSignUp', 'getDataValue', 'checkStepTwo', 'checkStepOne',
      'createFormGruop',
    ]);
  }

  onNext() {
    const MAX_STEP = 3;
    let currStep = this.state.currStep;
    let checkResult;

    if (currStep < MAX_STEP) {
      currStep += 1;

      if (this.state.currStep === 2) {
        checkResult = this.checkStepTwo();

        if (!checkResult) {
          this.setState({
            currStep,
            status: 'ok',
          });
        } else {
          this.setState({
            status: checkResult,
          });
        }
      } else if (this.state.currStep === 1) {
        checkResult = this.checkStepOne();

        if (!checkResult) {
          this.setState({
            currStep,
            status: 'ok',
          });
        } else {
          this.setState({
            status: checkResult,
          });
        }
      } else {
        this.setState({
          currStep,
        });
      }
    } else {
      this.signUp();
    }
  }

  onPrev() {
    let currStep = this.state.currStep;

    if (currStep > 1) {
      currStep -= 1;
      this.setState({
        currStep,
        status: '',
      });
    }
  }

  onChangeData(name) {
    return function changeData(options) {
      const data = {};

      data[name] = options.value;

      if (options.label) {
        data[`${name}Label`] = options.label;
      }

      this.setState(data);
    }.bind(this);
  }

  onInputKeyUp(e) {
    if (e.which === 13) {
      if (e.target.id === 'password') {
        document.getElementById('confirmpasswd').focus();
      } else {
        this.onNext();
      }
    }
  }
  onSignUp() {
    const checkResult = this.checkData();

    // 如果有验证错误信息
    if (checkResult) {
      this.setState({
        status: checkResult,
      });

    //
    } else {
      this.signUp();
    }
  }
  getDataValue(name) {
    return this.state[name] || '';
  }

  checkStepTwo() {
    const data = this.state;
    const groupPass = formGroups.get('password');
    let checkResult;

    checkResult = groupPass.validator.check(data.password);

    if (!checkResult) {
      if (data.password !== data.confirmpasswd) {
        checkResult = __('Password and confirm password must match');
      }
    }

    return checkResult;
  }

  checkStepOne() {
    const data = this.state;
    let checkResult;

    if (!data.country || data.country.length < 1) {
      return __('Please select a country');
    }

    if (!data.timeZone || data.timeZone.length < 1) {
      return __('Please select time zone');
    }

    return checkResult;
  }

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
  }

  createFormGruop(name, option) {
    const myGroup = formGroups.get(name);
    const input = myGroup.input;

    return (
      <FormGroup
        {...input}
        {...option}
        key={input.name}
        id={input.name}
        value={this.getDataValue(input.name)}
        onChange={this.onChangeData(input.name)}
        onKeyUp={this.onInputKeyUp}
      />
    );
  }

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
          <h2>{__('Setup Wizard')}</h2>
          <div className="t-wizard__header">
            <ul>
              <li className={stepOneClass}>
                <span className="icon" />
                <h3>1. {__('Welcome')}</h3>
              </li>
              <li className={stepTwoClass}>
                <span className="icon" />
                <h3>2. {__('Password')}</h3>
              </li>
              <li className={stepThreeClass}>
                <span className="icon" />
                <h3>3. {__('Completed')}</h3>
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
                      {this.createFormGruop('country', {
                        display: 'block',
                      })}
                    </div>
                    <div className="cols col-6">
                      {this.createFormGruop('timeZone', {
                        display: 'block',
                      })}
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
                      {this.createFormGruop('password', {
                        display: 'block',
                      })}
                    </div>
                    <div className="cols col-6">
                      {this.createFormGruop('confirmpasswd', {
                        display: 'block',
                      })}
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
                  text={__('Back')}
                />
              ) : null
            }

            <Button
              theme={btnInfoRole}
              onClick={this.onNext}
              text={this.state.currStep !== 3 ? __('Next Step') : __('Completed')}
            />
          </div>
        </div>
      </div>
    );
  }
}

SignUp.propTypes = propTypes;
SignUp.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
)(SignUp);
