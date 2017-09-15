import React from 'react'; import PropTypes from 'prop-types';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Button, SaveButton } from 'shared/components/Button';
import validator from 'shared/validator';
import Nav from 'shared/components/Nav';
import Modal from 'shared/components/Modal';
import Icon from 'shared/components/Icon';
import { NavLink } from 'react-router-dom';
import { FormGroup, Tooltip } from 'shared/components';
import Table from 'shared/components/Table';
import { RouteSwitches } from 'shared/components/Organism/RouterConfig';
import { getActionable } from 'shared/axc';
import { actions as appActions } from 'shared/containers/app';
import { actions as propertiesActions } from 'shared/containers/properties';

import * as mainActions from '../../actions';

const ALL_GROUP_ID = -100;

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
  togglePropertyContainer: PropTypes.func,
  updateAddApGroup: PropTypes.func,
  updateEditApGroup: PropTypes.func,
  updateGroupMoveDevice: PropTypes.func,
  updateGroupAddDevice: PropTypes.func,
  resetGroupAddDevice: PropTypes.func,
  selectManageGroupAp: PropTypes.func,
  toggleMainNav: PropTypes.func,
  route: PropTypes.shape({
    routes: PropTypes.array,
    path: PropTypes.string,
  }),
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string.isRequired,
  }),
  createModal: PropTypes.func,
  save: PropTypes.func,
  fetchModelList: PropTypes.func,
  resetVaildateMsg: PropTypes.func,

  validateOption: PropTypes.object,

  // immutable data
  app: PropTypes.instanceOf(Map),
  product: PropTypes.instanceOf(Map),
};

const validOptions = fromJS({
  groupname: validator({
    rules: 'utf8Len:[1, 31]',
  }),
  remark: validator({
    rules: 'utf8Len:[1, 255]',
  }),
  apmac: validator({
    rules: 'mac',
  }),
  name: validator({
    rules: 'required',
  }),
  model: validator({
    rules: '',
  }),
});

const defaultProps = {
  Component: 'button',
  role: 'default',
};

