import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import PureComponent from '../Base/PureComponent';

// We
const propTypes = {
  theme: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
  striped: PropTypes.bool,
  animated: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showText: PropTypes.bool,
  unit: PropTypes.string,
  className: PropTypes.string,
};

const defaultProps = {
  value: 0,
  max: 100,
  unit: '%',
};

export default class Progress extends PureComponent {
  render() {
    const {
      className, theme, striped, value, max, animated, showText, unit,
      ...restProps
    } = this.props;
    const progressClassNames = classnames('a-progress', {
      'a-progress--success': theme === 'success',
      'a-progress--info': theme === 'info',
      'a-progress--warning': theme === 'warning',
      'a-progress--danger': theme === 'danger',
      'a-progress--primary': theme === 'primary',
      'a-progress--striped': striped,
      'a-progress--animated': animated,
    });
    const progressBarClassNames = classnames('a-progress-bar', {
      'a-progress-bar--striped': striped,
    });
    const percentValue = parseInt(((value / max) * 100), 10);
    const textValue = parseInt(value, 10);
    const hasTextProgress = (
      <div className={`${className} a-progress-wrap`} >
        <progress
          {...restProps}
          className={progressClassNames}
          value={value}
          max={max}
        >
          {
            // Start  For under Ie9
          }
          <div
            {...restProps}
            className={progressClassNames}
          >
            <span
              className={progressBarClassNames}
              style={{
                width: `${percentValue}%`,
              }}
            />
          </div>
          {
            // End  For under Ie9
          }

        </progress>
        <span className="a-progress-text">{`${textValue}${unit}`}</span>
      </div>
    );

    return showText ? hasTextProgress : (
      <progress
        {...restProps}
        className={`${className} ${progressClassNames}`}
        value={value}
        max={max}
      >
        {
          // Start  For under Ie9
        }
        <div
          {...this.props}
          className={progressClassNames}
        >
          <span
            className={progressBarClassNames}
            style={{
              width: `${percentValue}%`,
            }}
          />
        </div>
        {
          // End  For under Ie9
        }

      </progress>
    );
  }
}
Progress.propTypes = propTypes;
Progress.defaultProps = defaultProps;
