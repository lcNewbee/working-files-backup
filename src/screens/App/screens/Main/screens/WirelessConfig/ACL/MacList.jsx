import React, { PropTypes } from 'react';
import Mac from './Mac';

export default class MacList extends React.Component {

  constructor(props) {
    super(props);
    this.getMacStatusFromList = this.getMacStatusFromList.bind(this);
  }

  getMacStatusFromList(index) {
    const list = this.props.macStatusList;
    console.log(list);
    return list[index];
  }

  render() {
    return (
      <ul>
        {this.props.maclist.map((mac, index) =>
          <Mac
            key={index}
            onClick={() => this.props.onMacClick(index)}
            text={mac}
            selected={this.getMacStatusFromList(index)}
          />
        )}
      </ul>
    );
  }
}

MacList.propTypes = {
  onMacClick: PropTypes.func,
  macStatusList: PropTypes.instanceOf(Array),
  maclist: PropTypes.instanceOf(Array),
};
