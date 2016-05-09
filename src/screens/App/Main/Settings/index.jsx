import React, { Component } from 'react';
import Tab from 'components/Tab';

export default class Setings extends Component {
  render() {
    return (
      <Tab
        menus={this.props.route.childRoutes}
      >
        {this.props.children}
      </Tab>
    )
  }
}
