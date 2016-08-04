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
import PopOver from 'shared/components/PopOver'
import Navbar from 'shared/components/Navbar';
import { FormGroup } from 'shared/components/Form';
import AsiderBar from './components/AsiderBar';
import { Link } from 'react-router';
import * as actions from './actions';
import * as appActions from 'shared/actions/app';
import reducer from './reducer';

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {isShowUserPop: false};

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.showUserPopOver = this.showUserPopOver.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onClickNav = this.onClickNav.bind(this);
    this.onSelectVlan = this.onSelectVlan.bind(this);
    this.renderPopOverContent = this.renderPopOverContent.bind(this);
    this.onHiddenPopOver = this.onHiddenPopOver.bind(this);
    this.onToggleMainPopOver = this.onToggleMainPopOver.bind(this);

    document.onkeydown = function(e) {
      if(e.keyCode == 116){
        this.onRefresh(e);
      }
    }.bind(this);

  };

  showUserPopOver() {
    this.onToggleMainPopOver({
      name: 'userOverview'
    });
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

  onToggleMainPopOver(option) {
    this.props.toggleMainPopOver(option);
  }

  onHiddenPopOver() {
    this.onToggleMainPopOver({
      isShow: false
    });
  }

  onClickNav(path) {
    if(path === '/main/network/vlan') {
      this.onToggleMainPopOver({
        name: 'vlanAsider'
      });
    }
  }

  onClickTopMenu(path) {
    if(path === '/main/group') {
      this.onToggleMainPopOver({
        name: 'groupAsider',
        isShow: true
      });
    } else {
      this.onToggleMainPopOver({
        isShow: false
      });
    }
  }

  onSelectVlan(id, e) {
    e.preventDefault();
    this.props.selectVlan(id);
  }

  onSelectGroup(id, e) {
    e.preventDefault();
    this.props.selectGroup(id);
  }

  renderPopOverContent(popOver) {
    const selectVlanId = this.props.mainAc.getIn(['vlan', 'selected']);
    const selectGroupId = this.props.mainAc.getIn(['group', 'selected']);

    switch (popOver.name) {
      case 'userOverview':
        return (
          <div className="m-user-overview">
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
        );
      case 'topMenu':
        return (
          <ul
            className="o-pop-over__content m-menu m-menu--open"
            style={{
              top: '93px',
              left: '20px',
              width: '140px',
              backgroundColor: '#222'
            }}
          >
            {
              fromJS(this.props.routes[0].childRoutes).map((item) => {
                const keyVal = `${item.get('path')}`;

                return item.get('text') ? (<li key={keyVal}>
                  <Link
                    to={item.get('path')}
                    className="m-menu__link"
                    activeClassName="active"
                    onClick={() => {
                      this.onClickTopMenu(item.get('path'))
                    }}
                  >
                    {item.get('text')}
                  </Link>
                </li>) : null;
              })
            }
          </ul>
        );
      case 'vlanAsider':
        return (
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
                    <li key={curId}>
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
                    size="2x"
                    onClick={() => {
                      this.props.showMainModal({
                        title: _('Manage VLAN'),
                        isShow: true,
                        name: 'vlan'
                      })
                    }}
                  />
                </div>
                <div className="m-action-bar__right">
                  <Icon
                    name="plus"
                    size="2x"
                    onClick={() => {
                      this.props.showMainModal({
                        title: _('Add VLAN'),
                        isShow: true,
                        name: 'vlan'
                      })
                    }}
                  />
                </div>
              </div>
            </footer>
          </asider>
        );

      case 'groupAsider':
        return (
          <asider className="t-main__asider-left">
            <h3 className="t-main__asider-header">{_('组列表')}</h3>
            <ul
              className="m-menu m-menu--open"
            >
              {
                this.props.mainAc.getIn(['group', 'list']).map((item) => {
                  var curId = item.get('id');
                  var remark = item.get('remark');
                  let classNames = 'm-menu__link';

                  if (curId === selectGroupId) {
                    classNames = `${classNames} active`;
                  }

                  return (
                    <li key={curId}>
                      <a
                        className={classNames}
                        onClick={(e) => this.onSelectGroup(curId, e)}
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
                    size="2x"
                    onClick={() => {
                      this.props.showMainModal({
                        title: _('Manage Ap Groups'),
                        isShow: true,
                        name: 'group'
                      })
                    }}
                  />
                </div>
                <div className="m-action-bar__right">
                  <Icon
                    name="plus"
                    size="2x"
                    onClick={() => {
                      this.props.showMainModal({
                        title: _('Add Ap Group'),
                        isShow: true,
                        name: 'group'
                      })
                    }}
                  />
                </div>
              </div>
            </footer>
          </asider>
        );

      default:
        return null;
    }
  }

  renderModalContent(option) {
    switch (option.name) {
      case 'vlan':
        return (
          <p>我是valn</p>
        );
      case 'group':
        return (
          <div>
            <FormGroup
              type="number"
              label={_('Group No')}
              disabled
            />
            <FormGroup
              type="text"
              label={_('Group Name')}
            />
            <FormGroup
              type="text"
              label={_('Remarks')}
            />
          </div>
        );

      default:
        return null;
    }
  }

  render() {
    const { saving, version, propertyData, guiName } = this.props.app.toJS();
    const { popOver, modal } = this.props.mainAc.toJS();
    let curTopNavText = _('NETWORK');
    let mainClassName = 't-main t-main--ac';

    if(this.props.location.pathname.indexOf('/main/group') === 0) {
      curTopNavText = _('AP GROUP');
    } else if (this.props.location.pathname.indexOf('/main/system') === 0) {
      curTopNavText = _('SYSTEM');
    }

    if(popOver.isShow && (popOver.name === 'vlanAsider' ||
        popOver.name === 'groupAsider')) {

      mainClassName = `${mainClassName} main--open-left`
    }

    return (
      <div>
        <Navbar title={_(guiName)} version={version}>
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
              onClick={() =>
                this.onToggleMainPopOver({
                  name: 'topMenu'
                })
              }
              className="o-menu-bar__nav"
            >
              <h3>
                <Icon
                  name="navicon"
                  onMouseOver={() =>
                    this.onToggleMainPopOver({
                      name: 'topMenu'
                    })
                  }
                />
                {curTopNavText}
              </h3>
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

        <PopOver onClose={this.onHiddenPopOver} {...popOver}>
          {
            this.renderPopOverContent(popOver)
          }
        </PopOver>

        <Modal onClose={this.onHiddenPopOver} {...modal}
          onClose={() => {
            this.props.showMainModal({
              isShow: false,
            })
          }}
        >
          {
            this.renderModalContent(modal)
          }
        </Modal>

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
