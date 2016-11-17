import React, { PropTypes } from 'react';
import Select from 'react-select';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import 'react-select/scss/default.scss';
import './_index.scss';

const propTypes = {
  isAsync: PropTypes.bool,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
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
    let myDisabled = this.props.disabled;

    if (this.props.isAsync) {
      ThisComponent = Select.Async;
    }

    if (this.props.readOnly) {
      myDisabled = true;
    }

    return (
      <ThisComponent
        {...this.props}
        onChange={this.onChange}
        disabled={myDisabled}
      />
    );
  }
}
MySelect.propTypes = propTypes;
MySelect.defaultProps = defaultProps;

export default MySelect;
