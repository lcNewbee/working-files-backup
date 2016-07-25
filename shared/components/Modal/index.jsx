import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import './index.scss';

const propTypes = {
  isShow: PropTypes.bool,
  title: PropTypes.string,
  id: PropTypes.string,
  size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
  role: PropTypes.oneOf(['dialog', 'alert', 'comfirm', 'message']),
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  transitionLeave: PropTypes.bool,
  transitionEnter: PropTypes.bool,
  okButton: PropTypes.bool,
  cancelButton: PropTypes.bool,
  onClose: PropTypes.func,
  onOk: PropTypes.func,
  children: PropTypes.any,
};

const defaultProps = {
  title: '',
  role: 'dialog',
  okText: _('OK'),
  cancelText: _('Cancel'),
  transitionEnter: true,
  transitionLeave: true,
  okButton: true,
  cancelButton: true,
};

class Modal extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onOk = this.onOk.bind(this);
  }

  onClose() {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  onOk() {
    if (typeof this.props.onOk === 'function') {
      this.props.onOk();
    }
  }

  render() {
    let classNames;
    let keyVal = 'onlyModal';
    let hasCloseBtn = true;
    let { cancelButton } = this.props;
    const { size, role, id, transitionLeave, transitionEnter,
      isShow, title, cancelText, okButton, okText } = this.props;

    // role is shown in classNames
    if (role) {
      classNames = `modal-${role}`;
    }

    // ReactCSSTransitionGroup need key value
    if (size) {
      keyVal += ` modal-${role}`;
    }

    // ReactCSSTransitionGroup need key value
    if (id) {
      keyVal = `${id}Modal`;
    }

    // No top close button
    if (role === 'message' || role === 'comfirm') {
      hasCloseBtn = false;

    // when role is "alert" no cancelButton
    } else if (role === 'alert') {
      cancelButton = false;
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
                        {
                          cancelButton ? (
                            <button
                              type="button"
                              className="btn btn-default"
                              onClick={this.onClose}
                            >
                              {cancelText}
                            </button>
                          ) : null
                        }

                        {
                          okButton ? (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={this.onOk}
                            >
                              {okText}
                            </button>
                          ) : null
                        }

                      </div>
                    ) : null
                  }
                </div>
              </div>
            </div>
          ) : null
        }
      </ReactCSSTransitionGroup>
    );
  }
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
