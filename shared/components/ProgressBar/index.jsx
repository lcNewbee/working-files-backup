import React from 'react';
import PropTypes from 'prop-types';
// import Progress from '../Progress';

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
  start: PropTypes.bool, // start属性控制进度条是否开始显示进度，为true表示开始移动，默认为false
  callback: PropTypes.func, // 进度条走完后执行的函数
  showText: PropTypes.bool, // 是否显示进度条文字，默认true
  unit: PropTypes.string, // 进度条单位，默认%
  color: PropTypes.string, // 进度条颜色
  time: PropTypes.number, // 进度条总时长,单位为 秒（s）
};

const defaultProps = {
  showText: true,
  color: '#0069d9',
  unit: '%',
  start: false,
  time: 30, // 默认总时间为 30 s
};

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.oneStepMove = this.oneStepMove.bind(this);
  }

  componentDidMount() {
    if (this.props.start === true) {
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
    const timeStamp = timestamp || new Date().getTime();
    if (!this.startTime) { this.startTime = timeStamp; }
    const runtime = timeStamp - this.startTime;
    let progress = runtime / (this.props.time * 1000);
    progress = Math.min(progress, 1);
    this.pgsElem.style.width = `${progress * 100}%`;
    this.txtElem.textContent = `${parseInt(progress * 100, 10)}${this.props.unit}`;
    if (runtime < this.props.time * 1000) {
      this.requestId = requestAnimationFrame(this.oneStepMove);
    } else {
      cancelAnimationFrame(this.requestId);
      this.props.callback();
    }
  }

  render() {
    const { title, showText, unit, color } = this.props;

    return (
      <div className="m-progress-bar">
        {
          title ? (
            <div className="m-progress-bar__title">
              {title}
            </div>
          ) : null
        }
        <div
          className="a-progress-wrap"
          style={{
            borderRadius: '.25rem',
            overflow: 'hidden',
            marginBottom: '5px',
            backgroundColor: '#e9ecef',
          }}
        >
          <div
            style={{
              width: 0,
              backgroundColor: color,
              height: '16px',
            }}
            ref={(pgsElem) => {
              if (pgsElem) {
                this.pgsElem = pgsElem;
              }
            }}
          />
          {
            showText && (
              <span
                className="a-progress-text"
                ref={(txtElem) => {
                  if (txtElem) {
                    this.txtElem = txtElem;
                  }
                }}
              >
                {`0${unit}`}
              </span>
            )
          }
        </div>
      </div>
    );
  }
}
ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;
