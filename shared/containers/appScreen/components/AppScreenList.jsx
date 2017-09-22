import React from 'react';
import PropTypes from 'prop-types';
import { Map, List, fromJS } from 'immutable';
import utils from 'shared/utils';
import {
  Button, Popconfirm, FormContainer, Modal, Table, FormInput, Search,
} from 'shared/components';

const saveText = __('Apply');
const savingText = __('Applying');
let savedText = __('Applied');
const searchInputStyle = {
  marginRight: '12px',
};

const sizeOptions = [
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

function getDataListKeys(id) {
  let ret = {
    pageDataKey: 'page',
    listDataKey: 'list',
    selectedListKey: 'selectedList',
    id: '',
  };

  if (id) {
    ret = {
      pageDataKey: `${id}Page`,
      listDataKey: `${id}List`,
      selectedListKey: `selected${utils.toCamel(id)}List`,
      id,
    };
  }

  return ret;
}

const propTypes = {
  // 组件通用选项
  fetchUrl: PropTypes.string,
  saveUrl: PropTypes.string,
  listTitle: PropTypes.string,

  // 用于配置，用于获取列表显示数据
  id: PropTypes.string,

  // AppScreen 组件的加载状态
  loading: PropTypes.bool,

  // 用于配置 list表格主键，用于Ajax保存
  listKey: PropTypes.string,
  defaultListItem: PropTypes.object,
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
  paginationType: PropTypes.oneOf([
    // 不对分页对象做处理,直接使用传入的分页对象
    'default',

    // 无分页
    'none',

    // 自动计算分页对象
    'auto',
  ]),
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
  activeListItemByIndex: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateCurListItem: PropTypes.func,
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
  paginationType: 'default',
  addable: true,
  editable: true,
  deleteable: true,
  onAfterSync: utils.noop,
  defaultListItem: {},
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
    this.state = {
      listKeyMap: getDataListKeys(props.id),
    };
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
    if (this.props.id !== nextProps.id) {
      this.setState({
        listKeyMap: getDataListKeys(nextProps.id),
      });
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
  onPageChange(i) {
    let needRefresh = true;

    if (this.props.paginationType === 'auto') {
      needRefresh = false;
    }
    this.onChangeQuery({
      page: i,
    }, needRefresh);
  }
  onChangeTableSize(data) {
    let needRefresh = true;

    // 自动计算分页不需要更新数据
    if (this.props.paginationType === 'auto') {
      needRefresh = false;
    }

    this.onChangeQuery({
      size: data.value,
      page: 1,
    }, needRefresh);
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
        this.props.onListAction({
          customData: {
            listId: this.props.id,
          },
        })
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
    const { selectedListKey, listDataKey } = this.state.listKeyMap;
    const $$list = store.getIn(['data', listDataKey]);
    const $$actionQuery = store.getIn(['actionQuery']);
    const listKey = option.actionKey || this.props.listKey;
    let actionName = option.actionName;
    let selectNumber = 0;
    let msgText = '';
    let $$selectedList = $$actionQuery.get(selectedListKey);


    const doSelectedItemsAction = () => {
      this.props.changeScreenActionQuery({
        action: actionName,
        [selectedListKey]: $$selectedList,
      });
      this.props.onListAction({
        customData: {
          listId: this.props.id,
        },
      })
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
      }).filterNot($$item => !$$item);
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
    } else if (actionName === 'setting') {
      actionName = 'edit';
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
        this.props.updateCurListItem($$curData.toJS());
        needMerge = true;
      }
      this.props.onListAction({
        needMerge,
        customData: {
          listId: this.props.id,
        },
      })
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
    const confirmText = __('Are you sure to %s the selected row %s?', __(actionName), (index + 1));
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

          if (json && json.state) {
            if (json.state.code <= 6000) {
              this.props.closeListItemModal();
            }
          }

          this.props.onAfterSync(json);
        });
      // 无文件提交
    } else {
      this.props.onListAction({
        customData: {
          listId: this.props.id,
        },
      })
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
    let actionColumnIndex = -1;
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
        actionColumnIndex = this.listTableOptions.findIndex($$column => $$column.get('id') === '__actions__');

        this.listTableOptions = this.listTableOptions.setIn([actionColumnIndex, 'render'],
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
                        this.props.activeListItemByIndex(
                          {
                            val: index,
                          },
                          this.state.listKeyMap,
                        );
                      }}
                    />
                  ) : null
                }
                {
                  deleteableResult ? (
                    <Popconfirm
                      title={__('Are you sure to %s the selected row %s?', __('delete'), (index + 1))}
                      onOk={
                        () => {
                          this.handleItemAction({
                            actionName: 'delete',
                            index,
                          });
                        }
                      }
                    >
                      <Button
                        icon="trash"
                        text={__('Delete')}
                        size="sm"
                      />
                    </Popconfirm>
                  ) : null
                }
                {
                  btnList ? btnList.map(($$btnItem) => {
                    const actionName = $$btnItem.get('actionName') || $$btnItem.get('actionType');
                    const needconfirm = $$btnItem.get('needConfirm');
                    let hiddenResult = $$btnItem.get('isHidden');
                    let onClickFunc = () => {
                      this.handleItemAction(
                        $$btnItem.set('index', index).set('needconfirm', false).toJS(),
                      );
                    };
                    let actionNode = null;

                    if (utils.isFunc(hiddenResult)) {
                      hiddenResult = hiddenResult($$item, index);
                    }

                    if (utils.isFunc($$btnItem.get('onClick'))) {
                      onClickFunc = $$btnItem.get('onClick');
                    }

                    if (needconfirm) {
                      actionNode = (
                        <Popconfirm
                          title={__('Are you sure to %s the selected row %s?', __($$btnItem.get('text') || actionName), (index + 1))}
                          onOk={onClickFunc}
                        >
                          <Button
                            key={`${$$btnItem.get('name')}Btn`}
                            icon={$$btnItem.get('icon')}
                            text={$$btnItem.get('text')}
                            size="sm"
                          />
                        </Popconfirm>
                      );
                    } else {
                      actionNode = (
                        <Button
                          key={`${$$btnItem.get('name')}Btn`}
                          icon={$$btnItem.get('icon')}
                          text={$$btnItem.get('text')}
                          size="sm"
                          onClick={onClickFunc}
                        />
                      );
                    }

                    return hiddenResult ? null : actionNode;
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

      // 只有在
      if (!this.listTableOptions.getIn([actionColumnIndex, 'width']) && btnsNum !== 'auto' && btnsNum > 0) {
        this.listTableOptions = this.listTableOptions.setIn([actionColumnIndex, 'width'], btnsNum * 80);
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
    const $$curList = store.getIn(['data', 'list']) || List([]);
    const query = store.getIn(['query']);
    const leftChildrenNode = [];
    const totalListItem = store.getIn(['data', 'page', 'total']) || $$curList.size;
    const rightChildrenNode = null;
    const $$selectedList = store.getIn(['actionQuery', this.state.listKeyMap.selectedListKey]);
    const selectNumber = $$selectedList ? $$selectedList.size : 0;
    let deleteconfirmText = __('Please select %s rows', __('delete'));
    let confirmType = 'message';
    let $$curActionBarButtons = actionBarButtons;

    if (selectNumber > 0) {
      deleteconfirmText = __('Are you sure to %s selected %s rows?', __('delete'), selectNumber);
      confirmType = 'confirm';
    }

    // 处理列表操作相关按钮
    if (actionable) {
      // 初始化添加按钮
      if (addable) {
        leftChildrenNode.push(
          totalListItem < parseInt(maxListSize, 10) ? (
            <Button
              icon="plus"
              key="addBtn"
              theme="primary"
              text={__('Add')}
              onClick={() => {
                this.props.addListItem(
                  this.props.defaultListItem,
                  this.state.listKeyMap,
                );
              }}
            />
          ) : (
            <Popconfirm
              title={__('Max list size is %s', maxListSize)}
              key="addItem"
              type="message"
            >
              <Button
                icon="plus"
                key="addBtn"
                theme="primary"
                text={__('Add')}
              />
            </Popconfirm>
          ),
        );
      }
      // 只有在列表是可选择情况下，添加多行操作按钮
      if (selectable) {
        // 多行删除
        if (deleteable) {
          leftChildrenNode.push(
            <Popconfirm
              title={deleteconfirmText}
              key="delteAll"
              type={confirmType}
              onOk={() => {
                this.onSelectedItemsAction({
                  actionName: 'delete',
                });
              }}
            >
              <Button
                icon="trash-o"
                key="delete"
                text={__('Delete')}
              />
            </Popconfirm>,
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
                const butProps = $$subButton.remove('needConfirm').toJS();
                const actionName = $$subButton.get('actionName');
                const actionText = $$subButton.get('text') || actionName;
                let onClickFuc = () => {
                  this.onSelectedItemsAction(butProps);
                };
                let popType = 'confirm';
                let confirmText = '';
                let retNode = null;
                if (selectNumber < 1) {
                  confirmText = __('Please select %s rows', __(actionText));
                  popType = 'message';
                } else if ($$subButton.get('needConfirm')) {
                  confirmText = __('Are you sure to %s selected %s rows?', __(actionText), selectNumber);
                }

                if (typeof $$subButton.get('onClick') === 'function') {
                  onClickFuc = $$subButton.get('onClick');
                }

                if (confirmText) {
                  retNode = (
                    <Popconfirm
                      title={confirmText}
                      type={popType}
                      key={`${actionName}Confirm`}
                      onOk={onClickFuc}
                    >
                      <Button
                        {...butProps}
                        key={`${actionName}Btn`}
                        onClick={utils.noop}
                      />
                    </Popconfirm>
                  );
                } else {
                  retNode = (
                    <Button
                      {...butProps}
                      key={`${actionName}Btn`}
                      onClick={onClickFuc}
                    />
                  );
                }

                return retNode;
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
      editFormLayout, editFormOption, saveUrl, id,
    } = this.props;
    const editData = store.getIn(['curListItem']);
    const actionQuery = store.getIn(['actionQuery']);
    const actionType = actionQuery.get('action');
    let isEditModelshow = false;
    const syncCode = app.getIn(['state', 'code']);
    const isCurList = !!store.getIn(['curListKeys', 'id']) === !!id;

    // 判断是否显示修改或添加 model
    if (actionType === 'edit' || actionType === 'add' || (!!modalChildren && actionType)) {
      isEditModelshow = true;

      if (syncCode >= 6000) {
        savedText = __('Unapply');
      }
    }
    return (
      !customModal ? (
        <Modal
          id={`AppScreenListModal${id}`}
          isShow={isCurList && isEditModelshow}
          title={actionQuery.get('myTitle')}
          onClose={this.onCloseEditModal}
          onExited={(1)}
          size={modalSize}
          noFooter
          draggable
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
                onChangeData={this.props.updateCurListItem}
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
      store, listTitle, selectable, customTable, paginationType,
    } = this.props;
    const { pageDataKey, listDataKey } = this.state.listKeyMap;
    const query = store.getIn(['query']);
    const page = store.getIn(['data', pageDataKey]);
    const list = store.getIn(['data', listDataKey]);
    let currPagination = null;

    if (paginationType === 'default') {
      currPagination = page;
    }

    return (
      <div
        className="t-list-info"
      >
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
              page={currPagination}
              onPageChange={this.onPageChange}
              pageQuery={query.toJS()}
              onPageSizeChange={this.onChangeTableSize}
              sizeOptions={sizeOptions}
              paginationType={paginationType}

              // 必须要父级 AppScreen 已处理加载状态后
              // 且 AppScreen 不是加载中，
              // 用于 相应 列表中单元素的操作事件,显示数据交互过程
              loading={this.props.loading === false && store.get('fetching')}
              selectable={selectable}
              onRowSelect={(data) => {
                this.props.selectListItem(data, this.state.listKeyMap);
              }}
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

