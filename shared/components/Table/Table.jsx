import React, { Component, PropTypes } from 'react';
import { fromJS, List } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from '../../utils';
import Pagination from '../Pagination';
import Icon from '../Icon';
import Row from './Row';

const propTypes = {
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  list: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  page: PropTypes.object,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onPageChange: PropTypes.func,
  selectable: PropTypes.bool,
  onRowSelect: PropTypes.func,
  onRowClick: PropTypes.func,
};

const defaultProps = {
  isTh: false,
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    utils.binds(this, [
      'onRowSelect',
      'onRowClick',
      'transformOptions',
    ]);
  }

  componentWillMount() {
    this.transformOptions(this.props.options);
  }
  componentWillUpdate(nextProps) {
    if (nextProps.options !== this.props.options) {
      this.transformOptions(nextProps.options);
    }
  }
  onRowSelect(data) {
    const actionData = data;
    if (this.props.onRowSelect) {
      this.props.onRowSelect(actionData);
    }
  }
  onRowClick(e, i) {
    if (this.props.onRowClick) {
      this.props.onRowClick(e, i);
    }
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

  renderBodyRow(myList) {
    const { selectable } = this.props;
    let ret = null;

    this.selectedList = [];

    if (myList && myList.size > 0) {
      ret = myList.map((item, i) => {
        if (item.get('__selected__')) {
          this.selectedList.push(i);
        }

        return (
          <Row
            key={`tableRow${i}`}
            options={this.$$options}
            item={item}
            index={i}
            selectable={selectable}
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
      className, list, page, loading, selectable,
      onRowClick,
    } = this.props;
    const myList = fromJS(list);
    const bodyRow = this.renderBodyRow(myList);
    let myTableClassName = 'table';
    let isSelectAll = false;

    if (myList && myList.size > 0 && (this.selectedList.length === myList.size)) {
      isSelectAll = true;
    }

    if (onRowClick) {
      myTableClassName = `${myTableClassName} table--pionter`;
    }

    if (className) {
      myTableClassName = `${myTableClassName} className`;
    }

    return (
      <div className="table-wrap">
        <table className={myTableClassName}>
          <thead>
            <Row
              options={this.$$options}
              selectable={selectable}
              onSelect={this.onRowSelect}
              isSelectAll={isSelectAll}
              isTh
            />
          </thead>
          <tbody>
            { bodyRow }
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
