import React, {PropTypes} from 'react';
import Icon from '../Icon';

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

export const Input = React.createClass({
  getType: function () {
    return this.props.type || 'text';
  },

  getValue: function () {
    let ret = this.props.value;
    return ret;
  },
  
  onBlur(e) {
    if(this.props.check) {
      this.props.check(e)
    }
  },
  
  onFoucs(e) {
    if(this.props.checkClear) {
      this.props.checkClear(e)
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

export const FormGruop = React.createClass({
  propTypes: {
    onValidError: PropTypes.func
  },
  
  // 验证不确定的错误
  check() {
    const {name, label, value, required} = this.props;
    let checkResult;
    
    if(value == '') {
      if(required) {
        checkResult = _('%s is required', label);
      }
    } else {
      if(this.props.validator) {
        checkResult = this.props.validator.check(value);
        console.log(checkResult)
      }
    }
    
    if(this.props.onValidError) {
      this.props.onValidError({name, checkResult});
    }
  },
  
  // 验证可确定的错误
  checkClear() {
    const { name, label, value} = this.props;
    let checkResult;
    
    if(this.props.validator) {
      checkResult = this.props.validator.checkClear(value);
      if(this.props.onValidError) {
        this.props.onValidError({name, checkResult});
      }
    }
  },
  
  componentDidUpdate(prevProps) {
    const {value} = this.props;
    
    // 数据验证
    if(this.props.validator) {
      
      if(prevProps.value !== value) {
        this.checkClear();
      } else if (prevProps.validateAt !== this.props.validateAt) {
        this.check();
      }
    }
  },
  
  render() {
    const { help, errMsg, name, label, required, children} = this.props;
    
    return <div className="form-group">
      {
        label ? (
          <label htmlFor={name}>
            {label}
            {required ? <span className="text-required">*</span> : null}
          </label>) : null
      }
      
      <div className="form-control">
        {
          children ? children : (
            <Input 
              {...this.props}
              check={this.check}
              checkClear={this.checkClear}
            />
          )
        }
        
        { 
          help ? <span className="help">{help}</span> : null 
        }
        
        { 
          errMsg ? <span className="error">{errMsg}</span> : null
        }
      </div>
    </div>
  }
});

