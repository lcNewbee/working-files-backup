import React from 'react'; import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';
import validator from 'shared/validator';
import utils from 'shared/utils';
import TIME_ZONE from 'shared/config/timeZone';
import countries from 'shared/config/country.json';
import Navbar from 'shared/components/Navbar';
import Button from 'shared/components/Button/Button';
import FormGroup from 'shared/components/Form/FormGroup';

import urls from 'shared/config/urls';

// self
import Modal from 'shared/components/Modal';
import { FormInput } from 'shared/components/Form';
import ProgressBar from 'shared/components/ProgressBar';
import { bindActionCreators } from 'redux';
import { actions as appActions } from 'shared/containers/app';
import { actions as sharedActions } from 'shared/containers/settings';
import * as selfActions from './actions';
import reducer from './reducer';
import imgEn from './modeEN.png';

const propTypes = {
  fetch: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  changeNextMode: PropTypes.func,
  changeNextModeData: PropTypes.func,
  validateAll: PropTypes.func,
  createModal: PropTypes.func,
  changeShowProgressBar: PropTypes.func,
  save: PropTypes.func,
  app: PropTypes.instanceOf(Map),
  validateOption: PropTypes.object,
  changeCurrModeData: PropTypes.func,
  changeShowThinModeConfigModal: PropTypes.func,
};

const validOptions = Map({
  validateIp: validator({
    rules: 'ip',
  }),
});

