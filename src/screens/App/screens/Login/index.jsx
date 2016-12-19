import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from 'shared/utils';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import * as appActions from 'shared/actions/app';
import Navbar from 'shared/components/Navbar';
import Button from 'shared/components/Button/Button';
import FormGroup from 'shared/components/Form/FormGroup';

const validOptions = Map({
  username: validator({
    label: _('Username'),
  }),
  password: validator({
    label: _('Password'),
  }),
});

const propTypes = {
  status: PropTypes.string,
  loginedAt: PropTypes.number,
  changeLoginState: PropTypes.func,
  save: PropTypes.func,
  validateAll: PropTypes.func,
  routes: PropTypes.array,
  app: PropTypes.object,
  router: PropTypes.object,
  validateOption: PropTypes.object,
};

const defaultProps = {
  closeModal: () => true,
};

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    utils.binds(this, [
      'onLogin',
      'onChangeData',
      'onValidateData',
      'onInputKeyUp',
      'changeLoginStatus',
    ]);
    this.state = {
      username: 'admin',
      password: '',
    };
  }
  componentWillMount() {
    document.getElementsByTagName('body')[0].className += ' sign-body';
  }

  componentWillReceiveProps(nextProps) {
    const thisRoute = this.props.routes && this.props.routes[0];
    let mainPath = '/main/status';

    if (thisRoute && thisRoute.mainPath) {
      mainPath = thisRoute.mainPath;
    }
    if (nextProps.status === 'ok') {
      // 如果登录时间不一致
      // 后续可以做记住密码的功能
      if (this.props.loginedAt !== nextProps.loginedAt) {
        this.props.router.push(mainPath);
      }
    }
  }

  componentWillUnmount() {
    const currClass = document.getElementsByTagName('body')[0].className;
    document.getElementsByTagName('body')[0].className = currClass.replace(' sign-body', '');
  }

  onChangeData(name) {
    return (data) => {
      const subData = {};

      subData[name] = data.value;

      if (this.props.status) {
        this.props.changeLoginState({
          msg: '',
        });
      }
      this.setState(subData);
    };
  }
  onValidateData() {
    this.props.validateAll()
      .then((invalid) => {
        if (invalid.isEmpty()) {
          this.onLogin();
        }
      });
  }
  onLogin() {
    const currClass = document.getElementsByTagName('body')[0].className;

    document.body.className = currClass.replace(' sign-body', '');

    this.props.save('goform/login', {
      username: this.state.username,
      password: this.state.password,
    }).then(
      (json) => {
        const loginState = {
          username: this.state.username,
          purview: 'none',
          loginedAt: Date.now(),
        };
        let result = _('Password Error');

        if (json.state) {
          if (json.state.code === 2000) {
            result = 'ok';

            if (json.data && json.data.purview) {
              utils.extend(loginState, json.data);

              if (json.data.usertype !== undefined) {
                // 超级管理员
                if (json.data.usertype === 0) {
                  loginState.purview = 'all';

                // 只读管理员
                } else if (json.data.usertype === 2) {
                  loginState.purview = 'readonly';
                }
              }
            } else {
              loginState.purview = 'all';
            }
          } else {
            result = json.state.msg;
          }
        }
        loginState.msg = result;

        return loginState;
      },
    ).then(this.changeLoginStatus);
  }
  onInputKeyUp(e) {
    if (e.which === 13) {
      this.onValidateData();
    }
  }
  changeLoginStatus(loginState) {
    this.props.changeLoginState(loginState);
  }

  render() {
    const { version, guiName } = this.props.app.toJS();
    const { username, password } = this.props.validateOption;

    return (
      <div>
        <Navbar
          title={guiName}
          version={version}
        />

        <div className="sign">
          <div className="sign-backdrop" />
          <div className="sign-content">
            <h1 className="title">{_('Please Login')}</h1>
            {
              guiConfig.hasUsername ? (
                <FormGroup
                  display="block"
                  name="username"
                  maxLength="32"
                  data-label={_('Username')}
                  placeholder={_('Username')}
                  value={this.state.username}
                  onChange={this.onChangeData('username')}
                  onKeyUp={this.onUsernameKeyUp}
                  required
                  {...username}
                />
              ) : null
            }
            <FormGroup
              type="password"
              name="password"
              display="block"
              maxLength="32"
              data-label={_('Password')}
              placeholder={_('Password')}
              value={this.state.password}
              onChange={this.onChangeData('password')}
              onKeyUp={this.onInputKeyUp}
              required
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
              onClick={this.onValidateData}
            />
          </div>
        </div>
      </div>
    );
  }
}
Login.propTypes = propTypes;
Login.defaultProps = defaultProps;

function mapStateToProps(state) {
  const myState = state.app.get('login');

  return {
    loginedAt: myState.get('loginedAt'),
    status: myState.get('msg'),
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
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(Login);
