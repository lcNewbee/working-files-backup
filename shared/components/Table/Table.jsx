import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, List } from 'immutable';
import PureComponent from '../Base/PureComponent';
import utils from '../../utils';
import Pagination from '../Pagination';
import Row from './Row';
import Loading from '../Loading';

const THEAD_INDEX = -1;

const defaultSizeOptions = [
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
];

function getPageObject($$list, pageQuery) {
  const ret = {};
  const page = {};
  const starIndex = ((pageQuery.page - 1) * pageQuery.size);
  let endIndex = pageQuery.page * pageQuery.size;
  let $$newList = $$list;

  page.total = $$list.size;

  // 总数大于每页显示条数
  if ($$list.size > pageQuery.size) {
    if (endIndex > $$list.size) {
      endIndex = $$list.size;
    }
    $$newList = $$list.slice(
      starIndex,
      endIndex,
    );

    page.currPage = pageQuery.page < 1 ? 1 : pageQuery.page;
    page.totalPage = parseInt($$list.size / pageQuery.size, 10);

    if ($$list.size % pageQuery.size > 0) {
      page.totalPage += 1;
    }
  }

  ret.page = page;
  ret.$$newList = $$newList;

  return ret;
}

const propTypes = {
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  page: PropTypes.object,
  paginationType: PropTypes.oneOf([
    // 无分页
    'none',

    // 不对分页对象做处理
    'default',

    // 自动计算分页对象
    'auto',
  ]),
  pageQuery: PropTypes.shape({
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  sizeOptions: PropTypes.array,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  selectable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),
  onRowSelect: PropTypes.func,
  onRowClick: PropTypes.func,
};

const defaultProps = {
  isTh: false,
  paginationType: 'default',
  sizeOptions: defaultSizeOptions,
  pageQuery: {},
  list: fromJS([]),
};

class Table extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onRowSelect',
      'onRowClick',
      'initList',
      'onTheadRowClick',
      'transformOptions',
      'sortRowsById',
    ]);
    this.state = {
      myList: fromJS([]),
    };
    this.sortCalc = 1;
  }

  componentWillMount() {
    this.transformOptions(this.props.options);
    this.initList(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      this.initList(nextProps);
    }
    if (nextProps.options !== this.props.options) {
      this.transformOptions(nextProps.options);
    }
  }

  onRowSelect(data) {
    const actionData = data;
    if (this.props.onRowSelect) {
      actionData.unselectableList = this.unselectableList;
      this.props.onRowSelect(actionData);
    }
  }
  onRowClick(e, i) {
    if (this.props.onRowClick) {
      this.props.onRowClick(e, i);
    }
  }
  onTheadRowClick(e) {
    const option = this.$$options.find(
      item => `${item.get('id')}SortIcon` === e.target.id,
    );
    if (option && option.get('sortable')) {
      this.sortRowsById(option.get('id'));
    }
  }
  initList(props) {
    let $$tmpList = List.isList(props.list) ? props.list : fromJS(props.list);

    if ($$tmpList) {
      $$tmpList = $$tmpList.filterNot(
        item => !item,
      );
    } else {
      $$tmpList = fromJS([]);
    }

    this.setState({
      myList: $$tmpList,
    });
  }
  transformOptions($$options) {
    let $$retOptions = $$options;

    if (!List.isList($$retOptions)) {
      $$retOptions = fromJS($$retOptions);
    }

    this.$$options = $$retOptions.map((item) => {
      let ret = item;
      const filterStr = item.get('filter');

      if (filterStr) {
        ret = item.set('filterObj', utils.filter(filterStr));
      }
      return ret;
    });
  }

  sortRowsById(id) {
    let sortFun = (a, b) => { // 默认的排序函数
      if (a > b) return 1;
      else if (a < b) return -1;
      return 0;
    };
    const option = this.$$options.find((item) => { // 找到id对应的option
      if (item.get('id') === id) return true;
      return false;
    });
    if (option && typeof (option.get) === 'function' && option.has('sortFun')) {
      sortFun = option.get('sortFun');
    }
    let list = this.state.myList;
    if (typeof (sortFun) === 'function') {
      list = list.sortBy(
        item => item.get(id),
        (a, b) => sortFun(a, b) * this.sortCalc,
      );
      this.sortCalc *= -1;
    }
    this.setState({
      myList: list,
    });
  }

  renderBodyRow(myList) {
    const { selectable } = this.props;
    let ret = null;

    this.selectedList = [];
    this.unselectableList = [];
    if (myList && myList.size > 0) {
      ret = myList.map((item, i) => {
        const isSelected = item && !!item.get('__selected__');
        let curSelectable = selectable;

        if (isSelected) {
          this.selectedList.push(i);
        }

        if (utils.isFunc(selectable)) {
          curSelectable = selectable(item, i);
        }

        // 不可选择的项
        if (!curSelectable) {
          this.unselectableList.push(i);
        }

        return (
          <Row
            key={`tableRow${i}`}
            options={this.$$options}
            item={item}
            index={i}
            selectable={selectable}
            curSelectable={curSelectable}
            selected={curSelectable && isSelected}
            onSelect={this.onRowSelect}
            onClick={e => this.onRowClick(e, i)}
          />
        );
      });
    } else {
      ret = (
        <tr>
          <td
            colSpan={this.$$options.size + (selectable ? 1 : 0)}
            className="empty"
          >
            {__('No Data')}
          </td>
        </tr>
      );
    }

    return ret;
  }

  render() {
    const {
      className, page, loading, selectable, onRowClick, paginationType,
      pageQuery, sizeOptions,
    } = this.props;
    let mySizeOptions = sizeOptions;
    let unselectableLen = 0;
    let newPageObject = {
      page,
    };
    let $$myList = this.state.myList;
    let myBodyChildren = null;
    let myPagination = page;
    let myTableClassName = 'table';
    let isSelectAll = false;

    if (onRowClick) {
      myTableClassName = `${myTableClassName} table--pionter`;
    }

    if (className) {
      myTableClassName = `${myTableClassName} ${className}`;
    }

    // 需要自己计算计算，分页相关
    if (paginationType === 'auto') {
      newPageObject = getPageObject($$myList, pageQuery);
      myPagination = newPageObject.page;
      $$myList = newPageObject.$$newList;

    // 如果是默认,但没有分页对象
    } else if (paginationType === 'default' && !page) {
      myPagination = {
        total: $$myList.size,
      };
      mySizeOptions = null;
    }

    myBodyChildren = this.renderBodyRow($$myList);
    unselectableLen = this.unselectableList.length;

    if ($$myList && $$myList.size > 0 && this.selectedList.length > 0 &&
        ((this.selectedList.length + unselectableLen) === $$myList.size)) {
      isSelectAll = true;
    }

    return (
      <div className="table-wrap">
        <table className={myTableClassName}>
          <thead>
            <Row
              options={this.$$options}
              selectable={selectable}
              selected={isSelectAll}
              index={THEAD_INDEX}
              onSelect={this.onRowSelect}
              onClick={this.onTheadRowClick}
              curSelectable
              isTh
            />
          </thead>
          <tbody>
            { myBodyChildren }
          </tbody>
        </table>
        {
          myPagination ? (
            <Pagination
              page={myPagination}
              size={pageQuery.size}
              sizeOptions={mySizeOptions}
              onPageChange={this.props.onPageChange}
              onPageSizeChange={this.props.onPageSizeChange}
            />
          ) : null
        }
        {
          loading ? (
            <div className="table-loading">
              <div className="backdrop" />
              <div className="table-loading-content">
                <Loading
                  size="sm"
                  style={{
                    marginLeft: '-44px',
                  }}
                />
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;

export default Table;
