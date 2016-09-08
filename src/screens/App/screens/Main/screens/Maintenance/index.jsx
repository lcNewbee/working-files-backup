import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fromJS, Map } from 'immutable';
import { FormGroup, FormInput, Modal } from 'shared/components';
import { Button } from 'shared/components/Button';
import * as appActions from 'shared/actions/app';
import utils from 'shared/utils';
import ProgressBar from './ProgressBar';
import * as selfActions from './actions';
import reducer from './reducer';
// import './index.scss';

const propTypes = {
  save: PropTypes.func,
  changeProgressBarInfo: PropTypes.func,
  changeShowProgessBar: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
  showProgessBar: PropTypes.bool,
  isShow: PropTypes.bool,
};

export default class Maintenance extends Component {
  constructor(props) {
    super(props);

    this.onFarewellUpgrade = this.onFarewellUpgrade.bind(this);
    this.onConfigurationRestore = this.onConfigurationRestore.bind(this);
    this.onRebootDevice = this.onRebootDevice.bind(this);
    this.onResetDevice = this.onResetDevice.bind(this);
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
      time: 12,
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

  render() {
    return (
      <div className="Maintenance">
        <Modal
          isShow={this.props.selfState.getIn(['progressBarInfo', 'isShow'])}
          noFooter
        >
          <ProgressBar
            title={this.props.selfState.getIn(['progressBarInfo', 'title'])}
            time={this.props.selfState.getIn(['progressBarInfo', 'time'])}
            toUrl="#"
          />
        </Modal>
        <h3>{_('MAINTENANCE')}</h3>
        <div className="row">
          <div className="cols col-6">
            <form
              className="form-group"
              action="/cgi-bin/upload.cgi"
              method="POST"
              encType="multipart/form-data"
              id="upgradeForm"
            >
              <FormGroup label={_('Firmware Upgrade:')}>
                <FormInput
                  type="file"
                  name="filename"
                  id="upgradeFile"
                />
                <Button
                  type="button"
                  text="Upgrade"
                  onClick={this.onFarewellUpgrade}
                />
              </FormGroup>
            </form>
            <FormGroup label={_('Reboot device:')}>
              <Button
                text="Reboot"
                onClick={this.onRebootDevice}
              />
            </FormGroup>
          </div>
          <div className="cols col-6">
            <FormGroup label={_('Backup configuration:')}>
              <Button
                text="Backup"
                onClick={() => this.props.save()}
              />
            </FormGroup>

            <form
              id="restoreForm"
              action="/cgi-bin/restore.cgi"
              method="POST"
              encType="multipart/form-data"
            >
              <FormGroup
                label={_('Restore configuration:')}
              >
                <FormInput
                  type="file"
                  id="restoreFile"
                />
                <Button
                  text="Restore"
                  onClick={this.onConfigurationRestore}
                />
              </FormGroup>
            </form>
            <FormGroup
              label={_('Reset configuration:')}
            >
              <Button
                text="Reset"
                onClick={this.onResetDevice}
              />
            </FormGroup>
          </div>
        </div>
        <h4>Dual boot firmware images</h4>
        <div className="row">
          <div className="cols col-6">
            <FormGroup label={_('Active Firmware:')}>
              PTP MA-1.v7.51.10362
            </FormGroup>
          </div>
          <div className="cols col-6">
            <FormGroup label={_('Backup firmware:')}>
              PTP MA-1.v7.51.9456(Activate)
            </FormGroup>
          </div>
        </div>
        <p>
          Note: updating firmware image always replaces backup firmware image and activates it automatically after reboot!
        </p>

      </div>
    );
  }
}

Maintenance.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    selfState: state.maintenance,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Maintenance);

export const maintenance = reducer;
