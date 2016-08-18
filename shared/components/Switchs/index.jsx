import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  onChange: PropTypes.func,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  style: PropTypes.object,
  role: PropTypes.oneOf(['switch']),
};

const defaultProps = {
  role: 'switch',
};

class Switchs extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e, labelVal) {
    if (e.target.value !== this.props.value) {
      if (this.props.onChange) {
        this.props.onChange({
          value: e.target.value,
          label: labelVal,
        });
      }
    }
  }

  render() {
    const { size, className, options, value, role } = this.props;
    let optionsList;
    let classNames = 'm-switch';

    if (options) {
      optionsList = fromJS(options);
    }

    if (size) {
      classNames = `${classNames} m-switch-${size}`;
    }

    if (className) {
      classNames = `${classNames} ${className}`;
    }

    return (
      <div
        className={classNames}
        style={this.props.style}
        role={role}
      >
        {
          options ? optionsList.map((item, i) => {
            let myClassName = 'm-switch__item';
            let val;
            let label;

            if (typeof item.get === 'function') {
              val = item.get('value');
              label = item.get('label');
            } else {
              val = `${i}`;
              label = item;
            }

            if (val === `${value}`) {
              myClassName += ' active';
            }

            return (
              <button
                key={i}
                className={myClassName}
                value={val}
                onClick={(e) => {
                  this.onClick(e, label);
                }}
              >
                {label}
              </button>
            );
          }) : null
        }
      </div>
    );
  }
}

Switchs.propTypes = propTypes;
Switchs.defaultProps = defaultProps;

export default Switchs;
