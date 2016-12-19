import React, { PropTypes, Component } from 'react';
import 'react-dom';
import { connect } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import * as actions from 'shared/actions/app';
import Modal from 'shared/components/Modal';
import ProgressBar from 'shared/components/ProgressBar';
import stringUtils from 'shared/utils/lib/string';

const propTypes = {
  closeModal: PropTypes.func,
  fetchProductInfo: PropTypes.func,
  app: PropTypes.object,
  route: PropTypes.object,
  routes: PropTypes.array,
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
    this.renderHtmlBody = this.renderHtmlBody.bind(this);
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

  renderHtmlBody() {
    const thisRoutes = this.props.routes;
    const bodyElem = document.getElementsByTagName('body')[0];

    if (thisRoutes[1].path && thisRoutes[1].path.indexOf('/main/') !== -1) {
      if (bodyElem.className.indexOf('fixed') === -1) {
        bodyElem.className = stringUtils.addClassName(bodyElem.className, 'fixed');
      }
    } else {
      bodyElem.className = stringUtils.removeClassName(bodyElem.className, 'fixed');
    }
  }

  render() {
    const { modal } = this.props.app.toJS();
    const modelRole = modal.role;
    const isLoadingModal = modelRole === 'loading';

    this.renderHtmlBody();

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
              <ProgressBar
                title={modal.loadingTitle}
                time={modal.loadingTime || 100}
                callback={modal.onLoaded}
                step={modal.loadingStep}
                style={{
                  minHeight: '24px',
                }}
                theme="success"
                start
              />
            ) : null
          }
          {modal.text || ''}
        </Modal>
        <ReduxToastr
          timeOut={3000}
          newestOnTop={false}
          position="top-right"
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
