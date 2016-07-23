import './index.scss';
import React, { PropTypes } from 'react';
import { fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  onChange: PropTypes.func,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

const defaultProps = {
  role: 'button',
};

class Switchs extends React.Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (e.target.value !== this.props.value) {
      if (this.props.onChange) {
        this.props.onChange({
          value: e.target.value,
          label: e.target.innerHTML,
        });
      }
    }
  }

  render() {
    const { size, className, options, value } = this.props;

    let classNames = 'btn-group';

    if (size) {
      classNames = `${classNames} btn-${size}`;
    }

    if (className) {
      classNames = `${className} ${classNames}`;
    }

    return (
      <div
        className={classNames}
        onClick={this.onClick}
      >
        {
          options ? fromJS(options).map((item, i) => {
            let myClassName = 'btn';
            let val;
            let label;

            if (typeof item.get === 'function') {
              val = item.get('value');
              label = item.get('label');
            } else {
              val = `${i}`;
              label = item;
            }

            if (val === value) {
              myClassName += ' active';
            }

            return (
              <button
                key={i}
                className={myClassName}
                value={val}
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
