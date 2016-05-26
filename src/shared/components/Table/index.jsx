import React, {Component} from 'react';
import utils from 'utils';
import Pagination from '../Pagination';
import Icon from '../Icon';

export class Row extends Component {
  render() {
    let tds;

    if(this.props.isTh) {
      tds = this.props.options.map(function(option, i) {
        return (
          <th key={'tableRow' + i} width={option.get('width')}>
            {option.get('text')}
          </th>
        );
      });
    } else {
      tds = this.props.options.map(function(option, i) {
        let tdDom = null;
        let id = option.get('id');
        let currVal = this.props.item.get(id);
        let filterObj = option.get('filterObj');
        
        if(filterObj && typeof filterObj.transform === 'function') {
          currVal = filterObj.transform(currVal);
        }

        if(!option.get('transform')) {
          tdDom = <td key={'tableRow' + i}>{currVal}</td>
        } else {
          tdDom = (
            <td key={'tableRow' + i}>
              { option.get('transform')(currVal, this.props.item) }
            </td>
          )
        }

        return tdDom;

      }.bind(this));
    }

    return (
      <tr>
        {tds}
      </tr>
    )
  }
}

export class Table extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {className, options, list, size, page, loading} = this.props;
    const listLen = this.props.list.size;
    const filterOptions = options.map((item) => {
      var ret = item;
      var filterStr = item.get('filter');
      
      if(filterStr) {
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
              isTh={true}
            />
          </thead>
          <tbody>
            {
              listLen > 0 ? list.map(function(item, i) {
                return (
                  <Row
                    key={'tableRow' + i}
                    options={filterOptions}
                    item={item}
                  />
                );
              }.bind(this)) : (
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
          (page && page.totalPage > 1) ? <Pagination
            page={page}
            onPageChange={this.props.onPageChange}
          /> : null
        }
        
        {
          loading ? (
            <div className="table-loading">
              <div className="backdrop"></div>
              <div className="table-loading-content">
                <Icon name="spinner" spin={true} />
              </div>
            </div>
          ) : null
        }
        
        
      </div>
    )
  }
}
