import React, { PropTypes } from 'react';
import Select from 'react-select';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import 'react-select/scss/default.scss';
import './_index.scss';

const propTypes = {
  isAsync: PropTypes.bool,
  onChange: PropTypes.func,
};

const defaultProps = {
  isAsync: false,
  placeholder: _('Please Select '),
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
      ret.value = curData.map((item) => item.value).join(',');
    } else {
      ret = data;
    }

    if (this.props.onChange) {
      this.props.onChange(ret, data);
    }
  }

  render() {
    let ThisComponent = Select;

    if (this.props.isAsync) {
      ThisComponent = Select.Async;
    }
    return (
      <ThisComponent
        {...this.props}
        onChange={this.onChange}
      />
    );
  }
}
MySelect.propTypes = propTypes;
MySelect.defaultProps = defaultProps;

export default MySelect;
