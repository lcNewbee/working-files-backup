import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import Nav from '../Nav';

import './_index.scss';

export default class TabMenus extends Component {
  render() {
    return (
      <div className="tab">
        <Nav
          className="tab-nav"
          menus={this.props.menus}
        />
        <div className='tab-content'>
          {this.props.children}
        </div>
      </div>
    )
  }
}
