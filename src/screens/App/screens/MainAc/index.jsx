import React, { Component } from 'react';
import { fromJS } from 'immutable';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import Nav from 'shared/components/Nav';
import Icon from 'shared/components/Icon';
import Modal from 'shared/components/Modal';
import Navbar from 'shared/components/Navbar';
import AsiderBar from './components/AsiderBar';
import { Link } from 'react-router';
import * as actions from './actions';
import * as appActions from 'shared/actions/app';
import reducer from './reducer';

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {isShow: false};

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.showUserPopOver = this.showUserPopOver.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onToggleTopMenu = this.onToggleTopMenu.bind(this);
    this.onToggleAsiderLeft = this.onToggleAsiderLeft.bind(this);
    this.onClickNav = this.onClickNav.bind(this);
    this.onSelectVlan = this.onSelectVlan.bind(this);

    document.onkeydown = function(e) {
      if(e.keyCode == 116){
        this.onRefresh(e);
      }
    }.bind(this);

  };

  showUserPopOver() {
    this.setState({isShow: !this.state.isShow});
  };

  onRefresh(e) {
    e.preventDefault();
    this.props.refreshAll();
  };

  onLogout(e) {
    e.preventDefault();
    this.props.changeLoginStatus('0');
    window.location.hash = "#";
  }
  onToggleTopMenu() {
    this.props.onToggleTopMenu()
  }
  onToggleAsiderLeft() {
    this.props.onToggleAsiderLeft()
  }

  onClickNav(path) {
    if(path === '/main/network/vlan') {
      this.props.onToggleAsiderLeft();
    }
  }
  onSelectVlan(id, e) {
    e.preventDefault();
    this.props.onToggleAsiderLeft();
    this.props.onSelectVlan(id);
  }
  render() {
    const { saving, version, propertyData, guiName } = this.props.app.toJS();
    const { topMenu, asiderLeft } = this.props.mainAc.toJS();
    const { isShow } = this.state;
    const selectVlanId = this.props.mainAc.getIn(['vlan', 'selected']);
    let curTopNavText = _('NETWORK');
    let mainClassName = 't-main t-main--ac';

    if(this.props.location.pathname.indexOf('/main/group') === 0) {
      curTopNavText = _('AP GROUP');
    } else if (this.props.location.pathname.indexOf('/main/system') === 0) {
      curTopNavText = _('SYSTEM');
    }

    if(asiderLeft) {
      mainClassName = `${mainClassName} main--open-left`
    }
    return (
      <div>
        <Navbar
          title={_(guiName)}
          version={version}
        >
          <div className="aside">
            <a href="#" className="as-control" onClick={this.onRefresh}>
              <Icon name="refresh" className="icon" />
              {_('REFRESH')}
            </a>
            <div className="user" onClick={this.showUserPopOver}>
              <Icon name="user-secret" className="icon-user" />
              <Icon
                name="caret-down"
                className="icon-down"
              />
            </div>
          </div>
          <div className="o-menu-bar">
            <nav
              onClick={this.onToggleTopMenu}
              className="o-menu-bar__nav"
            >
              <h3>
                <Icon name="navicon" onMouseOver={this.onToggleTopMenu} />{curTopNavText}</h3>
            </nav>

            <ol className="m-breadcrumb">
              <li>
                <a className="m-breadcrumb__link" href="">一级菜单</a>
              </li>
              <li>
                <a className="m-breadcrumb__link" href="">二级菜单</a>
              </li>
              <li>
                <a className="m-breadcrumb__link" href="">三级菜单</a>
              </li>
            </ol>
          </div>
        </Navbar>

        <div className={mainClassName}>
          <Nav
            className="t-main__nav"
            role="nav"
            menus={this.props.route.childRoutes}
            location={this.props.location}
            onChange={this.onClickNav}
            isTree
          />
          <div className='t-main__content'>
            {
              this.props.children
            }
          </div>
        </div>
        {
          isShow ? (
            <div className="m-pop-over" onClick={this.showUserPopOver}>
              <div className="m-pop-over__content m-user-overview">
                <div className="m-user-overview__info">
                  <Icon name="user-secret" className="icon-user" />
                </div>
                <div className="m-user-overview__controls">
                  <a className="change-pas" href="#/main/settings/admin">
                    <Icon
                      name="key"
                    />
                    {_('CHANGE PASSWORD')}
                  </a>
                  <a className="sign-out" href="#" onClick={this.onLogout}>
                    <Icon
                      name="sign-out"
                    />
                    {_('SIGN OUT')}
                  </a>
                </div>
              </div>
              <div className="m-pop-over__overlay"></div>
            </div>
          ) : null
        }

        {
          topMenu ? (
            <div className="m-pop-over" onClick={this.onToggleTopMenu}>
              <div className="m-pop-over__overlay"
              ></div>
              <ul
                className="m-pop-over__content m-menu m-menu--open"
                style={{top: '93px', left: '20px', width: '140px', backgroundColor: '#222'}}
              >
                {
                  fromJS(this.props.routes[0].childRoutes).map((item) => {
                    const keyVal = `${item.get('path')}`;

                    return item.get('text') ? (<li key={keyVal}>
                      <Link
                        to={item.get('path')}
                        className="m-menu__link"
                        activeClassName="active"
                      >
                        {item.get('text')}
                      </Link>
                    </li>) : null;
                  })
                }
              </ul>
            </div>
          ) : null
        }
        {
          asiderLeft ? (
            <div className="m-pop-over">
              <div className="m-pop-over__overlay" onClick={this.props.onToggleAsiderLeft}></div>
              <asider className="t-main__asider-left">
                <h3 className="t-main__asider-header">{_('VLAN列表')}</h3>
                <ul
                  className="m-menu m-menu--open"
                >
                  {
                    this.props.mainAc.getIn(['vlan', 'list']).map((item) => {
                      var curId = item.get('id');
                      var remark = item.get('remark');
                      let classNames = 'm-menu__link';

                      if (curId === selectVlanId) {
                        classNames = `${classNames} active`;
                      }

                      return (
                        <li>
                          <a
                            className={classNames}
                            onClick={(e) => this.onSelectVlan(curId, e)}
                          >
                            {curId}({remark})
                          </a>
                        </li>
                      );
                    })
                  }
                </ul>
                <footer className="t-main__asider-footer">
                  <div className="m-action-bar">
                    <div className="m-action-bar__left">
                      <Icon
                        name="cog"
                      />
                      修改
                    </div>
                    <div className="m-action-bar__right">
                      <Icon
                        name="plus"
                      />
                      添加
                    </div>
                  </div>
                </footer>
              </asider>
            </div>
          ) : null
        }

        {
          saving ? <div className="body-backdrop"></div> : null
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    mainAc: state.mainAc,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);

export const mainAc = reducer;
