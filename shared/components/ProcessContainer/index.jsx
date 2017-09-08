import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import classnames from 'classnames';
import Loading from '../Loading';

import './_index.scss';

const propTypes = {
  size: PropTypes.oneOf(['default', 'sm', 'lg']),
  loading: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,

  // ms
  delay: PropTypes.number,
};
const defaultProps = {
  size: 'sm',

  // 延迟显示加载效果的时间（防止闪烁）
  delay: 200,
};

class ProcessContainer extends React.Component {
  constructor(props) {
    const { delay, loading } = props;
    super(props);

    utils.binds(this, [
      'renderHeart',
      'showLoading',
    ]);

    if (loading) {
      this.showLoading(delay);
    } else {
      this.state = {
        loading: false,
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading && nextProps.loading !== this.state.loading) {
      this.showLoading(nextProps.delay);
    }
  }


  showLoading(delay) {
    if (delay > 0) {
      this.state = {
        loading: false,
      };
      this.delayTimeout = setTimeout(() => {
        this.setState({
          loading: true,
        });
      }, delay);
    } else {
      this.state = {
        loading: true,
      };
    }
  }

  componentWillUnmount() {
    clearTimeout(this.delayTimeout);
  }

  render() {
    const { size, loading, delay, className, ...rest } = this.props;
    let myClassnames = classnames(className, {
      'rw-process-container': true,
    });
    const loadingContentClassnames = classnames('rw-process-container__loading', {
      'active': this.state.loading,
    });

    if (size !== 'default' && size) {
      myClassnames = `${myClassnames} rw-process-container--${size}`;
    }

    return (
      <div className={myClassnames} {...rest}>
        {this.props.children}
        {
          loading ? <div className="rw-process-container__backdrop" /> : null
        }
        {
          loading ? (
            <div
              className={loadingContentClassnames}
            >
              <Loading
                size={size}
                delay={delay}
              />
            </div>
          ) : null
        }
      </div>
    );
  }
}

ProcessContainer.propTypes = propTypes;
ProcessContainer.defaultProps = defaultProps;

export default ProcessContainer;

