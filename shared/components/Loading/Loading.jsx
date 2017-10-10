import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';

import './Loading.scss';

const propTypes = {
  size: PropTypes.oneOf(['default', 'sm', 'lg']),
  style: PropTypes.object,

  // ms
  delay: PropTypes.number,
};
const defaultProps = {
  size: 'default',

  // 延迟显示加载效果的时间（防止闪烁）
  delay: 200,
};

class Loading extends React.Component {
  constructor(props) {
    const { delay } = props;
    super(props);

    utils.binds(this, [
      'renderHeart',
    ]);

    if (delay > 0) {
      this.state = {
        showPiece: false,
      };
      this.delayTimeout = setTimeout(() => {
        this.setState({
          showPiece: true,
        });
      }, delay);
    } else {
      this.state = {
        showPiece: true,
      };
    }
  }

  componentWillUnmount() {
    clearTimeout(this.delayTimeout);
  }

  render() {
    const { size, style } = this.props;
    let myClassnames = 'a-heart';

    if (size !== 'default' && size) {
      myClassnames = `${myClassnames} a-heart--${size}`;
    }

    return (
      <div className={myClassnames} style={style}>
        {
          this.state.showPiece ? [
            <div className="a-heart-piece-0" key="a-heart-piece-0" />,
            <div className="a-heart-piece-1" key="a-heart-piece-1" />,
            <div className="a-heart-piece-2" key="a-heart-piece-2" />,
            <div className="a-heart-piece-3" key="a-heart-piece-3" />,
            <div className="a-heart-piece-4" key="a-heart-piece-4" />,
            <div className="a-heart-piece-5" key="a-heart-piece-5" />,
            <div className="a-heart-piece-6" key="a-heart-piece-6" />,
            <div className="a-heart-piece-7" key="a-heart-piece-7" />,
            <div className="a-heart-piece-8" key="a-heart-piece-8" />,
          ] : null
        }
      </div>
    );
  }
}

Loading.propTypes = propTypes;
Loading.defaultProps = defaultProps;

export default Loading;

