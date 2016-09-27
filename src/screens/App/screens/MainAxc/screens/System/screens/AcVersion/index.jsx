import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import utils from 'shared/utils';
import {
  Button, FormContainer,
} from 'shared/components';
import * as appActions from 'shared/actions/app';

import urls from 'shared/config/urls';

const _ = window._;
const msg = {
  password: _('Password'),
  versionUses: _('Version Uses To'),
  selectFile: _('Select Version File'),
  confirmpasswd: _('Confirm Password'),
  welcomeDes: _('Thank you for purchasing Axilspot enterprise-class products,' +
    ' you will complete the configuration for management system in minutes'),
  passwordDes: _('Please provide an administrator password to login to Axilspot management system'),
  completeDes: _('Please confirm your configuration below.' +
    ' Click back to modify the configuration or click finish to activate the configuration.' +
    ' After finish you will skip to management interface.'),
};

const versionUsesOptions = [
  {
    value: '0',
    label: _('Upgrade'),
  }, {
    value: '1',
    label: _('Backup'),
  },
];

const stepOneFormGroupList = fromJS([
  {
    id: 'versionUses',
    type: 'switch',
    required: true,
    label: msg.versionUses,
    options: versionUsesOptions,
    placeholder: msg.country,
    validator: validator({}),
  }, {
    id: 'filename',
    type: 'file',
    required: true,
    label: msg.selectFile,
    maxLength: 21,
    placeholder: msg.selectFile,
    validator: validator({}),
  },
]);

// 原生的 react 页面
export const SignUp = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      password: '',
      confirmpasswd: '',
      currStep: 1,
      versionUses: '0',
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

        this.props.validateAll()
          .then((msgObj) => {
            if (msgObj.isEmpty()) {
              this.updateState({
                currStep,
                status: 'ok',
              });
            }
          });
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
    let checkResult;

    return checkResult;
  },

  checkStepOne() {
    const data = this.state;
    let checkResult;

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

  render() {
    const { currStep, versionUses } = this.state;
    const btnInfoRole = 'info';
    const { route, app } = this.props;
    const stepTwoTitleArr = [
      _('Upgrading Version'),
      _('Backup Version'),
    ];
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
      <div
        className="o-wizard"
        style={{
          width: '80%',
        }}
      >
        <h3 className="o-wizard__title">{_('AC Version Setup Wizard')}</h3>
        <div className="o-wizard__nav">
          <ul>
            <li className={stepOneClass}>
              <span className="icon" />
              <h3>1. {_('Upload AC Version')}</h3>
            </li>
            <li className={stepTwoClass}>
              <span className="icon" />
              <h3>2. {stepTwoTitleArr[versionUses]}</h3>
            </li>
            <li className={stepThreeClass}>
              <span className="icon" />
              <h3>3. {_('Completed')}</h3>
            </li>
          </ul>
        </div>
        <div className="o-wizard__content">
          {
            this.state.currStep === 1 ? (
              <div className="step-0 row">
                <FormContainer
                  className="o-form--cols-2"
                  action="goform/ss"
                  data={fromJS(this.state)}
                  invalidMsg={app.get('invalid')}
                  validateAt={app.get('validateAt')}
                  options={stepOneFormGroupList}
                  onSave={this.onSave}
                  onChangeData={this.updateState}
                  onValidError={this.props.reportValidError}
                />
              </div>
            ) : null
          }

          {
            this.state.currStep === 2 ? (
              <div className="step-1">
                <p>{msg.passwordDes}</p>

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
              </div>
            ) : null
          }

        </div>
        <div className="o-wizard__footer">
          {
            currStep > 1 ? (
              <Button
                onClick={this.onPrev}
                text={_('Back')}
              />
            ) : null
          }

          <Button
            theme={btnInfoRole}
            onClick={this.onNext}
            text={this.state.currStep !== 3 ? _('Next Step') : _('Completed')}
          />
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
