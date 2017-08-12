import React from 'react';
import PropTypes from 'prop-types';
import NumberInput from 'shared/components/Form/NumberInput';

const propTypes = {
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  onLowerInputChange: PropTypes.func,
  onUpperInputChange: PropTypes.func,
};

const defaultProps = {
  min: '',
  max: '',
  width: '84',
  value: '0-0',
};

class RangeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputOnEdit: '', // lower, upper
    };
  }

  render() {
    const { min, max, width, value } = this.props;
    const num = value.split('-');
    return (
      <div>
        <NumberInput
          type="number"
          className="fl"
          style={{ width: `${width}px` }}
          value={num[0]}
          min={min}
          max={max}
          onChange={(e) => {
            const val = e.target.value;
            this.props.onLowerInputChange(val);
          }}
        />
        <div className="fl a-range-input--dash">
          {'-'}
        </div>
        <NumberInput
          type="number"
          className="fl"
          style={{ width: `${width}px` }}
          width={width}
          min={min}
          max={max}
          value={num[1]}
          onChange={(e) => {
            const val = e.target.value;
            this.props.onUpperInputChange(val);
          }}
        />
      </div>
    );
  }
}

RangeInput.propTypes = propTypes;
RangeInput.defaultProps = defaultProps;

export default RangeInput;
