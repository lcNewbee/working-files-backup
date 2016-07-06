import React, { Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './index.scss';

const propTypes = {
  isShow: PropTypes.bool,
  title: PropTypes.string,
  size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
  role: PropTypes.oneOf(['dialog', 'alert', 'comfirm', 'message']),
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  // onClose: PropTypes.function,
  // onOk: PropTypes.function
};

const defaultProps = {
  title: '',
  role: 'dialog',
  okText: _('OK'),
  cancelText: _('Cancel'),
  transitionEnter: true,
  transitionLeave: true
}

class Modal extends Component {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
    this.onOk = this.onOk.bind(this);
  };

  onClose() {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  };

  onOk() {
    if (typeof this.props.onOk === 'function') {
      this.props.onOk();
    }
  };

  render() {
    const {isShow, title, cancelText,size, role, id, transitionLeave, transitionEnter} = this.props;
    let classNames;
    let keyVal = 'onlyModal';
    let hasCloseBtn = true;

    if (role) {
      classNames = `modal-${role}`;
    }

    if(id) {
      keyVal = `${id}Modal`;
    }

    // No top close button
    if(role === 'message' || role === 'comfirm') {
      hasCloseBtn = false;
    }
    return (
      <ReactCSSTransitionGroup
        component="div"
        transitionName="fade-up"
        transitionEnter={transitionEnter}
        transitionLeave={transitionLeave}
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {
          isShow ? (
            <div
              key={keyVal}
              className="modal"
              role={role}
            >
              <div className="modal-backdrop"></div>
              <div className={classNames}>
                <div className="modal-content">
                  {
                    title ? (
                      <div className="modal-header">
                        {
                          hasCloseBtn ? (
                            <button
                              type="button"
                              className="close fr"
                              onClick={this.onClose}
                            >
                              &times;
                            </button>
                          ) : null
                        }
                        <h4 className="modal-title" id="myModalLabel">
                          {title}
                        </h4>
                      </div>
                    ) : null
                  }

                  <div className="modal-body">
                    {this.props.children}
                  </div>
                  {
                    role !== 'message' ? (
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={this.onClose}
                        >
                          {this.props.cancelText}
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={this.onOk}
                        >
                          {this.props.okText}
                        </button>
                      </div>
                    ) : null
                  }
                </div>
              </div>
            </div>
          ) : null
        }
      </ReactCSSTransitionGroup>
    )
  };
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
