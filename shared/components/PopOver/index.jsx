import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PureComponent from '../Base/PureComponent';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const propTypes = {
  isShow: PropTypes.bool,
  overlay: PropTypes.bool,
  transitionLeave: PropTypes.bool,
  transitionEnter: PropTypes.bool,
  children: PropTypes.any,
  onClose: PropTypes.func,
};

const defaultProps = {
  transitionEnter: true,
  transitionLeave: true,
  transitionName: 'fade-up',
  overlay: true,
};

class PopOver extends PureComponent {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
    this.renderContent = this.renderContent.bind(this);
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  renderContent() {
    const { overlay } = this.props;
    const keyVal = 'onlyPopOver';
    let ret = this.props.children;

    if (overlay) {
      ret = (
        <div key={keyVal} className="o-pop-over">
          <div
            className="o-pop-over__overlay"
            onClick={this.onClose}
          />

          {this.props.children}
        </div>
      );
    }
    return ret;
  }

  render() {
    const { transitionLeave, transitionEnter, isShow, overlay } = this.props;

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
            this.renderContent()
          ) : null
        }
      </ReactCSSTransitionGroup>
    );
  }
}

PopOver.propTypes = propTypes;
PopOver.defaultProps = defaultProps;

export default PopOver;
