import React, { Component, PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import utils from 'shared/utils';
import {
  Nav, Icon, Modal, PopOver, Button, SaveButton, Navbar, FormGroup,
  Table, PropertyPanel,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as propertiesActions from 'shared/actions/properties';
import * as actions from './actions';
import myReducer from './reducer';

const propTypes = {
  fetchApGroup: PropTypes.func,
  fetchGroupAps: PropTypes.func,
  refreshAll: PropTypes.func,
  changeLoginStatus: PropTypes.func,
  toggleMainPopOver: PropTypes.func,
  selectVlan: PropTypes.func,
  selectGroup: PropTypes.func,
  selectAddApGroupDevice: PropTypes.func,
  showMainModal: PropTypes.func,
  togglePropertyPanel: PropTypes.func,
  route: PropTypes.object,
  location: PropTypes.object,
  routes: PropTypes.array,

  children: PropTypes.node,

  // immutable data
  app: PropTypes.instanceOf(Map),
  product: PropTypes.instanceOf(Map),
  properties: PropTypes.instanceOf(Map),
};

const defaultProps = {
  Component: 'button',
  role: 'default',
};

export default class Main extends Component {
  constructor(props) {
    super(props);

    this.state = { isShowUserPop: false };

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.showUserPopOver = this.showUserPopOver.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.onClickNav = this.onClickNav.bind(this);
    this.onSelectVlan = this.onSelectVlan.bind(this);
    this.renderPopOverContent = this.renderPopOverContent.bind(this);
    this.onHiddenPopOver = this.onHiddenPopOver.bind(this);
    this.onToggleMainPopOver = this.onToggleMainPopOver.bind(this);
    this.renderBreadcrumb = this.renderBreadcrumb.bind(this);
    this.onClickTopMenuTitle = this.onClickTopMenuTitle.bind(this);

    document.onkeydown = (e) => {
      if (e.keyCode === 116) {
        this.onRefresh(e);
      }
    };
  }

  componentWillMount() {
    this.props.fetchApGroup();
  }

  onRefresh(e) {
    e.preventDefault();
    this.props.refreshAll();
  }

  onLogout(e) {
    e.preventDefault();
    this.props.changeLoginStatus('0');
    window.location.hash = '#';
  }

  onToggleMainPopOver(option) {
    this.props.toggleMainPopOver(option);
  }

  onHiddenPopOver() {
    this.onToggleMainPopOver({
      isShow: false,
    });
  }

  onClickNav(path) {
    if (path === '/main/network/vlan') {
      // this.onToggleMainPopOver({
      //   name: 'vlanAsider',
      // });
    }
  }

  onClickTopMenu(path) {
    if (path === '/main/group') {
      // this.onToggleMainPopOver({
      //   name: 'groupAsider',
      //   isShow: true,
      // });
    } else {
      this.onToggleMainPopOver({
        isShow: false,
      });
    }
  }

  onClickTopMenuTitle() {
    if (this.props.location.pathname.indexOf('/main/group/') !== -1) {
      this.onToggleMainPopOver({
        name: 'groupAsider',
      });
    } else {
      this.onToggleMainPopOver({
        name: 'topMenu',
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
    this.props.fetchGroupAps();
  }

  showUserPopOver() {
    this.onToggleMainPopOver({
      name: 'userOverview',
    });
  }

  renderPopOverContent(popOver) {
    const selectVlanId = this.props.product.getIn(['vlan', 'selected', 'id']);
    const selectGroupId = this.props.product.getIn(['group', 'selected', 'id']);

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
              <a className="sign-out" href="#/" onClick={this.onLogout}>
                <Icon
                  name="sign-out"
                />
                {_('SIGN OUT')}
              </a>
            </div>
          </div>
        );
      case 'vlanAsider':
        return (
          <asider className="t-main__asider-left">
            <h3 className="t-main__asider-header">{_('VLAN列表')}</h3>
            <ul
              className="m-menu m-menu--open"
            >
              {
                this.props.product.getIn(['vlan', 'list']).map((item) => {
                  const curId = item.get('id');
                  const remark = item.get('remark');
                  let classNames = 'm-menu__link';

                  if (curId === selectVlanId) {
                    classNames = `${classNames} active`;
                  }

                  return (
                    <li key={curId}>
                      <a
                        className={classNames}
                        onClick={e => this.onSelectVlan(curId, e)}
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
                        size: 'lg',
                        cancelButton: false,
                        okButton: false,
                        name: 'vlanManage',
                      });
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
                        name: 'vlan',
                      });
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
            <h3 className="t-main__asider-header">{_('Group List')}</h3>
            <ul
              className="m-menu m-menu--open"
            >
              {
                this.props.product.getIn(['group', 'list']).map((item) => {
                  const curId = item.get('id');
                  let classNames = 'm-menu__link';

                  if (curId === selectGroupId) {
                    classNames = `${classNames} active`;
                  }

                  return (
                    <li key={curId}>
                      <a
                        className={classNames}
                        onClick={(e) => {
                          this.onSelectGroup(curId, e);
                          this.onToggleMainPopOver({
                            name: 'groupAsider',
                          });
                        }}
                      >
                        {item.get('groupname')} ({item.get('num')})
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
                        size: 'lg',
                        name: 'groupManage',
                      });
                    }}
                  />
                </div>
                <div className="m-action-bar__right">
                  <Icon
                    name="plus"
                    size="2x"
                    onClick={() => {
                      this.props.fetchGroupAps();
                      this.props.showMainModal({
                        title: _('Add Ap Group'),
                        isShow: true,
                        name: 'group',
                      });
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
    const selectVlanId = this.props.product.getIn(['vlan', 'selected', 'id']);
    const selectGroupId = this.props.product.getIn(['group', 'selected', 'id']);
    const tableOption = fromJS([
      {
        id: 'devicename',
        text: `${_('MAC Address')}/${_('Name')}`,
        transform(val, item) {
          return item.get('devicename') || item.get('mac');
        },
      }, {
        id: 'ip',
        text: _('IP Address'),
      }, {
        id: 'status',
        text: _('Status'),
        filter: 'translate',
      },
    ]);

    switch (option.name) {
      case 'vlan':
        return (
          <p>我是valn</p>
        );
      case 'group':
        return (
          <div>
            <FormGroup
              type="text"
              label={_('Group Name')}
              required
            />
            <FormGroup
              type="text"
              label={_('Remarks')}
              required
            />
            <Table
              className="table"
              options={tableOption}
              selectable
              list={this.props.product.get('devices')}
              onSelectRow={(data) => {
                this.props.selectAddApGroupDevice(data);
              }}
            />
          </div>
        );

      case 'groupManage':
        return (
          <div className="row">
            <div className="o-list cols col-6">
              <h3 className="o-list__header">{_('组列表')}</h3>
              <ul className="m-menu m-menu--open">
                {
                  this.props.product.getIn(['group', 'list']).map((item) => {
                    const curId = item.get('id');
                    let classNames = 'm-menu__link';

                    if (curId === selectGroupId) {
                      classNames = `${classNames} active`;
                    }

                    return (
                      <li key={curId}>
                        <a
                          className={classNames}
                          onClick={e => this.onSelectGroup(curId, e)}
                        >
                          {item.get('groupname')} ({item.get('num')})
                        </a>
                      </li>
                    );
                  })
                }
              </ul>
              <div className="o-list__footer action-btns">
                <Button
                  icon="plus"
                  text={_('添加组')}
                  onClick={() => {
                    this.props.fetchGroupAps();
                    this.props.showMainModal({
                      title: _('Add Ap Group'),
                      isShow: true,
                      name: 'group',
                    });
                  }}
                />
                <Button
                  icon="trash"
                  text={_('删除组')}
                />
              </div>
            </div>
            <div className="o-list cols col-6">
              <h3 className="o-list__header">{_('组内AP')}</h3>
              <Table
                className="table"
                options={tableOption}
                selectable
                list={this.props.product.get('devices')}
                onSelectRow={(data) => {
                  this.props.selectAddApGroupDevice(data);
                }}
              />
              <div className="o-list__footer">
                <Button
                  icon="move"
                  text={_('移动到其他组')}
                />
              </div>
            </div>
          </div>
        );

      case 'vlanManage':
        return (
          <div className="row">
            <div className="cols col-6">
              <h3>{_('VLAN 列表')}</h3>
              <ul
                className="m-menu m-menu--open"
              >
              {
                this.props.product.getIn(['vlan', 'list']).map((item) => {
                  const curId = item.get('id');
                  const remark = item.get('remark');
                  let classNames = 'm-menu__link';

                  if (curId === selectVlanId) {
                    classNames = `${classNames} active`;
                  }

                  return (
                    <li key={curId}>
                      <a
                        className={classNames}
                        onClick={e => this.onSelectVlan(curId, e)}
                      >
                        {curId}({remark})
                      </a>
                    </li>
                  );
                })
              }
              </ul>
              <div className="action-btns">
                <Button
                  icon="plus"
                  text={_('添加VLAN')}
                />
                <Button
                  icon="trash"
                  text={_('删除VLAN')}
                />
              </div>
            </div>
            <div className="cols col-6">
              <h3>{_('VLAN 列表')}</h3>
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
              <div className="form-group form-group-save">
                <div className="form-control">
                  <SaveButton
                    type="button"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  }

  renderBreadcrumb() {
    const groupData = this.props.product.get('group');
    const vlanData = this.props.product.get('vlan');
    const curRoutes = this.props.routes;
    let breadcrumbList = fromJS([]);
    const len = curRoutes.length;
    let i = 2;

    // 如果是 AP组管理
    if (curRoutes[1].path === '/main/group') {
      breadcrumbList = breadcrumbList.unshift({
        path: '/main/group',
        text: _('All Group'),
      })
      .unshift({
        path: '/main/group',
        text: groupData.getIn(['selected', 'groupname']) || '',
      });
    }

    for (i; i < len; i++) {
      breadcrumbList = breadcrumbList.unshift({
        path: curRoutes[i].path,
        text: curRoutes[i].text,
      });

       // 如果是 VLAN
      if (curRoutes[2].path === '/main/network/vlan' && i === 2) {
        breadcrumbList = breadcrumbList.unshift({
          path: '/main/network/vlan',
          text: `${vlanData.getIn(['selected', 'id'])}(${vlanData.getIn(['selected', 'remark'])})`,
        });
      }
    }

    return (
      <ol className="m-breadcrumb">
        {
          breadcrumbList.map((item, index) => (
            <li key={index}>
              <Link
                className="m-breadcrumb__link"
                to={item.path}
                onClick={() => this.onClickNav(item.path)}
              >
                {item.text}
              </Link>
            </li>
          ))
        }
      </ol>
    );
  }

  render() {
    const { saving, version, guiName } = this.props.app.toJS();
    const { popOver, modal } = this.props.product.toJS();
    const { isShowPanel } = this.props.properties.toJS();
    let isGroupMenu = false;
    let curTopNavText = _('NETWORK');
    let mainClassName = 't-main t-main--axc';

    if (this.props.location.pathname.indexOf('/main/group') === 0) {
      curTopNavText = _('AP GROUP');
      isGroupMenu = true;
    } else if (this.props.location.pathname.indexOf('/main/system') === 0) {
      curTopNavText = _('SYSTEM');
    }

    if (popOver.isShow && (popOver.name === 'vlanAsider' ||
        popOver.name === 'groupAsider')) {
      mainClassName = `${mainClassName} main--open-left`;
    }

    return (
      <div className={mainClassName}>
        <Navbar title={_(guiName)} version={version}>
          <div className="aside">
            <button className="as-control" onClick={this.onRefresh} >
              <Icon name="refresh" className="icon" />
              <span>{_('REFRESH')}</span>
            </button>
            <div className="user" onClick={this.showUserPopOver}>
              <Icon name="user-secret" className="icon-user" />
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
              fromJS(this.props.routes[0].childRoutes).map((item) => {
                const keyVal = `${item.get('path')}`;

                return item.get('text') ? (<li key={keyVal}>
                  <Link
                    to={item.get('path')}
                    className=""
                    activeClassName="active"
                    data-title={item.get('text')}
                    onClick={() => {
                      this.onClickTopMenu(item.get('path'));
                    }}
                  >
                    <Icon name={item.get('icon')} />
                  </Link>
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
              >
                <Icon name="comment" />
              </a>
            </li>
          </ul>
        </div>
        <div className="o-menu-bar">
          <nav
            onClick={() =>
              this.onClickTopMenuTitle()
            }
            className="o-menu-bar__nav"
          >
            <h3>
              <span>{curTopNavText}</span>
              {
                isGroupMenu ? (
                  <Icon
                    name="navicon"
                  />
                ) : null
              }
            </h3>
          </nav>
          {
            this.renderBreadcrumb()
          }
        </div>
        <Nav
          className="t-main__nav"
          role="tree"
          menus={this.props.route.childRoutes}
          location={this.props.location}
          onChange={this.onClickNav}
          isTree
        />
        <div className="t-main__content">
          {
            this.props.children
          }
        </div>

        <PopOver onClose={this.onHiddenPopOver} {...popOver}>
          {
            this.renderPopOverContent(popOver)
          }
        </PopOver>

        <Modal
          {...modal}
          onClose={() => {
            this.props.showMainModal({
              isShow: false,
            });
          }}
        >
          {
            this.renderModalContent(modal)
          }
        </Modal>

        {
          saving ? <div className="body-backdrop" /> : null
        }
        <PropertyPanel
          isShow={isShowPanel}
          onToggle={this.props.togglePropertyPanel}
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
  mapDispatchToProps
)(Main);

export const reducer = myReducer;
