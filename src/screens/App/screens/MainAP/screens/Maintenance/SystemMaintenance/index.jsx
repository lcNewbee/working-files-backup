import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { FormGroup, FormInput, Modal, ProgressBar } from 'shared/components';
import { SaveButton, Button } from 'shared/components/Button';
import * as appActions from 'shared/actions/app';
import * as settingActions from 'shared/actions/settings';
import utils from 'shared/utils';
// import ProgressBar from 'shared/components';
import * as selfActions from './actions';
import reducer from './reducer';
// import './index.scss';

/**
 * 可配置功能项
systemmaintenance: {
  poeOutFun: false,
}
*/

const propTypes = {
  save: PropTypes.func,
  route: PropTypes.object,
  changeProgressBarInfo: PropTypes.func,
  changeShowProgessBar: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  showProgessBar: PropTypes.bool,
  isShow: PropTypes.bool,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  fetch: PropTypes.func,
  app: PropTypes.instanceOf(Map),

  createModal: PropTypes.func,
  restoreSelfState: PropTypes.func,
  changeUpgradeBarInfo: PropTypes.func,
  resetSelfState: PropTypes.func,
  changePoeOut: PropTypes.func,
  changeVoipEnable: PropTypes.func,
};

const languageOptions = List(b28n.getOptions().supportLang).map((item) => (
  {
    value: item,
    label: b28n.langMap[item] || 'English',
  }
)).toJS();

function onChangeLang(data) {
  if (b28n.getLang() !== data.value) {
    b28n.setLang(data.value);
    window.location.reload();
  }
}

