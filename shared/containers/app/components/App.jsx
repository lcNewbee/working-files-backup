import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-dom';
import { fromJS, Map } from 'immutable';
import ReduxToastr from 'react-redux-toastr';
import Modal from 'shared/components/Modal';
import ProgressBar from 'shared/components/ProgressBar';
import utils from 'shared/utils';
import { RouteSwitches } from 'shared/components/Organism/RouterConfig';
import matchPath from 'react-router/matchPath';
import Router from 'react-router/Router';

// ensure we're using the exact code for default root match
const { computeMatch } = Router.prototype;

const matchRoutes = (routes, pathname, /* not public API*/branch = []) => {
  routes.some((route) => {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
        ? branch[branch.length - 1].match // use parent match
        : computeMatch(pathname); // use default "root" match
    if (match) {
      branch.push({ ...route, match });

      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }

    return match;
  });

  return branch;
};

const propTypes = {
  $$modal: PropTypes.instanceOf(Map),
  closeModal: PropTypes.func,
  fetchProductInfo: PropTypes.func,
  updateRouter: PropTypes.func,
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
  }

  componentWillMount() {
    const { history, route } = this.props;
    if (this.props.fetchProductInfo && typeof (this.props.route.formUrl) !== 'undefined') {
      this.props.fetchProductInfo(this.props.route.formUrl);
    }
    this.unsubscribeFromHistory = history.listen(this.handleLocationChange);

    if (route.indexPath) {
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
    const routes = fromJS(matchRoutes(this.props.route.routes, location.pathname));
    this.props.updateRouter({
      routes,
    });
  }

  renderHtmlBody() {
    const { route } = this.props;
    const bodyElem = document.getElementsByTagName('body')[0];
    if (route.path !== '/') {
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
