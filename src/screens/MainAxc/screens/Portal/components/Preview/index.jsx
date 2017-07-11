import React from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { Icon } from 'shared/components';

import './_index.scss';

import wifiIcon from './images/wifi@3x.png';
import reloginIcon from './images/relogin@3x.png';
import ipIcon from './images/ip@3x.png';

const styleObj = {
  width: '50%',
};
const authToIcon = {
  0: 'dot-circle-o',
  1: 'user',
  4: 'envelope',
  5: 'weixin',
  9: 'facebook-official',
};
function LoginBody(props) {
  const { auths, section, onChangeSection, onLoginOk } = props;
  const authArr = auths ? auths.split(',') : [];

  return (
    <div className="portal-content-body">
      {
        section === 'home' ? (
          <div className="portal-content-body-section active" id="authHome">
            <img src={wifiIcon} className="header-img" alt="wifi" />
            <p className="header-description">{__('Please select the type')}</p>
            {
              authArr.indexOf('0') !== -1 ? (
                <button
                  id="oneKeyLogin"
                  type="button"
                  className="a-btn a-btn--primary a-btn--lg a-btn--block"
                  onClick={onLoginOk}
                >
                  <Icon name={authToIcon['0']} />
                  <span>{__('One-click Sign In')}</span>
                </button>
              ) : null
            }
            {
              authArr.indexOf('5') !== -1 ? (
                <button
                  id="weixinLogin"
                  type="button"
                  className="a-btn a-btn--lg a-btn--success a-btn--block"
                  onClick={onLoginOk}
                >
                  <Icon name={authToIcon['5']} />
                  <span>{__('Sign in with Wechat')}</span>
                </button>
              ) : null
            }
            {
              authArr.indexOf('4') !== -1 ? (
                <button
                  id="smsLogin"
                  type="button"
                  className="a-btn a-btn--lg a-btn--warning a-btn--block"
                  onClick={() => {
                    onChangeSection('sms');
                  }}
                >
                  <Icon name={authToIcon['4']} />
                  <span className="b28n">{__('Sign in with SMS')}</span>
                </button>
              ) : null
            }
            {
              authArr.indexOf('1') !== -1 ? (
                <button
                  id="accountLogin"
                  type="button"
                  className="a-btn a-btn--lg a-btn--user a-btn--block"
                  onClick={() => {
                    onChangeSection('user');
                  }}
                >
                  <Icon name={authToIcon['1']} />
                  <span className="b28n">{__('Sign in with Account')}</span>
                </button>
              ) : null
            }
            {
              authArr.indexOf('9') !== -1 ? (
                <button
                  id="facebookLogin"
                  type="button"
                  className="a-btn a-btn--lg a-btn--facebook a-btn--block"
                  onClick={onLoginOk}
                >
                  <Icon name={authToIcon['9']} />
                  <span className="b28n">{__('Sign in with Facebook')}</span>
                </button>
              ) : null
            }
          </div>
        ) : null
      }
      {
        section === 'user' ? (
          <form className="portal-content-body-section active" id="userLogin">
            <div className="p-form-group p-form-group--icon">
              <Icon name="user" />
              <input type="text" className="p-form-control" id="InputAccount" name="usr" placeholder={__('Username')} />
            </div>
            <div className="p-form-group p-form-group--icon">
              <Icon name="ellipsis-h" />
              <input type="password" className="p-form-control" id="InputPassword" name="pwd" placeholder={__('Password')} />
            </div>
            <button id="btnAcpassword" type="button" className="b28n a-btn a-btn--lg a-btn--primary a-btn--block" onClick={onLoginOk}>{__('Login')}</button>
            {
              auths !== '1' ? (
                <button
                  type="button"
                  className="b28n a-btn a-btn--dark a-btn--lg a-btn--block goback"
                  onClick={() => {
                    onChangeSection('home');
                  }}
                >
                  {__('Return')}
                </button>
              ) : null
            }
          </form>
        ) : null
      }

      {
        section === 'sms' ? (
          <form className="portal-content-body-section active" id="smsLoginForm">
            <div className="p-form-group p-form-group--icon">
              <Icon name="phone" />
              <input type="text" className="p-form-control" id="InputPhone" placeholder={__('Mobile Phone Number')} />
            </div>
            <div className="p-form-group p-form-group--icon">
              <div className="p-input-group">
                <div className="p-input-group-input">
                  <Icon name="ellipsis-h" />
                  <input type="text" className="p-form-control" id="InputYZM" placeholder={__('Auth Code')} />
                </div>
                <button type="button" id="getSms" className="b28n a-btn a-btn--lg a-btn--primary">{__('Get Verification Code')}</button>
              </div>
            </div>
            <button id="btnSms" type="button" className="a-btn a-btn--lg a-btn--primary a-btn--block" onClick={onLoginOk}>
              <span>{__('Login')}</span>
            </button>
            {
              auths !== '4' ? (
                <button
                  type="button"
                  className="a-btn a-btn--lg a-btn--block a-btn--dark goback"
                  onClick={() => {
                    onChangeSection('home');
                  }}
                >
                  <span>{__('Return')}</span>
                </button>
              ) : null
            }

          </form>
        ) : null
      }
    </div>
  );
}
const propTypes = {
  type: PropTypes.oneOf(['login', 'out', 'ok', 'wechat']),
  data: PropTypes.object,
  onChangeType: PropTypes.func,
};
const defaultProps = {
  type: 'login',
  data: {},
};

