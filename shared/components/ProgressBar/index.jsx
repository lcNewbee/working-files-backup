import React, { PropTypes } from 'react';
import Progress from '../Progress';
import './ProgressBar.scss';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const propTypes = {
  title: PropTypes.string, // 进度条上方显示的提示文字
  time: PropTypes.number, // 进度条时长
  isShow: PropTypes.bool, // 控制组件是否显示
  start: PropTypes.bool, // start属性控制进度条是否开始显示进度，为true表示开始移动，默认为false
  style: PropTypes.object, // 设置进度条的样式
  callback: PropTypes.func, //进度条走完后执行的函数
};

const defaultProps = {
  isShow: false,
  start: false,
};

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.startMove = this.startMove.bind(this);
    this.state = {
      width: 0,
      n: 0,
    };
  }

  componentDidMount() {
    if (this.props.start === true) {
      this.startMove();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.start === false && this.props.start === true) {
      this.startMove();
    }
  }
  componentWillUnmount() {
    clearInterval(this.barChangeInterval);
  }

  startMove() {
    const time = this.props.time;

    this.barChangeInterval = setInterval(() => {
      const n = this.state.n;
      if (n <= time) {
        this.setState({
          n: n + 1,
        });
      } else if (this.props.callback && typeof (this.props.callback) === 'function') {
        this.props.callback();
      }
    }, 1000);
  }

  render() {
    const percentageValue = parseInt((this.state.n / this.props.time) * 100, 10);

    return (
      <div className="m-progress-bar">
        {
          this.props.title ? (
            <div className="m-progress-bar__title">
              {this.props.title}
            </div>
          ) : null
        }
        <Progress
          {...this.props}
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
