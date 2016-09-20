import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Input from './atom/Input';

const propTypes = {
  hasTextInput: PropTypes.bool,
  unit: PropTypes.number,
  value: PropTypes.string,
  label: PropTypes.string,

  onChange: PropTypes.func,
};

const defaultProps = {
  hasTextInput: false,
};

class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onRangeChange = this.onRangeChange.bind(this);
  }
  onRangeChange(e, value) {
    if (this.props.onChange) {
      this.props.onChange(e, value);
    }
  }
  render() {
    const { hasTextInput } = this.props;
    let ret = <Input {...this.props} />;

    if (hasTextInput) {
      ret = (
        <div className="a-input-range">
          <Input
            {...this.props}
          />
          <Input
            {...this.props}
            type="number"
            style={{}}
          />
        </div>
      );
    }

    return ret;
  }
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
