import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import Nav from '../Nav';

export default class TabMenus extends Component {
  render() {
    return (
      <div>
        <div className="tabs">
          <Nav
            className="tabs-nav"
            menus={this.props.menus}
          />
          <div className='tabs-content'>
            <div className='tabs-content-wrap'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