export default class PortalPreview extends React.Component {
  constructor(props) {
    const { data, type } = props;
    let initSection = 'home';

    super(props);

    if (type === 'login') {
      if (data.auths === '1') {
        initSection = 'user';
      } else if (data.auths === '4') {
        initSection = 'sms';
      }
    }

    this.state = {
      loginSection: initSection,
    };
    utils.binds(this, [
      'onChangeSection',
      'onChangeLoginSection',
      'updateLoginSection',
    ]);
  }
  componentWillReceiveProps(nextProps) {
    const curAuths = this.props.data.auths;
    const curType = this.props.type;
    const nextAuths = nextProps.data.auths;
    const nextType = nextProps.type;

    if (curAuths !== nextAuths || curType !== nextType) {
      this.updateLoginSection(nextProps);
    }
  }

  onChangeType(typeName) {
    if (this.props.onChangeType) {
      this.props.onChangeType(typeName);
    }
  }
  onChangeLoginSection(name) {
    this.setState({
      loginSection: name,
    });
  }
  updateLoginSection(props) {
    const { data, type } = props;
    let initSection = 'home';

    if (type === 'login') {
      if (data.auths === '1') {
        initSection = 'user';
      } else if (data.auths === '4') {
        initSection = 'sms';
      }
    }

    this.setState({
      loginSection: initSection,
    });
  }
  render() {
    const { type } = this.props;
    const {
      title, subTitle, auths, logo, backgroundImg, copyright, copyrightUrl,
    } = this.props.data;
    const authArr = auths ? auths.split(',') : [];
    let classNames = 'portal portal--mobile';

    if (type) {
      classNames = `${classNames} portal--${type}`;
    }

    return (
      <div className={classNames}>
        <div
          className="portal-banner"
          style={{
            backgroundImage: `url(${backgroundImg})`,
          }}
        />
        <div className="portal-content">
          <div className="portal-content-header">
            {
              logo ? (
                <img src={logo} alt="logo" className="a-brand" />
              ) : null
            }
            <hr />
            <h1>{title}</h1>
            <h2>{subTitle}</h2>
          </div>
          {
            type === 'login' ? (
              <LoginBody
                auths={auths}
                section={this.state.loginSection}
                onChangeSection={this.onChangeLoginSection}
                onLoginOk={() => {
                  this.onChangeType('ok');
                }}
              />
            ) : null
          }

          {
            type === 'ok' ? (
              <div className="portal-content-body" id="authHome">
                <img src={wifiIcon} className="header-img" alt="wifi" />
                <p className="header-description b28n">{__('Congrats,Authentication Succeeded')}</p>
                <ul className="p-list-group">
                  <li className="p-list-group-item">
                    <Icon name="user" className="a-icon" />
                    <span >{__('Useruame: login username')}</span>
                  </li>
                  <li className="p-list-group-item">
                    <Icon name="clock-o" className="a-icon" />
                    {__('Online Time %s min,%s mins Left', 10, 100)}
                  </li>
                  <li className="p-list-group-item">
                    <img src={ipIcon} className="a-icon" alt="icon" />
                    <span>{__('IP: %s', '0.0.0.0')}</span>
                  </li>
                </ul>
                <button id="goURL" type="button" className="a-btn a-btn--lg a-btn--primary a-btn--block">
                  <img src={reloginIcon} className="a-icon" alt="icon" />
                  <span>{__('Continue')}</span>
                </button>
                <button
                  id="LoginOut"
                  type="button"
                  className="a-btn a-btn--dark a-btn--lg a-btn--block"
                  onClick={() => this.onChangeType('out')}
                >
                  <Icon name="times-circle-o" className="a-icon" />
                  <span className="b28n">{__('Logout')}</span>
                </button>
              </div>
            ) : null
          }

          {
            type === 'out' ? (
              <div className="portal-content-body" id="authHome">
                <img src={wifiIcon} className="header-img" alt="wifi" />
                <p className="header-description b28n">{__('Logout Succeeded')}</p>
                <button
                  id="goauth"
                  type="button"
                  className="a-btn a-btn--primary a-btn--lg a-btn--block"
                  onClick={() => this.onChangeType('login')}
                >
                  <img src={reloginIcon} className="a-icon" alt="logo" />
                  <span >{__('Relogin')}</span>
                </button>
              </div>
            ) : null
          }
          <div className="portal-content-footer">
            {
              authArr.indexOf('1') !== -1 ? (
                <ul className="p-list-group p-list-group--inline">
                  <li
                    className="p-list-group-item frist"
                    style={styleObj}
                  >
                    <a >{__('Contact Admin')}</a>
                  </li>
                  <li className="p-list-group-item" style={styleObj}>
                    <a target="_blank">{__('Help Center')}</a>
                  </li>
                </ul>
              ) : (
                <ul className="p-list-group p-list-group--inline">
                  <li className="p-list-group-item" style={{ width: '100%' }}>
                    <a target="_blank">{__('Contact Admin')}</a>
                  </li>
                </ul>
              )
            }
            <hr />
            <a href={copyrightUrl} target="_blank">{copyright}</a>
          </div>
        </div>
      </div>
    );
  }
}


PortalPreview.propTypes = propTypes;
PortalPreview.defaultProps = defaultProps;
