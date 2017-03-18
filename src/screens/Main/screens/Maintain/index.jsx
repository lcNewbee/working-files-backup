import React, { Component } from 'react';
import { FormGroup } from 'shared/components';
import Button from 'shared/components/Button/Button';

var MaintenanceSetting=React.createClass({
  render:function(){
    return(
    <div className="row">
     <div className="cols col-6">
       <FormGroup label={_('Firmware Upade:')}>
       <Button/>
       </FormGroup>
       <FormGroup label={_('Reboot device:')}>
       <Button/>
       </FormGroup>
     </div>
    <div className="cols col-6">
       <FormGroup label={_('Backup configuration:')}>
       <Button/>
       </FormGroup>
       <FormGroup label={_('Restore device configuration:')}>
       <Button/>
        </FormGroup>
       <FormGroup label={_('Reset to factory configuration:')}>
       <Button/>
       </FormGroup>
     </div>
    </div>
    );
  }
});
var ActiveFirmware=React.createClass({
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

  var Maintenance = React.createClass({
  render: function() {
    return (
    <div className="Maintenance">
      <h3>MAIN TENANCE</h3>
      <br/>
      <MaintenanceSetting/>
      <h4>Dual boot firmware images</h4>
      <br/>
      <ActiveFirmware/>
      <p>Note: updating firmware image always replaces backup firmware image and activates it automatically after reboot!</p>
    </div>
    );
  }
});

 export default Maintenance;
