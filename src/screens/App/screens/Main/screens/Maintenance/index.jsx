import React, { Component } from 'react';
import { FormGroup, FormInput } from 'shared/components';
import Button from 'shared/components/Button';
import utils from 'shared/utils';
import './index.scss';

class MaintenanceSetting extends Component {

  constructor(props) {
    super(props);

    this.onFarewellUpgrade = this.onFarewellUpgrade.bind(this);
  }

  onFarewellUpgrade(e) {
    const input = document.getElementById('upgradeFile');
    const formElem = document.getElementById('upgradeForm');
    let data;
    let extension;

    e.preventDefault();

    if (!input.value) {
      // this.props.createModal({
      //   id: 'admin',
      //   role: 'alert',
      //   text: _('Please select a upload image'),
      // });
      return;
    }

    extension = utils.getExtension(input.value);

    //
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
  }

  render() {
    return (
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
              size="lg"
              text="Reboot"
              onclick=""
            />
          </FormGroup>
        </div>
        <div className="cols col-6">
          <FormGroup label={_('Backup configuration:')}>
            <Button
              size="lg"
              text="Backup"
              onclick=""
            />
          </FormGroup>
          <FormGroup label={_('Restore device configuration:')}>
            <Button
              size="lg"
              text="Restore"
              onclick=""
            />
          </FormGroup>
          <FormGroup label={_('Reset to factory configuration:')}>
            <Button
              size="lg"
              text="Reset"
              onclick=""
            />
          </FormGroup>
        </div>
      </div>
    );
  }
}

const ActiveFirmware = React.createClass({
  render() {
    return (
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
    );
  },
});

const Maintenance = React.createClass({
  render() {
    return (
      <div className="Maintenance">
        <h3 >MAINTENANCE</h3>
        <MaintenanceSetting />
        <h4>Dual boot firmware images</h4>
        <ActiveFirmware />
        <p>Note: updating firmware image always replaces backup firmware image and activates it automatically after reboot!</p>
      </div>
    );
  },
});

export default Maintenance;
