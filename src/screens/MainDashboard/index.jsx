import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import utils from 'shared/utils';
import classNamesUtils from 'classnames';
import { getActionable } from 'shared/axc';
import { Icon, PopOver, Navbar } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { RouteSwitches } from 'shared/components/Organism/RouterConfig';

import './_index.scss';

const propTypes = {
  refreshAll: PropTypes.func,
  save: PropTypes.func,
  fetch: PropTypes.func,
  changeLoginStatus: PropTypes.func,
  toggleMainPopOver: PropTypes.func,
  togglePropertyContainer: PropTypes.func,
  route: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  routes: PropTypes.array,

  // immutable data
  app: PropTypes.instanceOf(Map),
  product: PropTypes.instanceOf(Map),
  properties: PropTypes.instanceOf(Map),
};

const defaultProps = {
  Component: 'button',
  role: 'default',
};
export default class Main extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isShowUserPop: false };
    utils.binds(this, [
      'onSelectManageGroup',
      'showUserPopOver',
      'onRefresh',
      'onLogout',
      'onClickNav',
      'hiddenPopOver',
      'onToggleMainPopOver',
      'renderPopOverContent',
      'onRefreshProductInfo',
      'onSaveConfiguration',
    ]);

    document.onkeydown = (e) => {
      if (e.keyCode === 116) {
        this.onRefresh(e);
      }
    };

    this.state = {
      popOver: {
        name: 'userOverview',
        isShow: false,
        overlay: true,
      },
    };
  }

  componentWillMount() {
    const locationQuery = utils.getQuery(this.props.location.search);
    const purview = this.props.app.getIn(['login', 'purview']);
    const appId = locationQuery && locationQuery.appId;

    // 判断是否恢复出厂状态，再决定跳转页面
    this.props.fetch('goform/quicksetup').then((json) => {
      if (json && json.state && json.state.code === 2000) {
        if (json.data.restoreState === '1') {
          window.location.hash = '/quicksetup';
        }
      }
    });

    // 如果权限为空自动跳转到 登录Screen
    if (purview === 'none' && appId !== 'ad30a4a05ac6855c64074246948fbf9c') {
      this.props.history.push('/login');
    }

    this.actionable = getActionable(this.props);

    setTimeout(() => {
      this.setState({
        animationInited: true,
      });
    }, 1800);
  }

  componentDidMount() {
    utils.dom.addClass(document.getElementById('app'), 'app-warp--dashboard');
  }

  componentWillUpdate(nextProps) {
    if (this.props.app.get('companyname') !== nextProps.app.get('companyname')) {
      this.onRefreshProductInfo(nextProps);
    }
  }


  componentWillUnmount() {
    clearTimeout(this.onRefreshTimeout);
    utils.dom.removeClass(
      document.getElementById('app'),
      'app-warp--dashboard',
    );
  }

  /**
   * 用于更新不同厂商的相关信息
   *
   * @param {object} props
   *
   * @memberof Main
   */
  onRefreshProductInfo(props) {
    this.companyTitle = props.app.get('title') || '';
    this.companyName = props.app.get('companyname') || '';

    // 'sales@axilspot.com'
    this.emailUrl = props.app.get('email') || '';

    document.title = `${this.companyTitle} Access Controller`;
  }

  onRefresh(e) {
    e.preventDefault();
    this.props.refreshAll();
  }
  onLogout(e) {
    e.preventDefault();
    this.props.changeLoginStatus('0');
    this.hiddenPopOver();
    this.props.history.push('/login');
  }

  onToggleMainPopOver(option) {
    this.props.toggleMainPopOver(option);
  }

  onClickTopMenu(path) {
    if (path === '/main/group') {
      // this.onToggleMainPopOver({
      //   name: 'groupAsider',
      //   isShow: true,
      //   overlay: false,
      // });
    } else {
      this.onToggleMainPopOver({
        isShow: false,
      });
    }
  }
  onSaveConfiguration() {
    let ret = null;

    if (this.actionable) {
      this.setState({
        isSaveConfig: true,
      });
      ret = this.props.save('goform/system/saveConfig')
        .then(() => {
          this.setState({
            isSaveConfig: false,
          });
        });
    }

    return ret;
  }

  showUserPopOver() {
    this.setState({
      popOver: {
        name: 'userOverview',
        isShow: true,
        overlay: true,
      },
    });
  }
  hiddenPopOver() {
    this.setState({
      popOver: {
        name: 'userOverview',
        isShow: false,
        overlay: true,
      },
    });
  }

  renderPopOverContent(popOver) {
    switch (popOver.name) {
      case 'userOverview':
        return (
          <div className="m-user-overview">
            <div className="m-user-overview__info">
              <Icon name="user" className="icon-user" />
            </div>
            <div className="m-user-overview__controls">
              <a className="change-pas" href="#/main/system/admin" onClick={this.hiddenPopOver}>
                <Icon
                  name="key"
                />
                {__('Change Password')}
              </a>
              <a className="sign-out" onClick={this.onLogout}>
                <Icon
                  name="sign-out"
                />
                {__('Logout')}
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  render() {
    const { version } = this.props.app.toJS();
    const { popOver } = this.state;
    const mainClassName = 't-main t-main--dashboard';

    return (
      <div className={mainClassName}>
        {/* <Navbar version={version}>
          <div className="aside">
            <button className="as-control" onClick={this.onRefresh} >
              <Icon name="refresh" className="icon" />
              <span>{__('Refresh')}</span>
            </button>
            <div className="user" onClick={this.showUserPopOver}>
              <Icon name="user" className="icon-user" />
              <Icon
                name="caret-down"
                className="icon-down"
              />
            </div>
          </div>
        </Navbar> */}
        <RouteSwitches
          routes={this.props.route.routes}
        />
        <PopOver
          onClose={this.hiddenPopOver}
          {...popOver}
        >
          {
            this.renderPopOverContent(popOver)
          }
        </PopOver>
      </div>
    );
  }
}

Main.propTypes = propTypes;
Main.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    groupid: state.product.getIn(['group', 'selected', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
