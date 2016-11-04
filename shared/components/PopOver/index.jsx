import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const propTypes = {
  isShow: PropTypes.bool,
  id: PropTypes.string,
  size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
  role: PropTypes.oneOf(['dialog', 'alert', 'confirm', 'message']),
  transitionLeave: PropTypes.bool,
  transitionEnter: PropTypes.bool,
  children: PropTypes.any,
  onClose: PropTypes.func,
  transitionName: PropTypes.oneOf(['fade-up', 'fade-left']),
};

const defaultProps = {
  transitionEnter: true,
  transitionLeave: true,
  transitionName: 'fade-up',
};

class PopOver extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    let keyVal = 'onlyPopOver';
    const { transitionLeave, transitionEnter, isShow } = this.props;

    return (
      <ReactCSSTransitionGroup
        component="section"
        transitionName="fade-up"
        transitionEnter={transitionEnter}
        transitionLeave={transitionLeave}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {
          isShow ? (
            <div key={keyVal} className="o-pop-over">
              <div
                className="o-pop-over__overlay"
                onClick={this.onClose}
              />
              {this.props.children}
            </div>
          ) : null
        }
      </ReactCSSTransitionGroup>
    );
  }
}

PopOver.propTypes = propTypes;
PopOver.defaultProps = defaultProps;

export default PopOver;
