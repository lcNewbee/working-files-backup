import './_button.scss';
import React, { PropTypes } from 'react';
import Icon from '../Icon';
import utils from '../../utils';

const propTypes = {
  iconName: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  role: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
  size: PropTypes.oneOf(['sm', 'lg']),
  inverse: PropTypes.bool,
  Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  loading: PropTypes.bool,
  text: PropTypes.string,
};

const defaultProps = {
  Component: 'button',
  role: 'default',
};

function Button(props) {
  const { Component, icon, size, role, className, loading, text } = props;
  const componentProps = utils.extend({}, props);


  let classNames = 'btn';

  if (size) {
    classNames = `${classNames} btn-${size}`;
  }

  if (role) {
    classNames = `${classNames} btn-${role}`;
  }

  if (className) {
    classNames = `${className} ${classNames}`;
  }

  if (Component === 'button' || Component === 'input') {
    delete componentProps.text;
    delete componentProps.Component;
    delete componentProps.loading;
  }

  return (
    <Component
      {...componentProps}
      className={classNames}
      type="button"
    >
      {
        loading ? (
          <Icon name="spinner" spin />
        ) : <Icon name={icon} />
      }
      {text}
    </Component>
  );
}
// class Button extends React.Component {

//   render() {
//     const { Component, icon, size, role, className, loading, text } = this.props;

//     let classNames = 'btn';

//     if (size) {
//       classNames = `${classNames} btn-${size}`;
//     }

//     if (role) {
//       classNames = `${classNames} btn-${role}`;
//     }

//     if (className) {
//       classNames = `${className} ${classNames}`;
//     }

//     return (
//       <Component
//         {...this.props}
//         className={classNames}
//         type="button"
//       >
//         {
//           loading ? (
//             <Icon name="spinner" spin />
//           ) : <Icon name={icon} />
//         }
//         {text}
//       </Component>
//     );
//   }
// }

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
