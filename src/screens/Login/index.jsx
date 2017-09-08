import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import { actions as appActions } from 'shared/containers/app';
import { Navbar, Button, FormGroup } from 'shared/components';

const validOptions = Map({
  username: validator({
    label: __('Username'),
  }),
  password: validator({
    label: __('Password'),
  }),
});

const propTypes = {
  status: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  route: PropTypes.shape({
    mainPath: PropTypes.string,
  }),
  loginedAt: PropTypes.number,
  changeLoginState: PropTypes.func,
  save: PropTypes.func,
  validateAll: PropTypes.func,
  app: PropTypes.object,
  validateOption: PropTypes.object,
};

const defaultProps = {
  closeModal: () => true,
};

export default class Login extends React.PureComponent {
  constructor(props) {
    super(props);

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
    if (this.props.app.getIn(['login', 'needReload'])) {
      this.props.changeLoginState({
        needReload: false,
      });
      window.location.reload();
    }
    document.getElementsByTagName('body')[0].className += ' sign-body';
  }

  componentWillReceiveProps(nextProps) {
    const thisRoute = this.props.route;
    let mainPath = '/main/status';

    if (thisRoute && thisRoute.mainPath) {
      mainPath = thisRoute.mainPath;
    }
    if (nextProps.status === 'ok') {
      // 如果登录时间不一致
      // 后续可以做记住密码的功能
      if (this.props.loginedAt !== nextProps.loginedAt) {
        // dashboard 用于演示的特殊用户
        if (this.state.username === 'leo' || this.props.app.getIn(['login', 'username']) === 'leo') {
          this.props.history.push('/dashboard/overview');
        } else {
          this.props.history.push(mainPath);
        }
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
        let result = __('Password Error');

        if (json && json.state) {
          if (json.state.code === 2000) {
            result = 'ok';

            // 处理权限问题
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
          } else if (json.state.msg.indexOf('upper bound') !== -1) {
            result = __(json.state.msg);
          } else if (json.state.msg.indexOf('password error') !== -1) {
            result = guiConfig.hasUsername ? __(json.state.msg) : __(json.state.msg.replace('username or ', ''));
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
    const { version, guiName, slogan } = this.props.app.toJS();
    const { username, password } = this.props.validateOption;

    return (
      <div>
        <Navbar
          title={guiName}
          version={version}
          slogan={__(slogan)}
        />

        <div className="sign">
          <div className="sign-backdrop" />
          <div className="sign-content">
            <h1 className="title">{__('Please Login')}</h1>
            {
              guiConfig.hasUsername ? (
                <FormGroup
                  display="block"
                  name="username"
                  maxLength="32"
                  data-label={__('Username')}
                  placeholder={__('Username')}
                  value={this.state.username}
                  onChange={this.onChangeData('username')}
                  onKeyUp={this.onUsernameKeyUp}
                  required
                  autoFocus={guiConfig.hasUsername}
                  {...username}
                />
              ) : null
            }
            <FormGroup
              type="password"
              name="password"
              display="block"
              maxLength="31"
              data-label={__('Password')}
              placeholder={__('Password')}
              value={this.state.password}
              onChange={this.onChangeData('password')}
              onKeyUp={this.onInputKeyUp}
              required
              autoFocus={!guiConfig.hasUsername}
              {...password}
            />

            {
              this.props.status !== 'ok' ?
                <p
                  className="msg-error "
                  style={{ marginLeft: 0 }}
                >
                  {this.props.status}
                </p> : ''
            }
            <Button
              size="lg"
              theme="primary"
              text={__('Login')}
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
