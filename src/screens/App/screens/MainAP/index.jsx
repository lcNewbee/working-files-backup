import React, { Component, PropTypes } from 'react';
import utils from 'shared/utils';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import Nav from 'shared/components/Nav';
import Icon from 'shared/components/Icon';
import Navbar from 'shared/components/Navbar';
import * as appActions from 'shared/actions/app';
import * as actions from './actions';
import reducer from './reducer';

const propTypes = {
  app: PropTypes.object,
  fetch: PropTypes.func,
  refreshAll: PropTypes.func,
  route: PropTypes.object,
  changeLoginStatus: PropTypes.func,
  setDeviceRadioList: PropTypes.func,
  setRadioSelectOptions: PropTypes.func,
  changeMenus: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
};

export default class MainAP extends Component {
  constructor(props) {
    super(props);

    this.state = { isShow: false };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.makeRadioSelectOptions = this.makeRadioSelectOptions.bind(this);
    document.onkeydown = function (e) {
      if (e.keyCode === 116) {
        this.onRefresh(e);
      }
    }.bind(this);
  }

  componentWillMount() {
    this.props.fetch('goform/get_product_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.setDeviceRadioList(fromJS(json.data.deviceRadioList));
        const options = this.makeRadioSelectOptions(json.data.deviceRadioList);
        this.props.setRadioSelectOptions(options);
      }
    });
  }

  componentDidMount() {
    this.props.fetch('goform/get_firstLogin_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        if (json.data.ifFirstLogin === '1') {
          window.location.href = '#/wizard';
        }
        if (json.data.manageMode === '1') {
          const menus = this.props.route.childRoutes.filter(val => val.id !== 'wirelessconfig' && val.id !== 'quicksetup');
          this.props.changeMenus(fromJS(menus));
        } else if (json.data.manageMode === '0') {
          const menus = this.props.route.childRoutes;
          this.props.changeMenus(fromJS(menus));
        }
      }
    });
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
    this.setState({
      isShow: !this.state.isShow,
    });
  }

  makeRadioSelectOptions(list) {
    const len = list.length;
    let radioSelectOptions = fromJS([]);
    for (let i = 0; i < len; i++) {
      const item = fromJS({
        label: list[i].name,
        value: list[i].radioId,
      });
      radioSelectOptions = radioSelectOptions.push(item);
    }
    return radioSelectOptions;
  }

  render() {
    const { version, guiName, saving } = this.props.app.toJS();
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
              <span>{_('REFRESH')}</span>
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
          <Nav className="t-main__nav" role="menu" menus={this.props.selfState.get('menus').toJS()} />
          <div className="t-main__content">
            { this.props.children }
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

MainAP.propTypes = propTypes;

function mapStateToProps(state) {
  const myState = state.app;

  return {
    app: myState,
    selfState: state.product,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
  appActions,
  actions
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainAP);

export const product = reducer;
