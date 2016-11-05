import React, { PropTypes } from 'react';
import { Map, List, fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from 'shared/utils';
import { FormInput } from 'shared/components/Form';
import {
  Table, Select, Search, Button, Modal,
  FormContainer,
} from 'shared/components';

const msg = {
  perPage: _('Items per page: '),
};
const selectOptions = [
  { value: 20, label: `${msg.perPage}20` },
  { value: 50, label: `${msg.perPage}50` },
  { value: 100, label: `${msg.perPage}100` },
];

const propTypes = {
  // 组件通用选项
  title: PropTypes.string,
  listTitle: PropTypes.string,
  groupid: PropTypes.any,


  // 用于配置 list表格主键，用于Ajax保存
  listKey: PropTypes.string,
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  defaultQueryData: PropTypes.object,
  defaultSettingsData: PropTypes.object,
  tableOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  queryFormOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  saveFile: PropTypes.func,

  // 通用控制开关选项
  actionable: PropTypes.bool,
  addable: PropTypes.bool,
  editable: PropTypes.bool,
  deleteable: PropTypes.bool,
  searchable: PropTypes.bool,
  selectable: PropTypes.bool,
  noTitle: PropTypes.bool,

  // 通用操作函数
  initScreen: PropTypes.func,
  fetchScreenData: PropTypes.func,
  changeScreenQuery: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  leaveScreen: PropTypes.func,
  selectListItem: PropTypes.func,
  onListAction: PropTypes.func,
  createModal: PropTypes.func,

  // 全局 Settings 相关
  hasSettingsSaveButton: PropTypes.bool,
  settingsFormOption: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  updateScreenSettings: PropTypes.func,
  saveScreenSettings: PropTypes.func,

  // 数据验证
  validateAll: PropTypes.func,
  reportValidError: PropTypes.func,
  resetVaildateMsg: PropTypes.func,

  // List Action 具体列表项操作相关
  modalSize: PropTypes.string,
  editFormId: PropTypes.string,
  editFormLayout: PropTypes.string,
  defaultEditData: PropTypes.object,
  editFormOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  addListItem: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateCurEditListItem: PropTypes.func,
  editFormOption: PropTypes.object,
  actionBarButtons: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),

  // React node 元素
  children: PropTypes.node,
  actionBarChildren: PropTypes.node,
};
const defaultProps = {
  actionable: false,
  listKey: 'allKeys',
  addable: true,
  editable: true,
  deleteable: true,
};

// 原生的 react 页面
class ListInfo extends React.Component {
  constructor(props) {
    const initOption = {
      id: props.route.id,
      formUrl: props.route.formUrl,
      fetchUrl: props.route.fetchUrl,
      saveUrl: props.route.saveUrl,
    };
    super(props);

    if (props.defaultEditData) {
      initOption.defaultEditData = props.defaultEditData;
    }

    if (props.defaultQueryData) {
      initOption.query = props.defaultQueryData;
    }

    if (props.defaultSettingsData) {
      initOption.defaultSettingsData = props.defaultSettingsData;
    }

    // 需要对 groupid特处理
    if (typeof props.groupid !== 'undefined') {
      initOption.query = utils.extend({}, initOption.query, {
        groupid: props.groupid,
      });
      initOption.defaultSettingsData = utils.extend({}, props.defaultSettingsData, {
        groupid: props.groupid,
      });
      initOption.defaultEditData = utils.extend({}, props.defaultEditData, {
        groupid: props.groupid,
      });
    }

    this.props.initScreen(initOption);
    this.selectedList = [];
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.binds(
      'onChangeQuery', 'onPageChange', 'onSaveEditForm', 'onCloseEditModal',
      'onChangeSearchText', 'onChangeType', 'onChangeTableSize', 'onRemoveSelectItems',
      'onSaveSettings', 'onRemoveSelectedItems', 'onItemAction', 'onListSelectedAction'
    );
  }

