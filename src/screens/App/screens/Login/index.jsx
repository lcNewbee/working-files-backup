import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from 'shared/utils';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import * as appActions from 'shared/actions/app';
import {
  Navbar, Button, FormGroup,
} from 'shared/components';

import * as actions from './actions';
import reducer from './reducer';

const validOptions = Map({
  username: validator({
    label: _('Username'),
  }),
  password: validator({
    label: _('Password'),
  }),
});

// 原生的 react 页面
export const Login = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    document.getElementsByTagName('body')[0].className += ' sign-body';
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'ok') {
      // 如果登录时间不一致
      // 后续可以做记住密码的功能
      if (this.props.loginedAt !== nextProps.loginedAt) {
        window.location.hash = '#/main/status';
      }
    }
  },

  componentWillUnmount() {
    let currClass = document.getElementsByTagName('body')[0].className;

    document.getElementsByTagName('body')[0].className = currClass.replace(' sign-body', '');
    this.props.resetData();
  },

  checkData() {
    let data = this.props.data.toJS();
    let ret = formGroups.password.validator.check(data.password);

    return ret;
  },

  onLogin() {
    this.props.validateAll((invalid) => {
      if (invalid.isEmpty()) {
        this.props.login((status) => {
          let currClass = document.getElementsByTagName('body')[0].className;

          document.getElementsByTagName('body')[0].className = currClass.replace(' sign-body', '');
          this.props.changeLoginStatus(status);
        });
      }
    });

    // // 如果有验证错误信息
    // if (checkRusult) {
    //   this.props.loginResult(checkRusult);

    // //
    // } else {
    //   this.props.login(function (status) {
    //     var currClass = document.getElementsByTagName('body')[0].className;

    //     document.getElementsByTagName('body')[0].className = currClass.replace(' sign-body', '');
    //     this.props.changeLoginStatus(status);
    //   }.bind(this));
    // }
  },

  onChangeData(name) {
    return function (data) {
      const subData = {};

      subData[name] = data.value;
      this.props.updateData(subData);
    }.bind(this);
  },

  getDataValue(name) {
    return typeof this.props.data.get === 'function' ?
      this.props.data.get(name) : this.props.data[name];
  },

  onInputKeyUp(e) {
    if (e.which === 13) {
      this.onLogin();
    }
  },

  onUsernameKeyUp(e) {
    if (e.which === 13) {
      // 聚焦到 密码输入框
      // this.onLogin();
    }
  },

  render() {
    const { version, guiName } = this.props.app.toJS();
    const { username, password } = this.props.validateOption;
    let that = this;
    let myMsg = this.props.status;

    return (
      <div>
        <Navbar
          title={guiName}
          version={version}
        />

        <div className="sign">
          <div className="sign-backdrop"></div>
          <div className="sign-content">
            <h1 className="title">{_('Please Login')}</h1>
            {
              guiConfig.hasUsername ? (
                <FormGroup
                  required
                  name="username"
                  role="block"
                  maxLength="21"
                  data-label={_('Username')}
                  placeholder={_('Username')}
                  value={this.getDataValue('username')}
                  onChange={this.onChangeData('username')}
                  onKeyUp={this.onUsernameKeyUp}
                  {...username}
                />
              ) : null
            }
            <FormGroup
              type="password"
              name="password"
              role="block"
              seeAble={false}
              required
              maxLength="21"
              data-label={_('Password')}
              placeholder={_('Password')}
              value={this.getDataValue('password')}
              onChange={this.onChangeData('password')}
              onKeyUp={this.onInputKeyUp}
              {...password}
            />

            {
              this.props.status !== 'ok' ?
                <p className="msg-error ">{this.props.status}</p> :
                ''
            }
            <Button
              size="lg"
              theme="primary"
              text={_('Login')}
              onClick={this.onLogin}
            />
          </div>
        </div>
      </div>
    );
  },
});

function mapStateToProps(state) {
  const myState = state.login;

  return {
    loginedAt: myState.get('loginedAt'),
    status: myState.get('status'),
    data: myState.get('data'),
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch);
}


// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Login);

export const login = reducer;

