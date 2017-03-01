import React, { PropTypes } from 'react';
import classnames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

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

export default class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { className, theme, striped, value, max, animated, showText, unit, ...restProps } = this.props;
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
    const pecentValue = parseInt(((value / max) * 100), 10);
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
                width: `${pecentValue}%`,
              }}
            />
          </div>
          {
            // End  For under Ie9
          }

        </progress>
        <span className="a-progress-text">{`${value}${unit}`}</span>
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
              width: `${pecentValue}%`,
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
