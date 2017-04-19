import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-dom';
import { fromJS, Map } from 'immutable';
import ReduxToastr from 'react-redux-toastr';
import Modal from 'shared/components/Modal';
import ProgressBar from 'shared/components/ProgressBar';
import stringUtils from 'shared/utils/lib/string';
import { RouteSwitchs } from 'shared/components/Organism/RouterConfig';
import matchPath from 'react-router/matchPath';
import Router from 'react-router/Router';
import { Prompt } from 'react-router';

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
  route: PropTypes.shape({
    routes: PropTypes.array,
    formUrl: PropTypes.string,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }),
};

const defaultProps = {
  closeModal: () => true,
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.onModalClose = this.onModalClose.bind(this);
    this.onModalApply = this.onModalApply.bind(this);
    this.renderHtmlBody = this.renderHtmlBody.bind(this);
    this.updateRouter = this.updateRouter.bind(this);
  }
  componentWillMount() {
    if (this.props.fetchProductInfo && typeof (this.props.route.formUrl) !== 'undefined') {
      this.props.fetchProductInfo(this.props.route.formUrl);
    }
  }
  componentDidMount() {
    this.updateRouter();
  }
  shouldComponentUpdate(nextProps) {
    let ret = true;

    // console.log(this.props.location.pathname, nextProps.location.pathname);
    // // 如果是切换路径
    // if (this.props.location.pathname !== nextProps.location.pathname) {
    //   this.updateRouter();
    //   //this.props.changeAppScreen();
    //   ret = false;
    // }

    return ret;
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.updateRouter();
      //this.props.changeAppScreen();
      //ret = false;
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

  updateRouter() {
    const routes = fromJS(matchRoutes(this.props.route.routes, this.props.location.pathname));
    this.props.updateRouter({
      routes,
    });
  }

  renderHtmlBody() {
    const { route } = this.props;
    const bodyElem = document.getElementsByTagName('body')[0];
    if (route.path !== '/') {
      if (bodyElem.className.indexOf('fixed') === -1) {
        bodyElem.className = stringUtils.addClassName(bodyElem.className, 'fixed');
      }
    } else {
      bodyElem.className = stringUtils.removeClassName(bodyElem.className, 'fixed');
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
        <RouteSwitchs
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
