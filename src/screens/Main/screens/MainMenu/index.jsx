import React, { Component } from 'react';
import Tab from 'shared/components/Tab';

export default class Mainmenu extends Component {
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
