import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/scss/default.scss';

import PureComponent from '../Base/PureComponent';
import './Select.scss';

const propTypes = {
  isAsync: PropTypes.bool,
  autoWidth: PropTypes.bool,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
};

const defaultProps = {
  isAsync: false,
  readOnly: false,
  disabled: false,
  onChange: () => {},
  placeholder: __('Please Select'),
};

class MySelect extends PureComponent {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(data) {
    let ret = {};
    let curData;

    if (data.length !== undefined) {
      curData = [...data];
      ret.value = curData.map(item => item.value).join(',');
    } else {
      ret = data;
    }

    if (this.props.onChange && !this.props.readOnly) {
      this.props.onChange(ret, data);
    }
  }

  render() {
    let ThisComponent = Select;
    const { readOnly, className, autoWidth } = this.props;
    let thisClassname = className;

    if (this.props.isAsync) {
      ThisComponent = Select.Async;
    }

    if (readOnly) {
      if (thisClassname) {
        thisClassname = `${thisClassname} is-disabled`;
      } else {
        thisClassname = 'is-disabled';
      }
    }

    if (autoWidth) {
      thisClassname = `${thisClassname} is-auto-width`;
    }

    return (
      <ThisComponent
        {...this.props}
        onChange={this.onChange}
        className={thisClassname}
      />
    );
  }
}
MySelect.propTypes = propTypes;
MySelect.defaultProps = defaultProps;

export default MySelect;