  componentWillMount() {
    const { actionable, editable, deleteable, tableOptions } = this.props;
    let actionsOption = null;
    let btnsNum = 0;
    let btnList = List([]);

    // 初始选项，添加操作项
    if (actionable && tableOptions) {
      actionsOption = tableOptions.find(item => item.get('id') === '__actions__');
      if (editable) {
        btnsNum += 1;
      }
      if (deleteable) {
        btnsNum += 1;
      }

      if (actionsOption) {
        btnList = actionsOption.get('actions');
        btnsNum += btnList.size;
      }

      this.listTableOptions = tableOptions.push(Map({
        id: '__actions__',
        text: _('Actions'),
        width: btnsNum * 90,
        transform: (val, item, index) => (
          <div className="action-btns">
            {
              editable ? (
                <Button
                  icon="edit"
                  text={_('Edit')}
                  size="sm"
                  onClick={() => {
                    this.props.editListItemByIndex(index);
                  }}
                />
              ) : null
            }
            {
              deleteable ? (
                <Button
                  icon="trash"
                  text={_('Delete')}
                  size="sm"
                  onClick={() => {
                    this.onRemoveItem(index);
                  }}
                />
              ) : null
            }
            {
              btnList.map(btnItem => (
                <Button
                  icon={btnItem.get('icon')}
                  text={btnItem.get('text')}
                  size="sm"
                  onClick={() => {
                    this.onItemAction(
                      index,
                      btnItem.get('name')
                    );
                  }}
                />
              ))
            }
          </div>
        ),
      }));
    } else {
      this.listTableOptions = tableOptions;
    }

    if (this.listTableOptions) {
      this.listTableOptions = this.listTableOptions.map(
        ($$item) => {
          let $$retItem = $$item;

          if ($$retItem.get('type') === 'switch') {
            $$retItem = $$retItem.set('transform', (val, $$data, index) => {
              return (
                <FormInput
                  type="checkbox"
                  name={$$item.get('id')}
                  value="1"
                  checked={parseInt(val, 10) === 1}
                  onChange={(data) => {
                    this.onItemAction(
                      index,
                      $$item.get('actionType'),
                      {
                        [$$item.get('id')]: data.value,
                      }
                    );
                  }}
                />
              );
            });
          }

          return $$retItem;
        }
      );
    }


    this.onFetchList();
  }
  componentWillUpdate(nextProps) {
    this.formUrl = nextProps.route.formUrl;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.onFetchList();
    }

