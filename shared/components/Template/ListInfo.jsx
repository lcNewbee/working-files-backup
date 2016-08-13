import React, { PropTypes } from 'react';
import { Map, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {
  Table, Select, Search, Switchs, Button,
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

  tableOptions: PropTypes.instanceOf(List),
  typeOption: PropTypes.instanceOf(List),
  hasSearch: PropTypes.bool,

  changeListQuery: PropTypes.func,
  fetchList: PropTypes.func,
  leaveListScreen: PropTypes.func,
  addListItem: PropTypes.func,
  editListItemByIndex: PropTypes.func,
  initList: PropTypes.func,

  children: PropTypes.node,
  actionBarChildren: PropTypes.node,

  addAbled: PropTypes.bool,
  editAbled: PropTypes.bool,
  deleteAbled: PropTypes.bool,
  controlAbled: PropTypes.bool,
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

    this.listId = props.route.id;
    this.props.initList({
      formUrl: this.props.route.formUrl,
      listId: props.route.id,
    });
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.binds('handleChangeQuery', 'onPageChange',
        'onChangeSearchText', 'onChangeType', 'onChangeTableSize');
  }

  componentWillMount() {
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
      tableOptions, typeOption, store, route, hasSearch, actionBarChildren,
      addAbled, editAbled, deleteAbled, controlAbled,
    } = this.props;
    const myListId = store.get('curListId');
    const page = store.getIn([myListId, 'data', 'page']);
    const list = store.getIn([myListId, 'data', 'list']);
    const query = store.getIn([myListId, 'query']);
    let myListTableOptions = tableOptions;
    let pageSelectClassName = 'fr';

    // 数据未初始化不渲染
    if (myListId === 'base') {
      return null;
    }

    if (!hasSearch && !typeOption && !actionBarChildren &&
        (controlAbled && !addAbled)) {
      pageSelectClassName = 'fl';
    }

    if (controlAbled && (editAbled || deleteAbled)) {
      myListTableOptions = tableOptions.push(Map({
        id: 'actions',
        text: _('Actions'),
        width: '180',
        transform: (val, item, index) => {
          return (
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
          );
        },
      }));
    }

    return (
      <div className="t-list-info">
        <h2 className="t-list-info__title">{route.text}</h2>
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
            typeOption ? (
              <Switchs
                value={query.get('type')}
                options={typeOption}
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
                  this.props.addListItem(this.props.defaultItem);
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
          options={myListTableOptions}
          list={list}
          page={page}
          onPageChange={this.onPageChange}
          loading={store.get('fetching')}
        />

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

