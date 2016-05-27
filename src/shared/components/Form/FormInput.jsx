import React, {PropTypes} from 'react';
import Icon from '../Icon';
import Select from '../Select';
import Checkbox from './Checkbox';

const propTypes = {
  className: PropTypes.string,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  size: PropTypes.oneOf(['min', 'sm', 'md', 'lg', 'xl'])
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
    const elem = e.target;
    let val = elem.value;
    let checkedValue = '1';
    let data = {
      label: this.props.label
    }
    
    if(elem.type === 'checkbox') {
      if(elem.value) {
        checkedValue = elem.value;
      }
      val = elem.checked ? checkedValue : '0';
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
    const {
      Component, type, clearable, className, searchable,
      size
    } = this.props;
    let MyComponent = Component;
    let classNames = className;
    
    if (size) {
      classNames = `${classNames} input-${size}`;
    }
    
    if(type === 'select') {
      
      return <Select 
        {...this.props}
        className={classNames}
        clearable={ clearable || false }
        searchable={ searchable || false }
      />
    }
    
    if(type === 'checkbox') {
      MyComponent = Checkbox;
    }
    
    if(type !== 'checkbox' && type !== 'radio') {
      classNames = `${classNames} text`;
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
