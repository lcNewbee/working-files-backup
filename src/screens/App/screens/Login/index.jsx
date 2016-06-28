import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from 'utils';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Input, FormGroup} from 'components/Form';
import {fromJS, Map} from 'immutable';
import validator from 'utils/lib/validator';
import * as actions from './actions';
import * as appActions from 'actions/app';
import reducer from './reducer';

const formGroups = {
  password: {
    input: {
      type: 'password',
      name: 'password',
      maxLength: 21,
      placeholder: _('Password'),
    },
    validator: validator({
      label: _('Password'),
      rules: 'required'
    })
  }
};

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
    var currClass = document.getElementsByTagName('body')[0].className;

    document.getElementsByTagName('body')[0].className = currClass.replace(' sign-body', '');
  },


  checkData() {
    var data = this.props.data.toJS();
    var passCheck = formGroups.password.validator.check(data.password);

    return passCheck;
  },


  onLogin() {
    var checkRusult = this.checkData();

    // 如果有验证错误信息
    if(checkRusult) {
      this.props.loginResult(checkRusult)

    //
    } else {
      this.props.login(function(status) {
        var currClass = document.getElementsByTagName('body')[0].className;

        document.getElementsByTagName('body')[0].className = currClass.replace(' sign-body', '');
        this.props.changeLoginStatus(status);
      }.bind(this));
    }

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

    if(e.which === 13) {
      this.onLogin();
    }
  },

  componentDidUpdate(prevProps, prevState) {
    //console.log(this.ref)
  },

  render() {
    const { version } = this.props.app.toJS();
    var that = this;
    var myMsg = this.props.status;


    return (
      <div>
        <header className="navbar">
          <div className="brand"></div>
          <h1>{_('Axilspot Access Manager')}</h1>
          <span className="version">GUI {version}</span>
        </header>
        <div className="sign">
          <div className="sign-backdrop"></div>
          <div className="sign-content">
            <h1 className="title">{_('Please Login')}</h1>
            <FormGroup
              type="password"
              name="password"
              maxLength="21"
              placeholder={_('Password')}
              value={this.getDataValue('password') }
              onChange={this.onChangeData('password') }
              onKeyUp={this.onInputKeyUp}
              validator={formGroups.password.validator}
            />
            {
              this.props.status !== 'ok' ?
                <p className="msg-error ">{this.props.status}</p> :
                ''
            }
            <button className="btn btn-primary btn-lg"
              onClick={this.onLogin}>
              {_('Login')}
            </button>
          </div>

        </div>
      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.login;

  return {
    loginedAt: myState.get('loginedAt'),
    status: myState.get('status'),
    data: myState.get('data'),
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch)
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export const login = reducer;

