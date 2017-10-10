import React, { Component } from 'react';

export default class NotFound extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  componentWillMount() {

  }
  onClick() {

  }
  render() {
    return (
      <div style={{ textAlign: 'center' }} >
        <p>404 NotFound</p>
      </div>
    );
  }
}
