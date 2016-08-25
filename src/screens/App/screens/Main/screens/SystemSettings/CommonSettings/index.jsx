import React, { Component } from 'react';
import { FormGroup, FormInput } from 'shared/components';

export default class CommonSettings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div>
          <h3>{_('Accounts Settings')}</h3>
          <FormGroup
            type="text"
            label={_('Old User Name')}
          />
          <FormGroup
            type="password"
            label={_('Old Password')}
          />
          <FormGroup
            type="text"
            label={_('New User Name')}
          />
          <FormGroup
            type="password"
            label={_('New Password')}
          />
          <FormGroup
            type="password"
            label={_('Confirm Password')}
          />
        </div>
        <div>
          <h3>{_('Time Settings')}</h3>
          <FormGroup
            type="checkbox"
            label={_('NTP Client')}
          />
          <FormGroup
            type="text"
            label={_('NTP Server')}
          />
        </div>
      </div>
    );
  }
}
