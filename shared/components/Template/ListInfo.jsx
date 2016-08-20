import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  Table, Select, Search, Switchs, Button, FormGroup, Modal,
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
  defaultItem: PropTypes.object,
  defaultEditData: PropTypes.object,

  tableOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  typeOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  editFormOptions: PropTypes.oneOfType([
    PropTypes.instanceOf(List), PropTypes.array,
  ]),
  hasSearch: PropTypes.bool,

  changeListQuery: PropTypes.func,
  fetchList: PropTypes.func,
  leaveListScreen: PropTypes.func,
  addListItem: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  closeListItemModal: PropTypes.func,
  updateEditListItem: PropTypes.func,
  changeListActionQuery: PropTypes.func,
  onListAction: PropTypes.func,
  initList: PropTypes.func,

  children: PropTypes.node,
  actionBarChildren: PropTypes.node,

  addAbled: PropTypes.bool,
  editAbled: PropTypes.bool,
  deleteAbled: PropTypes.bool,
  controlAbled: PropTypes.bool,
  noTitle: PropTypes.bool,
  autoEditModel: PropTypes.bool,
};
const defaultProps = {
  controlAbled: false,
  addAbled: true,
  editAbled: true,
  deleteAbled: true,
};

// 原生的 react 页面
class ListInfo extends React.Component {
  constructor(props) {
    super(props);
    this.defaultFormData = {};

    this.props.initList({
      formUrl: this.props.route.formUrl,
      listId: props.route.id,
      defaultEditData: props.defaultEditData,
    });
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.binds('handleChangeQuery', 'onPageChange', 'onSave',
        'onChangeSearchText', 'onChangeType', 'onChangeTableSize');
  }

  componentWillMount() {
    const { controlAbled, editAbled, deleteAbled, tableOptions } = this.props;

    // 初始配置，添加操作项
    if (controlAbled && (editAbled || deleteAbled)) {
      this.ListTableOptions = tableOptions.push(Map({
        id: 'actions',
        text: _('Actions'),
        width: '180',
        transform: (val, item, index) => (
          <div className="action-btns">
            {
              editAbled ? (
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
              deleteAbled ? (
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

    // 初始化默认值对象
    tableOptions.forEach((item) => {
      const defaultVal = item.get('defaultValue');
      if (defaultVal) {
        this.defaultFormData[item.get('id')] = defaultVal;
      }
    });

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

  render() {
    const {
      typeOptions, store, route, hasSearch, actionBarChildren,
      addAbled, editFormOptions, controlAbled, noTitle,
    } = this.props;
    const { defaultFormData } = this;
    const myListId = store.get('curListId');
    const page = store.getIn([myListId, 'data', 'page']);
    const list = store.getIn([myListId, 'data', 'list']);
    const editData = store.getIn([myListId, 'data', 'edit']);
    const query = store.getIn([myListId, 'query']);
    let pageSelectClassName = 'fr';

    // 数据未初始化不渲染
    if (myListId === 'base') {
      return null;
    }

    if (!hasSearch && !typeOptions && !actionBarChildren &&
        (controlAbled && !addAbled)) {
      pageSelectClassName = 'fl';
    }

    return (
      <div className="t-list-info">
        {
          noTitle ? null : (
            <h2 className="t-list-info__title">{route.text}</h2>
          )
        }
        <div className="m-action-bar clearfix">
          {
            hasSearch ? (
              <Search
                value={query.get('text')}
                onChange={this.onChangeSearchText}
                onSearch={this.handleSearch}
                placeholder={_('IP or MAC Address')}
              />
            ) : null
          }

          {
            typeOptions ? (
              <Switchs
                value={query.get('type')}
                options={typeOptions}
                onChange={this.onChangeType}
              />
            ) : null
          }

          {
            controlAbled && addAbled ? (
              <Button
                icon="plus"
                theme="primary"
                text={_('Add')}
                onClick={() => {
                  this.props.addListItem(defaultFormData);
                }}
              />
            ) : null
          }
          {
            actionBarChildren
          }
          {
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

        </div>

        <Table
          className="table"
          options={this.ListTableOptions}
          list={list}
          page={page}
          onPageChange={this.onPageChange}
          loading={store.get('fetching')}
        />
        {
          editFormOptions ? (
            <Modal
              isShow={!editData.isEmpty()}
              title={editData.get('myTitle')}
              onOk={() => this.onSave()}
              onClose={
                () => this.props.closeListItemModal(route.id)
              }
            >
              {
                editFormOptions.map((item) => {
                  const myProps = item.toJS();
                  const id = myProps.id;

                  return (
                    <FormGroup
                      {...myProps}
                      key={id}
                      value={editData.get(id)}
                      onChange={
                        (data) => {
                          const upDate = {};
                          upDate[id] = data.value;
                          this.props.updateEditListItem(upDate);
                        }
                      }
                    />
                  );
                })
              }
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

