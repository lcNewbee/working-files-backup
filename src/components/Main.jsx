import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
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
              {this.props.children}
            </div>
          </div>
          <Nav className="main-nav" mainNav={this.props.mainNav} />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    mainNav: state.config.mainNav
  };
}

// 添加 redux 属性的 react 页面
export const MainContainer = connect(
  mapStateToProps
)(Main);
