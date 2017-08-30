import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Nav from 'shared/components/Nav';
import Icon from 'shared/components/Icon';
import Navbar from 'shared/components/Navbar';
import { RouteSwitches } from 'shared/components/Organism/RouterConfig';
import { actions as appActions } from 'shared/containers/app';
import * as actions from './actions';
import reducer from './reducer';

const propTypes = {
  app: PropTypes.object,
  save: PropTypes.func,
  fetch: PropTypes.func,
  refreshAll: PropTypes.func,
  route: PropTypes.object,
  location: PropTypes.object,
  changeLoginStatus: PropTypes.func,
  setDeviceRadioList: PropTypes.func,
  setRadioSelectOptions: PropTypes.func,
  changeMenus: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
};

function makeRadioSelectOptions(list) {
  const len = list.length;
  let radioSelectOptions = fromJS([]);
  for (let i = 0; i < len; i += 1) {
    const item = fromJS({
      label: list[i].name,
      value: list[i].radioId,
    });
    radioSelectOptions = radioSelectOptions.push(item);
  }
  return radioSelectOptions;
}

export default class MainAP extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isShow: false };
    this.onRefresh = this.onRefresh.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.showUserPopOver = this.showUserPopOver.bind(this);
    document.onkeydown = (e) => {
      if (e.keyCode === 116) {
        this.onRefresh(e);
      }
    };
  }

  componentWillMount() {
    this.props.fetch('goform/get_product_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.setDeviceRadioList(fromJS(json.data.deviceRadioList));
        const options = makeRadioSelectOptions(json.data.deviceRadioList);
        this.props.setRadioSelectOptions(options);

        const title = document.getElementById('ap-main-html-title');
        title.innerHTML = json.data.title || 'WI-FI AP';
      }
    }).then(() =>
      this.props.fetch('goform/get_firstLogin_info'),
    ).then((json) => {
      if (json.state && json.state.code === 2000) {
        if (json.data.ifFirstLogin === '1') {
          window.location.href = '#/wizard';
        } else if (json.data.enable === '1') {
          const menus = this.props.route.routes.filter(val => val.id !== 'wirelessconfig' && val.id !== 'quicksetup');
          this.props.changeMenus(fromJS(menus));
        } else if (json.data.enable === '0') {
          const menus = this.props.route.routes;
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
    this.props.save('goform/set_logout_stat');
    window.location.hash = '#';
  }

  showUserPopOver() {
    this.setState({
      isShow: !this.state.isShow,
    });
  }

  render() {
    const {
      guiName, saving, slogan, companyname, email, companyTel, copyrightInfo, supportLink,
    } = this.props.app.toJS();
    const { isShow } = this.state;
    // 解决在管理页面刷新获取radioType为undefined，导致请求国家信道错误的问题
    if (this.props.selfState.getIn(['deviceRadioList']).size === 0) return null;
    // console.log('menus', this.props.selfState.get('menus'));

    return (
      <div>
        <Navbar
          title={guiName}
          slogan={__(slogan)}
        >
          <div className="aside">
            <a href="" className="as-control" onClick={this.onRefresh}>
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
            menus={this.props.selfState.get('menus')}
          />
          <div className="t-main__content">
            <RouteSwitches
              routes={this.props.route.routes}
            />
          </div>
          {
            email && companyname ? (
              <ul
                className="t-main__nav-footer"
              >
                <li>
                  <a
                    className=""
                    title={__('Email to %s', companyname)}
                    href={`mailto:${email}`}
                  >
                    <Icon name="envelope" />
                    <div className="contact">{__('Contact Us')}</div>
                  </a>
                </li>
              </ul>
            ) : null
          }

          { // 只有网旗有底边栏 wangqi
            companyname && companyname.toLowerCase() === 'wangqi' && (<div className="t-main__footer-bar">
              <div className="content-wraper clearfix">
                <div className="copyright fl">
                  {__(copyrightInfo)}
                </div>

                {
                  companyTel && (
                    <div className="telNumber fl">
                      {__('Service Tel')}：{companyTel}
                    </div>
                  )
                }

                {
                  supportLink && (
                    <div className="support fl">
                      <a href={`${supportLink}`}>{__('Technical Support')}</a>
                    </div>
                  )
                }
              </div>
            </div>)
          }
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
                  <a className="sign-out" href="#/" onClick={this.onLogout}>
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
    actions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainAP);

export const product = reducer;
