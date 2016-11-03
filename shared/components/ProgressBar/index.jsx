import React, { PropTypes } from 'react';
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

  startMove() {
    this.bodyWrapOffsetWidth = this.myBodyWrap.offsetWidth - 2;
    const time = this.props.time;
    const length = this.bodyWrapOffsetWidth;
    this.barChangeInterval = setInterval(() => {
      const n = this.state.n;
      if (n <= time) {
        this.setState({
          width: (n / time) * length,
          n: n + 1,
        });
      } else if (this.props.callback && typeof (this.props.callback) === 'function') {
        this.props.callback();
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.barChangeInterval);
  }

  render() {
    return (
      <div>
        <div className="bar-title">
          {this.props.title}
        </div>
        <div
          className="bar-wrap"
          ref={(elem) => {
            if (elem !== null) {
              this.myBodyWrap = elem;
            }
          }}
          style={this.props.style}
        >
          <span
            className="percentage"
            style={{
              position: 'absolute',
              marginLeft: this.myBodyWrap ? this.myBodyWrap.offsetWidth/2 - 7 : 0,
              marginTop: this.myBodyWrap ? this.myBodyWrap.offsetHeight/2 - 7 : 0,
            }}
          >
             {
                parseInt((this.state.n / this.props.time) * 100, 10) > 100 ? '100% ...' : (
                 parseInt((this.state.n / this.props.time) * 100, 10) + '% ...'
                )
            }
          </span>
          <div
            className="bar-body1 fl"
            style={{
              width: this.state.width,
              height: this.myBodyWrap ? this.myBodyWrap.offsetHeight - 2 : 0,
            }}
          />
        </div>
      </div>
    );
  }
}
ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;
