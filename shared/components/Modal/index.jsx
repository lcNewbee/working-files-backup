import React from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransition from 'react-transition-group/CSSTransition';
import classNames from 'classnames';
import b28n from 'shared/b28n';
import utils from 'shared/utils';
import RenderInDom from '../Base/RenderInDom';
import PureComponent from '../Base/PureComponent';

let curModelShowNum = 0;
let backdropTimeout = null;

function renderBackdrop(isShow, enter, exit) {
  const modalBackdropElem = document.getElementById('modalBackdrop');
  let modalBackdropHtml = '<div id="modalBackdrop" class="o-modal__backdrop fade"></div>';

  if (isShow) {
    curModelShowNum += 1;
    if (!modalBackdropElem) {
      document.body.appendChild(utils.dom.fragment(modalBackdropHtml));
    }
  } else if (curModelShowNum > 0) {
    curModelShowNum -= 1;
    modalBackdropHtml = '<div id="modalBackdrop" class="o-modal__backdrop in"></div>';
  }
  // 如果是显示
  if (curModelShowNum > 0) {
    if (enter) {
      clearTimeout(backdropTimeout);
      backdropTimeout = setTimeout(
        () => {
          document.getElementById('modalBackdrop').className = classNames(
            'o-modal__backdrop',
            {
              in: isShow,
              fade: !isShow,
            },
          );
        }, 10);
    } else {
      document.getElementById('modalBackdrop').className = classNames(
        'o-modal__backdrop',
        {
          in: isShow,
          fade: !isShow,
        },
      );
    }

    // 隐藏Backdrop, 并显示动画
  } else if (exit) {
    setTimeout(
      () => {
        if (document.getElementById('modalBackdrop')) {
          document.getElementById('modalBackdrop').className = classNames(
            'o-modal__backdrop',
            {
              in: isShow,
              fade: !isShow,
            },
          );
        }
      }, 10);

    // 定时删除Backdrop元素
    clearTimeout(backdropTimeout);
    backdropTimeout = setTimeout(
      () => {
        const newElem = document.getElementById('modalBackdrop');
        if (newElem) {
          document.body.removeChild(newElem);
        }
      }, 500);

    // 隐藏并无动画
  } else if (modalBackdropElem) {
    document.body.removeChild(modalBackdropElem);
  }
}

const propTypes = {
  isShow: PropTypes.bool,
  title: PropTypes.any,
  id: PropTypes.string,
  style: PropTypes.object,
  size: PropTypes.oneOf(['min', 'md', 'lg', 'xlg', 'max']),
  role: PropTypes.oneOf(['dialog', 'alert', 'confirm', 'message', 'loading']),
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  exit: PropTypes.bool,
  enter: PropTypes.bool,
  okButton: PropTypes.bool,
  draggable: PropTypes.bool,
  cancelButton: PropTypes.bool,
  noFooter: PropTypes.bool,
  customBackdrop: PropTypes.bool,
  onClose: PropTypes.func,
  onOk: PropTypes.func,
  children: PropTypes.any,
};
const defaultProps = {
  title: '',
  role: 'dialog',
  enter: true,
  exit: true,
  okButton: true,
  cancelButton: true,
  noFooter: false,
  customBackdrop: false,
};

