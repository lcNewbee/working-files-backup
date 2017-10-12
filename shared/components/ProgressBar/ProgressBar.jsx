import React from 'react';
import PropTypes from 'prop-types';

import './ProgressBar.scss';

const propTypes = {
  // 进度条上方显示的提示文字
  title: PropTypes.string,

  // 是否显示文字
  showText: PropTypes.bool,

  // start属性控制进度条是否开始显示进度，为true表示开始移动，默认为false
  start: PropTypes.bool,

  // 设置进度条的样式
  style: PropTypes.shape({
    width: PropTypes.string,
  }),

  // 进度条走完后执行的函数
  callback: PropTypes.func,

  // 进度条总时长,单位为 秒（s）
  time: PropTypes.number,
  unit: PropTypes.string,

  // 每 1% 间隔时间,单位为 毫秒（ms）
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  initStep: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  curStep: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  unit: '%',
  start: false,
  initStep: 0,

  showText: true,

  // 默认总时间为 30 s
  time: 30,

  step: 100,
};

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.startMove = this.startMove.bind(this);
    this.state = {
      n: props.initStep,
    };
  }

  componentDidMount() {
    if (this.props.start === true) {
      this.startMove();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.initStep !== this.props.initStep) {
      this.setState({
        n: nextProps.initStep,
      });
    }

    if (nextProps.curStep !== this.props.curStep) {
      this.setState({
        n: nextProps.curStep,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.start === false && this.props.start === true) ||
        prevProps.step !== this.props.step || prevProps.time !== this.props.time) {
      this.startMove();
    }
  }
  componentWillUnmount() {
    clearInterval(this.barChangeInterval);
  }

  startMove() {
    const time = this.props.time || 30;
    let intervalTime = (time * 1000) / 100;

    if (this.props.step) {
      intervalTime = parseInt(this.props.step, 10);
    } else {
      intervalTime = (time * 1000) / 100;
    }

    clearInterval(this.barChangeInterval);

    this.barChangeInterval = setInterval(() => {
      const { n } = this.state;

      if (n <= 100) {
        this.setState({
          n: n + 1,
        });

      // 到达 100 清理定时器，执行回调
      } else {
        clearInterval(this.barChangeInterval);
        if (this.props.callback && typeof (this.props.callback) === 'function') {
          this.props.callback();
        }
      }
    }, intervalTime);
  }

  render() {
    const {
      title, showText, unit, style,
    } = this.props;
    let percentageValue = parseInt(this.state.n, 10);
    const bodyStyle = {};

    percentageValue = percentageValue > 100 ? 100 : percentageValue;

    bodyStyle.width = `${percentageValue}%`;

    return (
      <div className="rw-progress-bar" style={style}>
        {
          title ? (
            <div className="rw-progress-bar__title">
              {title}
            </div>
          ) : null
        }
        <div
          className="rw-progress-bar__body"
        >
          <div
            className="rw-progress-bar__body__inner"
            style={bodyStyle}
          />
          {
            showText && (
              <span
                className="rw-progress-bar__body__text"
                ref={(txtElem) => {
                  if (txtElem) {
                    this.txtElem = txtElem;
                  }
                }}
              >
                {`${percentageValue}${unit}`}
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
