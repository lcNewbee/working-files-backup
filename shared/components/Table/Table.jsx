import React, { Component, PropTypes } from 'react';
import { fromJS } from 'immutable';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from '../../utils';
import Pagination from '../Pagination';
import Icon from '../Icon';
import Row from './Row';

const propTypes = {
  options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  list: PropTypes.object,
  page: PropTypes.object,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onPageChange: PropTypes.func,
  selectAble: PropTypes.bool,
  onSelectRow: PropTypes.func,
};

const defaultProps = {
  isTh: false,
};

class Table extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
  }
  onSelectRow(data) {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(data);
    }
  }
  render() {
    const { className, options, list, page, loading, selectAble } = this.props;
    const myList = fromJS(list);

    let filterOptions = options.map((item) => {
      let ret = item;
      const filterStr = item.get('filter');

      if (filterStr) {
        ret = item.set('filterObj', utils.filter(filterStr));
      }
      return ret;
    });

    return (
      <div className="table-wrap">
        <table className={className}>
          <thead>
            <Row
              options={filterOptions}
              isTh
              selectAble={selectAble}
              onSelect={this.onSelectRow}
            />
          </thead>
          <tbody>
            {
              myList.size > 0 ? myList.map((item, i) =>
                <Row
                  key={`tableRow${i}`}
                  options={filterOptions}
                  item={item}
                  index={i}
                  selectAble={selectAble}
                  onSelect={this.onSelectRow}
                />
              ) : (
                <tr>
                  <td
                    colSpan={options.size + (selectAble ? 1 : 0)}
                    className="empty"
                  >
                    {_('No Data')}
                  </td>
                </tr>
              )
            }
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
