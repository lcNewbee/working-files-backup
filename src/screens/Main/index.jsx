import React from 'react';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Nav from 'shared/components/Nav';
import Icon from 'shared/components/Icon';
import Navbar from 'shared/components/Navbar';
import { RoutesSwitch } from 'shared/components/Organism/RouterConfig';
import { actions as appActions } from 'shared/containers/app';
import * as actions from './actions';


export default class Main extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isShow: false };

    this.showUserPopOver = this.showUserPopOver.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onLogout = this.onLogout.bind(this);

    document.onkeydown = function (e) {
      if (e.keyCode == 116) {
        this.onRefresh(e);
      }
    }.bind(this);
  }

  onRefresh(e) {
    e.preventDefault();
    this.props.refreshAll();
  }

  onLogout(e) {
    e.preventDefault();
    this.props.changeLoginStatus('0');
    window.location.hash = '#';
  }

  showUserPopOver() {
    this.setState({ isShow: !this.state.isShow });
  }

  render() {
    const { saving, guiName, version } = this.props.app.toJS();
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
              <span>{__('REFRESH')}</span>
            </a>
            <div className="user" onClick={this.showUserPopOver}>
              <Icon name="user-secret" className="icon-user" />
              <Icon
                name="caret-down"
                className="icon-down"
              />
            </div>
          </div>
        </Navbar>

        <div className="t-main main--open">
          <Nav
            className="t-main__nav"
            role="menu"
            location={this.props.location}
            menus={this.props.route.routes}
          />
          <div className="t-main__content">
            <RoutesSwitch
              routes={this.props.route.routes}
            />
          </div>
        </div>
        {
          isShow ? (
            <div className="o-pop-over" onClick={this.showUserPopOver}>
              <div className="o-pop-over__content m-user-overview">
                <div className="m-user-overview__info">
                  <Icon name="user-secret" className="icon-user" />
                </div>
                <div className="m-user-overview__controls">
                  <a className="change-pas" href="#/main/maintenance/accountsettings">
                    <Icon
                      name="key"
                    />
                    {__('CHANGE PASSWORD')}
                  </a>
                  <a className="sign-out" href="#" onClick={this.onLogout}>
                    <Icon
                      name="sign-out"
                    />
                    {__('LOG OUT')}
                  </a>
                </div>
              </div>
              <div className="o-pop-over__overlay"></div>
            </div>
          ) : null
        }

        {
          saving ? <div className="body-backdrop"></div> : null
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