export default class MainGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isInitGroupList: true,
      isShowUserPop: false,
    };
    utils.binds(this, [
      'renderBreadcrumb',
      'onSelectManageGroup',
      'showUserPopOver',
      'onRefresh',
      'onLogout',
      'onClickNav',
      'onHiddenPopOver',
      'onToggleMainPopOver',
      'onClickTopMenuTitle',
      'onSaveGroup',
      'onSaveMoveGroup',
      'onRemoveGroupAps',
      'saveGroup',
      'onRemoveGroup',
      'removeGroup',
      'fetchManageGroupAps',
      'isDuplicateAp',
      'autoRefreshData',
      'initFromLocationQuery',
    ]);

    document.onkeydown = (e) => {
      if (e.keyCode === 116) {
        this.onRefresh(e);
      }
    };
  }

  componentWillMount() {
    const rateInterval = this.props.app.get('rateInterval');
    const purview = this.props.app.getIn(['login', 'purview']);

    // 如果权限为空自动跳转到 登录Screen
    if (purview === 'none') {
      this.props.history.push('/login');
    }

    // 获取当前组AP
    this.props.fetchApGroup()
      .then(
        () => {
          this.initFromLocationQuery();
          this.setState({
            isInitGroupList: false,
          });
        },
      );

    // 获取未分组设备
    this.props.fetchGroupAps(-1);

    this.autoRefreshTimer = setTimeout(() => {
      this.autoRefreshData();
    }, rateInterval);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.route.path !== this.props.route.path) {
      this.autoRefreshData();
    }
  }

  componentWillUnmount() {
    this.props.togglePropertyContainer(false);
    clearTimeout(this.autoRefreshTimer);
  }

  onRefresh(e) {
    e.preventDefault();
    this.props.refreshAll();
  }
  onLogout(e) {
    e.preventDefault();
    this.props.changeLoginStatus('0');
    this.onHiddenPopOver();
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
    if (path === '/main/group') {
      this.props.selectGroup(-100);
    }
  }

  onClickTopMenuTitle() {
    if (this.props.location.pathname.indexOf('/main/group/') !== -1) {
      this.onToggleMainPopOver({
        name: 'groupAsider',
        overlay: false,
      });
    } else {
      this.onToggleMainPopOver({
        name: 'topMenu',
      });
    }
  }

  onSelectGroup(id, e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    this.props.selectGroup(id);
  }
  onSelectManageGroup(id) {
    this.props.selectManageGroup(id);
    this.props.fetchGroupAps(id);
  }

  /**
   * 添加组时选择AutoAp
   *
   * @param {object} data
   *
   * @memberOf MainGroup
   */
  onSelectGroupAp(data) {
    this.props.selectAddApGroupDevice(data);
  }
  onSaveGroup() {
    this.props.validateAll()
      .then((msg) => {
        if (msg.isEmpty()) {
          this.saveGroup();
        }
      });
  }
  onSaveMoveGroup() {
    const { product } = this.props;
    const $$moveData = this.props.product.getIn(['group', 'apMoveData']);
    const $$editData = product.getIn(['group', 'manageSelected']);
    const groupId = $$editData.get('id');
    const $$selectMacList = this.props.product
      .getIn(['group', 'devices'])
      .filter(item => item.get('__selected__'))
      .map(item1 => item1.get('mac')) || fromJS([]);
    const subData = {
      action: 'move',
      groupid: groupId,
      targetid: $$moveData.get('targetGroupId'),
      aplist: $$selectMacList.toJS(),
    };
    if ($$moveData.get('targetGroupId') > 0) {
      this.props.save('/goform/group', subData)
        .then((json) => {
          const state = json && json.state;

          if (state && state.code === 2000) {
            this.props.fetchGroupAps(groupId);
          }
          this.props.fetchApGroup();
          this.props.showMainModal({
            isShow: false,
          });
        });
    } else {
      this.props.createModal({
        role: 'alert',
        customBackdrop: true,
        text: __('Please select target group'),
      });
    }
  }
  onRemoveGroup() {
    const manageSelected = this.props.product.getIn(['group', 'manageSelected']);
    const msgText = __('Are you sure to delete group: %s?', manageSelected.get('groupname'));

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msgText,
      apply: () => {
        this.removeGroup(manageSelected.get('id'), 'upgrade');
      },
    });
  }
  onRemoveGroupAps() {
    const $$selectMacList = this.props.product
      .getIn(['group', 'devices'])
      .filter(item => item.get('__selected__'))
      .map(item1 => item1.get('mac')) || fromJS([]);
    const selectedStr = $$selectMacList.join(', ');
    const groupid = this.props.product
      .getIn(['group', 'manageSelected', 'id']);
    const msgText = __('Are you sure to delete selected aps: %s?', selectedStr);

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msgText,
      apply: () => {
        this.props.save('/goform/group', {
          action: 'deleteGroupAps',
          aplist: $$selectMacList.toJS(),
          groupid,
        }).then(() => {
          this.props.fetchGroupAps(-1);
          this.props.fetchGroupAps(groupid);
          this.props.fetchApGroup();
        });
      },
    });
  }

  /**
   * 自动刷新数据，有一些数据是需要定时更新的
   * 不同模块需自动刷新的数据不一样
   *
   * @memberOf MainGroup
   */
  autoRefreshData() {
    const rateInterval = this.props.app.get('rateInterval');

    clearTimeout(this.autoRefreshTimer);

    if (!this.pauseRfresh) {
      // 更新AP组相关信息
      this.props.fetchApGroup();

      // 获取未分组设备
      this.props.fetchGroupAps(-1);
    }

    this.autoRefreshTimer = setTimeout(
      () => this.autoRefreshData(),
      rateInterval,
    );
  }
  initFromLocationQuery() {
    const locationQuery = utils.getQuery(this.props.location.search);

    // console.log('locat = ', locationQuery)
    // 如果
    if (typeof locationQuery.groupid !== 'undefined') {
      this.onSelectGroup(locationQuery.groupid);
    }
  }
  // initRouteDom() {
  //   const selectGroupId = this.props.product.getIn(['group', 'selected', 'id']);
  //   let mainLeftMenus = this.props.route.routes;

  //   // 如果当前是所有组，则隐藏组配置相关菜单
  //   if (selectGroupId === ALL_GROUP_ID) {
  //     mainLeftMenus = mainLeftMenus.slice(0, 3);
  //   }

  //   this.NavList = (

  //   );
  // }

  /**
   * 获取正在管理的AP组内AP列表
   * @memberOf MainGroup
   */
  fetchManageGroupAps() {
    const groupid = this.props.product
      .getIn(['group', 'manageSelected', 'id']);

    this.props.fetchGroupAps(groupid);
  }
  removeGroup(id) {
    this.props.save('/goform/group', {
      action: 'deleteGroup',
      groupid: id,
    }).then(() => {
      this.props.fetchApGroup();
      this.fetchManageGroupAps();
      this.props.fetchGroupAps(-1);
    });
  }

  /**
   * 验证是否有同名或同mac的AP
   *
   * @param {any} $$subData
   * @returns
   *
   * @memberOf MainGroup
   */
  isDuplicateAp($$subData) {
    const { product } = this.props;
    const $$curGroupDevices = product.getIn(['group', 'devices']);
    let ret;

    if ($$subData.get('type') === 'custom') {
      if ($$curGroupDevices.find(
        $$item => $$item.get('mac') === $$subData.get('apmac'),
      )) {
        ret = __('AP with the same MAC already exists');
      }

      if ($$curGroupDevices.find(
        $$item => $$item.get('devicename') === $$subData.get('name'),
      )) {
        ret = __('AP with the same name already exists');
      }
    }

    return ret;
  }
  saveGroup() {
    const { product } = this.props;
    const $$addData = this.props.product.getIn(['group', 'addData']);
    const $$editData = product.getIn(['group', 'manageSelected']);
    const validMac = product.getIn(['group', 'apAddData', 'apmac']).replace(/-/g, ':');
    const $$apAddData = product.getIn(['group', 'apAddData']).set('apmac', validMac);
    const curModalName = product.getIn(['modal', 'name']);
    const $$selectMacList = this.props.product
      .get('defaultDevices')
      .filter(item => item.get('__selected__'))
      .map(item1 => item1.get('mac'));
    let subData;

    if (curModalName === 'groupAdd') {
      subData = $$addData.merge({
        action: 'add',
        aplist: $$selectMacList.toJS(),
      });
    } else if (curModalName === 'groupEdit') {
      subData = $$editData.merge({
        action: 'edit',
      });
    } else if (curModalName === 'groupApAdd') {
      subData = $$apAddData.merge({
        action: 'groupApAdd',
        groupid: $$editData.get('id'),
        aplist: $$selectMacList.toJS(),
      });
    }
    this.props.save('/goform/group', subData)
      .then((json) => {
        const state = json && json.state;

        if (state) {
          if (state.code === 2000) {
            this.props.fetchGroupAps($$editData.get('id'));
            this.props.fetchGroupAps(-1);
            this.props.showMainModal({
              isShow: false,
            });
            if (curModalName === 'groupApAdd') {
              this.props.resetGroupAddDevice();
            }

            this.props.fetchApGroup();
          }
        }
      });
  }
  // 二级菜单组列表导航
  renderAsideTop() {
    const { product } = this.props;
    const selectGroupId = product.getIn(['group', 'selected', 'id']);
    const manageGroupId = product.getIn(['group', 'manageSelected', 'id']);
    const $$groupList = product.getIn(['group', 'list']);
    const curRoutePath = this.props.route.path;
    const actionable = getActionable(this.props);
    let isGroupMenu = false;

    if (curRoutePath === '/main/group') {
      isGroupMenu = true;
    }

    if (!isGroupMenu) {
      return null;
    }

    return (
      <aside className="t-main__asider-top">
        <header>
          <h3>{__('Group List')}</h3>
          <div className="toggle-bar" onClick={this.onClickTopMenuTitle} >
            <Icon
              name="caret-down"
              title={__('Toggle Group List')}
            />
          </div>
        </header>
        <ul
          className="m-menu m-menu--open"
        >
          {
            $$groupList.map((item) => {
              const curId = item.get('id');
              let classNames = 'm-menu__link';
              let linkText = item.get('groupname');

              if (curId === ALL_GROUP_ID) {
                linkText = __(linkText);
              }

              if (curId === selectGroupId) {
                classNames = `${classNames} active`;
              }

              linkText = `${linkText} (${item.get('apNum')})`;
              return (
                <li key={curId}>
                  <a
                    className={classNames}
                    onClick={(e) => {
                      this.onSelectGroup(curId, e);
                      this.onToggleMainPopOver({
                        name: 'groupAsider',
                        overlay: false,
                      });
                      if (curId === ALL_GROUP_ID) {
                        this.props.history.push('/main/group');
                      }
                    }}
                  >
                    {linkText}
                  </a>
                </li>
              );
            })
          }
        </ul>
        <footer className="t-main__asider-footer">
          <div className="m-action-bar">
            {
              actionable ? (
                <div>
                  <Tooltip
                    placement="top"
                    theme="light"
                    title={__('Manage AP Groups')}
                  >
                    <Icon
                      name="cog"
                      size="2x"
                      onClick={(e) => {
                        this.props.fetchGroupAps(manageGroupId);
                        this.props.showMainModal({
                          title: __('Manage AP Groups'),
                          isShow: true,
                          size: 'lg',
                          name: 'groupManage',
                        });
                      }}
                    />
                  </Tooltip>
                </div>
              ) : null
            }
          </div>
        </footer>
      </aside>
    );
  }
  renderModalContent(option) {
    const selectGroupId = this.props.product.getIn(['group', 'manageSelected', 'id']);
    const moveTargetGroupId = this.props.product.getIn(['group', 'apMoveData', 'targetGroupId']);
    const isSaving = this.props.app.get('saving');
    const { product } = this.props;
    const groupApAddData = product.getIn(['group', 'apAddData']);
    const modelListOptions = product.getIn(['model', 'options']);
    let noMannageAp = false;

     // validate const
    const {
      groupname, remark, apmac, name, model,
    } = this.props.validateOption;

    const tableOption = fromJS([
      {
        id: 'devicename',
        text: __('Name'),
        render(val, $$data) {
          return val || $$data.get('mac');
        },
      },
      {
        id: 'model',
        text: __('Model'),
      },
      {
        id: 'mac',
        text: __('MAC Address'),
      },
      {
        id: 'ip',
        text: __('IP Address'),
      },
      {
        id: 'status',
        text: __('Status'),
        filter: 'translate',
      },
    ]);
    let $$mannageGroupAps = product.getIn(['group', 'devices']);

    switch (option.name) {
      case 'groupApAdd':
        return (
          <div className="o-form">
            <FormGroup
              type="switch"
              label={__('Type')}
              value={groupApAddData.get('type')}
              options={[
                {
                  value: 'auto',
                  label: __('Auto AP'),
                }, {
                  value: 'custom',
                  label: __('Custom'),
                },
              ]}
              onChange={data => this.props.updateGroupAddDevice({
                type: data.value,
              })}
            />
            {
              groupApAddData.get('type') === 'auto' ? (
                <div className="o-form__fileset">
                  <legend className="o-form__legend">
                    { __('Auto AP List') }
                  </legend>
                  <Table
                    className="table"
                    options={tableOption}
                    list={product.getIn(['defaultDevices'])}
                    onRowSelect={data => this.onSelectGroupAp(data)}
                    selectable
                  />
                </div>
              ) : (
                <div className="o-form__fileset">
                  <legend className="o-form__legend">
                    { __('Custom AP') }
                  </legend>
                  <FormGroup
                    type="text"
                    name="name"
                    label={__('Name')}
                    maxLength="31"
                    value={groupApAddData.get('name')}
                    onChange={data => this.props.updateGroupAddDevice({
                      name: data.value,
                    })}
                    required
                    {...name}
                  />
                  <FormGroup
                    type="select"
                    name="model"
                    options={modelListOptions}
                    label={__('Model')}
                    value={groupApAddData.get('model')}
                    onChange={data => this.props.updateGroupAddDevice({
                      model: data.value,
                    })}
                    required
                    {...model}
                  />
                  <FormGroup
                    type="text"
                    label={__('MAC')}
                    name="apmac"
                    maxLength="18"
                    value={groupApAddData.get('apmac')}
                    onChange={data => this.props.updateGroupAddDevice({
                      apmac: data.value,
                    })}
                    required
                    {...apmac}
                  />
                </div>
              )
            }

            <div
              className="form-group"
              style={{
                marginTop: '12px',
              }}
            >
              <div className="form-control">
                <SaveButton
                  type="button"
                  loading={isSaving}
                  text={__('Apply')}
                  savingText={__('Applying')}
                  savedText={__('Applied')}
                  onClick={this.onSaveGroup}
                />
              </div>
            </div>

          </div>
        );
      case 'groupMoveAp':
        return (
          <div className="row">
            <div className="o-list cols col-8">
              <h3 className="o-list__header">{__('Please Select AP')}</h3>
              <Table
                className="table"
                options={tableOption}
                list={product.getIn(['group', 'devices'])}
                onRowSelect={(data) => {
                  this.props.selectManageGroupAp(data);
                }}
                page={product.getIn(['group', 'devicesPage'])}
                onPageChange={(data) => {
                  this.props.fetchGroupAps(selectGroupId, {
                    page: data,
                  });
                }}
                selectable
              />
            </div>
            <div className="o-list cols col-4">
              <h3 className="o-list__header">{__('Target Group List')}</h3>
              <ul className="m-menu m-menu--open">
                {
                  product.getIn(['group', 'list']).map((item) => {
                    const curId = item.get('id');
                    let classNames = 'm-menu__link';

                    // 目标组，不包含本组
                    if (curId === selectGroupId || curId === -100) {
                      return null;
                    }
                    if (curId === moveTargetGroupId) {
                      classNames = `${classNames} active`;
                    }

                    return (
                      <li key={curId}>
                        <a
                          className={classNames}
                          onClick={(e) => {
                            e.preventDefault();
                            this.props.updateGroupMoveDevice({
                              targetGroupId: curId,
                            });
                          }}
                        >
                          {`${item.get('groupname')} (${item.get('apNum')})`}
                        </a>
                      </li>
                    );
                  })
                }
              </ul>
              <div className="o-list__footer">
                <SaveButton
                  type="button"
                  loading={isSaving}
                  text={__('Apply')}
                  savingText={__('Applying')}
                  savedText={__('Applied')}
                  onClick={this.onSaveMoveGroup}
                />
              </div>
            </div>
          </div>
        );
      case 'groupAdd':
        return (
          <div className="o-form o-form--block">
            <div className="row">
              <div className="o-list cols col-4">
                <FormGroup
                  type="text"
                  label={__('Group Name')}
                  name="groupname"
                  maxLength="31"
                  value={product.getIn(['group', 'addData', 'groupname'])}
                  onChange={data => this.props.updateAddApGroup({
                    groupname: data.value,
                  })}
                  required
                  {...groupname}
                />
                <FormGroup
                  type="textarea"
                  label={__('Remarks')}
                  name="remark"
                  maxLength="256"
                  value={product.getIn(['group', 'addData', 'remark'])}
                  onChange={data => this.props.updateAddApGroup({
                    remark: data.value,
                  })}
                  {...remark}
                />
                <div
                  className="form-group"
                >
                  <div className="form-control">
                    <SaveButton
                      type="button"
                      loading={isSaving}
                      text={__('Apply')}
                      savingText={__('Applying')}
                      savedText={__('Applied')}
                      onClick={this.onSaveGroup}
                    />
                  </div>
                </div>
              </div>
              <div className="o-list cols col-8">
                <h3>{__('Select AP to group')}</h3>
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

      case 'groupEdit':
        return (
          <div className="o-form o-form--block">
            <FormGroup
              type="text"
              label={__('Group Name')}
              name="groupname"
              maxLength="31"
              value={product.getIn(['group', 'manageSelected', 'groupname'])}
              onChange={data => this.props.updateEditApGroup({
                groupname: data.value,
              })}
              required
              {...groupname}
            />
            <FormGroup
              type="textarea"
              label={__('Remarks')}
              name="remark"
              value={product.getIn(['group', 'manageSelected', 'remark'])}
              onChange={data => this.props.updateEditApGroup({
                remark: data.value,
              })}
              maxLength="256"
              {...remark}
            />
            <div
              className="form-group"
            >
              <div className="form-control">
                <SaveButton
                  type="button"
                  loading={isSaving}
                  text={__('Apply')}
                  savingText={__('Applying')}
                  savedText={__('Applied')}
                  onClick={this.onSaveGroup}
                />
              </div>
            </div>
          </div>
        );

      case 'groupManage':

        // 当没有选择组或为所有组时显示空列表
        if (!selectGroupId || selectGroupId === -100) {
          $$mannageGroupAps = fromJS([]);
          noMannageAp = true;
        }

        return (
          <div className="row">
            <div className="o-list cols col-4">
              <h3 className="o-list__header">{__('Group List')}</h3>
              <ul className="m-menu m-menu--open">
                {
                  product.getIn(['group', 'list']).map((item) => {
                    const curId = item.get('id');
                    let classNames = 'm-menu__link';

                    if (curId === selectGroupId) {
                      classNames = `${classNames} active`;
                    }

                    // 不能管理 All Group
                    if (curId === ALL_GROUP_ID) {
                      return null;
                    }
                    return (
                      <li key={curId}>
                        <a
                          className={classNames}
                          onClick={e => this.onSelectManageGroup(curId, e)}
                        >
                          {`${item.get('groupname')} (${item.get('apNum')})`}
                        </a>
                      </li>
                    );
                  })
                }
              </ul>
              <div className="o-list__footer action-btns">
                <Button
                  icon="plus"
                  text={__('Add')}
                  onClick={() => {
                    this.props.fetchGroupAps();
                    this.props.updateAddApGroup({
                      groupname: '',
                      remark: '',
                    });
                    this.props.showMainModal({
                      title: __('Add AP Group'),
                      size: 'lg',
                      isShow: true,
                      name: 'groupAdd',
                    });
                  }}
                />
                <Button
                  icon="edit"
                  text={__('Edit')}
                  onClick={() => {
                    this.props.showMainModal({
                      title: __('Edit AP Group'),
                      size: 'md',
                      isShow: true,
                      name: 'groupEdit',
                    });
                  }}
                />
                <Button
                  icon="trash"
                  text={__('Delete')}
                  onClick={(e) => {
                    this.onRemoveGroup(e);
                  }}
                />
              </div>
            </div>
            <div className="o-list cols col-8">
              <h3 className="o-list__header">{__('Group AP')}</h3>
              <Table
                className="table"
                options={tableOption}
                selectable
                list={$$mannageGroupAps}
                onRowSelect={(data) => {
                  this.props.selectManageGroupAp(data);
                }}
                page={product.getIn(['group', 'devicesPage'])}
                onPageChange={(data) => {
                  this.props.fetchGroupAps(selectGroupId, {
                    page: data,
                  });
                }}
              />
              {
                noMannageAp ? null : (
                  <div className="o-list__footer action-btns">
                    <Button
                      icon="plus"
                      text={__('Add AP')}
                      onClick={() => {
                        this.props.fetchModelList();
                        this.props.resetGroupAddDevice();
                        this.props.fetchGroupAps(-1);
                        this.props.showMainModal({
                          title: __('Add AP to Group'),
                          size: 'md',
                          isShow: true,
                          name: 'groupApAdd',
                        });
                      }}
                    />
                    <Button
                      icon="share"
                      text={__('Move to Other Group')}
                      onClick={() => {
                        this.props.updateGroupMoveDevice({
                          targetGroupId: -1,
                        });
                        this.props.showMainModal({
                          title: __('Move AP to Other Group'),
                          size: 'lg',
                          isShow: true,
                          name: 'groupMoveAp',
                        });
                      }}
                    />
                    <Button
                      icon="trash"
                      text={__('Delete Selected')}
                      onClick={() => {
                        this.onRemoveGroupAps();
                      }}
                    />
                  </div>
                )
              }
            </div>
          </div>
        );


      default:
        return null;
    }
  }
  renderBreadcrumb() {
    const { product, app } = this.props;
    const groupData = product.get('group');
    const selectGroupId = product.getIn(['group', 'selected', 'id']);
    const manageGroupId = product.getIn(['group', 'manageSelected', 'id']);
    const $$groupList = product.getIn(['group', 'list']);
    const curRoutes = app.getIn(['router', 'routes']).toJS();
    const selectOptions = $$groupList.map(
      $$item => (
        {
          value: $$item.get('id'),
          label: $$item.get('groupname'),
        }
      ),
    ).toJS();
    let breadcrumbList = fromJS([]);
    const len = curRoutes.length;
    let i = 2;

    // 所有组
    breadcrumbList = breadcrumbList.unshift({
      id: 'allGroup',
      path: '/main/group',
      text: __('All Group'),
    });

    // 显示当前组
    if (groupData.getIn(['selected', 'id']) !== ALL_GROUP_ID) {
      breadcrumbList = breadcrumbList.unshift({
        id: 'curGroup',
        path: '/main/group/',
        text: groupData.getIn(['selected', 'groupname']) || '',
      });
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
          breadcrumbList.map((item) => {
            let renderNode = (
              <NavLink
                className="m-breadcrumb__link"
                to={item.path}
              >
                {item.text}
              </NavLink>
            );

            /*
            if (item.id === 'curGroup') {
              renderNode = (
                <a className="m-breadcrumb__link">
                  <FormInput
                    type="select"
                    value={selectGroupId}
                    options={selectOptions}
                    onChange={(data) => {
                      this.onSelectGroup(data.value);
                    }}
                  />
                </a>
              );
            } else
            */
            if (item.id === 'allGroup') {
              renderNode = (
                <a className="m-breadcrumb__link" >
                  {__('All Group')}
                  {/* <Button
                    style={{
                      marginLeft: '4px',
                    }}
                    theme="primary"
                    icon="plus"
                    size="sm"
                    onClick={() => {
                      this.props.fetchGroupAps();
                      this.props.updateAddApGroup({
                        groupname: '',
                        remark: '',
                      });
                      this.props.showMainModal({
                        title: __('Add AP Group'),
                        isShow: true,
                        size: 'lg',
                        name: 'groupAdd',
                      });
                    }}
                  />
                  <Button
                    style={{
                      marginLeft: '4px',
                    }}
                    theme="primary"
                    icon="cog"
                    size="sm"
                    onClick={() => {
                      this.props.fetchGroupAps(manageGroupId);
                      this.props.showMainModal({
                        title: __('Manage AP Groups'),
                        isShow: true,
                        size: 'lg',
                        name: 'groupManage',
                      });
                    }}
                  />*/}
                </a>

              );
            }

            return (
              <li key={item.path}>{renderNode}</li>
            );
          })
        }
      </ol>
    );
  }
  render() {
    const selectGroupId = this.props.product.getIn(['group', 'selected', 'id']);
    const { modal } = this.props.product.toJS();
    let mainLeftMenus = this.props.route.routes;

    // 如果当前是所有组，则隐藏组配置相关菜单
    if (selectGroupId === ALL_GROUP_ID) {
      mainLeftMenus = mainLeftMenus.slice(0, 3);
    }

    if (!modal.isShow) {
      this.pauseRfresh = false;
    } else {
      this.pauseRfresh = true;
    }

    return (
      <div>
        <div className="o-menu-bar">
          {
            this.renderBreadcrumb()
          }
        </div>
        <div className="t-main__nav">
          {this.renderAsideTop()}
          <h4>{this.props.product.getIn(['group', 'selected', 'groupname'])}</h4>
          <Nav
            role="tree"
            menus={mainLeftMenus}
            location={this.props.location}
            onChange={this.onClickNav}
            isTree
          />
        </div>
        <div className="t-main__nav-toggle" onClick={this.props.toggleMainNav} >
          <Icon name="caret-left" />
        </div>
        <div className="t-main__content">
          {
            this.state.isInitGroupList ? null : (
              <RouteSwitches
                routes={this.props.route.routes}
              />
            )
          }
        </div>

        <Modal
          {...modal}
          id="mainGroupModal"
          onClose={() => {
            this.props.showMainModal({
              isShow: false,
            });
            this.props.resetVaildateMsg();
          }}
          noFooter
          draggable
        >
          {
            this.renderModalContent(modal)
          }
        </Modal>
      </div>
    );
  }
}

MainGroup.propTypes = propTypes;
MainGroup.defaultProps = defaultProps;

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
    propertiesActions,
    mainActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(MainGroup);
