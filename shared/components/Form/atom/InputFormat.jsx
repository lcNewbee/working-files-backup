import React, { PropTypes } from 'react';
import utils, { inputFormat as inputFormatUtil } from '../../../utils';

const propTypes = {
  isFocus: PropTypes.bool,
  value: PropTypes.any,
  inputFormat: PropTypes.object,
};

const defaultProps = {
  type: 'text',
  isFocus: false,
  onKeyDown: utils.emptyFunc,
  onChange: utils.emptyFunc,
};

class Input extends React.Component {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'init',
      'onInput',
      'onKeyDown',
      'onChange',
    ]);

    this.properties = utils.extend({
      initValue: props.value,
    }, props.inputFormat);

    this.init();
  }
  componentWillReceiveProps(nextProps) {
    const owner = this;

    let newValue = nextProps.value;

    if (newValue !== undefined) {
      newValue = newValue.toString();

      if (newValue !== owner.properties.initValue) {
        owner.properties.initValue = newValue;
        owner.onInput(newValue);
      }
    }
  }

  componentDidUpdate() {
    if (this.props.isFocus) {
      this.myRef.focus();
    }
  }
  onKeyDown(event) {
    const owner = this;
    const pps = owner.properties;
    const charCode = event.which || event.keyCode;

    // hit backspace when last character is delimiter
    if (charCode === 8 && inputFormatUtil.isDelimiter(pps.result.slice(-1), pps.delimiter, pps.delimiters)) {
      pps.backspace = true;
    } else {
      pps.backspace = false;
    }

    owner.props.onKeyDown(event);
  }
  onChange(event) {
    const owner = this;
    const pps = owner.properties;
    const newEvent = event;

    owner.onInput(event.target.value);

    newEvent.target.value = pps.result;

    owner.props.onChange(newEvent);
  }
  onInput(val) {
    const owner = this;
    const pps = owner.properties;
    let value = val;

    if (pps.backspace && !inputFormatUtil.isDelimiter(value.slice(-1), pps.delimiter, pps.delimiters)) {
      value = value.slice(0, value.length - 1);
    }
    // strip delimiters
    value = inputFormatUtil.stripDelimiters(value, pps.delimiter, pps.delimiters);

    // convert case
    value = pps.uppercase ? value.toUpperCase() : value;
    value = pps.lowercase ? value.toLowerCase() : value;

    // strip over length characters
    value = pps.maxLength > 0 ? value.slice(0, pps.maxLength) : value;

    // apply blocks
    pps.result = inputFormatUtil.getFormattedValue(value, pps.blocks, pps.blocksLength, pps.delimiter, pps.delimiters);
  }
  init() {
    const owner = this;
    const pps = owner.properties;

    pps.maxLength = inputFormatUtil.getMaxLength(pps.blocks);
    pps.blocksLength = pps.blocks.length;

    owner.onInput(pps.initValue);
  }
  render() {
    const inputProps = this.props;
    let ThisComponent = 'input';

    if (inputProps.type === 'textarea') {
      ThisComponent = 'textarea';
    }

    return (
      <ThisComponent
        {...inputProps}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        ref={ref => (this.myRef = ref)}
      />
    );
  }
}

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