// 原生的 react 页面
export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.onOkButtonClick = this.onOkButtonClick.bind(this);
    this.onThinModeImgClick = this.onThinModeImgClick.bind(this);
    this.comfirmModeChange = this.comfirmModeChange.bind(this);
    // this.onSkipButtonClick = this.onSkipButtonClick.bind(this);

    this.state = {
      errorMsg: '',
    };
  }

  // Mine
  componentDidMount() {
    this.props.fetch('goform/get_firstLogin_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        const data = fromJS(json.data).delete('ifFirstLogin');
        this.props.changeCurrModeData(data);
        this.props.changeNextModeData(data);
        this.props.changeShowProgressBar(false);
      }
    }).then(() => {
      // 后台根据是否请求过下面的接口识别是否是第一次登陆
      // 故在此请求该接口，表明已经登陆过，无特殊意义
      this.props.fetch('goform/get_system_info_forTestUse');
    });
  }

  onOkButtonClick() {
    const that = this;
    const { currModeData, nextModeData } = this.props.selfState.toJS();
    const showThinModeConfigModal = this.props.selfState.get('showThinModeConfigModal');
    function reportError(str) {
      that.setState({
        errorMsg: __(str),
      });
    }
    function validIp(str) {
      const ipArr = str.split('.');
      const ipHead = ipArr[0];
      if (ipArr[0] === '127') {
        return __('IP address begin with 127 is a reserved loopback address, please input another value between 1 to 233');
      }
      if (ipArr[0] > 223) {
        return __('IP Address begin with %s is invalid, please input a value between 1 to 223.', ipHead);
      }
      return '';
    }
    this.props.validateAll('acipinput').then((mg) => {
      if (mg.isEmpty()) {
        if (nextModeData.enable === '1' && !showThinModeConfigModal) {
          this.props.changeShowThinModeConfigModal(true);
        } else if (currModeData.enable === nextModeData.enable && nextModeData.enable === '0') {
          // 模式没有改变，且是胖AP，直接跳到管理页面
          window.location.href = '#/main/status';
        } else if (currModeData.enable !== nextModeData.enable && nextModeData.enable === '0') {
          this.comfirmModeChange();
          this.props.changeShowThinModeConfigModal(false);
        } else if (nextModeData.enable === '1') {
          // 模式不变，瘦AP，需要验证服务器输入是否正确（这里是首次进入页面，之前的服务器地址为空，所以没有必要比较地址不变的情况。）
          const nextServerAddr = nextModeData.acIp;
          const addrArr = nextServerAddr.split(':');
          // 如果出现多个冒号，返回错误
          if (addrArr.length > 2) {
            reportError('Invalid server address!');
            return null;
          }
          // 验证IP或者域名
          const dominOrIp = addrArr[0];
          const dominValid = /^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/.test(dominOrIp);
          const ipValid = /^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/.test(dominOrIp);
          if (!dominValid && !ipValid) {
            reportError('Invalid domain name or ip address!');
            return null;
          } else if (!dominValid && ipValid) {
            const validmsg = validIp(dominOrIp);
            if (validmsg !== '') {
              reportError(validmsg);
              return null;
            }
          }
          // 验证端口
          const port = addrArr[1];
          if (typeof (port) !== 'undefined' && (port < 0 || port > 65535 || parseInt(port, 10).toString() !== port)) {
            reportError('Invalid server address! Port must be an integer between 0 and 65535 !');
            return null;
          }
          // 通过测试，保存配置
          this.comfirmModeChange();
          this.props.changeShowThinModeConfigModal(false);
          reportError('');
        }
      }
    });
  }

  onThinModeImgClick() {
    this.props.changeShowThinModeConfigModal(true);
  }

  // onSkipButtonClick() {
  //   this.props.fetch('goform/get_system_info_forTestUse').then((json) => {
  //     if (json.state && json.state.code === 2000) {
  //       window.setTimeout(() => { window.location.href = '#/main/status'; }, 500);
  //     }
  //   });
  // }

  comfirmModeChange() {
    const query = this.props.selfState.get('nextModeData').toJS();
    this.props.save('goform/set_thin', query);

    this.props.changeShowProgressBar(true);
  }

  render() {
    const btnInfoRole = 'info';
    const { guiName } = this.props.app.toJS();
    const { nextModeData, currModeData } = this.props.selfState.toJS();
    // const imgWrapStyle = {
    //   width: '50%',
    //   height: '100px',
    //   border: '1px solid #000',
    //   textAlign: 'center',
    // };
    // const radioWrapStyle = {
    //   width: '50%',
    //   border: '1px solid #ddd',
    //   textAlign: 'center',
    //   overflow: 'hidden',
    // };
    const selectedWrapStyle = {
      backgroundColor: '#005bcc',
    };
    // console.log(this.props.validateOption.validateIp);
    return (
      <div
        style={{
          overflow: 'auto',
        }}
      >
        <Navbar
          title={guiName}
        />
        <div
          className="t-wizard"
          style={{
            marginTop: '0px',
            overflow: 'auto',
          }}
        >
          <h2>{__('Quick Setup')}</h2>
          <div
            className="t-wizard__content"
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                marginTop: '-20px',
                marginBottom: '5px',
                fontSize: '13px',
              }}
            >
              <div style={{ marginBottom: '5px' }}>
                {
                  __('Notice: You see this page only when you first login. You can select the device operation mode(Fat/Thin) as you need.')
                }
              </div>
              <div style={{ marginBottom: '5px' }}>
                {
                  __('Fat AP: The wireless access point handles all wireless clients independently, and each AP has to be configured individually.')
                }
              </div>
              <div style={{ marginBottom: '5px' }}>
                {
                  __('Thin AP:  The wireless access point managed by the controller. All configurations are done on the controller.')
                }
              </div>
            </div>
            <div
              className="row"
              style={{
                marginTop: '5px',
              }}
            >
              <div
                className="cols cols-6"
                style={{
                  width: '400px',
                  border: '1px solid #ddd',
                  overflow: 'hidden',
                }}
                onClick={() => {
                  this.props.changeNextModeData({ enable: '0' });
                }}
              >
                <div
                  style={nextModeData.enable === '0' ? selectedWrapStyle : {}}
                >
                  <img
                    src={imgEn}
                    alt="img for thin ap"
                    style={{
                      height: '350px',
                      paddingLeft: '20px',
                    }}
                  />
                </div>
                <div
                  style={{
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    height: '50px',
                    lineHeight: '50px',
                    fontSize: '15px',
                    marginTop: '3px',
                  }}
                >
                  <FormInput
                    type="radio"
                    name="modeSelection"
                    checked={nextModeData.enable === '0'}
                    text={__('Fat AP Mode')}
                    onChange={() => {
                      this.props.changeNextModeData({ enable: '0' });
                    }}
                  />
                </div>
              </div>
              <div
                className="cols cols-6"
                style={{
                  width: '400px',
                  border: '1px solid #ddd',
                  overflow: 'hidden',
                }}
                onClick={() => {
                  this.props.changeNextModeData({ enable: '1' });
                  this.props.changeShowThinModeConfigModal(true);
                }}
              >
                <div
                  style={nextModeData.enable === '1' ? selectedWrapStyle : {}}
                >
                  <img
                    src={imgEn}
                    alt="img for thin ap"
                    style={{
                      position: 'relative',
                      left: '-330px',
                      height: '350px',
                    }}
                  />
                </div>
                <div
                  style={{
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    height: '50px',
                    lineHeight: '50px',
                    fontSize: '15px',
                    marginTop: '3px',
                  }}
                >
                  <FormInput
                    type="radio"
                    name="modeSelection"
                    checked={nextModeData.enable === '1'}
                    text={__('Thin AP Mode')}
                    onChange={() => {
                      this.props.changeNextModeData({ enable: '1' });
                      this.props.changeShowThinModeConfigModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="t-wizard__footer">
            <Button
              theme={btnInfoRole}
              onClick={this.onOkButtonClick}
              text={__('OK')}
            />
          </div>
        </div>
        <Modal
          className="thinModeConfig"
          isShow={this.props.selfState.get('showThinModeConfigModal')}
          draggable
          onOk={() => {
            this.onOkButtonClick();
          }}
          onClose={() => {
            const data = this.props.selfState.get('currModeData').toJS();
            this.props.changeNextModeData(fromJS(...data));
            this.props.changeShowThinModeConfigModal(false);
            this.setState({
              errorMsg: '',
            });
          }}
        >
          <FormGroup
            type="text"
            label={__('AC Address')}
            form="acipinput"
            value={nextModeData.acIp}
            placeholder={__('IP or Domain Name')}
            help={__('Example:192.168.0.1:80')}
            onChange={(data) => {
              const ip = data.value.replace(/：/g, ':');
              this.props.changeNextModeData(fromJS({ acIp: ip }));
            }}
            required
          />
          {
            this.state.errorMsg === '' ? null : (
              <div
                style={{
                  color: 'red',
                  margin: '10px 100px',
                }}
              >
                {__(this.state.errorMsg)}
              </div>
            )
          }
          <span>
            {__('Notice: The device will reboot when you click \'OK\' button if the configuration changed! Or, the page will be directed to management web.')}
          </span>
        </Modal>
        <Modal
          className="excUpgradeBar"
          isShow={this.props.selfState.get('showProgressBar')}
          style={{
            top: '200px',
            borderRadius: '20px',
          }}
          noFooter
          draggable
        >
          <ProgressBar
            title={__('rebooting , please wait...')}
            time={60}
            callback={() => {
              this.props.changeShowProgressBar(false);
              window.location.href = '#';
            }}
            start
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          />
        </Modal>
      </div>
    );
  }
}

SignUp.propTypes = propTypes;

function mapStateToProps(state) {
  // console.log(state.wizard.toJS())
  return {
    app: state.app,
    selfState: state.wizard,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch,
  );
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(SignUp);

export const wizard = reducer;
