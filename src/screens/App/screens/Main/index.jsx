import React, { Component } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import Nav from 'components/Nav';
import Icon from 'components/Icon';
import Sidebar from './components/Sidebar';
import Modal from 'components/Modal';
import * as actions from './actions';


const BRAND_TEXT = 'Axilspot ' + _('Management');

export default class Main extends Component {
  constructor(props) {
    super(props)
    
    this.state = {isShow: false};
    
    this.showUserPopOver = this.showUserPopOver.bind(this);
  };
  
  showUserPopOver() {
    this.setState({isShow: !this.state.isShow});
  };
  
  render() {
    const { saving } = this.props.app.toJS();
    const { isShow } = this.state;
    
    return (
      <div>
        <header className="navbar">
          <a href="" className="brand">{BRAND_TEXT}</a>
          <div className="fr user" onClick={this.showUserPopOver}>
            <Icon name="user-secret" className="icon-user" />
            <Icon
              name="caret-down"
              className="icon-down"
            />
          </div>
        </header>
        <div className="main">
          <div className='main-content'>
            <div className='main-content-wrap'>
              {
                this.props.children
              }
            </div>
          </div>
          <Nav className="main-nav" menus={this.props.route.childRoutes} />
        </div>
        {
            isShow ? (
              <div className="pop-over" onClick={this.showUserPopOver}>
                <div
                  className="user-pop-over"
                >
                  <div className="user-info">
                    <Icon name="user-secret" className="icon-user" />
                  </div>
                  <div className="user-controls">
                    <a className="change-pas" href="#/main/settings/admin">
                      <Icon
                        name="key"
                      />
                      {_('CHANGE PASSWORD')}
                    </a>
                    <a className="sign-out" href="#">
                      <Icon
                        name="sign-out"
                      />
                      {_('SIGN OUT')}
                    </a>
                  </div>
                </div>
                <div className="overlay"></div>
              </div>
            ) : null
          }
          
          {
            saving ? (
              <Modal
                role="message"
                isShow="true"
              >
                { _('Saving') }
              </Modal>
            ) : null
          }
      </div>
    )
  }
}

function mapStateToProps(state) {
  var myState = state.app;

  return {
    app: myState
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(Main);