export default class SystemMaintenance extends Component {
  constructor(props) {
    super(props);

    this.onFarewellUpgrade = this.onFarewellUpgrade.bind(this);
    this.onConfigurationRestore = this.onConfigurationRestore.bind(this);
    this.onRebootDevice = this.onRebootDevice.bind(this);
    this.onResetDevice = this.onResetDevice.bind(this);
    this.onBackupConfig = this.onBackupConfig.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    this.props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.fetchUrl,
    });
    this.props.fetch('goform/get_poe_out').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.changePoeOut(json.data.poeOut);
      }
    });
    this.props.fetch('goform/get_voip_info').then((json) => {
      if (json.state && json.state.code === 2000) {
        this.props.changeVoipEnable(json.data.enable);
      }
    });
  }

  // componentDidUpdate() {
  //   this.props.restoreSelfState();
  // }

  componentWillUnmount() {
    this.props.changeProgressBarInfo(fromJS({
      title: '',
      time: 0,
      isShow: false,
    }));
  }

  onFarewellUpgrade(e) {
    const that = this;
    const input = document.getElementById('upgradeFile');
    const formElem = document.getElementById('upgradeForm');
    e.preventDefault();
    if (!input.value) {
      return;
    }
    function upgradeDevice() {
      Promise.resolve().then(() => {
        const upgradeBarInfo = that.props.selfState.get('upgradeBarInfo')
                                .set('isShow', true);
        that.props.changeUpgradeBarInfo(upgradeBarInfo);
      }).then(() => {
        const upgradeBarInfo = that.props.selfState.get('upgradeBarInfo')
                                .setIn(['firstBar', 'start'], true);
        that.props.changeUpgradeBarInfo(upgradeBarInfo);
      });
      utils.postForm(formElem.action, formElem).then((json) => {
        if (json.state && json.state.code === 4000) {
          that.props.resetSelfState();
          that.props.createModal({
            id: 'settings',
            role: 'alert',
            text: __('Invalid firmware!'),
          });
        }
      });
    }

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: __('Sure you want to UPGRADE the software and REBOOT ?'),
      apply: upgradeDevice,
    });
  }

  onConfigurationRestore(e) {
    const that = this;
    const input = document.getElementById('restoreFile');
    const formElem = document.getElementById('restoreForm');
    e.preventDefault();
    if (!input.value) {
      return;
    }
    function saveConfig() {
      utils.postForm(formElem.action, formElem)
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            const step = Promise.resolve();
            step.then(() => {
              const barInfo = that.props.selfState.get('progressBarInfo')
                              .set('title', __('The configuration is restoring now, please wait ...'))
                              .set('time', 120).set('isShow', true).set('start', false);
              that.props.changeProgressBarInfo(barInfo);
            }).then(() => {
              const barInfo = that.props.selfState.get('progressBarInfo').set('start', true);
              that.props.changeProgressBarInfo(barInfo);
            });
          } else if (json.state && json.state.code === 4000) {
            that.props.resetSelfState();
            that.props.createModal({
              id: 'settings',
              role: 'alert',
              text: __('Save configuration failed !'),
            });
          }
        });
    }

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: __('Sure you want to RESTORE the configuration and REBOOT ?'),
      apply: saveConfig,
    });
  }

  onRebootDevice() {
    const that = this;
    function rebootDevice() {
      that.props.fetch('goform/reboot');
      const step = Promise.resolve();
      step.then(() => {
        that.props.changeProgressBarInfo(fromJS({
          title: __('The device is rebooting now, please wait ...'),
          time: 90,
          isShow: true,
        }));
      }).then(() => {
        const barInfo = that.props.selfState.get('progressBarInfo').set('start', true);
        that.props.changeProgressBarInfo(barInfo);
      });
    }

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: __('Sure you want to REBOOT the device ?'),
      apply: rebootDevice,
    });
  }

  onResetDevice() {
    const that = this;
    function resetDevice() {
      that.props.fetch('goform/reset');
      const step = Promise.resolve();
      step.then(() => {
        that.props.changeProgressBarInfo(fromJS({
          title: __('The device is reseting now, please wait ...'),
          time: 90,
          isShow: true,
        }));
      }).then(() => {
        const barInfo = that.props.selfState.get('progressBarInfo').set('start', true);
        that.props.changeProgressBarInfo(barInfo);
      });
    }

    this.props.createModal({
      id: 'settings',
      role: 'confirm',
      text: __('Sure you want to restore the device into factory default ?'),
      apply: resetDevice,
    });
  }

  onBackupConfig() {
    this.props.fetch('goform/save_config').then((json) => {
      if (json.state && json.state.code === 2000) {
        window.location.href = json.data.config_url;
      } else if (json.state && json.state.code === 4000) {
        this.props.createModal({
          id: 'settings',
          role: 'alert',
          text: __('Backup failed! Please try again.'),
        });
      }
    });
  }

  render() {
    return (
      <div className="o-form">
        <div className="o-form__legend">
          {__('Upgrade')}
        </div>
        <form
          action="/cgi-bin/upload.cgi"
          method="POST"
          encType="multipart/form-data"
          id="upgradeForm"
          className="clearfix"
        >
          <FormGroup
            label={__('Firmware Upgrade')}
            type="file"
            name="filename"
            id="upgradeFile"
            className="fl"
            style={{
              marginRight: '5px',
            }}
          />
          <SaveButton
            type="button"
            icon=""
            text={__('Upgrade')}
            onClick={this.onFarewellUpgrade}
            theme="primary"
            className="fl"
          />
        </form>
        <div className="o-form__legend">
          {__('Reboot')}
        </div>
        <FormGroup label={__('Reboot Device')}>
          <SaveButton
            text={__('Reboot')}
            icon=""
            style={{ width: '68px' }}
            onClick={this.onRebootDevice}
            theme="primary"
          />
        </FormGroup>

        <div className="o-form__legend">
          {__('Configuration')}
        </div>
        <FormGroup label={__('Backup Configuration')}>
          <SaveButton
            text={__('Backup')}
            icon=""
            style={{ width: '68px' }}
            onClick={this.onBackupConfig}
            theme="primary"
          />
        </FormGroup>

        <FormGroup
          label={__('Reset Configuration')}
        >
          <SaveButton
            text={__('Reset')}
            icon=""
            style={{ width: '68px' }}
            onClick={this.onResetDevice}
            theme="primary"
          />
        </FormGroup>

        <form
          id="restoreForm"
          action="/cgi-bin/upload_settings.cgi"
          method="POST"
          encType="multipart/form-data"
          ref={(refs) => {
            this.restoreForm = refs;
          }}
          className="clearfix"
        >
          <FormGroup
            label={__('Restore Configuration')}
            type="file"
            id="restoreFile"
            name="restoreFile"
            style={{
              marginRight: '5px',
            }}
            className="fl"
          />
          <Button
            text={__('Restore')}
            icon=""
            onClick={this.onConfigurationRestore}
            theme="primary"
            className="fl"
          />
        </form>

        <FormGroup
          type="select"
          label={__('Language Setting')}
          options={languageOptions}
          value={b28n.getLang()}
          onChange={onChangeLang}
        />

        {
          this.props.route.funConfig.poeOutFun ? (
            <div>
              <div className="o-form__legend">
                {__('POE')}
              </div>
              <div className="clearfix">
                <FormGroup
                  type="switch"
                  label={__('POE Out')}
                  className="fl"
                  options={[
                    { label: __('Turn On'), value: '1' },
                    { label: __('Turn Off'), value: '0' },
                  ]}
                  minWidth="80px"
                  value={this.props.selfState.get('poeOut')}
                  onChange={(data) => {
                    this.props.changePoeOut(data.value);
                  }}
                />
                <SaveButton
                  loading={this.props.app.get('saving')}
                  onClick={() => {
                    const query = { poeOut: this.props.selfState.get('poeOut') };
                    this.props.save('goform/set_poe_out', query);
                  }}
                />
              </div>
            </div>
            ) : null
        }

        {
          this.props.route.funConfig.voipFun ? (
            <div>
              <div className="o-form__legend">
                {__('VOIP')}
              </div>
              <div className="clearfix">
                <FormGroup
                  type="switch"
                  label={__('VOIP')}
                  className="fl"
                  options={[
                    { label: __('Turn On'), value: '1' },
                    { label: __('Turn Off'), value: '0' },
                  ]}
                  minWidth="80px"
                  value={this.props.selfState.get('voipEnable')}
                  onChange={(data) => {
                    this.props.changeVoipEnable(data.value);
                  }}
                />
                <SaveButton
                  loading={this.props.app.get('saving')}
                  onClick={() => {
                    const query = { enable: this.props.selfState.get('voipEnable') };
                    this.props.save('goform/set_voip', query);
                  }}
                />
              </div>
            </div>
            ) : null
        }

        <Modal
          className="upgradeBar"
          isShow={this.props.selfState.getIn(['upgradeBarInfo', 'isShow'])}
          style={{
            top: '200px',
            borderRadius: '20px',
          }}
          noFooter
          draggable
        >
          <ProgressBar
            title={this.props.selfState.getIn(['upgradeBarInfo', 'firstBar', 'title'])}
            time={this.props.selfState.getIn(['upgradeBarInfo', 'firstBar', 'time'])}
            callback={() => {
              const txt = __('Upgrading, please DO NOT cut the power !');
              const upgradeBarInfo = this.props.selfState.get('upgradeBarInfo')
                                        .setIn(['secondBar', 'start'], true)
                                        .setIn(['firstBar', 'title'], txt);
              this.props.changeUpgradeBarInfo(upgradeBarInfo);
            }}
            start={this.props.selfState.getIn(['upgradeBarInfo', 'firstBar', 'start'])}
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '10px',
            }}
          />
          <ProgressBar
            title={this.props.selfState.getIn(['upgradeBarInfo', 'secondBar', 'title'])}
            time={this.props.selfState.getIn(['upgradeBarInfo', 'secondBar', 'time'])}
            callback={() => {
              window.location.href = '#';
              this.props.resetSelfState();
            }}
            start={this.props.selfState.getIn(['upgradeBarInfo', 'secondBar', 'start'])}
            style={{
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          />
        </Modal>
        <Modal
          className="excUpgradeBar"
          isShow={this.props.selfState.getIn(['progressBarInfo', 'isShow'])}
          style={{
            top: '200px',
            borderRadius: '20px',
          }}
          noFooter
          draggable
        >
          <ProgressBar
            title={this.props.selfState.getIn(['progressBarInfo', 'title'])}
            time={this.props.selfState.getIn(['progressBarInfo', 'time'])}
            callback={() => {
              window.location.href = '#';
              this.props.resetSelfState();
            }}
            start={this.props.selfState.getIn(['progressBarInfo', 'start'])}
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

SystemMaintenance.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    selfState: state.systemmaintenance,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, settingActions, selfActions),
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SystemMaintenance);

export const systemmaintenance = reducer;
