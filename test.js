'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('./_button.scss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Icon = require('../Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  iconName: _react.PropTypes.string,
  icon: _react.PropTypes.string,
  className: _react.PropTypes.string,
  role: _react.PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
  size: _react.PropTypes.oneOf(['sm', 'lg']),
  inverse: _react.PropTypes.bool,
  Component: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.func]),
  loading: _react.PropTypes.bool,
  text: _react.PropTypes.string
};

var defaultProps = {
  Component: 'button',
  role: 'default'
};

function Button() {
  for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
    props[_key] = arguments[_key];
  }

  var Component = props.Component;
  var icon = props.icon;
  var size = props.size;
  var role = props.role;
  var className = props.className;
  var loading = props.loading;
  var text = props.text;


  var classNames = 'btn';

  if (size) {
    classNames = classNames + ' btn-' + size;
  }

  if (role) {
    classNames = classNames + ' btn-' + role;
  }

  if (className) {
    classNames = className + ' ' + classNames;
  }

  return _react2.default.createElement(
    Component,
    _extends({}, props, {
      className: classNames,
      type: 'button'
    }),
    loading ? _react2.default.createElement(_Icon2.default, { name: 'spinner', spin: true }) : _react2.default.createElement(_Icon2.default, { name: icon }),
    text
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

exports.default = Button;
module.exports = exports['default'];
