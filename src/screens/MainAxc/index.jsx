import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import utils from 'shared/utils';
import classNamesUtils from 'classnames';
import Icon from 'shared/components/Icon';
import PopOver from 'shared/components/PopOver';
import Navbar from 'shared/components/Navbar';
import { actions as appActions } from 'shared/containers/app';
import {
  actions as propertiesActions,
  Screen as PropertyPanel,
} from 'shared/containers/properties';
import { RouteSwitches } from 'shared/components/Organism/RouterConfig';
import * as actions from './actions';
import myReducer from './reducer';

const ALL_GROUP_ID = -100;

const propTypes = {
  refreshAll: PropTypes.func,
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
      'onHiddenPopOver',
      'onToggleMainPopOver',
      'renderPopOverContent',
      'renderBreadcrumb',
    ]);

    document.onkeydown = (e) => {
      if (e.keyCode === 116) {
        this.onRefresh(e);
      }
    };
  }

  componentWillMount() {
    const locationQuery = utils.getQuery(this.props.location.search);
    const purview = this.props.app.getIn(['login', 'purview']);
    const appId = locationQuery && locationQuery.appId;

    // 如果权限为空自动跳转到 登录Screen
    if (purview === 'none' && appId !== 'ad30a4a05ac6855c64074246948fbf9c') {
      this.props.history.push('/login');
    }
  }
  componentWillUnmount() {
    clearTimeout(this.onRefreshTimeout);
  }

  onRefresh(e) {
    e.preventDefault();
    this.props.refreshAll();
  }
  onLogout(e) {
    e.preventDefault();
    this.props.changeLoginStatus('0');
    this.onHiddenPopOver();
    this.props.history.push('/login');
  }

  onToggleMainPopOver(option) {
    this.props.toggleMainPopOver(option);
  }

  onHiddenPopOver() {
    this.onToggleMainPopOver({
      isShow: false,
    });
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

  showUserPopOver() {
    this.onToggleMainPopOver({
      name: 'userOverview',
      isShow: true,
      overlay: true,
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
              <a className="change-pas" href="#/main/system/admin" onClick={this.onHiddenPopOver}>
                <Icon
                  name="key"
                />
                {__('Change Password')}
              </a>
              <a className="sign-out" onClick={this.onLogout}>
                <Icon
                  name="sign-out"
                />
                {__('Login Out')}
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  renderBreadcrumb() {
    const { location, product, app } = this.props;
    const groupData = product.get('group');
    const curRoutes = app.getIn(['router', 'routes']).toJS();
    let breadcrumbList = fromJS([]);
    const len = curRoutes.length;
    let i = 2;

    // 如果是 AP组管理
    if (location.pathname.indexOf('/main/group') === 0) {
      breadcrumbList = breadcrumbList.unshift({
        path: '/main/group',
        text: __('All Group'),
      });

      if (groupData.getIn(['selected', 'id']) !== ALL_GROUP_ID) {
        breadcrumbList = breadcrumbList.unshift({
          path: '/main/group/',
          text: groupData.getIn(['selected', 'groupname']) || '',
        });
      }
    }

    for (i; i < len; i += 1) {
      breadcrumbList = breadcrumbList.unshift({
        path: curRoutes[i].path,
        text: curRoutes[i].text,
      });
    }

    return (
      <ol className="m-breadcrumb m-breadcrumb--simple">
        {
          breadcrumbList.map(item => (
            <li key={item.path}>
              <NavLink
                className="m-breadcrumb__link"
                to={item.path}
              >
                {item.text}
              </NavLink>
            </li>
          ))
        }
      </ol>
    );
  }

  render() {
    const { version } = this.props.app.toJS();
    const { popOver } = this.props.product.toJS();
    const { isShowPanel } = this.props.properties.toJS();
    let mainClassName = 't-main t-main--axc';
    let isMainLeftShow = false;
    let isMainRightShow = isShowPanel;

    isMainLeftShow = popOver.isShow && (popOver.name === 'vlanAsider' || popOver.name === 'groupAsider');
    isMainRightShow = isShowPanel;
    mainClassName = classNamesUtils(mainClassName, {
      'main--open-left': isMainLeftShow,
      'is-main-right-open': isMainRightShow,
    });
    return (
      <div className={mainClassName}>
        <Navbar version={version}>
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
        </Navbar>
        <div className="o-top-menu-bar">
          <ul
            className="m-menu m-menu--open"
          >
            {
              fromJS(this.props.route.routes).map(($$item) => {
                const keyVal = `${$$item.get('path')}`;
                return $$item.get('text') ? (<li key={keyVal}>
                  <NavLink
                    to={$$item.get('path')}
                    key={$$item.get('id')}
                    activeClassName="active"
                    data-title={$$item.get('text')}
                    onClick={() => {
                      this.onClickTopMenu($$item.get('path'));
                    }}
                  >
                    <Icon name={$$item.get('icon')} />
                    <div>{$$item.get('text')}</div>
                  </NavLink>
                </li>) : null;
              })
            }
          </ul>

          <ul
            className="m-menu m-menu--open o-top-menu-bar__footer"
          >
            <li>
              <a
                className=""
                title={__('Email to Axilspot')}
                href="mailto:sales@axilspot.com"
              >
                <Icon name="envelope" />
                <div>{__('Contact Us')}</div>
              </a>
            </li>
          </ul>
        </div>
        <div className="o-menu-bar">
          {
            this.renderBreadcrumb()
          }
        </div>
        <RouteSwitches
          routes={this.props.route.routes}
        />
        <PopOver
          onClose={this.onHiddenPopOver}
          {...popOver}
        >
          {
            this.renderPopOverContent(popOver)
          }
        </PopOver>
        <PropertyPanel
          isShow={isShowPanel}
          onToggle={this.props.togglePropertyContainer}
          data={this.props.properties}
          {...this.props}
        />
      </div>
    );
  }
}

Main.propTypes = propTypes;
Main.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    product: state.product,
    properties: state.properties,
    groupid: state.product.getIn(['group', 'selected', 'id']),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
    propertiesActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);

export const reducer = myReducer;
