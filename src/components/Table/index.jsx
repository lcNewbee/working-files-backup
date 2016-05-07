import React, {Component} from 'react';
import Pagination from 'comlan/components/Pagination';

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
    var total = this.props.list.size;
    var size = this.props.size;
    
    return (
      <div>
        <table className={this.props.className}>
          <thead>
            <Row options={this.props.options} isTh={true} />
          </thead>
          <tbody>
            {
              this.props.list.map(function(item, i) {
                return (
                  <Row
                    key={'tableRow' + i}
                    options={this.props.options}
                    item={item}
                  />
                );
              }.bind(this))
            }
          </tbody>
        </table>
        {
          this.props.page ? <Pagination
            page={this.props.page}
            onPageChange={this.props.onPageChange}
          /> : ''
        }
      </div>
    )
  }
}