    if (this.props.groupid !== prevProps.groupid) {
      this.props.changeScreenActionQuery({
        groupid: this.props.groupid,
      });
      this.props.changeScreenQuery({
        groupid: this.props.groupid,
      });
      this.onFetchList();
    }
  }
  componentWillUnmount() {
    if (this.props.leaveScreen) {
      this.props.leaveScreen();
    }
  }
  onChangeSearchText(val) {
    this.onChangeQuery({
      search: val,
    }, true);
  }
  onChangeType(data) {
    this.onChangeQuery({
      type: data.value,
    }, true);
  }
  onChangeTableSize(data) {
    this.onChangeQuery({
      size: data.value,
      page: 1,
    }, true);
  }
  onSaveEditForm(formElem, hasFile) {
    const formUrl = formElem.getAttribute('action');

    if (this.props.validateAll) {
      this.props.validateAll(this.props.editFormId)
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            // 表单中无文件
            if (!hasFile) {
              this.props.onListAction();
            } else {
              this.props.saveFile(formUrl, formElem)
                .then(() => {
                  this.props.fetchScreenData(formUrl);
                  this.props.closeListItemModal();
                });
            }
          }
        });
    }
  }
  onCloseEditModal() {
    if (this.props.closeListItemModal) {
      this.props.closeListItemModal();
    }
    if (this.props.resetVaildateMsg) {
      this.props.resetVaildateMsg();
    }
  }

  onPageChange(i) {
    this.onChangeQuery({
      page: i,
    }, true);
  }
  onRemoveItem(i) {
    const store = this.props.store;
    const myListScreenId = store.get('curScreenId');
    const list = store.getIn([myListScreenId, 'data', 'list']);
    const listKey = this.props.listKey;
    let selectedList = [];
    const msgText = _('Are you sure to delete selected row: %s', i);

    if (listKey === 'allKeys') {
      selectedList = [list.get(i)];
    } else {
      selectedList = [list.getIn([i, listKey])];
    }

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msgText,
      apply: () => {
        this.props.changeScreenActionQuery({
          action: 'delete',
          selectedList,
        });
        this.props.onListAction();
      },
    });
  }

  onChangeQuery(data, needRefresh) {
    if (this.props.changeScreenQuery) {
      this.props.changeScreenQuery(data);
    }

    if (needRefresh) {
      this.onFetchList();
    }
  }
  onSaveSettings() {
    if (this.props.validateAll) {
      this.props.validateAll()
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            this.props.saveScreenSettings();
          }
        });
    }
  }
  onRemoveSelectedItems(selectedList, list) {
    const listKey = this.props.listKey;
    let selectStr = '';
    let mySelectedList = selectedList;
    let msgText = '';

    if (selectedList && selectedList.size > 0) {
      mySelectedList = mySelectedList.map((val) => {
        let ret = [];

        if (listKey === 'allKeys') {
          ret = list.get(val);
        } else {
          ret = list.getIn([val, listKey]);
        }

        return ret;
      });
      selectStr = mySelectedList.map((item, i) => i).join(', ');
      msgText = _('Are you sure to delete selected rows: %s', selectStr);

      this.props.createModal({
        id: 'settings',
        role: 'confirm',
        text: msgText,
        apply: () => {
          this.props.changeScreenActionQuery({
            action: 'delete',
            selectedList: mySelectedList,
          });
          this.props.onListAction();
        },
      });
    } else {
      this.props.createModal({
        role: 'alert',
        text: _('Please select delete rows'),
      });
    }
  }
  onListSelectedAction(actionName) {
    const store = this.props.store;
    const myListScreenId = store.get('curScreenId');
    const $$list = store.getIn([myListScreenId, 'data', 'list']);
    const $$actionQuery = store.getIn([myListScreenId, 'actionQuery']);
    const listKey = this.props.listKey;
    let selectStr = '';
    let msgText = '';
    let $$selectedList = $$actionQuery.get('selectedList');

    if ($$selectedList && $$selectedList.size > 0) {
      $$selectedList = $$selectedList.map((val) => {
        let ret = [];

        if (listKey === 'allKeys') {
          ret = $$list.get(val);
        } else {
          ret = $$list.getIn([val, listKey]);
        }

        return ret;
      });
      selectStr = $$selectedList.map((item, i) => i).join(', ');
      msgText = _('Are you sure to %s selected rows: %s', actionName, selectStr);

      this.props.createModal({
        id: 'settings',
        role: 'confirm',
        text: msgText,
        apply: () => {
          this.props.changeScreenActionQuery({
            action: actionName,
            selectedList: $$selectedList,
          });
          this.props.onListAction();
        },
      });
    } else {
      this.props.createModal({
        role: 'alert',
        text: _('Please select %s rows', actionName),
      });
    }
  }
  onItemAction(index, actionName, data) {
    const store = this.props.store;
    const myListScreenId = store.get('curScreenId');
    const list = store.getIn([myListScreenId, 'data', 'list']);
    const listKey = this.props.listKey;
    const $$actionItem = list.get(index);
    let $$actionData = Map({
      action: actionName,
    });

    if (listKey === 'allKeys') {
      $$actionData = $$actionData.merge($$actionItem);
    } else {
      $$actionData = $$actionData.set(
        listKey,
        $$actionItem.get(listKey)
      );
    }

    $$actionData = $$actionData.merge(data);

    this.props.changeScreenActionQuery($$actionData.toJS());
    this.props.onListAction();
  }
  onFetchList() {
    if (this.props.fetchScreenData) {
      this.props.fetchScreenData();
    }
  }

  binds(...methods) {
    methods.forEach((method) => {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    });
  }

  render() {
    const {
      store, route, app, modalSize, title, listTitle,
      selectable, deleteable, searchable, addable, actionable, noTitle,
      editFormLayout, editFormOptions, defaultEditData, editFormId,
      settingsFormOption, updateScreenSettings, hasSettingsSaveButton,
      queryFormOptions, editFormOption, actionBarButtons,
      actionBarChildren,
    } = this.props;
    const myListScreenId = store.get('curScreenId');
    const page = store.getIn([myListScreenId, 'data', 'page']);
    const list = store.getIn([myListScreenId, 'data', 'list']);
    const curSettings = store.getIn([myListScreenId, 'curSettings']);
    const editData = store.getIn([myListScreenId, 'curListItem']);
    const query = store.getIn([myListScreenId, 'query']);
    const actionQuery = store.getIn([myListScreenId, 'actionQuery']);
    const actionType = actionQuery.get('action');
    const saveUrl = route.saveUrl || route.formUrl;
    const fetchUrl = route.fetchUrl || route.formUrl;
    const leftChildrenNode = [];
    let pageSelectClassName = 'fr';
    let isEditModelshow = false;
    let myEditFormOptions = editFormOptions;
    let $$curActionBarButtons = actionBarButtons;

    if (editFormOption && editFormOption.hasFile) {
      myEditFormOptions = myEditFormOptions.unshift(fromJS({
        id: 'action',
        type: 'hidden',
        value: actionType,
      }));
    }

    // 数据未初始化不渲染
    if (myListScreenId === 'base') {
      return null;
    }

    // 判断是否显示修改或添加 model
    if (actionType === 'edit' || actionType === 'add') {
      isEditModelshow = true;
    }

    // 处理每页显示下拉框的位置
    if (!searchable && !queryFormOptions && !actionBarChildren &&
        (actionable && !addable)) {
      pageSelectClassName = 'fl';
    }

    if (actionable) {
      if (addable) {
        leftChildrenNode.push(
          <Button
            icon="plus"
            key="addBtn"
            theme="primary"
            text={_('Add')}
            onClick={() => {
              this.props.addListItem(defaultEditData);
            }}
          />
        );
      }
      if (actionBarButtons) {
        if (!List.isList(actionBarButtons)) {
          $$curActionBarButtons = fromJS(actionBarButtons);
        }

        leftChildrenNode.push(
          $$curActionBarButtons.map(
            ($$subButton) => {
              const butProps = $$subButton.toJS();
              const actionName = $$subButton.get('name');
              return (
                <Button
                  {...butProps}
                  key={`${actionName}Btn`}
                  onClick={() => {
                    this.onListSelectedAction(actionName);
                  }}
                />
              );
            }
          ).toJS()
        );
      }
    }
    if (searchable) {
      leftChildrenNode.push(
        <Search
          value={query.get('text')}
          key="searchInput"
          onChange={this.onChangeSearchText}
          onSearch={this.handleSearch}
        />
      );
    }
    if (actionable && selectable && deleteable) {
      leftChildrenNode.push(
        <Button
          icon="trash-o"
          key="delete"
          text={_('Remove Selected')}
          onClick={() => {
            this.onRemoveSelectedItems(actionQuery.get('selectedList'), list);
          }}
        />
      );
    }
    if (actionBarChildren) {
      leftChildrenNode.push(actionBarChildren);
    }

    return (
      <div className="t-list-info">
        {
          noTitle ? null : (
            <h2 className="t-list-info__title">{title || route.text}</h2>
          )
        }
        {
          settingsFormOption ? (
            <FormContainer
              options={settingsFormOption}
              data={curSettings}
              onChangeData={updateScreenSettings}
              onSave={this.onSaveSettings}
              invalidMsg={app.get('invalid')}
              validateAt={app.get('validateAt')}
              isSaving={app.get('saving')}
              hasSaveButton={hasSettingsSaveButton}
            />
          ) : null
        }

        {
          listTitle ? (
            <h2 className="t-list-info__title">{listTitle}</h2>
          ) : null
        }

        <FormContainer
          action={fetchUrl}
          method="GET"
          layout="flow"
          data={query}
          options={queryFormOptions}
          id={editFormId}
          isSaving={app.get('fetching')}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          onSave={this.onSave}
          onChangeData={this.props.changeScreenQuery}
          onValidError={this.props.reportValidError}
          leftChildren={leftChildrenNode}
          rightChildren={
              page ? (
                <Select
                  className={pageSelectClassName}
                  value={query.get('size')}
                  onChange={this.onChangeTableSize}
                  options={selectOptions}
                  searchable={false}
                  clearable={false}
                />
            ) : null
          }
        />
        {
          this.listTableOptions ? (
            <Table
              className="table"
              options={this.listTableOptions}
              list={list}
              page={page}
              onPageChange={this.onPageChange}
              loading={app.get('fetching')}
              selectable={selectable}
              onRowSelect={this.props.selectListItem}
            />
          ) : null
        }
        {
          editFormOptions ? (
            <Modal
              isShow={isEditModelshow}
              title={actionQuery.get('myTitle')}
              onOk={this.onSave}
              onClose={this.onCloseEditModal}
              size={modalSize}
              noFooter
            >
              <FormContainer
                action={saveUrl}
                layout={editFormLayout}
                isSaving={app.get('saving')}
                data={editData}
                actionQuery={actionQuery}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                options={myEditFormOptions}
                onSave={this.onSaveEditForm}
                onChangeData={this.props.updateCurEditListItem}
                onValidError={this.props.reportValidError}
                hasSaveButton
                {...editFormOption}
              />
            </Modal>
          ) : null
        }
        {
          this.props.children
        }
      </div>
    );
  }
}

ListInfo.propTypes = propTypes;
ListInfo.defaultProps = defaultProps;

export default ListInfo;

