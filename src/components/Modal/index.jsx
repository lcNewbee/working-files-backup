import React, { Component, PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const propTypes = {
  isShow: PropTypes.bool,
  title: PropTypes.string,
  size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
  role: PropTypes.oneOf(['dialog', 'alert', 'comfirm']),
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  // onClose: PropTypes.function,
  // onOk: PropTypes.function
};

const defaultProps = {
  title: '',
  role: 'dialog',
  okText: 'Ok',
  cancelText: 'Cancel'
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
    let {size, role, id} = this.props;
    let classNames;
    let keyVal = 'onlyModal';
    
    if (role) {
      classNames = `modal-${role}`;
    }
    
    if(id) {
      keyVal = `${id}Modal`;
    }

    return (
      <ReactCSSTransitionGroup
        component="div"
        transitionName="fade-up"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {
          this.props.isShow ? (
            <div
              key={keyVal}
              className="modal"
              role={role}
            >
              <div className="modal-backdrop"></div>
              <div className={classNames}>
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close fr"
                      onClick={this.onClose}
                    >
                      &times;
                    </button>
                    <h4 className="modal-title" id="myModalLabel">
                      {this.props.title}
                    </h4>
                  </div>
                  <div className="modal-body">
                    {this.props.children}
                  </div>
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
                </div>
              </div>
            </div>
          ) : ''
        }
      </ReactCSSTransitionGroup>
    )
  };
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
