import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import utils from 'shared/utils';
import classNamesUtils from 'classnames';
import { getActionable } from 'shared/axc'
import { SaveButton, Icon, PopOver, Navbar } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import {
  actions as propertiesActions,
  Screen as PropertyPanel,
} from 'shared/containers/properties';
import { RouteSwitches } from 'shared/components/Organism/RouterConfig';
import * as actions from './actions';
import myReducer from './reducer';

const SAVE_BUTTON_TEXT = __('Save');
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
      'onHiddenPopOver',
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
  }

  componentWillMount() {
    const locationQuery = utils.getQuery(this.props.location.search);
    const purview = this.props.app.getIn(['login', 'purview']);
    const appId = locationQuery && locationQuery.appId;

    // // 判断是否恢复出厂状态，再决定跳转页面
    // this.props.fetch('goform/quicksetup').then((json) => {
    //   if (json.state && json.state.code === 2000) {
    //     if (json.data.restoreState === '0') {
    //       window.location.hash = '/quicksetup';
    //     }
    //   }
    // });

    // 如果权限为空自动跳转到 登录Screen
    if (purview === 'none' && appId !== 'ad30a4a05ac6855c64074246948fbf9c') {
      this.props.history.push('/login');
    }
    this.onRefreshProductInfo(this.props);
    this.actionable = getActionable(this.props);
  }
  componentWillUpdate(nextProps) {
    if (this.props.app.get('companyname') !== nextProps.app.get('companyname')) {
      this.onRefreshProductInfo(nextProps);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.onRefreshTimeout);
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

    document.title = `${this.companyTitle} Access Manager`;
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
    const { version, saving } = this.props.app.toJS();
    const { popOver, nav } = this.props.product.toJS();
    const { isShowPanel } = this.props.properties.toJS();
    const isMainNavShow = nav.show;
    let mainClassName = 't-main t-main--axc';
    let isMainLeftShow = false;
    let isMainRightShow = isShowPanel;

    isMainLeftShow = popOver.isShow && (popOver.name === 'vlanAsider' || popOver.name === 'groupAsider');
    isMainRightShow = isShowPanel;
    mainClassName = classNamesUtils(mainClassName, {
      'main--open-left': isMainLeftShow,
      'is-main-right-open': isMainRightShow,
      'is-main-nav-hidden': !isMainNavShow,
    });
    return (
      <div className={mainClassName}>
        <Navbar version={version}>
          <div className="aside">
            {
              this.actionable ? (
                <SaveButton
                  type="button"
                  icon="save"
                  loading={saving && this.state.isSaveConfig}
                  text={SAVE_BUTTON_TEXT}
                  savingText={SAVE_BUTTON_TEXT}
                  savedText={SAVE_BUTTON_TEXT}
                  onClick={this.onSaveConfiguration}
                />
              ) : null
            }

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
                title={__('Email to %s', this.companyTitle)}
                href={`mailto:${this.emailUrl}`}
              >
                <Icon name="envelope" />
                <div>{__('Contact Us')}</div>
              </a>
            </li>
          </ul>
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
