import React, { PropTypes } from 'react';
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
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onRef: PropTypes.func,
};

const defaultProps = {
  Component: 'span',
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
    const { className, placeholder, onRef, ...restProps } = this.props;
    const placehodlerText = placeholder || _('Please Select File...');
    let inputClassName = 'a-input-file__input';

    if (className) {
      inputClassName = `${inputClassName} ${className}`;
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
          className={inputClassName}
          placeholder={placehodlerText}
          type="text"
          value={this.state.showText}
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
