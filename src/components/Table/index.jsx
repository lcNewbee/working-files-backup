import React, {Component} from 'react';

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
    return (
      <table className={this.props.className}>
        <thead>
          <Row options={this.props.options} isTh={true} />
        </thead>
        <tbody>
          {
            this.props.list.map(function(item, i) {
              return (
                <Row
                  key={'table' + i}
                  options={this.props.options}
                  item={item}
                />
              );
            }.bind(this))
          }
        </tbody>
      </table>
    )
  }
}
