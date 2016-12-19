import React, { PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Input from './atom/Input';

const propTypes = {
  hasTextInput: PropTypes.bool,
  unit: PropTypes.string,
  value: PropTypes.any,
  min: PropTypes.string,
  max: PropTypes.string,

  onChange: PropTypes.func,
};

const defaultProps = {
  hasTextInput: false,
  unit: '',
  min: 1,
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
    const { hasTextInput, unit, min } = this.props;
    const value = this.props.value || min;

    return (
      <div className="a-input-range clearfix">
        <Input
          {...this.props}
          value={value}
          className="fl"
        />
        {
          hasTextInput ? (
            <Input
              {...this.props}
              type="number"
              value={value}
              className="fl"
              style={{
                width: '60px',
                marginLeft: '2px',
              }}
            />
          ) : `${value}${unit}`
        }
      </div>
    );
  }
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;

export default Checkbox;
