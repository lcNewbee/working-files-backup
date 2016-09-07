import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  SaveButton, FormGroup, FormInput,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as settingsActions from 'shared/actions/settings';
import utils from 'shared/utils';
import * as selfActions from './actions';
import reducer from './reducer';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,

  fetch: PropTypes.func,
  updateItemSettings: PropTypes.func,
  initSettings: PropTypes.func,
};


export default class AccountSettings extends Component {
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
        <FormGroup>
          <SaveButton
            
          />
        </FormGroup>

      </div>
    );
  }
}

AccountSettings.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, settingsActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountSettings);

export const accountsettings = reducer;

