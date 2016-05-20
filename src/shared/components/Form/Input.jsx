import React from 'react';
import Icon from '../Icon';

export const Input = React.createClass({
  getInitialState: function() {
    return {
      errMsg: ''
    }
  },
  
  getType: function () {
    return this.props.type || 'text';
  },

  getValue: function () {
    let ret = this.props.value;
    return ret;
  },
  
  onBlur: function(e) {
    
    if(this.props.checkValue) {
      this.props.checkValue(e.target.value);
    }
  },
  
  //
  handleChange: function (e) {
    
    // 数据更新
    if (typeof this.props.updater === 'function') {
      this.props.updater(e);
    }
    
    // 数据验证
    if(typeof this.props.checkClearValue === 'function') {
      this.props.checkClearValue(e.target.value);
    }
  },

  render: function () {
    let {className, id, name} = this.props;
    
    if(className) {
      className = 'text ' + className;
    } else {
      className = 'text';
    }
    id = id || name;
    return <input {...this.props}
      id={id}
      type={this.getType()}
      value={this.getValue()}
      className={className}
      onChange={this.handleChange}
      onBlur={this.onBlur}
    />;
  }
});

export const Search = React.createClass({

  onChange(e) {
    if (typeof this.props.updater === 'function') {
      this.props.updater(e);
    }
  },

  onKeyUp(e) {
    let which = e.which;
    
    if(which === 13) {
      if (typeof this.props.onSearch === 'function') {
        this.props.onSearch(e);
      }
    }
  },

  render() {
    
    return (
      <div className="input-search fl">
        
        <Icon className="icon-search" name="search"/>
        <input {...this.props}
          type="text"
          onChange={this.onChange}
          onKeyUp={this.onKeyUp}
        />
      </div>
    );
  }
});

export const FormGruop = React.createClass({
  getInitialState() {
    return {};
  },
  
  checkValue(val) {
    if(this.props.validator) {
      this.setState({
        errMsg: this.props.validator.check(val)
      });
    }
  },
  
  checkClearValue(val) {
    
    if(this.props.validator) {
      this.setState({
        errMsg: this.props.validator.checkClear(val)
      });
    }
  },

  render() {
    
    return <div className="form-group">
      {
        this.props.label ?
          <label htmlFor={this.props.name}>{this.props.label}</label> :
          null
      }
      <div className="form-control">
        <Input 
          {...this.props}
          checkValue={this.checkValue}
          checkClearValue={this.checkClearValue}
        />
        {
          this.props.help ? <span className="help">{this.props.help}</span> :
          null
        }
        { this.state.errMsg ? <span className="error">{this.state.errMsg}</span> : null}
      </div>
    </div>
  }
});

