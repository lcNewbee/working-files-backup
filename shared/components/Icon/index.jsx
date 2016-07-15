import React, {PropTypes} from 'react';
import 'font-awesome/css/font-awesome.css';
import './index.scss';

const propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
  rotate: PropTypes.oneOf(['45', '90', '135', '180', '225', '270', '315']),
  flip: PropTypes.oneOf(['horizontal', 'vertical']),
  fixedWidth: PropTypes.bool,
  spin: PropTypes.bool,
  pulse: PropTypes.bool,
  stack: PropTypes.oneOf(['1x', '2x']),
  inverse: PropTypes.bool,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
};

const defaultProps = {
  Component: 'span',
};

class Icon extends React.Component {

  render() {
    let {
      Component,
      name, size, rotate, flip, spin, fixedWidth, stack, inverse,
      pulse, className
    } = this.props;

    let classNames = `icon fa fa-${name}`;

    if (size) {
      classNames = `${classNames} fa-${size}`;
    }
    if (rotate) {
      classNames = `${classNames} fa-rotate-${rotate}`;
    }
    if (flip) {
      classNames = `${classNames} fa-flip-${flip}`;
    }
    if (fixedWidth) {
      classNames = `${classNames} fa-fw`;
    }
    if (spin) {
      classNames = `${classNames} fa-spin`;
    }
    if (pulse) {
      classNames = `${classNames} fa-pulse`;
    }

    if (stack) {
      classNames = `${classNames} fa-stack-${stack}`;
    }
    if (inverse) {
      classNames = `${classNames} fa-inverse`;
    }

    if (className) {
      classNames = `${classNames} ${className}`;
    }

    if (className) {
      classNames = className + ' ' + classNames;
    }

    return <Component {...this.props} className={classNames} />;
  }
}

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
