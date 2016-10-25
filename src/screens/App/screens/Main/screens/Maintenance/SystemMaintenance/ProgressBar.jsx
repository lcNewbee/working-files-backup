import React, { PropTypes } from 'react';
import './ProgressBar.scss';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// isShow属性控制组件是否显示
// start属性控制进度条是否开始显示进度，为true表示开始移动，默认为false
const propTypes = {
  title: PropTypes.string,
  time: PropTypes.number,
  isShow: PropTypes.bool,
  toUrl: PropTypes.string,
  start: PropTypes.bool,
  style: PropTypes.object,
  callback: PropTypes.func, //进度条走完后执行的函数
};

// isShow 和 start 需异步修改，即先显示，在置start为true，否则进度条不会动。
const defaultProps = {
  isShow: false,
  start: false,
};

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      n: 0,
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
    if (prevProps.start === false && this.props.start === true) {
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
          style={{
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <span
            className="percentage"
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
              borderRadius: '10px',
            }}
            ref={(elem) => {
              if (elem !== null) {
                this.myBody1 = elem;
              }
            }}
          />
        </div>
      </div>
    );
  }
}
ProgressBar.propTypes = propTypes;
ProgressBar.defaultProps = defaultProps;
