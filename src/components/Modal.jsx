import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export default class Modal extends Component {
  constructor(props) {
    super(props);
  }

  onClose() {
    if (typeof this.props.onClose === 'function') {
      this.props.onClose();
    }
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        component="div"
        transitionName="fade-up"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {
          this.props.isShow ? (
            <div key="trsModel" className="modal" id="myModal" role="dialog"
              aria-labelledby="myModalLabel" aria-hidden="true">
              <div className="modal-backdrop"></div>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close fr"
                      onClick={this.onClose.bind(this)}
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
                      onClick={this.onClose.bind(this)}
                    >
                      关闭
                    </button>
                    <button type="button" className="btn btn-primary">
                      提交更改
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : ''
        }
      </ReactCSSTransitionGroup>
    )
  }
}
