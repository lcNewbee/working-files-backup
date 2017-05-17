import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-dom';
import { fromJS, Map } from 'immutable';
import ReduxToastr from 'react-redux-toastr';
import Modal from 'shared/components/Modal';
import ProgressBar from 'shared/components/ProgressBar';
import utils from 'shared/utils';
import { RouteSwitches, matchRoutes } from 'shared/components/Organism/RouterConfig';

const propTypes = {
  $$modal: PropTypes.instanceOf(Map),
  closeModal: PropTypes.func,
  fetchProductInfo: PropTypes.func,
  updateRouter: PropTypes.func,
  addAppScreen: PropTypes.func,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  history: PropTypes.shape({
    listen: PropTypes.func,
  }),
  route: PropTypes.shape({
    routes: PropTypes.array,
    formUrl: PropTypes.string,
  }),
};

const defaultProps = {
  closeModal: () => true,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    utils.binds(this, [
      'onModalClose',
      'onModalApply',
      'renderHtmlBody',
      'handleLocationChange',
    ]);

    this.lastPathname = '';
    this.handleLocationChange(props.location);
  }

  componentWillMount() {
    const { history, route, location } = this.props;
    if (this.props.fetchProductInfo && typeof (this.props.route.formUrl) !== 'undefined') {
      this.props.fetchProductInfo(this.props.route.formUrl);
    }
    this.unsubscribeFromHistory = history.listen(this.handleLocationChange);

    if (route.indexPath && location.pathname === route.path) {
      history.push(route.indexPath);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory();
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
  handleLocationChange(location) {
    let $$routes = null;
    let curScreenId = 'base';

    // 只有当 screenId 改变时 才切换 路由
    if (this.lastPathname !== location.pathname) {
      $$routes = fromJS(matchRoutes(this.props.route.routes, location.pathname));
      curScreenId = $$routes.getIn([-1, 'id']);

      this.props.updateRouter({
        routes: $$routes,
      });
      this.props.addAppScreen(curScreenId, $$routes.get(-1));

      this.lastPathname = location.pathname;
    }
  }

  renderHtmlBody() {
    const { location } = this.props;
    const bodyElem = document.getElementsByTagName('body')[0];

    // Main 相关界面添加 fixed
    if (location.pathname.indexOf('main') !== -1) {
      if (bodyElem.className.indexOf('fixed') === -1) {
        bodyElem.className = utils.addClassName(bodyElem.className, 'fixed');
      }
    } else {
      bodyElem.className = utils.removeClassName(bodyElem.className, 'fixed');
    }
  }

  render() {
    const { $$modal } = this.props;
    const modal = $$modal.toJS();
    const modelRole = modal.role;
    const isLoadingModal = modelRole === 'loading';

    this.renderHtmlBody();

    return (
      <div>
        <RouteSwitches
          routes={this.props.route.routes}
        />
        <Modal
          id="appModal"
          isShow={modal.status === 'show'}
          title={modal.title}
          role={modelRole}
          transitionEnter={false}
          transitionLeave={false}
          onClose={this.onModalClose}
          onOk={this.onModalApply}
          noFooter={isLoadingModal}
          noClose={isLoadingModal}
          okText={__('OK')}
          cancelText={__('Cancel')}
          customBackdrop
        >
          {
            modelRole === 'loading' ? (
              <ProgressBar
                title={modal.loadingTitle}
                time={modal.loadingTime || 100}
                callback={modal.onLoaded}
                step={modal.loadingStep}
                initStep={modal.loadingInitStep}
                curStep={modal.loadingCurStep}
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
