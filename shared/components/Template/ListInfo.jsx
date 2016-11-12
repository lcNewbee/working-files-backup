import React, { PropTypes } from 'react';
import { Map, List, fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from 'shared/utils';
import { FormInput, Search } from 'shared/components/Form';
import Select from 'shared/components/Select';
import Table from 'shared/components/Table';
import Modal from 'shared/components/Modal';
import { Button } from 'shared/components/Button';
import FormContainer from 'shared/components/Organism/FormContainer';


const selectOptions = [
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

const propTypes = {
  // 组件通用选项
  fetchUrl: PropTypes.string,
  saveUrl: PropTypes.string,
  listTitle: PropTypes.string,
  groupid: PropTypes.any,


  // 用于配置 list表格主键，用于Ajax保存
  listKey: PropTypes.string,
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  tableOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  queryFormOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  saveFile: PropTypes.func,

  // 通用控制开关选项
  customModal: PropTypes.bool,
  customTable: PropTypes.bool,
  actionable: PropTypes.bool,
  addable: PropTypes.bool,
  editable: PropTypes.bool,
  deleteable: PropTypes.bool,
  searchable: PropTypes.bool,
  selectable: PropTypes.bool,

  // 通用操作函数
  fetchScreenData: PropTypes.func,
  changeScreenQuery: PropTypes.func,
  changeScreenActionQuery: PropTypes.func,
  selectListItem: PropTypes.func,
  onListAction: PropTypes.func,
  createModal: PropTypes.func,

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
    super(props);
    this.selectedList = [];
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    utils.binds(this, [
      'onChangeQuery', 'onPageChange', 'onSaveEditForm', 'onCloseEditModal',
      'onChangeSearchText', 'onChangeType', 'onChangeTableSize', 'onRemoveSelectItems',
      'onItemAction', 'onSelectedItemsAction',
    ]);
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
                      btnItem.get('name'),
                      index,
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
            $$retItem = $$retItem.set('transform', (val, $$data, index) => (
              <FormInput
                type="checkbox"
                name={$$item.get('id')}
                value="1"
                checked={parseInt(val, 10) === 1}
                onChange={(data) => {
                  this.onItemAction(
                    $$item.get('actionType'),
                    index,
                    {
                      [$$item.get('id')]: data.value,
                    },
                  );
                }}
              />
            ));
          }

          return $$retItem;
        },
      );
    }
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
    const list = store.getIn(['data', 'list']);
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
  onSelectedItemsAction(actionName) {
    const store = this.props.store;
    const $$list = store.getIn(['data', 'list']);
    const $$actionQuery = store.getIn(['actionQuery']);
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
      selectStr = $$actionQuery.get('selectedList').sort().join(', ');
      msgText = _('Are you sure to %s selected rows: %s', _(actionName), selectStr);
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
        text: _('Please select %s rows', _(actionName)),
      });
    }
  }
  onItemAction(actionName, index, data) {
    const store = this.props.store;
    const list = store.getIn(['data', 'list']);
    const listKey = this.props.listKey;
    const $$actionItem = list.get(index);
    const msgText = _('Are you sure to %s selected rows: %s', _(actionName), index);
    let selectedList = [];
    let $$actionData = Map({
      action: actionName,
    });

    if (listKey === 'allKeys') {
      $$actionData = $$actionData.merge($$actionItem);
      selectedList = [list.get(index)];
    } else {
      $$actionData = $$actionData.set(
        listKey,
        $$actionItem.get(listKey),
      );
      selectedList = [list.getIn([index, listKey])];
    }

    $$actionData = $$actionData.merge(data)
      .merge({
        selectedList,
      });

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: msgText,
      apply: () => {
        this.props.changeScreenActionQuery(
          $$actionData.toJS(),
        );
        this.props.onListAction();
      },
    });
  }
  onFetchList() {
    if (this.props.fetchScreenData) {
      this.props.fetchScreenData();
    }
  }
  renderHeader() {
    const {
      store, app, fetchUrl,
      selectable, deleteable, searchable, addable, actionable,
      defaultEditData, editFormId, queryFormOptions, actionBarButtons,
      actionBarChildren,
    } = this.props;
    const page = store.getIn(['data', 'page']);
    const query = store.getIn(['query']);
    const leftChildrenNode = [];
    let pageSelectClassName = 'fr';
    let $$curActionBarButtons = actionBarButtons;

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
          />,
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
              const needConfirm = $$subButton.get('needConfirm');
              return (
                <Button
                  {...butProps}
                  key={`${actionName}Btn`}
                  onClick={() => {
                    this.onSelectedItemsAction(actionName, needConfirm);
                  }}
                />
              );
            },
          ).toJS(),
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
        />,
      );
    }
    if (actionable && selectable && deleteable) {
      leftChildrenNode.push(
        <Button
          icon="trash-o"
          key="delete"
          text={_('Remove Selected')}
          onClick={() => {
            this.onSelectedItemsAction('delete');
          }}
        />,
      );
    }
    if (actionBarChildren) {
      leftChildrenNode.push(actionBarChildren);
    }

    return (
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
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    lineHeight: '30px',
                    marginRight: '10px',
                  }}
                >
                  {_('View')}
                </span>
                <Select
                  className={pageSelectClassName}
                  value={query.get('size')}
                  onChange={this.onChangeTableSize}
                  options={selectOptions}
                  searchable={false}
                  clearable={false}
                />
              </div>

          ) : null
        }
      />
    );
  }

  renderFooter() {
    const {
      store, app, modalSize, customModal,
      editFormLayout, editFormOptions, editFormOption, saveUrl,
    } = this.props;
    const editData = store.getIn(['curListItem']);
    const actionQuery = store.getIn(['actionQuery']);
    const actionType = actionQuery.get('action');
    let isEditModelshow = false;
    let myEditFormOptions = editFormOptions;

    if (editFormOption && editFormOption.hasFile) {
      myEditFormOptions = myEditFormOptions.unshift(fromJS({
        id: 'action',
        type: 'hidden',
        value: actionType,
      }));
    }

    // 处理可添加不能编辑的表单项
    if (actionType === 'edit') {
      myEditFormOptions = myEditFormOptions.map(($$formList) => {
        let $$newFormList = $$formList;

        if (List.isList($$newFormList)) {
          $$newFormList = $$newFormList.map(($$formGroup) => {
            let $$newFormGroup = $$formGroup;

            if ($$formGroup.get('notEditable')) {
              $$newFormGroup = $$newFormGroup.set('disabled', true);
            }
            return $$newFormGroup;
          });
        } else if ($$formList.get('notEditable')) {
          $$newFormList = $$formList.set('disabled', true);
        }

        return $$newFormList;
      });
    }

    // 判断是否显示修改或添加 model
    if (actionType === 'edit' || actionType === 'add') {
      isEditModelshow = true;
    }

    return (
      !customModal ? (
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
    );
  }

  render() {
    const {
      store, app, listTitle, selectable, customTable,
    } = this.props;
    const page = store.getIn(['data', 'page']);
    const list = store.getIn(['data', 'list']);

    return (
      <div className="t-list-info">
        {
          listTitle ? (
            <h2 className="t-list-info__title">{listTitle}</h2>
          ) : null
        }
        {
          this.renderHeader()
        }
        {
          this.listTableOptions && !customTable ? (
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
          this.renderFooter()
        }
      </div>
    );
  }
}

ListInfo.propTypes = propTypes;
ListInfo.defaultProps = defaultProps;

export default ListInfo;

