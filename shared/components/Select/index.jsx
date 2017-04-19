import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import 'react-select/scss/default.scss';
import './_index.scss';

const propTypes = {
  isAsync: PropTypes.bool,
  onChange: PropTypes.func,
  readOnly: PropTypes.any,
  className: PropTypes.string,
};

const defaultProps = {
  isAsync: false,
  readOnly: false,
  disabled: false,
  onChange: () => {},
  placeholder: __('Please Select '),
};

class MySelect extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
    const { readOnly, className } = this.props;
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
