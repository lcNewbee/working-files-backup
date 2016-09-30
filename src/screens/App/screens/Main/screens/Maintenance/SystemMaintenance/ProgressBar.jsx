import React, { PropTypes } from 'react';
import './ProgressBar.scss';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const propTypes = {
  title: PropTypes.string,
  time: PropTypes.number,
  isShow: PropTypes.bool,
  toUrl: PropTypes.string,
  style: PropTypes.object,
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
        // console.log(n);
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
            // (() => {
            //   let bodyWidth; let wrapWidth;
            //   if (this.myBody1 && this.myBodyWrap) {
            //     bodyWidth = this.myBody1.clientWidth;
            //     wrapWidth = this.myBodyWrap.clientWidth;
            //   }
            //   console.log('mybody', bodyWidth);
            //   return parseInt((bodyWidth / wrapWidth) * 100, 10) + '% ...';
            // })()
              // (() => {
              //   if (this.state.n <= this.props.time) {
              //     return parseInt((this.state.n / this.props.time) * 100, 10) + '% ...';
              //   }
              //   return '100%';
              // })()
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