class Modal extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onClose',
      'onOk',
      'onShow',
      'onExited',
    ]);
    this.state = {
      modalStyle: props.style,
      modalSize: props.size,
      isShow: props.isShow,
      bodyContent: props.children,
    };
  }

  componentDidMount() {
    if (this.state.isShow && !this.props.customBackdrop) {
      renderBackdrop(
        this.state.isShow,
        this.props.enter,
        this.props.exit,
      );
    }
    this.modalKey = `model${utils.uuid()}`;
  }

  componentWillReceiveProps(nextProps) {
    const newState = {
      isShow: nextProps.isShow,
    };

    if (nextProps.style !== this.props.style) {
      newState.modalStyle = nextProps.style;
    }

    // 如果是关闭 Modal, 暂存现在的显示状态
    if (this.props.isShow && !nextProps.isShow) {
      this.cacheBodyContent = nextProps.children;
      this.cacheSize = nextProps.size;
    } else {
      this.setState({
        bodyContent: nextProps.children,
        modalSize: nextProps.size,
      });
    }

    this.setState(newState);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isShow !== this.state.isShow && !this.props.customBackdrop) {
      renderBackdrop(
        this.state.isShow,
        this.props.enter,
        this.props.exit,
      );
    }
  }
  componentWillUnmount() {
    const isShowModel = false;
    renderBackdrop(
      isShowModel,
      this.props.enter,
      this.props.exit,
    );
  }
  onExited() {
    const newState = {};
    let needSetState = false;

    if (this.cacheBodyContent) {
      newState.bodyContent = this.cacheBodyContent;
      needSetState = true;
    }

    if (this.cacheSize) {
      needSetState = true;
      newState.modalSize = this.cacheSize;
    }

    if (needSetState) {
      this.setState(newState);
    }

    this.cacheBodyContent = null;
    this.cacheSize = '';
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
  renderDom() {
    const { isShow } = this.props;

    document.body.className = classNames(
      document.body.className.replace(/(^\s*)|(\s*)o-modal--open/g, ''),
      {
        'o-modal--open': isShow,
      },
    );
  }
  render() {
    const { role, id, exit, enter,
      isShow, title, cancelText, okButton, okText, draggable,
      customBackdrop,
    } = this.props;
    const size = this.state.modalSize;
    let noFooter = this.props.noFooter;
    let contentClassNames;
    let keyVal = this.modalKey;
    let hasCloseBtn = true;
    let { cancelButton } = this.props;
    let modalClassName = 'o-modal';

    // role is shown in contentClassNames
    if (role) {
      contentClassNames = `o-modal__${role}`;
    }

    if (draggable) {
      modalClassName = `${modalClassName} o-modal--draggable`;
    }

    // size
    if (size) {
      modalClassName = `${modalClassName} o-modal--${size}`;
    }

    // ReactCSSTransition need key value
    if (id) {
      keyVal = `${id}Key`;
    }

    // No top close button
    if (role === 'message') {
      noFooter = true;
    } else if (role === 'confirm') {
      hasCloseBtn = false;

      // when role is "alert" no cancelButton
    } else if (role === 'alert') {
      cancelButton = false;
    }

    return (
      <RenderInDom>
        <ReactCSSTransition
          key={keyVal}
          in={this.state.isShow}
          classNames="fade-down"
          enter={enter}
          exit={exit}
          timeout={500}
          onExited={this.onExited}
          appear
          mountOnEnter
          unmountOnExit
        >
          <div
            className={modalClassName}
            key={keyVal}
            role={role}
            onDragOver={(e) => { e.preventDefault(); }} // 拖放事件：允许放置
            onDrop={(e) => { // 拖放事件：放置事件
              if (draggable) {
                const positionStyle = Object.assign({},
                  this.state.modalStyle,
                  {
                    top: `${e.clientY - this.diffY}px`,
                    left: `${e.clientX - this.diffX}px`,
                    position: 'absolute',
                  },
                );
                this.setState({
                  modalStyle: positionStyle,
                });
              }
            }}
          >
            {
              customBackdrop && isShow ? (
                <div className="o-modal__backdrop in" />
              ) : null
            }
            <div
              className={contentClassNames}
              style={this.state.modalStyle}
              ref={(ref) => {
                this.moveDiv = ref;
              }}
            >
              <div
                className="o-modal__content"
              >
                {
                  title ? ( // 只有Modal的标题部分允许拖动
                    <div
                      className="o-modal__header"
                      draggable={draggable}
                      onDragStart={(e) => { // 拖放事件：拖放准备
                        this.diffX = e.clientX - this.moveDiv.offsetLeft;
                        this.diffY = e.clientY - this.moveDiv.offsetTop;
                      }}
                    >
                      {
                        hasCloseBtn ? (
                          <span
                            className="close fr"
                            onClick={this.onClose}
                          >
                            &times;
                          </span>
                        ) : null
                      }
                      <h4 className="o-modal__title" id="myModalLabel">
                        {title}
                      </h4>
                    </div>
                  ) : null
                }

                <div className="o-modal__body">
                  {this.state.bodyContent}
                </div>
                {
                  !noFooter ? (
                    <div className="o-modal__footer">
                      {
                        cancelButton ? (
                          <button
                            type="button"
                            className="a-btn a-btn--secondary"
                            onClick={this.onClose}
                          >
                            {cancelText || b28n.format('Cancel')}
                          </button>
                        ) : null
                      }

                      {
                        okButton ? (
                          <button
                            type="button"
                            className="a-btn a-btn--primary"
                            onClick={this.onOk}
                          >
                            {okText || b28n.format('OK')}
                          </button>
                        ) : null
                      }

                    </div>
                  ) : null
                }
              </div>
            </div>
          </div>
        </ReactCSSTransition>
      </RenderInDom>
    );
  }
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
