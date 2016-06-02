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
  
  // clearError
  clearValidError() {
    this.props.onValidError({
      name: this.props.name,
      checkResult: undefined
    });
  },
  
  componentDidUpdate(prevProps) {
    const {value} = this.props;
    
    // 数据验证
    if(this.props.validator) {
      
      // 如果组是可用的
      if(!this.props.disabled) {
        if(prevProps.value !== value) {
          this.checkClear();
        } else if (prevProps.validateAt !== this.props.validateAt) {
          this.check();
        }
      
      } else {
        this.clearValidError()
      }
      
    }
  },
  
  
  render() {
    const { help, errMsg, name, label, required,
      children, type, clearable, role, id
    } = this.props;
    const {check, checkClear} = this;
    let groupClassName = `form-group form-group-${role}`;
    
    return <div className={groupClassName}>
      {
        label ? (
          <label htmlFor={id}>
            {label}
            {required ? <span className="text-required">*</span> : null}
          </label>) : null
      }
      
      <div className="form-control">
        {
          children ? React.Children.map(children, function(elem) {
            var ret = elem;
            
            if(elem && elem.type && elem.type.name === 'FormInput') {
              ret = React.cloneElement(elem, {
                check: check,
                checkClear: checkClear
              });
            }
            
            return ret;
          }) : (
            <FormInput
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

export default FormGroup;