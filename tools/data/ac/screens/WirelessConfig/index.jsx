import React, { Component } from 'react';
import Tab from 'shared/components/Tab';

export default class WirelessConfig extends Component {
  render() {
    return (
      <Tab
        menus={this.props.route.routes}
      >
        {this.props.children}
      </Tab>
    )
  }
}
