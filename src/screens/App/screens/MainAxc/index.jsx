import React, { Component, PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import utils from 'shared/utils';
import { Button, SaveButton } from 'shared/components/Button';
import validator from 'shared/utils/lib/validator';
import Nav from 'shared/components/Nav';
import Modal from 'shared/components/Modal';
import Icon from 'shared/components/Icon';
import PopOver from 'shared/components/PopOver';
import Navbar from 'shared/components/Navbar';
import { FormGroup } from 'shared/components/Form';
import Table from 'shared/components/Table';
import PropertyPanel from 'shared/components/Template/PropertyPanel';
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
  validateAll: PropTypes.func,
  selectGroup: PropTypes.func,
  selectManageGroup: PropTypes.func,
  selectAddApGroupDevice: PropTypes.func,
  showMainModal: PropTypes.func,
  togglePropertyPanel: PropTypes.func,
  updateAddApGroupDevice: PropTypes.func,
  route: PropTypes.object,
  location: PropTypes.object,
  routes: PropTypes.array,

  children: PropTypes.node,
  validateOption: PropTypes.object,

  // immutable data
  app: PropTypes.instanceOf(Map),
  product: PropTypes.instanceOf(Map),
  properties: PropTypes.instanceOf(Map),
};

const validOptions = fromJS({
  groupname: validator({
    rules: 'len:[1, 64]',
  }),
  groupRemark: validator({}),
});

const defaultProps = {
  Component: 'button',
  role: 'default',
};

export default class Main extends Component {
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
      'onClickTopMenuTitle',
      'onSaveAddGroup',
      'saveAddGroup',

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
    // 获取当前组AP
    this.props.fetchApGroup();

    // 获取未分组设备
    this.props.fetchGroupAps(-1);
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

  onClickNav(path) {}

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

  onSelectGroup(id, e) {
    e.preventDefault();
    this.props.selectGroup(id);
  }
  onSelectManageGroup(id, e) {
    e.preventDefault();
    this.props.selectManageGroup(id);
    this.props.fetchGroupAps(id);
  }

  onSelectGroupAp(data) {
    this.props.selectAddApGroupDevice(data);
  }

  onSaveAddGroup() {
    this.props.validateAll()
      .then((msg) => {
        if (msg.isEmpty()) {
          this.saveAddGroup();
        }
      });
  }
  saveAddGroup() {
    const $$addData = this.props.product.getIn(['group', 'addData']);
    const $$selectMacList = this.props.product
      .get('defaultDevices')
      .filter(item => item.get('__selected__'))
      .map(item1 => item1.get('mac'));
    const subData = $$addData.merge({
      aplist: $$selectMacList.toJS(),
    });

    this.props.save('/goform/group', subData)
      .then((json) => {
        const data = json && json.data;

        if (data && json.state.code === 2000) {
          this.props.fetchGroupAps(-1);
        }

        // this.props.showMainModal({
        //   isShow: false,
        // });
      });
  }
  showUserPopOver() {
    this.onToggleMainPopOver({
      name: 'userOverview',
    });
  }

  renderPopOverContent(popOver) {
    const selectGroupId = this.props.product.getIn(['group', 'selected', 'id']);
    const $$groupList = this.props.product.getIn(['group', 'list']);

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

      case 'groupAsider':
        return (
          <asider className="t-main__asider-left">
            <h3 className="t-main__asider-header">{_('Group List')}</h3>
            <ul
              className="m-menu m-menu--open"
            >
              {
                $$groupList.map((item) => {
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
                        {item.get('groupname')} ({item.get('apNum')})
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
                        size: 'lg',
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
    const selectGroupId = this.props.product.getIn(['group', 'manageSelected', 'id']);
    const isSaving = this.props.app.get('saving');
    const { product } = this.props;

     // validate const
    const {
      groupname, groupRemark,
    } = this.props.validateOption;

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

    //console.log(product.get(['group', 'devices']).toJS())

    switch (option.name) {
      case 'group':
        return (
          <div className="o-form o-form--block">
            <div className="row">
              <div className="o-list cols col-4">
                <FormGroup
                  type="text"
                  label={_('Group Name')}
                  name="groupname"
                  value={product.getIn(['group', 'addData', 'groupname'])}
                  onChange={data => this.props.updateAddApGroupDevice({
                    groupname: data.value,
                  })}
                  required
                  {...groupname}
                />
                <FormGroup
                  type="text"
                  label={_('Remarks')}
                  name="groupRemark"
                  value={product.getIn(['group', 'addData', 'groupRemark'])}
                  onChange={data => this.props.updateAddApGroupDevice({
                    groupRemark: data.value,
                  })}
                  required
                  {...groupRemark}
                />
                <div
                  className="form-group"
                >
                  <div className="form-control">
                    <SaveButton
                      type="button"
                      loading={isSaving}
                      onClick={this.onSaveAddGroup}
                    />
                  </div>
                </div>
              </div>
              <div className="o-list cols col-8">
                <h3>{_('Select Group Devices')}</h3>
                <Table
                  className="table"
                  options={tableOption}
                  list={product.getIn(['defaultDevices'])}
                  onRowSelect={data => this.onSelectGroupAp(data)}
                  selectable
                />
              </div>
            </div>
          </div>
        );

      case 'groupManage':
        return (
          <div className="row">
            <div className="o-list cols col-4">
              <h3 className="o-list__header">{_('Group List')}</h3>
              <ul className="m-menu m-menu--open">
                {
                  product.getIn(['group', 'list']).map((item) => {
                    const curId = item.get('id');
                    let classNames = 'm-menu__link';

                    if (curId === selectGroupId) {
                      classNames = `${classNames} active`;
                    }

                    return (
                      <li key={curId}>
                        <a
                          className={classNames}
                          onClick={e => this.onSelectManageGroup(curId, e)}
                        >
                          {item.get('groupname')} ({item.get('apNum')})
                        </a>
                      </li>
                    );
                  })
                }
              </ul>
              <div className="o-list__footer action-btns">
                <Button
                  icon="plus"
                  text={_('Add')}
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
                  icon="edit"
                  text={_('Edit')}
                />
                <Button
                  icon="trash"
                  text={_('Delete')}
                />
              </div>
            </div>
            <div className="o-list cols col-8">
              <h3 className="o-list__header">{_('Group AP')}</h3>
              <Table
                className="table"
                options={tableOption}
                selectable
                list={product.getIn(['group', 'devices'])}
                onRowSelect={(data) => {
                  this.props.selectAddApGroupDevice(data);
                }}
              />
              <div className="o-list__footer action-btns">
                <Button
                  icon="plus"
                  text={_('Add')}
                />
                <Button
                  icon="share"
                  text={_('Move to Other Group')}
                />
                <Button
                  icon="trash"
                  text={_('Delete Selected')}
                />
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
          noFooter
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
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Main);

export const reducer = myReducer;
