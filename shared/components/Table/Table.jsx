import React from 'react';
import PropTypes from 'prop-types';
import { fromJS, List, is } from 'immutable';
import classnams from 'classnames';
import utils from 'shared/utils';

import createStore from './createStore';
import PureComponent from '../Base/PureComponent';
import Pagination from '../Pagination';
import TableRow from './TableRow';
import TableHeader from './TableHeader';
import ProcessContainer from '../ProcessContainer';
import ColumnGroup from './ColumnGroup';
import Checkbox from '../Form/Checkbox';

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
    $$newList = $$list
      .map(($$item, index) => $$item.set('__index__', index))
      .slice(
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
  prefixClass: PropTypes.string,
  theme: PropTypes.oneOf([
    'light', '',
  ]),
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  hiddenColumns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  page: PropTypes.shape({
    total: PropTypes.number,
  }),
  scroll: PropTypes.shape({
    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  rowKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  paginationType: PropTypes.oneOf([
    // 无分页
    'none',

    // 采用传入的分页对象，不对分页对象做处理
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
  onColumnSort: PropTypes.func,
};

const defaultProps = {
  prefixClass: 'rw-table',
  theme: '',
  scroll: {},
  paginationType: 'default',
  sizeOptions: defaultSizeOptions,
  pageQuery: {},
  list: fromJS([]),
  hiddenColumns: fromJS([]),
};

class Table extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onRowSelect',
      'onRowClick',
      'refreshListData',
      'onTheadRowClick',
      'refreshColumns',
      'sortRowsById',
      'onColumnSort',
      'onColumnsConfig',
      'getTable',
      'getBodyRows',
      'handleBodyScroll',
      'handleRowHover',
      'handleWindowResize',
      'syncFixedTableRowHeight',
      'isHasFixedColumns',
    ]);
    this.state = {
      myList: fromJS([]),
      hiddenColumns: fromJS([]),
      $$fixedColumnsHeadRowsHeight: fromJS([]),
      $$fixedColumnsBodyRowsHeight: fromJS([]),
    };
    this.sortCalc = 1;
    this.store = createStore({
      fixedColumnsRowHeight: [],

    });
  }

  componentWillMount() {
    this.refreshColumns(this.props, this.state);
    this.refreshListData(this.props);
  }

  componentDidMount() {
    if (this.isHasFixedColumns()) {
      this.handleWindowResize();
      this.resizeEvent = addEventListener(
        window, 'resize', this.handleWindowResize,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.list !== this.props.list) {
      this.refreshListData(nextProps);
    }
    if (nextProps.options !== this.props.options) {
      this.refreshColumns(nextProps, this.state);
    }
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.state.hiddenColumns !== nextState.hiddenColumns) {
      this.refreshColumns(nextProps, nextState);
    }
  }

  componentDidUpdate() {
    if (this.isHasFixedColumns()) {
      this.handleWindowResize();
    }
    if (this.scrollTableElem) {
      this.setScrollPositionClassName(this.scrollTableElem);
    }
  }

  componentWillUnmount() {
    if (this.resizeEvent && this.resizeEvent.remove) {
      this.resizeEvent.remove();
    }
    clearTimeout(this.resizeTimeout);
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
  onColumnSort(dataIndex) {
    // 优先调用传入的 排序函数
    if (this.props.onColumnSort) {
      this.props.onColumnSort(dataIndex);
    } else {
      this.sortRowsById(dataIndex);
    }
  }

  onColumnsConfig(dataIndex, visible) {
    let $$newHidenColumns = this.state.hiddenColumns;
    const oldListIndex = $$newHidenColumns.findIndex(itemIndex => itemIndex === dataIndex);

    // k
    if (visible) {
      $$newHidenColumns = $$newHidenColumns.delete(oldListIndex);
    } else if (oldListIndex === -1) {
      $$newHidenColumns = $$newHidenColumns.push(dataIndex);
    }

    this.setState({
      hiddenColumns: $$newHidenColumns,
    });
  }
  getRowKey(record, index) {
    const rowKey = this.props.rowKey;
    const key = (typeof rowKey === 'function') ?
      rowKey(record, index) : record[rowKey];

    return key === undefined ? `${index}` : key;
  }
  getBodyRows(myList, $$columns, fixed) {
    const { selectable } = this.props;
    const isHasFixedColumns = this.isHasFixedColumns();
    let ret = null;

    this.selectedList = [];
    this.unselectableList = [];

    if (myList && myList.size > 0) {
      ret = myList.map(($$item, i) => {
        const isSelected = $$item && !!$$item.get('__selected__');
        const curIndex = ($$item && $$item.get('__index__')) || i;
        const key = this.getRowKey($$item.toJS(), curIndex);
        const height = (fixed && isHasFixedColumns && this.state.$$fixedColumnsBodyRowsHeight.get(i)) ?
          this.state.$$fixedColumnsBodyRowsHeight.get(i) : null;
        let curSelectable = selectable;

        if (isSelected) {
          this.selectedList.push(i);
        }

        if (utils.isFunc(selectable)) {
          curSelectable = selectable($$item, i);
        }

        // 不可选择的项
        if (!curSelectable) {
          this.unselectableList.push(i);
        }

        return (
          <TableRow
            key={key}
            hoverKey={key}
            height={height}
            curRowHoverKey={this.state.curRowHoverKey}
            onHover={this.handleRowHover}
            columns={$$columns}
            item={$$item}
            index={curIndex}
            selectable={selectable}
            curSelectable={curSelectable}
            selected={curSelectable && isSelected}
            onSelect={this.onRowSelect}
            onClick={e => this.onRowClick(e, curIndex)}
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

  getTable(options = {}) {
    const { $$myList, fixed } = options;
    const {
      className, selectable, onRowClick, scroll, prefixClass, theme,
    } = this.props;
    const isFixedHeader = (scroll && scroll.y);
    let $$columns = this.$$options;
    let headTable = null;
    let bodyTable = null;
    let myBodyChildren = null;
    let unselectableLen = 0;
    let myTableClassName = prefixClass;
    let isSelectAll = false;
    let tableBodyStyle = null;

    if (fixed) {
      $$columns = this.$$columnsGroup.get(fixed);
    }

    if (onRowClick) {
      myTableClassName = `${myTableClassName} ${prefixClass}--pionter`;
    }

    if (theme) {
      myTableClassName = `${myTableClassName} ${prefixClass}--${theme}`;
    }

    if (className) {
      myTableClassName = `${myTableClassName} ${className}`;
    }

    myBodyChildren = this.getBodyRows($$myList, $$columns, fixed);
    unselectableLen = this.unselectableList.length;

    if ($$myList && $$myList.size > 0 && this.selectedList.length > 0 &&
        ((this.selectedList.length + unselectableLen) === $$myList.size)) {
      isSelectAll = true;
    }

    // 需要处理 选择 列
    if (fixed !== 'right') {
      $$columns = $$columns.map(($$column) => {
        let ret = $$column;

        if ($$column.get('id') === '__selected__') {
          ret = $$column.set('text', (
            <Checkbox
              theme="square"
              checked={isSelectAll}
              onChange={(e) => {
                this.onRowSelect({
                  index: THEAD_INDEX,
                  selected: e.target.checked,
                });
              }}
            />
          ));
        }
        return ret;
      });
    }

    if (isFixedHeader) {
      headTable = (
        <div
          className={`${prefixClass}-header`}
          key="tableHeader"
          ref={(elem) => {
            if (!fixed) {
              this.scrollHeadTable = elem;
            }
          }}
        >
          <table className={myTableClassName} >
            <ColumnGroup
              columns={$$columns}
              selectable={selectable}
            />
            <TableHeader
              allColumns={this.props.options}
              columns={$$columns}
              selectable={selectable}
              selected={isSelectAll}
              index={THEAD_INDEX}
              onColumnSort={this.onColumnSort}
              onColumnsConfig={this.onColumnsConfig}
              curSelectable
            />
          </table>
        </div>
      );

      tableBodyStyle = {
        maxHeight: scroll.y,
        overflowY: 'scroll',
      };
    }

    bodyTable = (
      <div
        className={`${prefixClass}-body`}
        style={tableBodyStyle}
        key="tableBody"
        onScroll={this.handleBodyScroll}
        ref={(elem) => {
          if (!fixed && elem) {
            this.scrollBodyTableElem = elem;
          }
        }}
      >
        <table
          className={myTableClassName}
          ref={(elem) => {
            this.bodyTable = elem;
            if (!fixed) {
              this.scrollBodyTable = elem;
            }
          }}
        >
          <ColumnGroup
            columns={$$columns}
            selectable={selectable}
          />
          {
            isFixedHeader ? null : (
              <TableHeader
                allColumns={this.props.options}
                columns={$$columns}
                selectable={selectable}
                selected={isSelectAll}
                index={THEAD_INDEX}
                onColumnSort={this.onColumnSort}
                onColumnsConfig={this.onColumnsConfig}
                curSelectable
              />
            )
          }
          <tbody>
            { myBodyChildren }
          </tbody>
        </table>
      </div>
    );

    return [headTable, bodyTable];
  }
  setScrollPosition(position) {
    const { prefixClass } = this.props;

    this.scrollPosition = position;
    if (this.tableContainerNode) {
      utils.dom.removeClass(this.tableContainerNode, `${prefixClass}-container--scroll-position-left`);
      utils.dom.removeClass(this.tableContainerNode, `${prefixClass}-container--scroll-position-right`);
      utils.dom.removeClass(this.tableContainerNode, `${prefixClass}-container--scroll-position-middle`);
      if (position === 'both') {
        utils.dom.addClass(this.tableContainerNode, `${prefixClass}-container--scroll-position-left ${prefixClass}-container--scroll-position-right`);
      } else {
        utils.dom.addClass(this.tableContainerNode, `${prefixClass}-container--scroll-position-${position}`);
      }
    }
  }

  setScrollPositionClassName(target) {
    const node = target || this.scrollTableElem;
    const scrollToLeft = node.scrollLeft === 0;
    const scrollToRight = node.scrollLeft + 1 >=
      node.children[0].children[0].getBoundingClientRect().width -
      node.getBoundingClientRect().width;

    if (scrollToLeft && scrollToRight) {
      this.setScrollPosition('both');
    } else if (scrollToLeft) {
      this.setScrollPosition('left');
    } else if (scrollToRight) {
      this.setScrollPosition('right');
    } else if (this.scrollPosition !== 'middle') {
      this.setScrollPosition('middle');
    }
  }
  isHasFixedColumns() {
    return this.$$columnsGroup.get('scroll') && this.$$columnsGroup.size > 1;
  }
  handleWindowResize() {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() => {
      this.syncFixedTableRowHeight();
      this.setScrollPositionClassName();
    }, 150);
  }

  /**
   * 同步 位置固定的 表格的高度
   *
   * @returns
   * @memberof Table
   */
  syncFixedTableRowHeight() {
    const tableRect = this.scrollTableElem.getBoundingClientRect();

    if (tableRect.height !== undefined && tableRect.height <= 0) {
      return;
    }

    const headRows = this.headTable ?
      this.scrollHeadTable.querySelectorAll('thead') :
      this.scrollBodyTable.querySelectorAll('thead');

    const bodyRows = this.scrollBodyTable.querySelectorAll('tbody tr') || [];
    const $$fixedColumnsHeadRowsHeight = fromJS([].map.call(
      headRows, row => row.getBoundingClientRect().height || 'auto',
    ));
    const $$fixedColumnsBodyRowsHeight = fromJS([].map.call(
      bodyRows, row => row.getBoundingClientRect().height || 'auto',
    ));

    // 对比高度是否改变
    if (is(this.state.$$fixedColumnsHeadRowsHeight, $$fixedColumnsHeadRowsHeight) &&
        is(this.state.$$fixedColumnsBodyRowsHeight, $$fixedColumnsBodyRowsHeight)) {
      return;
    }
    this.setState({
      $$fixedColumnsHeadRowsHeight,
      $$fixedColumnsBodyRowsHeight,
    });
  }
  handleRowHover(isHover, hoverKey) {
    if (isHover) {
      this.setState({
        curRowHoverKey: hoverKey,
      });
    } else {
      this.setState({
        curRowHoverKey: null,
      });
    }
  }
  handleBodyScroll(e) {
    const target = e.target;

    if (target.scrollLeft !== this.lastScrollLeft) {
      this.setScrollPositionClassName(target);
    }
    this.lastScrollLeft = target.scrollLeft;
  }

  refreshListData(props) {
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

  refreshColumns(props, state) {
    const { selectable } = props;
    const $$options = props.options;
    const $$hiddenColumns = state.hiddenColumns;
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

    if (!$$hiddenColumns.isEmpty()) {
      this.$$options = this.$$options.filterNot(($$item) => {
        const colId = $$item.get('id');

        return $$hiddenColumns.find(dataIndex => dataIndex === colId);
      });
    }

    if (selectable) {
      this.$$options = this.$$options.unshift(fromJS({
        id: '__selected__',
        width: 28,
        // fixed: 'left',
        render: (val, $$item, $$colnmn) => {
          const disabled = !$$colnmn.get('curSelectable');
          const curIndex = $$colnmn.get('__index__');

          return (
            <Checkbox
              theme="square"
              checked={val || false}
              disabled={disabled}
              onChange={(e) => {
                this.onRowSelect({
                  index: curIndex,
                  selected: e.target.checked,
                });
              }}
            />
          );
        },
      }));
    }

    this.$$columnsGroup = this.$$options.groupBy($$item => ($$item.get('fixed') || 'scroll'));
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

  render() {
    const {
      page, loading, paginationType, pageQuery, sizeOptions, scroll,
      prefixClass,
    } = this.props;
    const tableContainerClassNames = classnams({
      [`${prefixClass}-container`]: true,
      [`${prefixClass}-fixed-header`]: (scroll && scroll.y),
    });
    const isTableScroll = this.isHasFixedColumns() || scroll.x || scroll.y;
    const isAnyFixedLeftColumns = this.$$columnsGroup.get('left');
    const isAnyFixedRightColumns = this.$$columnsGroup.get('right');
    let mySizeOptions = sizeOptions;
    let newPageObject = {
      page,
    };
    let $$myList = this.state.myList;
    let myPagination = page;
    let scrollTable = null;

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

    scrollTable = this.getTable({ $$myList });

    if (isTableScroll) {
      scrollTable = (
        <div
          className={`${prefixClass}-scroll`}
          onScroll={this.handleBodyScroll}
          ref={(elem) => {
            if (elem) {
              this.scrollTableElem = elem;
            }
          }}
        >
          {scrollTable}
        </div>
      );
    } else {
      this.scrollTableElem = null;
    }

    return (
      <ProcessContainer loading={loading}>
        <div
          className={tableContainerClassNames}
          ref={(elem) => {
            if (elem) {
              this.tableContainerNode = elem;
            }
          }}
        >
          { scrollTable }
          {
            isAnyFixedLeftColumns ? (
              <div className={`${prefixClass}-fixed-left`}>
                {
                  this.getTable({
                    $$myList,
                    fixed: 'left',
                  })
                }
              </div>
            ) : null
          }
          {
            isAnyFixedRightColumns ? (
              <div className={`${prefixClass}-fixed-right`}>
                {
                  this.getTable({
                    $$myList,
                    fixed: 'right',
                  })
                }
              </div>
            ) : null
          }
        </div>

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
      </ProcessContainer>
    );
  }
}

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;

export default Table;
