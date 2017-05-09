import React from 'react';
import PropTypes from 'prop-types';
import Progress from '../Progress';

// import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

require('./_index.scss');

const propTypes = {
  title: PropTypes.string,    // 进度条上方显示的提示文字

  isShow: PropTypes.bool,     // 控制组件是否显示
  start: PropTypes.bool,      // start属性控制进度条是否开始显示进度，为true表示开始移动，默认为false
  style: PropTypes.object,    // 设置进度条的样式
  callback: PropTypes.func,   // 进度条走完后执行的函数

  // 进度条总时长,单位为 秒（s）
  time: PropTypes.number,

  // 每 1% 间隔时间,单位为 毫秒（ms）
  initStep: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  curStep: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const defaultProps = {
  isShow: false,
  start: false,
  initStep: 0,
  time: 30,    // 默认总时间为 30 s
};

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.startMove = this.startMove.bind(this);
    this.state = {
      width: 0,
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
      const n = this.state.n;

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
    const { title, ...restProps } = this.props;
    const percentageValue = parseInt(this.state.n, 10);

    delete restProps.initStep;
    delete restProps.time;
    delete restProps.curStep;
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
