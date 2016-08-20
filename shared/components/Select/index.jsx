import React, { PropTypes } from 'react';
import Select from 'react-select';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import 'react-select/scss/default.scss';
import './index.scss';

const propTypes = {
  isAsync: PropTypes.bool,
};

const defaultProps = {
  isAsync: false,
  placeholder: _('Please Select '),
};

class MySelect extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    let ThisComponent = Select;

    if (this.props.isAsync) {
      ThisComponent = Select.Async;
    }
    return (
      <ThisComponent
        {...this.props}
      />
    );
  }
}
MySelect.propTypes = propTypes;
MySelect.defaultProps = defaultProps;

export default MySelect;
