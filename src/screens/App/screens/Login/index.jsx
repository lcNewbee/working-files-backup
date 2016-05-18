import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Input, FormGruop} from 'components/Form/Input';
import {fromJS, Map} from 'immutable';
import validator from 'utils/lib/validator';
import * as actions from './actions';
import reducer from './reducer';

import './_login.scss';

const formGroups = Map({
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
});

// 原生的 react 页面
export const Login = React.createClass({
  mixins: [PureRenderMixin],

  componentWillMount() {
    
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
  
  checkData() {
    var data = this.props.data.toJS();
    var passCheck = validator.check(data.password, 'required');
    
    return passCheck;
  },

  onLogin() {
    var checkRusult = this.checkData();
    
    // 如果有验证错误信息
    if(checkRusult) {
      this.props.loginResult(checkRusult)
      
    //
    } else {
      this.props.login();
    }
    
  },

  onChangeData(name) {
    const thisProp = this.props;

    return function (e) {
      const data = {};
      data[name] = e.target.value;
      thisProp.updateData(data);
    };
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

  render() {
    var formGruopList;
    var that = this;
    var myMsg = this.props.status;

    formGruopList = formGroups.toArray().map(function(item) {
      var input = item.input;
      
      return (
        <FormGruop
          {...input}
          key={input.name}
          value={this.getDataValue(input.name) }
          updater={this.onChangeData(input.name) }
          onKeyUp={this.onInputKeyUp}
        />
      );
    }.bind(this));
    
    return (
      <div>
        <header className="navbar">
          <a href="" className="brand">Comlanos {_('Management')}</a>
        </header>
        <div className="login">
          <h1>{_('Please Login')}</h1>
          {formGruopList}
          {
            this.props.status !== 'ok' ?
              <p className="msg-error ">{this.props.status}</p> :
              ''
          }
          <button className="btn"
            onClick={this.onLogin}>
            {_('Login')}
          </button>
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
    data: myState.get('data')
  };

}

// 添加 redux 属性的 react 页面
export const View = connect(
  mapStateToProps,
  actions
)(Login);

export const login = reducer;

