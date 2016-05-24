import React, {Component} from 'react';
import Pagination from '../Pagination';
import Icon from '../Icon';

export class Row extends Component {
  render() {
    let tds;

    if(this.props.isTh) {
      tds = this.props.options.map(function(option, i) {
        return (
          <th key={'tableRow' + i}>
            {option.get('text')}
          </th>
        );
      });
    } else {
      tds = this.props.options.map(function(option, i) {
        let tdDom = <td key={'tableRow' + i}></td>;
        let id = option.get('id');

        if(!option.get('transform')) {
          tdDom = <td key={'tableRow' + i}>{this.props.item.get(id)}</td>
        } else {
          tdDom = <td key={'tableRow' + i}>{option.get('transform')(this.props.item)}</td>
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
    
    return (
      <div className="table-wrap">
        <table className={className}>
          <thead>
            <Row options={options} isTh={true} />
          </thead>
          <tbody>
            {
              listLen > 0 ? list.map(function(item, i) {
                return (
                  <Row
                    key={'tableRow' + i}
                    options={this.props.options}
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
