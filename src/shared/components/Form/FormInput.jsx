import React, {PropTypes} from 'react';
import Icon from '../Icon';
import Select from '../Select';
import Checkbox from './Checkbox';

const InputComponets = {
  input() {
    let classNames = 'text ' + this.props.className;
    
    return <input {...this.props}
      className={classNames}
      onChange={this.handleChange}
      onBlur={this.onBlur}
    />;
  },
  
  select() {
    return <Select {...this.props}
      clearable={this.props.clearable || false}
    />;
  },
  
  checkbox() {
    let {checked, value, options} = this.props;
    let label = '';
    
    if(options && options.label) {
      label = options.label;
    }
    
    return <Checkbox {...this.props}
      onChange={this.handleChange}
      label={label}
    />;
  },
  
  radio() {
    return <Checkbox {...this.props}
      onChange={this.handleChange}
      onBlur={this.onBlur}
    />;
  }
}

function getComponetName(type) {
  var ret = type;
  
  if(ret !== 'select' && ret !== 'checkbox' && ret !== 'radio') {
    ret = 'input';
  }
  
  return ret;
}

const propTypes = {
  className: PropTypes.string,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

const defaultProps = {
  Component: 'input',
  type: 'text',
};

class FormInput extends React.Component {
  constructor(props) {
    super(props);

    this.onBlur = this.onBlur.bind(this);
    this.onFoucs = this.onFoucs.bind(this);
    this.handleChange = this.handleChange.bind(this);
  };
  
  onBlur(e) {
    if(this.props.check) {
      this.props.check(e)
    }
  }
  
  onFoucs(e) {
    if(this.props.checkClear) {
      this.props.checkClear(e)
    }
  }
  
  handleChange(e) {
    let val = e.target.value;
    let data = {
      label: this.props.label
    }
    
    if(e.target.type === 'checkbox') {
      val = e.target.checked ? '1' : '0';
    }
    
    data.value = val;
    
    
    // 数据更新
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(data, e);
    }
    
    // 数据验证
    if(typeof this.props.checkClearValue === 'function') {
      this.props.checkClearValue(val);
    }
  }

  render() {
    const {Component, type, clearable, className} = this.props;
    let MyComponent = Component;
    let classNames = className;
    
    if(type === 'select') {
      
      return <Select 
        {...this.props}
        clearable={clearable || false}
      />
    }
    
    if(type === 'checkbox') {
      MyComponent = Checkbox;
    }
    
    if(type !== 'checkbox' && type !== 'radio') {
      classNames += ' text'
    }
    
    return <MyComponent 
      {...this.props}
      className={classNames}
      onChange={this.handleChange}
      onBlur={this.onBlur}
    />;
  }
}

FormInput.propTypes = propTypes;
FormInput.defaultProps = defaultProps;

export default FormInput;
