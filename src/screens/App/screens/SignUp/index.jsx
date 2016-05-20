import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {Input, FormGruop} from 'components/Form/Input';
import {fromJS, Map, List} from 'immutable';
import validator from 'utils/lib/validator';
import utils from 'utils';

import './_signUp.scss';

const msg = {
  password:  _('Password'),
  confirmpasswd: _('Confirm Password')
}

const formGroups = List([
  {
    input: {
      type: 'password',
      label: msg.password,
      name: 'password',
      maxLength: 21,
      placeholder: msg.password,
    },
    validator: validator({
      label: msg.password,
      rules: 'required'
    })
  }, {
    input: {
      label: msg.confirmpasswd,
      type: 'password',
      name: 'confirmpasswd',
      maxLength: 21,
      placeholder: msg.confirmpasswd,
    },
    validator: validator({
      label: msg.confirmpasswd,
      rules: 'required'
    })
  }
]);

// 原生的 react 页面
export const SignUp = React.createClass({
  mixins: [PureRenderMixin],
  
  getInitialState() {
    return {
      password: '',
      confirmpasswd: ''
    }
  },
  
  componentWillMount() {
    
  },

  componentWillReceiveProps(nextProps) {
   
  },
  
  checkData() {
    const data = this.state;
    let checkResult;
    
    formGroups.forEach(function(item) {
      var key = item.input.name;
      
      checkResult = item.validator.check(data[key]);
      
      if(checkResult) {
        return false;
      }
    });
    
    if(!checkResult) {
      if(this.state.password !== this.state.confirmpasswd) {
        checkResult = _('Password and confirm password must match')
      }
    }
    
    return checkResult;
  },
  
  signUp() {
    utils.save('/goform/regist', {
      password: this.state.password,
      confirmpasswd: this.state.confirmpasswd
    })
    .then(function(json) {
      if(json.state && json.state.code === 2000) {
        window.location.hash = '';
      }
    }.bind(this))
  },

  onSignUp() {
    var checkResult = this.checkData();
    
    // 如果有验证错误信息
    if(checkResult) {
      this.updateState({
        status: checkResult
      })
      
    //
    } else {
      this.signUp();
    }
    
  },
  
  updateState(data) {
    this.setState(utils.extend({}, this.state, data));
  },

  onChangeData(name) {
    return function(e) {
      let data = {};
      
      data[name] = e.target.value;
      this.updateState(data);
    }.bind(this)
  },

  getDataValue(name) {
    return this.state[name] || '';
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

    formGruopList = formGroups.map(function(item) {
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
        <div className="sign-up">
          <h1>{_('Please Sign Up')}</h1>
          {formGruopList}
          {
            this.state.status !== 'ok' ?
              <p className="msg-error ">{this.state.status}</p> :
              ''
          }
          <button className="btn"
            onClick={this.onSignUp}>
            {_('Sign Up')}
          </button>
        </div>
      </div>
    );
  }
});

// 添加 redux 属性的 react 页面
export const Screen = SignUp;
