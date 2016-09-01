import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  Table, Select, Search, Button, Modal, FormGroup,
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
  title: PropTypes.string,
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  defaultEditData: PropTypes.object,
  defaultQueryData: PropTypes.object,
  defaultSettingsData: PropTypes.object,
  tableOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  queryFormOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  editFormOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  searchable: PropTypes.bool,
  selectable: PropTypes.bool,

  changeListQuery: PropTypes.func,
  fetchList: PropTypes.func,
  leaveListScreen: PropTypes.func,
  addListItem: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  reportValidError: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateEditListItem: PropTypes.func,
  changeListActionQuery: PropTypes.func,
  onListAction: PropTypes.func,
  validateAll: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  initList: PropTypes.func,
  selectListItem: PropTypes.func,

  children: PropTypes.node,
  actionBarChildren: PropTypes.node,

  addable: PropTypes.bool,
  editable: PropTypes.bool,
  deleteable: PropTypes.bool,
  actionable: PropTypes.bool,
  noTitle: PropTypes.bool,
  autoEditModel: PropTypes.bool,
};
const defaultProps = {
  actionable: false,
  addable: true,
  editable: true,
  deleteable: true,
};

// 原生的 react 页面
class ListInfo extends React.Component {
  constructor(props) {
    const initOption = {
      listId: props.route.id,
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

    this.props.initList(initOption);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.binds('handleChangeQuery', 'onPageChange', 'onSave', 'onCloseEditModal',
        'onChangeSearchText', 'onChangeType', 'onChangeTableSize', 'removeSelectItems');
  }

  componentWillMount() {
    const { actionable, editable, deleteable, tableOptions } = this.props;

    // 初始配置，添加操作项
    if (actionable && (editable || deleteable) && tableOptions) {
      this.ListTableOptions = tableOptions.push(Map({
        id: 'actions',
        text: _('Actions'),
        width: '180',
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
          </div>
        ),
      }));
    } else {
      this.ListTableOptions = tableOptions;
    }

    if (this.props.fetchList) {
      this.props.fetchList(this.listId);
    }
  }
  componentWillUpdate(nextProps) {
    this.formUrl = nextProps.route.formUrl;
  }
  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt') &&
        this.props.fetchList) {
      this.fetchList();
    }
  }
  componentWillUnmount() {
    if (this.props.leaveListScreen) {
      this.props.leaveListScreen();
    }
  }
  onChangeSearchText(val) {
    this.handleChangeQuery({
      search: val,
    }, true);
  }
  onChangeType(data) {
    this.handleChangeQuery({
      type: data.value,
    }, true);
  }
  onChangeTableSize(data) {
    this.handleChangeQuery({
      size: data.value,
      page: 1,
    }, true);
  }
  onSave() {
    if (this.props.validateAll) {
      this.props.validateAll()
        .then((errMsg) => {
          if (errMsg.isEmpty()) {
            this.props.onListAction();
          }
        });
    }
  }
  onCloseEditModal() {
    this.props.closeListItemModal();
    this.props.resetVaildateMsg();
  }

  onPageChange(i) {
    this.handleChangeQuery({
      page: i,
    }, true);
  }
  onRemoveItem(i) {
    this.props.changeListActionQuery({
      action: 'remove',
      index: i,
    });
    this.props.onListAction();
  }
  fetchList() {
    if (this.props.fetchList) {
      this.props.fetchList();
    }
  }
  binds(...methods) {
    methods.forEach((method) => {
      if (typeof this[method] === 'function') {
        this[method] = this[method].bind(this);
      }
    });
  }

  handleChangeQuery(data, needRefresh) {
    if (this.props.changeListQuery) {
      this.props.changeListQuery(data);
    }

    if (needRefresh && this.props.fetchList) {
      this.props.fetchList();
    }
  }
  removeSelectItems() {

  }

  render() {
    const {
      store, route, searchable, actionBarChildren,
      addable, editFormOptions, actionable, noTitle, app, editable,
      defaultEditData, selectable, title, deleteable, queryFormOptions,
    } = this.props;
    const myListId = store.get('curListId');
    const page = store.getIn([myListId, 'data', 'page']);
    const list = store.getIn([myListId, 'data', 'list']);
    const editData = store.getIn([myListId, 'data', 'edit']);
    const query = store.getIn([myListId, 'query']);
    const actionQuery = store.getIn([myListId, 'query']);
    const saveUrl = route.saveUrl || route.formUrl;
    const fetchUrl = route.fetchUrl || route.formUrl;
    let pageSelectClassName = 'fr';
    let actionBarClassNames = 'm-action-bar clearfix';

    if (!actionable && !actionBarChildren) {
      actionBarClassNames = `${actionBarClassNames} none`;
    }

    // 数据未初始化不渲染
    if (myListId === 'base') {
      return null;
    }

    if (!searchable && !queryFormOptions && !actionBarChildren &&
        (actionable && !addable)) {
      pageSelectClassName = 'fl';
    }

    return (
      <div className="t-list-info">
        {
          noTitle ? null : (
            <h2 className="t-list-info__title">{title || route.text}</h2>
          )
        }
        <FormContainer
          action={fetchUrl}
          method="GET"
          layout="flow"
          data={query}
          options={queryFormOptions}
          isSaving={app.get('fetching')}
          invalidMsg={app.get('invalid')}
          validateAt={app.get('validateAt')}
          onSave={this.onSave}
          onChangeData={this.props.changeListQuery}
          onValidError={this.props.reportValidError}
          leftChildren={[
            actionable && addable ? (
              <Button
                icon="plus"
                theme="primary"
                text={_('Add')}
                onClick={() => {
                  this.props.addListItem(defaultEditData);
                }}
              />
            ) : null,
            searchable ? (
              <Search
                value={query.get('text')}
                onChange={this.onChangeSearchText}
                onSearch={this.handleSearch}
              />
            ) : null,
            actionable && selectable && deleteable ? (
              <Button
                icon="trash-o"
                text={_('Remove Selected')}
                onClick={() => {
                  this.removeSelectItems();
                }}
              />
            ) : null,
            actionBarChildren,
          ]}
          rightChildren={
              page ? (
                <FormGroup className="fr">
                  <Select
                    className={pageSelectClassName}
                    value={query.get('size')}
                    onChange={this.onChangeTableSize}
                    options={selectOptions}
                    searchable={false}
                    clearable={false}
                  />
                </FormGroup>
            ) : null
          }
        />
        {
          this.ListTableOptions ? (
            <Table
              className="table"
              options={this.ListTableOptions}
              list={list}
              page={page}
              onPageChange={this.onPageChange}
              loading={app.get('fetching')}
              selectable={selectable}
              onSelectRow={this.props.selectListItem}
            />
          ) : null
        }
        {
          editFormOptions ? (
            <Modal
              isShow={!editData.isEmpty()}
              title={editData.get('myTitle')}
              onOk={this.onSave}
              onClose={this.onCloseEditModal}
              noFooter
            >
              <FormContainer
                action={saveUrl}
                isSaving={app.get('saving')}
                data={editData}
                actionQuery={actionQuery}
                invalidMsg={app.get('invalid')}
                validateAt={app.get('validateAt')}
                options={editFormOptions}
                onSave={this.onSave}
                onChangeData={this.props.updateEditListItem}
                onValidError={this.props.reportValidError}
                hasSaveButton
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

