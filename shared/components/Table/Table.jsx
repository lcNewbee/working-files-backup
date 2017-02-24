import React, { Component, PropTypes } from 'react';
import { fromJS, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from '../../utils';
import Pagination from '../Pagination';
import Icon from '../Icon';
import Row from './Row';

const THEAD_INDEX = -1;

const propTypes = {
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  page: PropTypes.object,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onPageChange: PropTypes.func,
  selectable: PropTypes.oneOfType([
    PropTypes.bool, PropTypes.func,
  ]),
  onRowSelect: PropTypes.func,
  onRowClick: PropTypes.func,
};

const defaultProps = {
  isTh: false,
  list: fromJS([]),
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
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
            {_('No Data')}
          </td>
        </tr>
      );
    }

    return ret;
  }

  render() {
    const {
      className, page, loading, selectable, onRowClick,
    } = this.props;
    const myList = this.state.myList;
    const myBodyChildren = this.renderBodyRow(myList);
    const unselectableLen = this.unselectableList.length;
    let myTableClassName = 'table';
    let isSelectAll = false;

    if (myList && myList.size > 0 &&
        ((this.selectedList.length + unselectableLen) === myList.size)) {
      isSelectAll = true;
    }

    if (onRowClick) {
      myTableClassName = `${myTableClassName} table--pionter`;
    }

    if (className) {
      myTableClassName = `${myTableClassName} ${className}`;
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
          // 只有当 总页数大于 1时 才显示分页
          (page && page.get('totalPage') > 1) ? <Pagination
            page={page}
            onPageChange={this.props.onPageChange}
          /> : null
        }

        {
          loading ? (
            <div className="table-loading">
              <div className="backdrop" />
              <div className="table-loading-content">
                <Icon name="spinner" spin />
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
