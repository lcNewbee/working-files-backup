import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Input, FormGruop} from 'components/Form/Input';
import * as actions from './actions';
import reducer from './reducer';

import './_login.scss';


const formGroups = [
  // {
  //   //label: '用户名',
  //   name: 'username',
  //   maxLength: 23,
  //   placeholder: 'Username',
  //   validator: {
  //     label: '用户名',
  //     rules: 'required|matches[1,23]'
  //   }
  // },
  {
    //label: '密码',
    type: 'password',
    name: 'password',
    maxLength: 21,
    placeholder: _('Password'),
    validator: {
      label: _('Password'),
      rules: 'required|matches[1,23]'
    }
  }
];

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

  onClickLogin(e) {
    this.props.login();
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

  render() {
    var formGruopList = [];
    var that = this;

    formGroups.forEach(function (item) {
      formGruopList.push(
        <FormGruop
          {...item}
          key={item.name}
          value={this.getDataValue(item.name) }
          updater={this.onChangeData(item.name) }
        />
      )
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
            onClick={this.onClickLogin}>
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

