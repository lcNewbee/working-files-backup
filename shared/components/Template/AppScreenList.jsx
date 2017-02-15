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
  editable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),
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
  onBeforeAction: PropTypes.func,
  onBeforeSave: PropTypes.func,
  onAfterSync: PropTypes.func.isRequired,

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
};

// 原生的 react 页面
class AppScreenList extends React.Component {
  constructor(props) {
    super(props);
    this.selectedList = [];
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    utils.binds(this, [
      'initListTableOptions',
      'doItemAction',
      'doSaveEditForm',
      'onChangeQuery',
      'onFetchList',
      'onPageChange',
      'onSaveEditForm',
      'onCloseEditModal',
      'onChangeSearchText',
      'onChangeType',
      'onChangeTableSize',
      'onRemoveSelectItems',
      'onItemAction',
      'onSelectedItemsAction',
      'initModalFormOptions',
    ]);
  }
  componentWillMount() {
    this.initListTableOptions(this.props);
    this.initModalFormOptions(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.tableOptions !== nextProps.tableOptions) {
      this.initListTableOptions(nextProps);
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
      selectStr = $$actionQuery.get('selectedList').sort().map(val => val + 1).join(', ');
      msgText = _('Are you sure to %s selected rows: %s', _(actionName), selectStr);

      if (needConfirm) {
        this.props.createModal({
          id: 'settings',
          role: 'confirm',
          text: msgText,
          apply: () => {
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
          },
        });
      } else {
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
      }
    } else {
      if (actionName === 'setting') {
        actionName = 'edit';
      }
      this.props.createModal({
        role: 'alert',
        text: _('Please select %s rows', _(actionName)),
      });
    }
  }
  onItemAction(option, index, $$data) {
    const actionName = option.actionName || option.actionType;
    const { onBeforeAction } = this.props;
    const needConfirm = option.needConfirm;
    const store = this.props.store;
    const list = store.getIn(['data', 'list']);
    const listKey = option.actionKey || this.props.listKey;
    const $$actionItem = list.get(index);
    const confirmText = _('Are you sure to %s selected: %s', _(actionName), (index + 1));
    let selectedList = [];
    let $$actionQuery = Map({
      action: actionName,
    });
    let cancelMsg = '';
    let onBeforeActionResult;

    if (listKey === 'allKeys') {
      $$actionQuery = $$actionQuery.merge($$actionItem);
      selectedList = [list.get(index)];
    } else {
      $$actionQuery = $$actionQuery.set(
        listKey,
        $$actionItem.get(listKey),
      );
      selectedList = [list.getIn([index, listKey])];
    }

    if ($$data) {
      $$actionQuery = $$actionQuery.merge($$data);
    }

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
          msg => this.doItemAction($$actionQuery, {
            cancelMsg: msg,
            confirmText,
            needConfirm,
          }),
        );

    // 同步处理
    } else {
      if (onBeforeActionResult) {
        cancelMsg = onBeforeActionResult;
      }
      this.doItemAction($$actionQuery, {
        cancelMsg,
        needConfirm,
        confirmText,
      });
    }
  }
  doItemAction($$actionQuery, option) {
    const { cancelMsg, needConfirm, confirmText } = option;
    const modalId = 'listAction';

    if (cancelMsg) {
      this.props.createModal({
        id: modalId,
        role: 'alert',
        text: cancelMsg,
      });
    } else if (needConfirm) {
      this.props.createModal({
        id: modalId,
        role: 'confirm',
        text: confirmText,
        apply: () => {
          if ($$actionQuery) {
            this.props.changeScreenActionQuery(
              $$actionQuery.toJS(),
            );
          }
          this.props.onListAction()
            .then(
              (json) => {
                this.props.onAfterSync(json);
              },
            );
        },
      });
    } else {
      if ($$actionQuery) {
        this.props.changeScreenActionQuery(
          $$actionQuery.toJS(),
        );
      }
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
    } else if (this.props.validateAll) {
      this.props.validateAll(this.props.editFormId)
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            // 表单中无文件
            if (!hasFile) {
              this.props.onListAction()
                .then(
                  (json) => {
                    this.props.onAfterSync(json);
                  },
                );
            } else {
              this.props.saveFile(formUrl, formElem)
                .then((json) => {
                  this.props.fetchScreenData({
                    url: formUrl,
                  });
                  this.props.closeListItemModal();
                  this.props.onAfterSync(json);
                });
            }
          }
        });
    }
  }
  initListTableOptions(props) {
    const { actionable, editable, deleteable, tableOptions } = props;
    let actionsOption = null;
    let btnsNum = 0;
    let btnList = List([]);
    let transformFunc = null;
    let hasTransformFunc = false;

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
        transformFunc = actionsOption.get('transform');
        hasTransformFunc = utils.isFunc(transformFunc);

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
            text: _('Actions'),
          }));
        }
        this.listTableOptions = this.listTableOptions.setIn([-1, 'transform'],
          (val, $$item, index) => {
            let editableResult = editable;
            let deleteableResult = deleteable;

            if (utils.isFunc(editable)) {
              editableResult = editable($$item, index);
            }

            if (utils.isFunc(deleteable)) {
              deleteableResult = deleteable($$item, index);
            }

            if (hasTransformFunc) {
              btnsNum = 'auto';
            }

            return (
              <div className="action-btns">
                {
                  editableResult ? (
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
                  deleteableResult ? (
                    <Button
                      icon="trash"
                      text={_('Delete')}
                      size="sm"
                      onClick={() => {
                        this.onItemAction({
                          actionName: 'delete',
                          needConfirm: true,
                        }, index);
                      }}
                    />
                    ) : null
                  }
                {
                  btnList ? btnList.map(($$btnItem) => {
                    let hiddenResult = $$btnItem.get('isHidden');
                    let onClickFunc = () => {
                      this.onItemAction(
                        $$btnItem.toJS(),
                        index,
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
                  hasTransformFunc ? transformFunc(val, $$item, index) : null
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
                disabled={!actionable}
                checked={parseInt(val, 10) === 1}
                onChange={(data) => {
                  this.onItemAction(
                    $$item.toJS(),
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
      selectable, deleteable, searchable, addable, actionable,
      defaultEditData, editFormId, queryFormOptions, actionBarButtons,
      actionBarChildren,
    } = this.props;
    const page = store.getIn(['data', 'page']);
    const query = store.getIn(['query']);
    const leftChildrenNode = [];
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
            text={_('Add')}
            onClick={() => {
              this.props.addListItem(defaultEditData);
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
              text={_('Delete')}
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
          value={query.get('text')}
          key="searchInput"
          maxLength="265"
          onChange={this.onChangeSearchText}
          onSearch={this.handleSearch}
          style={{
            marginRight: '12px',
          }}
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
          {_('View')}
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

    // 判断是否显示修改或添加 model
    if (actionType === 'edit' || actionType === 'add' || !!modalChildren) {
      isEditModelshow = true;
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
              loading={store.get('fetching')}
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

