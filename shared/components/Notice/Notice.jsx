import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  text: PropTypes.string,
  show: PropTypes.bool,
  width: PropTypes.string,
};

const defaultProps = {
  width: '200px',
  show: true,
};


export default class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 0.8,
    };
  }

  componentDidMount() {
    let opacity = this.state.opacity;
    this.timeout = setTimeout(() => {
      this.timeInterval = setInterval(() => {
        opacity -= 0.02;
        if (opacity <= 0) {
          this.setState({ opacity: 0 });
          clearInterval(this.timeInterval);
        } else this.setState({ opacity });
      }, 50);
    }, 1500);
  }

  componentWillUnmount() {
    clearTimeout(this.timeInterval);
  }

  render() {
    return (
      <div>
        {
          this.props.show ? (
            <div
              className="o-modal"
              style={{
                display: this.state.opacity ? 'block' : 'none',
              }}
            >
              <div
                style={{
                  width: this.props.width,
                  padding: '30px 25px',
                  margin: '100px auto',
                  backgroundColor: `rgba(0, 0, 0, ${this.state.opacity})`,
                  color: `rgba(255, 255, 255, ${this.state.opacity})`,
                  fontSize: '17px',
                  borderRadius: '5px',
                }}
                onClick={() => {
                  clearTimeout(this.timeout);
                  clearInterval(this.timeInterval);
                  this.setState({ opacity: 0 });
                }}
              >
                {this.props.text}
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

Notice.propTypes = propTypes;
Notice.defaultProps = defaultProps;
