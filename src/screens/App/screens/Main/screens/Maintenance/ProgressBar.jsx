import React, { PropTypes } from 'react';
import './ProgressBar.scss';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const propTypes = {
  title: PropTypes.string,
  time: PropTypes.number,
  isShow: PropTypes.bool,
  toUrl: PropTypes.string,
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
        console.log(n);
      } else {
        window.location.href = this.props.toUrl;
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
        >
          <span
            className="percentage"
          >
            {parseInt((this.state.n / this.props.time) * 100, 10) + '% ...'}
          </span>
          <div
            className="bar-body1 fl"
            style={{
              width: this.state.width,
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
