import React from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { Icon, Nav, Navbar } from 'shared/components';
import { RouteSwitches } from 'shared/components/Organism/RouterConfig';
import { actions as appActions } from 'shared/containers/app';
import * as actions from './actions';

const propTypes = {
  refreshAll: PropTypes.func,
  changeLoginStatus: PropTypes.func,
  route: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  routes: PropTypes.array,

  // immutable data
  app: PropTypes.instanceOf(Map),
};

const defaultProps = {
  Component: 'button',
  role: 'default',
};

export default class Main extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isShow: false };

    this.showUserPopOver = this.showUserPopOver.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onLogout = this.onLogout.bind(this);

    document.onkeydown = (e) => {
      if (e.keyCode === 116) {
        this.onRefresh(e);
      }
    };
  }

  onRefresh(e) {
    e.preventDefault();
    this.props.refreshAll();
  }

  onLogout(e) {
    e.preventDefault();
    this.props.changeLoginStatus('0');
    this.props.history.push('/login');
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
            <button href="#" className="as-control" onClick={this.onRefresh}>
              <Icon name="refresh" className="icon" />
              <span>{__('REFRESH')}</span>
            </button>
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
            <RouteSwitches
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
                  <a className="change-pas" href="#/main/system/admin">
                    <Icon
                      name="key"
                    />
                    {__('CHANGE PASSWORD')}
                  </a>
                  <a className="sign-out" href="#/login" onClick={this.onLogout}>
                    <Icon
                      name="sign-out"
                    />
                    {__('LOG OUT')}
                  </a>
                </div>
              </div>
              <div className="o-pop-over__overlay" />
            </div>
          ) : null
        }

        {
          saving ? <div className="body-backdrop" /> : null
        }
      </div>
    );
  }
}

Main.propTypes = propTypes;
Main.defaultProps = defaultProps;

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
