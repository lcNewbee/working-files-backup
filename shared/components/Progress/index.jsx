import React, { PropTypes } from 'react';
import classnames from 'classnames';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const propTypes = {
  theme: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
  striped: PropTypes.bool,
  animated: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  value: 0,
  max: 100,
};

export default class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { theme, striped, value, max, animated } = this.props;
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

    return (
      <progress
        {...this.props}
        className={progressClassNames}
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
