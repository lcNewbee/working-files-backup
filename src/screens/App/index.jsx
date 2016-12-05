import React, { PropTypes, Component } from 'react';
import 'react-dom';
import { connect } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import * as actions from 'shared/actions/app';
import Modal from 'shared/components/Modal';
import Icon from 'shared/components/Icon';

const propTypes = {
  closeModal: PropTypes.func,
  fetchProductInfo: PropTypes.func,
  app: PropTypes.object,
  route: PropTypes.object,
  children: PropTypes.node,
};

const defaultProps = {
  closeModal: () => true,
};

class App extends Component {
  constructor(props) {
    super(props);

    this.onModalClose = this.onModalClose.bind(this);
    this.onModalApply = this.onModalApply.bind(this);
  }
  componentWillMount() {
    if (this.props.fetchProductInfo) {
      this.props.fetchProductInfo(this.props.route.formUrl);
    }
  }

  onModalClose() {
    this.props.closeModal({
      status: 'cancel',
    });
  }

  onModalApply() {
    this.props.closeModal({
      status: 'ok',
    });
  }

  render() {
    const { modal } = this.props.app.toJS();
    const modelRole = modal.role;
    const isLoadingModal = modelRole === 'loading';

    return (
      <div>
        { this.props.children }
        <Modal
          isShow={modal.status === 'show'}
          title={modal.title}
          role={modelRole}
          transitionEnter={false}
          transitionLeave={false}
          onClose={this.onModalClose}
          onOk={this.onModalApply}
          noFooter={isLoadingModal}
          noClose={isLoadingModal}
          customBackdrop
        >
          {
            modelRole === 'loading' ? (
              <div className="o-modal__body-icon">
                <Icon
                  name="spinner"
                  size="2x"
                  style={{
                    color: '#0093DD',
                  }}
                  spin
                />
              </div>
            ) : null
          }
          {modal.text}
        </Modal>
        <ReduxToastr
          timeOut={3000}
          newestOnTop={false}
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          preventDuplicates
          progressBar
        />
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}
// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  actions,
)(App);

export { default as app } from './reducer';
