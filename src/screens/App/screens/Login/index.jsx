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

const propTypes = {
  status: PropTypes.string,
  loginedAt: PropTypes.number,
  resetData: PropTypes.func,
  updateData: PropTypes.func,
  validateAll: PropTypes.func,
  login: PropTypes.func,
  changeLoginStatus: PropTypes.func,
  data: PropTypes.object,
  app: PropTypes.object,
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
      'onInputKeyUp',
      'getDataValue',
    ]);
  }
  componentWillMount() {
    document.getElementsByTagName('body')[0].className += ' sign-body';
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'ok') {
      // 如果登录时间不一致
      // 后续可以做记住密码的功能
      if (this.props.loginedAt !== nextProps.loginedAt) {
        window.location.hash = '#/main/status';
      }
    }
  }

  componentWillUnmount() {
    const currClass = document.getElementsByTagName('body')[0].className;

    document.getElementsByTagName('body')[0].className = currClass.replace(' sign-body', '');
    this.props.resetData();
  }

  onChangeData(name) {
    return (data) => {
      const subData = {};

      subData[name] = data.value;
      this.props.updateData(subData);
    };
  }
  onLogin() {
    this.props
      .validateAll()
      .then((invalid) => {
        if (invalid.isEmpty()) {
          this.props.login((status) => {
            const currClass = document.getElementsByTagName('body')[0].className;

            document.body.className = currClass.replace(' sign-body', '');
            this.props.changeLoginStatus(status);
          });
        }
      });
  }
  onInputKeyUp(e) {
    if (e.which === 13) {
      this.onLogin();
    }
  }
  getDataValue(name) {
    return typeof this.props.data.get === 'function' ?
      this.props.data.get(name) : this.props.data[name];
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
                  value={this.getDataValue('username')}
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
              value={this.getDataValue('password')}
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
              onClick={this.onLogin}
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

