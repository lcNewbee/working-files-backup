import React, { PropTypes } from 'react';

export default class Mac extends React.Component {
  render() {
    return (
      <li
        onClick={this.props.onClick}
        style={{
          textDecoration: this.props.selected ? 'line-through' : 'none',
          cursor: this.props.selected ? 'default' : 'pointer',
        }}
      >
        {this.props.text}
      </li>
    );
  }
}

Mac.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
};
