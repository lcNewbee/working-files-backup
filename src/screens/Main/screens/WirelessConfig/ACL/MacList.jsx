import React from 'react'; import PropTypes from 'prop-types';
import Mac from './Mac';

export default class MacList extends React.Component {

  constructor(props) {
    super(props);
    this.getMacStatusFromList = this.getMacStatusFromList.bind(this);
  }

  getMacStatusFromList(index) {
    const list = this.props.macStatusList;
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
            disabled={this.props.disabled}
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
  disabled: PropTypes.bool,
};
