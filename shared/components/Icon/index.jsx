import React, { PropTypes } from 'react';
import 'font-awesome/css/font-awesome.css';
import utils from '../../utils';
import './_index.scss';

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

// 自定义
function isCustomIcon(name) {
  const customNameMap = {
    display: true,
    laptop: true,
    mobile: true,
    mobile2: true,
    tablet: true,
    tv: true,
    meter: true,
    sphere: true,
  };

  return customNameMap[name];
}

function Icon(props) {
  const {
    Component,
    name, size, rotate, flip, spin, fixedWidth, stack, inverse,
    pulse, className,
  } = props;
  const iconProps = utils.objectAssign({}, props);
  delete iconProps.Component;
  delete iconProps.spin;

  let classNames = 'icon fa';

  // 非自定义图标，Font Awesome图标
  if (!isCustomIcon(name)) {
    if (name) {
      classNames = `${classNames} fa-${name}`;
    }
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

  // 自定义图标
  } else {
    classNames = `${classNames} a-icon-${name}`;
  }

  if (className) {
    classNames = `${classNames} ${className}`;
  }

  return <Component {...iconProps} className={classNames} />;
}

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

export default Icon;
