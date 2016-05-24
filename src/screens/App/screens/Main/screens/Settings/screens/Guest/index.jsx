import React, {PropTypes} from 'react';
import utils from 'utils';
import { bindActionCreators } from 'redux';
import {fromJS, Map, List} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'utils/lib/validator';
import * as validateActions from 'actions/valid';
import * as myActions from './actions';
import { fetchDeviceGroups } from '../GroupSettings/actions';
import myReducer from './reducer';

import {FormGroup} from 'components/Form';
import Button from 'components/Button';

const msg = {
  'upSpeed': _('Up Speed'),
  'downSpeed': _('Down Speed'),
  'selectGroup': _('Select Group')
};

const propTypes = {
  fetchDeviceGroups: PropTypes.func,
  fetching: PropTypes.bool,
  data: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List)
};

const validOptions = Map({
  guestssid: validator({
    rules: 'len:[1, 64]'
  }),
  password: validator({
    rules: 'len:[8, 64]'
  })
});

export const Guest = React.createClass({
  mixins: [PureRenderMixin],

  propTypes,

  componentWillMount() {
    this.props.fetchGuestSettings();
  },

  onUpdate(name) {
    return function (data) {
      let settings = {};
      settings[name] = data.value
      this.props.changeGuestSettings(settings);
    }.bind(this)
  },

  onChangeGroup(item) {
    this.props.changeGuestGroup(item.value);
  },

  onChangeEncryption(item) {
    const data = {
      encryption: item.value
    };

    this.props.changeGuestSettings(data);
  },

  onSave() {
    this.props.validateAll(function (invalid) {
      if (invalid.isEmpty()) {
        this.props.setGuest();
      }
    }.bind(this));
  },

  render() {
    const groupOptions = this.props.data
      .get('list').map(function (item, i) {
        return {
          value: item.get('groupname'),
          label: item.get('groupname')
        }
      }).toJS();

    const encryptionOptions = [
      {
        value: 'none',
        label: _('NONE')
      },
      {
        value: 'psk-mixed',
        label: _('STRONG')
      }
    ];

    const {password, guestssid} = this.props.validateOption;

    const currData = this.props.data.get('curr');

    let settngClassName = 'none';

    if (currData.get('enable') == '1') {
      settngClassName = '';
    }

    return (
      <div>
        <h3>{ _('Current Group') }</h3>
        <FormGroup
          label={msg.selectGroup}
          type="select"
          options={groupOptions}
          value={currData.get('groupname') }
          onChange={this.onChangeGroup}
          />

        <h3>{_('Guest Settings') }</h3>
        <FormGroup
          label={_('Enable Guest') }
          type="checkbox"
          options={{
            label: _('Enable')
          }}
          checked={ currData.get('enable') == '1'}
          onChange={this.onUpdate('enable') }
          />

        <div className={settngClassName}>
          <FormGroup
            label={ _('Guest SSID') }
            required={true}
            value={currData.get('guestssid') }
            onChange={this.onUpdate('guestssid') }

            {...guestssid}
            />

          <FormGroup
            label={_('Encryption') }
            type="select"
            value={currData.get('encryption') }
            options={encryptionOptions}
            onChange={this.onChangeEncryption}
            />
          {
            currData.get('encryption') === 'psk-mixed' ?
              <FormGroup
                label={ _('Password') }
                required={true}
                type="password"
                className="text"
                value={currData.get('password') }
                onChange={this.onUpdate('password') }
                {...password}
                /> : null
          }
          <FormGroup
            label={_('Portal Enable') }
            type="checkbox"
            help={_('Enable') }
            checked={ currData.get('portalenable') == '1'}
            onChange={this.onUpdate('portalenable') }
            />
        </div>
        div 
        <FormGroup>
          <Button
            type='button'
            text={_('Save') }
            role="save"
            onClick={this.onSave}
            />
        </FormGroup>
      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.guest;

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    { fetchDeviceGroups },
    validateActions,
    myActions
  ), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Guest);

export const reducer = myReducer;
