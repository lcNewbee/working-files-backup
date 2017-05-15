import React from 'react';
import PropTypes from 'prop-types';
import { Map, List, fromJS } from 'immutable';
import utils from 'shared/utils';
import { FormInput, Search } from 'shared/components/Form';
import Select from 'shared/components/Select';
import Table from 'shared/components/Table';
import Modal from 'shared/components/Modal';
import { Button } from 'shared/components/Button';
import FormContainer from 'shared/components/Organism/FormContainer';

const saveText = __('Apply');
const savingText = __('Applying');
let savedText = __('Applied');
const searchInputStyle = {
  marginRight: '12px',
};

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

  // AppScreen 组件的加载状态
  loading: PropTypes.bool,

  // 用于配置 list表格主键，用于Ajax保存
  listKey: PropTypes.string,
  maxListSize: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
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
  editable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),
  deleteable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),
  selectable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),
  searchable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),

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
  searchProps: PropTypes.object,
  modalSize: PropTypes.string,
  editFormId: PropTypes.string,
  editFormLayout: PropTypes.string,
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
  onBeforeAction: PropTypes.func,
  onBeforeSave: PropTypes.func,
  onBeforeSync: PropTypes.func,
  onAfterSync: PropTypes.func,

  // React node 元素
  actionBarChildren: PropTypes.node,
  modalChildren: PropTypes.node,
};
const defaultProps = {
  actionable: false,
  listKey: 'allKeys',
  addable: true,
  editable: true,
  deleteable: true,
  onAfterSync: utils.emptyFunc,
  createModal: (option) => {
    if (option && option.text) {
      /* eslint-disable no-alert */
      alert(option.text);
    }
  },
  maxListSize: 999999,
};

