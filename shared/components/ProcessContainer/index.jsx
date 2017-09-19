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

  // 延迟显示时间 ms，防止闪烁
  delay: PropTypes.number,

  // 强制显示加载中时间，防止闪烁
  forceLoadingTime: PropTypes.number,
};
const defaultProps = {
  size: 'sm',
  loading: false,

  // 延迟显示加载效果的时间（防止闪烁）
  delay: 200,

  // 最小显示loading 状态时间
  forceLoadingTime: 0,
};

class ProcessContainer extends React.PureComponent {
  constructor(props) {
    const { loading } = props;
    super(props);

    utils.binds(this, [
      'renderHeart',
      'handleStartLoading',
      'handleEndLoading',
    ]);

    this.state = {
      loading,
    };
  }

  componentWillReceiveProps(nextProps) {
    // 切换加载状态
    if (this.props.loading !== nextProps.loading) {

      // 加载
      if (nextProps.loading) {
        this.handleStartLoading(nextProps);

      // 关闭加载中
      } else {
        this.handleEndLoading(nextProps);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }

  handleStartLoading(props) {
    const { delay, forceLoadingTime } = props;

    this.forceLoading = false;
    clearTimeout(this.loadingTimeout);

    if (delay) {
      this.loadingTimeout = setTimeout(() => {
        this.setState({
          loading: true,
        });

        // 强制显示 loading, 避免闪烁
        if (forceLoadingTime) {
          this.forceLoading = true;
          this.loadingTimeout = setTimeout(() => {
            this.setState({
              loading: false,
            });
            this.forceLoading = false;
          }, forceLoadingTime);
        }
      }, delay);
    } else {
      this.setState({
        loading: true,
      });
    }
  }

  handleEndLoading() {
    // 非强制显示 loading 状态下直接关闭
    if (!this.forceLoading) {
      clearTimeout(this.loadingTimeout);
      this.state = {
        loading: false,
      };
    }
  }

  render() {
    const { size, delay, className, forceLoadingTime, ...rest } = this.props;
    const { loading } = this.state;
    let myClassnames = classnames(className, {
      'rw-process-container': true,
    });
    let loadingNode = null;

    if (size !== 'default' && size) {
      myClassnames = `${myClassnames} rw-process-container--${size}`;
    }

    if (loading) {
      loadingNode = [
        <div className="rw-process-container__backdrop" key="loadingBackdrop" />,
        (
          <div className="rw-process-container__loading" key="loadingContent">
            <Loading
              size={size}
              delay={0}
            />
          </div>
        ),
      ];
    }

    return (
      <div className={myClassnames} {...rest}>
        {this.props.children}
        { loadingNode }
      </div>
    );
  }
}

ProcessContainer.propTypes = propTypes;
ProcessContainer.defaultProps = defaultProps;

export default ProcessContainer;

