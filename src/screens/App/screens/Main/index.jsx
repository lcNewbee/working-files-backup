import React, { Component } from 'react';
import utils from 'utils';
import { bindActionCreators } from 'redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import Nav from 'components/Nav';
import Icon from 'components/Icon';
import Sidebar from './components/Sidebar';
import Modal from 'components/Modal';
import * as actions from './actions';
import * as appActions from 'actions/app';


const BRAND_TEXT =  _('Management');

export default class Main extends Component {
  constructor(props) {
    super(props)
    
    this.state = {isShow: false};
    
    this.showUserPopOver = this.showUserPopOver.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    
    document.onkeypress = function(e){
      if(e.keyCode == 116){
        e.preventDefault();
        this.onRefresh();
      }
    }
  };
  
  showUserPopOver() {
    this.setState({isShow: !this.state.isShow});
  };
  
  onRefresh(e) {
    e.preventDefault();
    this.props.refreshAll();
  };
  
  render() {
    const { saving } = this.props.app.toJS();
    const { isShow } = this.state;
    
    return (
      <div>
        <header className="navbar">
          <a href="#/main/status" className="brand">
            <span className="logo">Axilspot</span>
          </a>
          <div className="aside">
            <a href="#" className="as-control" onClick={this.onRefresh}>
              <Icon name="refresh" className="icon" />
              REFRESH ALL
            </a>
            <div className="user" onClick={this.showUserPopOver}>
              <Icon name="user-secret" className="icon-user" />
              <Icon
                name="caret-down"
                className="icon-down"
              />
            </div>
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
                isShow={true}
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions
  ), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
