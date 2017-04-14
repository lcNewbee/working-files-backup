import React from 'react'; import PropTypes from 'prop-types';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Icon from '../Icon';
import Input from './atom/Input';
import utils from '../../utils';

function transformShowText(fileValue) {
  let ret = fileValue;

  if (ret) {
    ret = ret.split(/(\\|\/)/);
    ret = ret[ret.length - 1];
  }

  return ret || '';
}
const propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onRef: PropTypes.func,
  disabled: PropTypes.bool,
};

const defaultProps = {
  Component: 'span',
  disabled: false,
};

class File extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    utils.binds(this, [
      'onChange',
      'resetInput',
    ]);
    this.state = {
      showText: transformShowText(props.value),
    };
  }

  onChange(e) {
    const val = e.target.value;

    if (this.props.onChange) {
      this.props.onChange(e, val);
    }
    this.setState({
      showText: transformShowText(val),
    });
  }

  resetInput() {
    this.setState({
      showText: '',
    });
  }

  render() {
    const { className, value, placeholder, onRef, ...restProps } = this.props;
    const placehodlerText = placeholder || __('Please Select File...');
    const fileTextInputProps = {
      disabled: this.props.disabled,
      placeholder: placehodlerText,
      type: 'text',

      // React waring: value 需要与 onChange 联合使用
      value: this.state.showText,
      onChange: utils.emptyFunc,
    };
    let inputClassName = 'a-input-file__input';

    if (className) {
      inputClassName = `${inputClassName} ${className}`;
      fileTextInputProps.className = inputClassName;
    }

    if (this.props.name) {
      fileTextInputProps.name = `${this.props.name}Text`;
    }

    return (
      <div className="a-input-file">
        <Icon className="a-input-file__icon" name="file" />
        <Input
          {...restProps}
          type="file"
          onChange={this.onChange}
          className="a-input-file_file"
          ref={
            (fileElem) => {
              if (onRef) {
                onRef(fileElem);

                if (fileElem && fileElem.myRef) {
                  this.setState({
                    showText: transformShowText(fileElem.myRef.value),
                  });
                }
              }
            }
          }
        />
        <Input
          {...fileTextInputProps}
          ref={
            (elem) => {
              if (elem) {
                this.fileTextInput = elem;
              }
            }
          }
        />
      </div>
    );
  }
}

File.propTypes = propTypes;
File.defaultProps = defaultProps;

export default File;
