import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import utils from '../../utils';
import Pagination from '../Pagination';
import Icon from '../Icon';
import Row from './Row';

const propTypes = {
  options: PropTypes.object,
  list: PropTypes.object,
  page: PropTypes.object,
  loading: PropTypes.bool,
  className: PropTypes.string,
  onPageChange: PropTypes.func,
};

const defaultProps = {
  isTh: false,
};

export class Table extends Component {
  constructor(props) {
    super(props);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onSelectRow = this.onSelectRow.bind(this);
  }
  onSelectRow() {

  }
  render() {
    const { className, options, list, page, loading } = this.props;
    const listLen = this.props.list.size;
    const filterOptions = options.map((item) => {
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
            />
          </thead>
          <tbody>
            {
              listLen > 0 ? list.map((item, i) =>
                <Row
                  key={`tableRow${i}`}
                  options={filterOptions}
                  item={item}
                />
              ) : (
                <tr>
                  <td
                    colSpan={options.size}
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
              <div className="backdrop"></div>
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