// 原生的 react 页面
class AppScreenList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.selectedList = [];
    utils.binds(this, [
      'initListTableOptions',
      'onItemAction',
      'doSaveEditForm',
      'doSyncData',
      'onBeforeSync',
      'onChangeQuery',
      'onFetchList',
      'onPageChange',
      'onSaveEditForm',
      'onCloseEditModal',
      'onChangeSearchText',
      'onChangeType',
      'onChangeTableSize',
      'onRemoveSelectItems',
      'handleItemAction',
      'onSelectedItemsAction',
      'initModalFormOptions',
    ]);
  }
  componentWillMount() {
    this.initListTableOptions(this.props, this.props.editable);
    this.initModalFormOptions(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.tableOptions !== nextProps.tableOptions) {
      this.initListTableOptions(nextProps, nextProps.editable);
    }
    if (this.props.editFormOptions !== nextProps.editFormOptions ||
        this.props.editFormOption !== nextProps.editFormOption ||
        this.props.store.getIn(['actionQuery', 'action']) !== nextProps.store.getIn(['actionQuery', 'action'])) {
      this.initModalFormOptions(nextProps);
    }
  }

  onFetchList() {
    if (this.props.fetchScreenData) {
      this.props.fetchScreenData();
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
  onBeforeSync(callback) {
    const { onBeforeSync, store } = this.props;
    const $$actionQuery = store.get('actionQuery');
    const $$curListItem = store.get('curListItem');
    const retOption = {};
    let onBeforeSyncResult = '';

    if (onBeforeSync) {
      onBeforeSyncResult = onBeforeSync($$actionQuery, $$curListItem);
    }

    if (utils.isPromise(onBeforeSyncResult)) {
      onBeforeSyncResult.then(
          (msg) => {
            retOption.msg = msg;
            callback(retOption);
          },
        );
    } else {
      if (onBeforeSyncResult) {
        retOption.msg = onBeforeSyncResult;
      }

      callback(retOption);
    }
  }
  onSaveEditForm(formElem, hasFile) {
    const { onBeforeSave, store } = this.props;
    const $$actionQuery = store.get('actionQuery');
    const $$curListItem = store.get('curListItem');
    const saveOption = {
      formElem,
      hasFile,
    };
    let onBeforeSaveResult = '';

    if (onBeforeSave) {
      onBeforeSaveResult = onBeforeSave($$actionQuery, $$curListItem);
    }

    if (utils.isPromise(onBeforeSaveResult)) {
      onBeforeSaveResult.then(
          (msg) => {
            saveOption.msg = msg;
            this.doSaveEditForm(saveOption);
          },
        );
    } else {
      if (onBeforeSaveResult) {
        saveOption.msg = onBeforeSaveResult;
      }

      this.doSaveEditForm(saveOption);
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
    const msgText = __('Are you sure to delete selected row: %s', i);

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
        this.props.onListAction()
          .then(
            (json) => {
              this.props.onAfterSync(json);
            },
          );
      },
    });
  }

  onChangeQuery(data, needRefresh) {
    if (this.props.changeScreenQuery) {
      this.props.changeScreenQuery(data);
    }

    if (needRefresh) {
      clearTimeout(this.querySaveTimeout);
      this.querySaveTimeout = setTimeout(() => {
        this.onFetchList();
      }, 200);
    }
  }
  onSelectedItemsAction(option) {
    const needConfirm = option.needConfirm;
    const store = this.props.store;
    const $$list = store.getIn(['data', 'list']);
    const $$actionQuery = store.getIn(['actionQuery']);
    const listKey = option.actionKey || this.props.listKey;
    let actionName = option.actionName;
    let selectNumber = 0;
    let msgText = '';
    let $$selectedList = $$actionQuery.get('selectedList');
    const doSelectedItemsAction = () => {
      this.props.changeScreenActionQuery({
        action: actionName,
        selectedList: $$selectedList,
      });
      this.props.onListAction()
        .then(
          (json) => {
            this.props.onAfterSync(json);
          },
        );
    };

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
      selectNumber = $$actionQuery.get('selectedList').size;
      msgText = __('Are you sure to %s selected %s rows?', __(actionName), selectNumber);

      if (needConfirm) {
        this.props.createModal({
          id: 'settings',
          role: 'confirm',
          text: msgText,
          apply: doSelectedItemsAction,
        });
      } else {
        doSelectedItemsAction();
      }
    } else {
      if (actionName === 'setting') {
        actionName = 'edit';
      }
      this.props.createModal({
        role: 'alert',
        text: __('Please select %s rows', __(actionName)),
      });
    }
  }
  onItemAction($$actionQuery, option) {
    const { cancelMsg, needConfirm, confirmText, $$curData } = option;
    const modalId = 'listAction';
    const doItemAction = () => {
      let needMerge = false;

      if ($$actionQuery) {
        this.props.changeScreenActionQuery($$actionQuery.toJS());
      }

      if (!$$curData.isEmpty()) {
        this.props.updateCurEditListItem($$curData.toJS());
        needMerge = true;
      }
      this.props.onListAction({ needMerge })
        .then(
          (json) => {
            this.props.onAfterSync(json);
          },
        );
    };

    // 打印取消原因提示
    if (cancelMsg) {
      this.props.createModal({
        id: modalId,
        role: 'alert',
        text: cancelMsg,
      });

    // 需要询问用户
    } else if (needConfirm) {
      this.props.createModal({
        id: modalId,
        role: 'confirm',
        text: confirmText,
        apply: doItemAction,
      });

    // 直接提交
    } else {
      doItemAction();
    }
  }
  handleItemAction(option, $$data) {
    const { index, needConfirm } = option;
    const { store, onBeforeAction } = this.props;
    const actionName = option.actionName || option.actionType;
    const list = store.getIn(['data', 'list']);
    const listKey = option.actionKey || this.props.listKey;
    const $$actionItem = list.get(index);
    const confirmText = __('Are you sure to %s selected %s row?', __(actionName), (index + 1));
    let selectedList = [];
    let cancelMsg = '';
    let onBeforeActionResult;
    let $$curData = Map({});
    let $$actionQuery = Map({
      action: actionName,
    });

    if (listKey === 'allKeys') {
      $$curData = $$curData.merge($$actionItem);
      selectedList = [list.get(index)];
    } else {
      $$curData = $$curData.set(
        listKey,
        $$actionItem.get(listKey),
      );
      selectedList = [list.getIn([index, listKey])];
    }

    $$curData = $$curData.merge($$data);
    $$actionQuery = $$actionQuery.merge({
      selectedList,
    });

    // 运行 onBeforeAction
    if (onBeforeAction) {
      onBeforeActionResult = onBeforeAction($$actionQuery);
    }

    // 异步处理，如果是 Promise 对象
    if (utils.isPromise(onBeforeActionResult)) {
      onBeforeActionResult.then(
          msg => this.onItemAction($$actionQuery, {
            cancelMsg: msg,
            confirmText,
            needConfirm,
            $$curData,
          }),
        );

    // 同步处理
    } else {
      if (onBeforeActionResult) {
        cancelMsg = onBeforeActionResult;
      }
      this.onItemAction($$actionQuery, {
        cancelMsg,
        needConfirm,
        confirmText,
        $$curData,
      });
    }
  }
  doSyncData(option) {
    if (option && option.hasFile) {
      this.props.saveFile(option.formUrl, option.formElem)
        .then((json) => {
          this.props.fetchScreenData({
            url: option.formUrl,
          });
          this.props.closeListItemModal();
          this.props.onAfterSync(json);
        });
    // 无文件提交
    } else {
      this.props.onListAction()
        .then(
          (json) => {
            this.props.onAfterSync(json);
          },
        );
    }
  }
  doSaveEditForm(option) {
    const { formElem, hasFile } = option;
    const formUrl = formElem.getAttribute('action');

    if (option && option.msg) {
      this.props.createModal({
        id: 'saveEditForm',
        role: 'alert',
        text: option.msg,
      });

    // 数据验证，与 syncData 前验证
    } else if (this.props.validateAll) {
      this.props.validateAll(this.props.editFormId)
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            this.onBeforeSync(
              (syncOption) => {
                if (!syncOption.msg) {
                  this.doSyncData({
                    hasFile,
                    formUrl,
                    formElem,
                  });
                } else {
                  this.props.createModal({
                    id: 'saveEditForm',
                    role: 'alert',
                    text: syncOption.msg,
                  });
                }
              },
            );
          }
        });
    }
  }
  initListTableOptions(props, editable) {
    const { actionable, deleteable, tableOptions } = props;
    let actionsOption = null;
    let btnsNum = 0;
    let btnList = List([]);
    let renderFunc = null;
    let hasRenderFunc = false;

    this.listTableOptions = tableOptions;

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
        renderFunc = actionsOption.get('render');
        hasRenderFunc = utils.isFunc(renderFunc);

        btnList = actionsOption.get('actions');

        if (btnList && btnList.size) {
          btnsNum += btnList.size;
        }
        this.listTableOptions = tableOptions;
      }

      // 有操作按钮时，添加操作列
      if (btnsNum > 0) {
        if (!actionsOption) {
          this.listTableOptions = tableOptions.push(Map({
            id: '__actions__',
            text: __('Actions'),
          }));
        }
        this.listTableOptions = this.listTableOptions.setIn([-1, 'render'],
          (val, $$item, $$option) => {
            const index = $$option.get('__index__');
            let editableResult = editable;
            let deleteableResult = deleteable;

            if (utils.isFunc(editable)) {
              editableResult = editable($$item, index);
            }

            if (utils.isFunc(deleteable)) {
              deleteableResult = deleteable($$item, index);
            }

            if (hasRenderFunc) {
              btnsNum = 'auto';
            }

            return (
              <div className="action-btns">
                {
                  editableResult ? (
                    <Button
                      icon="edit"
                      text={__('Edit')}
                      size="sm"
                      onClick={() => {
                        this.props.editListItemByIndex(index);
                      }}
                    />
                  ) : null
                }
                {
                  deleteableResult ? (
                    <Button
                      icon="trash"
                      text={__('Delete')}
                      size="sm"
                      onClick={() => {
                        this.handleItemAction({
                          actionName: 'delete',
                          needConfirm: true,
                          index,
                        });
                      }}
                    />
                    ) : null
                  }
                {
                  btnList ? btnList.map(($$btnItem) => {
                    let hiddenResult = $$btnItem.get('isHidden');
                    let onClickFunc = () => {
                      this.handleItemAction(
                        $$btnItem.set('index', index).toJS(),
                      );
                    };

                    if (utils.isFunc(hiddenResult)) {
                      hiddenResult = hiddenResult($$item, index);
                    }

                    if (utils.isFunc($$btnItem.get('onClick'))) {
                      onClickFunc = $$btnItem.get('onClick');
                    }

                    return hiddenResult ? null : (
                      <Button
                        key={`${$$btnItem.get('name')}Btn`}
                        icon={$$btnItem.get('icon')}
                        text={$$btnItem.get('text')}
                        size="sm"
                        onClick={onClickFunc}
                      />
                    );
                  }) : null
                }
                {
                  hasRenderFunc ? renderFunc(val, $$item, index) : null
                }
              </div>
            );
          },
        );
      }

      if (btnsNum !== 'auto' && btnsNum > 0) {
        this.listTableOptions = this.listTableOptions.setIn([-1, 'width'], btnsNum * 90);
      }
    }

    // 处理包含 单条 启用开关
    if (this.listTableOptions) {
      this.listTableOptions = this.listTableOptions.map(
        ($$item) => {
          let $$retItem = $$item;

          if ($$retItem.get('type') === 'switch') {
            $$retItem = $$retItem.set('render', (val, $$data, $$props) => (
              <FormInput
                type="checkbox"
                name={$$item.get('id')}
                value="1"
                disabled={!actionable}
                checked={parseInt(val, 10) === 1}
                onChange={(data) => {
                  this.handleItemAction(
                    $$item.set('index', $$props.get('__index__')).toJS(),
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

  initModalFormOptions(props) {
    const { editFormOptions, editFormOption, store } = props;
    let myEditFormOptions = editFormOptions;
    const actionType = store.getIn(['actionQuery', 'action']);

    if (editFormOption && editFormOption.hasFile) {
      myEditFormOptions = myEditFormOptions.unshift(fromJS({
        id: 'action',
        type: 'hidden',
        value: actionType,
      }));
    }

    // 处理可添加不能编辑的表单项
    if (actionType === 'edit') { // 给列表中所有项目添加是否可编辑的属性
      myEditFormOptions = myEditFormOptions.map(($$formList) => {
        let $$newFormList = $$formList;

        if (List.isList($$newFormList)) { // 按照fieldset分组后的list
          $$newFormList = $$newFormList.map(($$formGroup) => {
            let $$newFormGroup = $$formGroup;

            if ($$formGroup.get('notEditable')) {
              // 该项不可编辑，则置为只读，并将选择类型强制设为输入类型
              $$newFormGroup = $$newFormGroup.set('readOnly', true)
                .set('type', 'text');

              if ($$newFormGroup.get('type') === 'select' || $$newFormGroup.get('type') === 'switch') {
                $$newFormGroup = $$newFormGroup.set('type', 'text');
              }
            }
            return $$newFormGroup;
          });
        } else if ($$formList.get('notEditable')) { // 没有分组的list
          $$newFormList = $$formList.set('readOnly', true);
        }

        return $$newFormList;
      });
    } else if (actionType === 'add') { // 如果是添加操作，则根据
      myEditFormOptions = myEditFormOptions.map(
        ($$item) => {
          let $$newItem = $$item;

          if (List.isList($$newItem)) { // 分组后的list
            $$newItem = $$newItem.filterNot(
              $$formGroup => $$formGroup.get('noAdd'),
            );
          } else if ($$item.get('noAdd')) { // 未分组的list
            $$newItem = $$newItem.set('style', { display: 'none' });
          }

          return $$newItem;
        },
      );
    }

    this.editFormOptions = myEditFormOptions;
  }
  renderHeader() {
    const {
      store, app, fetchUrl,
      selectable, deleteable, searchable, searchProps, addable, actionable,
      editFormId, queryFormOptions, actionBarButtons,
      actionBarChildren, maxListSize,
    } = this.props;
    const page = store.getIn(['data', 'page']);
    const $$curList = store.getIn(['data', 'list']) || List([]);
    const query = store.getIn(['query']);
    const leftChildrenNode = [];
    const totalListItem = store.getIn(['data', 'page', 'total']) || $$curList.size;
    let $$curActionBarButtons = actionBarButtons;
    let rightChildrenNode = null;

    // 处理列表操作相关按钮
    if (actionable) {
      // 初始化添加按钮
      if (addable) {
        leftChildrenNode.push(
          <Button
            icon="plus"
            key="addBtn"
            theme="primary"
            text={__('Add')}
            onClick={() => {
              if (totalListItem < parseInt(maxListSize, 10)) {
                this.props.addListItem();
              } else {
                this.props.createModal({
                  id: 'addListItem',
                  role: 'alert',
                  text: __('Max list size is %s', maxListSize),
                });
              }
            }}
          />,
        );
      }
      // 只有在列表是可选择情况下，添加多行操作按钮
      if (selectable) {
        // 多行删除
        if (deleteable) {
          leftChildrenNode.push(
            <Button
              icon="trash-o"
              key="delete"
              text={__('Delete')}
              onClick={() => {
                this.onSelectedItemsAction({
                  actionName: 'delete',
                  needConfirm: true,
                });
              }}
            />,
          );
        }

        // 用户自定义多行操作
        if (actionBarButtons) {
          if (!List.isList(actionBarButtons)) {
            $$curActionBarButtons = fromJS(actionBarButtons);
          }

          leftChildrenNode.push(
            $$curActionBarButtons.map(
              ($$subButton) => {
                const butProps = $$subButton.toJS();
                const actionName = $$subButton.get('actionName');
                return (
                  <Button
                    {...butProps}
                    key={`${actionName}Btn`}
                    onClick={() => {
                      this.onSelectedItemsAction($$subButton.toJS());
                    }}
                  />
                );
              },
            ).toJS(),
          );
        }

        if (actionBarChildren) {
          leftChildrenNode.push(actionBarChildren);
        }
      }
    }

    // 列表查询
    if (searchable) {
      leftChildrenNode.push(
        <Search
          {...searchProps}
          value={query.get('search')}
          key="searchInput"
          maxLength="265"
          onChange={this.onChangeSearchText}
          onSearch={this.handleSearch}
          style={searchInputStyle}
        />,
      );
    }

    // 页面大小选择下拉框
    if (page) {
      rightChildrenNode = [
        <label
          key="pageLabel"
          htmlFor="pageSelect"
        >
          {__('View')}
        </label>,
        <Select
          key="pageSelect"
          value={query.get('size')}
          onChange={this.onChangeTableSize}
          options={selectOptions}
          searchable={false}
          clearable={false}
        />,
      ];
    }

    return (
      <FormContainer
        id={editFormId}
        action={fetchUrl}
        method="GET"
        layout="flow"
        className="t-list-info__query"
        data={query}
        options={queryFormOptions}
        isSaving={app.get('fetching')}
        invalidMsg={app.get('invalid')}
        validateAt={app.get('validateAt')}
        onValidError={this.props.reportValidError}
        onChangeData={this.onChangeQuery}
        onSave={this.onFetchList}
        saveText={saveText}
        savingText={savingText}
        savedText={savedText}
        leftChildren={leftChildrenNode}
        rightChildren={rightChildrenNode}
      />
    );
  }
  renderFooter() {
    const {
      store, app, modalSize, customModal, modalChildren,
      editFormLayout, editFormOption, saveUrl,
    } = this.props;
    const editData = store.getIn(['curListItem']);
    const actionQuery = store.getIn(['actionQuery']);
    const actionType = actionQuery.get('action');
    let isEditModelshow = false;
    const syncCode = app.getIn(['state', 'code']);

    // 判断是否显示修改或添加 model
    if (actionType === 'edit' || actionType === 'add' || !!modalChildren) {
      isEditModelshow = true;

      if (syncCode >= 6000) {
        savedText = __('Unapply');
      }
    }

    return (
      !customModal ? (
        <Modal
          id="AppScreenListModal"
          isShow={isEditModelshow}
          title={actionQuery.get('myTitle')}
          onClose={this.onCloseEditModal}
          size={modalSize}
          noFooter
        >
          {
            !modalChildren ? (
              <FormContainer
                action={saveUrl}
                layout={editFormLayout}
                isSaving={app.get('saving')}
                data={editData}
                actionQuery={actionQuery}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                options={this.editFormOptions}
                onSave={this.onSaveEditForm}
                onChangeData={this.props.updateCurEditListItem}
                onValidError={this.props.reportValidError}
                saveText={saveText}
                savingText={savingText}
                savedText={savedText}
                hasSaveButton
                {...editFormOption}
              />
            ) : modalChildren
          }

        </Modal>
      ) : null
    );
  }

  render() {
    const {
      store, listTitle, selectable, customTable,
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

              // 必须要父级 AppScreen 已处理加载状态后
              // 且 AppScreen 不是加载中，
              // 用于 相应 列表中单元素的操作事件,显示数据交互过程
              loading={this.props.loading === false && store.get('fetching')}
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

AppScreenList.propTypes = propTypes;
AppScreenList.defaultProps = defaultProps;

export default AppScreenList;

