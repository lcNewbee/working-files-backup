import React from 'react';
import PropTypes from 'prop-types';
import Progress from '../Progress';

window.requestAnimationFrame = window.requestAnimationFrame
                            || window.mozRequestAnimationFrame
                            || window.webkitRequestAnimationFrame
                            || window.msRequestAnimationFrame
                            || function (f) { return setTimeout(f, 1000 / 60); };

window.cancelAnimationFrame = window.cancelAnimationFrame
                            || window.mozCancelAnimationFrame
                            || function (requestId) { clearTimeout(requestId); };
const propTypes = {
  title: PropTypes.string, // 进度条上方显示的提示文字

  isShow: PropTypes.bool, // 控制组件是否显示
  start: PropTypes.bool, // start属性控制进度条是否开始显示进度，为true表示开始移动，默认为false
  style: PropTypes.object, // 设置进度条的样式
  callback: PropTypes.func, // 进度条走完后执行的函数

  // 进度条总时长,单位为 秒（s）
  time: PropTypes.number,
};

const defaultProps = {
  isShow: false,
  start: false,
  time: 30, // 默认总时间为 30 s
};

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.oneStepMove = this.oneStepMove.bind(this);
    this.state = {
      width: 0,
      progress: 0,
    };
  }

  componentDidMount() {
    if (this.props.start === true) {
      console.log('is in ms brower', window.requestAnimationFrame === window.msRequestAnimationFrame);
      requestAnimationFrame(this.oneStepMove);
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.start === false && this.props.start === true) ||
        prevProps.time !== this.props.time) {
      requestAnimationFrame(this.oneStepMove);
    }
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.requestId);
  }

  oneStepMove(timestamp) {
    console.log('timestamp', timestamp);
    const timeStamp = timestamp || new Date().getTime();
    if (!this.startTime) { this.startTime = timeStamp; }
    const runtime = timeStamp - this.startTime;
    let progress = runtime / (this.props.time * 1000);
    progress = Math.min(progress, 1);
    this.setState({ progress }, () => {
      if (runtime < this.props.time * 1000) {
        this.requestId = requestAnimationFrame(this.oneStepMove);
      } else {
        cancelAnimationFrame(this.requestId);
        this.props.callback();
      }
    });
  }

  render() {
    const { title, ...restProps } = this.props;
    const percentageValue = parseFloat(this.state.progress * 100);

    delete restProps.time;
    delete restProps.isShow;
    delete restProps.callback;

    return (
      <div className="m-progress-bar">
        {
          title ? (
            <div className="m-progress-bar__title">
              {title}
            </div>
          ) : null
        }
        <Progress
          {...restProps}
          className="m-progress-bar__body"
          value={percentageValue > 100 ? 100 : percentageValue}
          max="100"
          unit="% ..."
          showText
        />
      </div>
    );
  }
}
ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;
