import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import { FormGroup, FormInput, Modal } from 'shared/components';
import { Button } from 'shared/components/Button';
import * as appActions from 'shared/actions/app';
import * as settingActions from 'shared/actions/settings';
import utils from 'shared/utils';
import ProgressBar from './ProgressBar';
import * as selfActions from './actions';
import reducer from './reducer';
// import './index.scss';

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
};

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
  }

  componentWillUnmount() {
    this.props.changeProgressBarInfo(fromJS({
      title: '',
      time: 0,
      isShow: false,
    }));
  }

  onFarewellUpgrade(e) {
    const input = document.getElementById('upgradeFile');
    const formElem = document.getElementById('upgradeForm');
    let data;

    e.preventDefault();

    if (!input.value) {
      // this.props.createModal({
      //   id: 'admin',
      //   role: 'alert',
      //   text: _('Please select a upload image'),
      // });
      return;
    }
    const extension = utils.getExtension(input.value);

    if (typeof FormData === 'function') {
      data = new FormData();
      data.append('filename', input.files[0]);
      data.append('suffix', extension);

      fetch(formElem.action, {
        method: 'POST',
        body: data,
      })
      .then((rq) => {
      });
    } else {
      formElem.submit();
    }

    this.props.changeProgressBarInfo(fromJS({
      title: _('The device is updating now, please wait for a while...'),
      time: 120,
      isShow: true,
    }));
  }

  onConfigurationRestore(e) {
    const input = document.getElementById('restoreFile');
    const formElem = document.getElementById('restoreForm');
    let data;

    e.preventDefault();

    if (!input.value) {
      // this.props.createModal({
      //   id: 'admin',
      //   role: 'alert',
      //   text: _('Please select a upload image'),
      // });
      return;
    }

    const extension = utils.getExtension(input.value);

    if (typeof FormData === 'function') {
      data = new FormData();
      data.append('filename', input.files[0]);
      data.append('suffix', extension);

      fetch(formElem.action, {
        method: 'POST',
        body: data,
      })
      .then((rq) => {
      });
    } else {
      formElem.submit();
    }

    this.props.changeProgressBarInfo(fromJS({
      title: _('The configuration is restoring now, please wait ...'),
      time: 60,
      isShow: true,
    }));
  }

  onRebootDevice() {
    utils.save('goform/reboot')
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.props.changeProgressBarInfo(fromJS({
              title: _('The device is rebooting now, please wait ...'),
              time: 90,
              isShow: true,
            }));
          }
        });
  }

  onResetDevice() {
    utils.save('goform/reset')
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            this.props.changeProgressBarInfo(fromJS({
              title: _('The device is reseting now, please wait ...'),
              time: 90,
              isShow: true,
            }));
          }
        });
  }

  onBackupConfig() {
    utils.fetch('goform/save_config')
        .then((json) => {
          if (json.state && json.state.code === 2000) {
            window.location = json.data.config_url;
          } else if (json.state && json.state.code === 4000) {
            window.alert('Backup failed! Please try again.');
          }
        });
  }

  render() {
    return (
      <div className="o-form">
        <div className="o-form__legend">
          {_('Upgrade')}
        </div>
        <form
          action="/cgi-bin/upload.cgi"
          method="POST"
          encType="multipart/form-data"
          id="upgradeForm"
        >
          <FormGroup label={_('Firmware Upgrade')}>
            <FormInput
              type="file"
              name="filename"
              id="upgradeFile"
            />
            <Button
              type="button"
              text={_('Upgrade')}
              onClick={this.onFarewellUpgrade}
            />
          </FormGroup>
        </form>
        <div className="o-form__legend">
          {_('Reboot')}
        </div>
        <FormGroup label={_('Reboot device')}>
          <Button
            text={_('Reboot')}
            onClick={this.onRebootDevice}
          />
        </FormGroup>

        <div className="o-form__legend">
          {_('Configuration')}
        </div>
        <FormGroup label={_('Backup configuration')}>
          <Button
            text={_('Backup')}
            onClick={this.onBackupConfig}
          />
        </FormGroup>

        <form
          id="restoreForm"
          action="/cgi-bin/back_config"
          method="POST"
          encType="multipart/form-data"
        >
          <FormGroup
            label={_('Restore configuration')}
          >
            <FormInput
              type="file"
              id="restoreFile"
            />
            <Button
              text={_('Restore')}
              onClick={this.onConfigurationRestore}
            />
          </FormGroup>
        </form>
        <FormGroup
          label={_('Reset configuration')}
        >
          <Button
            text={_('Reset')}
            onClick={this.onResetDevice}
          />
        </FormGroup>

        <Modal
          isShow={this.props.selfState.getIn(['progressBarInfo', 'isShow'])}
          style={{
            top: '200px',
            borderRadius: '20px',
          }}
          noFooter
        >
          <ProgressBar
            title={this.props.selfState.getIn(['progressBarInfo', 'title'])}
            time={this.props.selfState.getIn(['progressBarInfo', 'time'])}
            toUrl="#"
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
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(SystemMaintenance);

export const systemmaintenance = reducer;
