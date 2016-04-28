import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import Nav from './Nav';

export default class Main extends Component {
  render() {
    return (
      <div>
        <header className="navbar">
          <a href="" className="brand">Comlanos 管理系统</a>
        </header>
        <div className="main">
          <div className='main-content'>
            <div className='main-content-wrap'>
              <ReactCSSTransitionGroup
                component="div"
                transitionName="fade-up"
                transitionEnterTimeout={500}
                transitionLeave={false}
              >
                {React.cloneElement(this.props.children, {
                  key: this.props.location.pathname
                })}
              </ReactCSSTransitionGroup>
            </div>
          </div>
          <Nav className="main-nav" menus={this.props.route.childRoutes} />
        </div>
      </div>
    )
  }
}
