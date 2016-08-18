import React, { Component } from 'react';
import { FormGroup } from 'shared/components';
import Button from 'shared/components/Button';
import './index.scss';
const MaintenanceSetting=React.createClass({
  render:function(){
    return(
    <div className="row">
     <div className="cols col-6">
       <FormGroup label={_('Firmware Upade:')}>
       <Button
              size="lg"
              text="Upade"
              onclick=""
      />
       </FormGroup>
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
});
const ActiveFirmware=React.createClass({
  render: function(){
    return(
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
  }
});

 const Maintenance = React.createClass({
  render: function() {
    return (
    <div className="Maintenance">
      <h3 >MAINTENANCE</h3>
      <MaintenanceSetting/>
      <h4>Dual boot firmware images</h4>
      <ActiveFirmware/>
      <p>Note: updating firmware image always replaces backup firmware image and activates it automatically after reboot!</p>
    </div>
    );
  }
});

 export default Maintenance;
