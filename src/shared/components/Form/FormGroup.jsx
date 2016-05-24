import React, {PropTypes} from 'react';
import Icon from '../Icon';
import Select from '../Select';
import Checkbox from './Checkbox';
import FormInput from './FormInput';

const MAX_INDEX = 999999;
let formInputIndex = 0;

function createFormInputId(name) {
  let ret = name || 'formGroup_';
  
  ret += formInputIndex;
  
  if(formInputIndex < MAX_INDEX) {
    formInputIndex += 1;
  } else {
    formInputIndex = 0;
  }
  
  return ret;
}

const propTypes = {
  className: PropTypes.string,
  Component: PropTypes.string,
};

const defaultProps = {
  Component: 'input',
}

export const FormInputss = React.createClass({
  propTypes,
  defaultProps,
  
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
    const val = e.target.value;
    let data = {
      value: val,
      label: this.props.label
    };
   
    // 数据更新
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data, e);
    }
    
    // 数据验证
    if(typeof this.props.checkClearValue === 'function') {
      this.props.checkClearValue(val);
    }
  },

  render: function () {
    let {className, id, name, Component} = this.props;
    const type = this.getType();
    let classNames = '';
    
    if(type !== 'checkbox' && type !== 'radio') {
      classNames = 'text ';
    }
    
    if(className) {
      classNames += className;
    }
    
    return <input {...this.props}
      type={type}
      value={this.getValue()}
      className={classNames}
      onChange={this.handleChange}
      onBlur={this.onBlur}
    />;
  }
});

export const FormGroup = React.createClass({
  propTypes: {
    onValidError: PropTypes.func,
    errMsg: PropTypes.string,
    help: PropTypes.string,
    label: PropTypes.string,
  },
  
  // 验证不确定的错误
  check() {
    const {name, label, value, required} = this.props;
    let checkResult;
    
    if(value == '' || value === undefined) {
      if(required) {
        checkResult = _('%s is required', label);
      }
    } else {
      if(this.props.validator) {
        checkResult = this.props.validator.check(value);
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
    const { help, errMsg, name, label, required,
      children, type, clearable
    } = this.props;
    
    let id = this.props.id;
    
    return <div className="form-group">
      {
        label ? (
          <label htmlFor={id}>
            {label}
            {required ? <span className="text-required">*</span> : null}
          </label>) : null
      }
      
      <div className="form-control">
        {
          children ? children : (
            <FormInput
              {...this.props}
              id={id}
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

export default FormGroup;