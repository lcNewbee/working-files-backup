import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransition from 'react-transition-group/CSSTransition';
import PureComponent from '../Base/PureComponent';

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
    const { transitionLeave, transitionEnter, isShow } = this.props;

    return (
      <ReactCSSTransition
        classNames="fade-up"
        enter={transitionEnter}
        exit={transitionLeave}
        timeout={{
          enter: 500,
          exit: 300,
        }}
      >
        <div
          key="onlyPopOver"
          style={{
            display: isShow ? 'block' : 'none',
          }}
        >
          {
            isShow ? (
              this.renderContent()
            ) : null
          }
        </div>
      </ReactCSSTransition>
    );
  }
}

PopOver.propTypes = propTypes;
PopOver.defaultProps = defaultProps;

export default PopOver;
