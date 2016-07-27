import React, { Component } from 'react';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import Nav from 'shared/components/Nav';
import Icon from 'shared/components/Icon';
import Modal from 'shared/components/Modal';
import Navbar from 'shared/components/Navbar';
import AsiderBar from './components/AsiderBar';
import { Link } from 'react-router';
import * as actions from './actions';
import * as appActions from 'shared/actions/app';

export default class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {isShow: false};

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.showUserPopOver = this.showUserPopOver.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onLogout = this.onLogout.bind(this);

    document.onkeydown = function(e) {
      if(e.keyCode == 116){
        this.onRefresh(e);
      }
    }.bind(this);
  };

  showUserPopOver() {
    this.setState({isShow: !this.state.isShow});
  };

  onRefresh(e) {
    e.preventDefault();
    this.props.refreshAll();
  };

  onLogout(e) {
    e.preventDefault();
    this.props.changeLoginStatus('0');
    window.location.hash = "#";
  }

  render() {

    const { saving, version, propertyData, guiName } = this.props.app.toJS();
    const { isShow } = this.state;

    return (
      <div>
        <Navbar
          title={guiName}
          version={version}
        >
          <div className="aside">
            <a href="#" className="as-control" onClick={this.onRefresh}>
              <Icon name="refresh" className="icon" />
              {_('REFRESH')}
            </a>
            <div className="user" onClick={this.showUserPopOver}>
              <Icon name="user-secret" className="icon-user" />
              <Icon
                name="caret-down"
                className="icon-down"
              />
            </div>
          </div>
          <div className="o-menu-bar">
            <nav className="o-menu-bar__nav">
              <h3><Icon name="navicon" />网络设置</h3>
              <ul className="o-menu-bar__nav-menus">
                <li>
                  <Link
                    to="/main/network"
                    activeClassName="active"
                  >
                    网络设置
                  </Link>
                </li>
                <li>
                  <Link
                    to="/main/group"
                    activeClassName="active"
                  >
                    AP组管理
                  </Link>
                </li>
                <li>
                  <Link
                    to="/main/system"
                    activeClassName="active"
                  >
                    系统设置
                  </Link>
                </li>
              </ul>
            </nav>

            <ol className="m-breadcrumb">
              <li>
                <a className="m-breadcrumb__link" href="">一级菜单</a>
              </li>
              <li>
                <a className="m-breadcrumb__link" href="">二级菜单</a>
              </li>
              <li>
                <a className="m-breadcrumb__link" href="">三级菜单</a>
              </li>
            </ol>
          </div>
        </Navbar>

        <div className="t-main t-main--ac main--open">
          <Nav
            className="t-main__nav o-nav"
            menus={this.props.route.childRoutes}
            location={this.props.location}
            isTree
          />
          <div className='t-main__content'>
            {
              this.props.children
            }
          </div>
          <AsiderBar
            data={propertyData}
            isShow={propertyData.isShow}
          />
        </div>
        {
            isShow ? (
              <div className="m-pop-over" onClick={this.showUserPopOver}>
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
                    <a className="sign-out" href="#" onClick={this.onLogout}>
                      <Icon
                        name="sign-out"
                      />
                      {_('SIGN OUT')}
                    </a>
                  </div>
                </div>
                <div className="m-pop-over__overlay"></div>
              </div>
            ) : null
          }

          {
            saving ? <div className="body-backdrop"></div> : null
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
