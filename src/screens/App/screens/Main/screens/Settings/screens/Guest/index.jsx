import React, {PropTypes} from 'react';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
import {fromJS, Map, List} from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import validator from 'shared/utils/lib/validator';
import * as appActions from 'shared/actions/app';
import * as myActions from './actions';
import { fetchDeviceGroups } from '../GroupSettings/actions';
import myReducer from './reducer';

import {FormGroup, FormInput} from 'shared/components/Form';
import Button from 'shared/components/Button';
import SaveButton from 'shared/components/Button/Save';

const msg = {
  'upSpeed': _('Up Speed'),
  'downSpeed': _('Down Speed'),
  'selectGroup': _('Select Group')
};
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

const propTypes = {
  fetchDeviceGroups: PropTypes.func,
  fetching: PropTypes.bool,
  data: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List)
};

const validOptions = Map({
  guestssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]'
  }),
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 31]'
  }),
  upstream: validator({
    rules: 'num:[32, 102400, 0]'
  }),
  downstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),

  vlanid: validator({
    rules: 'num:[2, 4095]'
  }),
});

export const Guest = React.createClass({
  mixins: [PureRenderMixin],

  propTypes,

  componentWillMount() {
    this.props.fetchGuestSettings();
  },

  componentDidUpdate(prevProps) {
    if(prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.props.fetchGuestSettings();
    }
  },

  componentWillUnmount() {
    this.props.resetVaildateMsg();
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

  getCurrData(name, defaultVal) {
    const myDefault = defaultVal || '';

    return this.props.store.getIn(['data', 'curr', name]) || myDefault;
  },

  getGroupOptions() {
    return this.props.store
      .getIn(['data', 'list'])
      .map(function(item, i) {
        var groupname = item.get('groupname');
        var label = groupname

        if(groupname === 'Default') {
          label = _('Ungrouped Devices');
        }
        return {
          value: groupname,
          label: label
        }
      })
      .toJS();
  },

  render() {
    const groupOptions = this.getGroupOptions();
    const {password, guestssid, upstream, downstream, vlanid} = this.props.validateOption;
    const getCurrData = this.getCurrData;
    const noControl = this.props.app.get('noControl');

    let settngClassName = 'none';

    if (getCurrData('enable') == '1') {
      settngClassName = '';
    }

    return (
      <div>
        <h3>{ _('Current Group') }</h3>
        <FormGroup
          label={msg.selectGroup}
          type="select"
          options={groupOptions}
          value={getCurrData('groupname') }
          onChange={this.onChangeGroup}
          />

        <h3>{_('Guest Settings') }</h3>
        <FormGroup
          label={_('Enable Guest') }
          type="checkbox"
          options={{
            label: _('Enable')
          }}
          checked={ getCurrData('enable') == '1'}
          onChange={this.onUpdate('enable') }
          />

        <div className={settngClassName}>
          <FormGroup
            label={ _('Guest SSID') }
            required={true}
            maxLength="31"
            value={getCurrData('guestssid') }
            onChange={this.onUpdate('guestssid') }

            {...guestssid}
            />

          <FormGroup
            label={_('Encryption') }
            type="select"
            value={getCurrData('encryption') }
            options={encryptionOptions}
            onChange={this.onChangeEncryption}
            />
          {
            getCurrData('encryption') === 'psk-mixed' ?
              <FormGroup
                label={ _('Password') }
                required={true}
                type="password"
                maxLength="31"
                className="text"
                value={getCurrData('password') }
                onChange={this.onUpdate('password') }
                {...password}
                /> : null
          }
          <FormGroup
            type="checkbox"
            label={_('Enable Portal') }
            options={{
              label: _('Enable')
            }}
            checked={ getCurrData('portalenable') == '1'}
            onChange={this.onUpdate('portalenable') }
          />

          <FormGroup
            label={_('VLAN')}
            value={getCurrData('vlanid')}
            required={getCurrData('vlanenable') == '1'}
            disabled={getCurrData('vlanenable') != '1'}

            {...vlanid}
          >
            <FormInput
              type="checkbox"
              checked={getCurrData('vlanenable') == '1'}
              onChange={this.onUpdate('vlanenable')}
            />

            { _('VLAN ID:') }
            <FormInput
              type="text"
              style={{'marginLeft': '3px'}}
              className="input-sm"
              disabled={getCurrData('vlanenable') != '1'}
              value={getCurrData('vlanid')}
              onChange={this.onUpdate('vlanid')}
            />
            <span className="help">(2 - 4095)</span>
          </FormGroup>

          <FormGroup
            label={msg.upSpeed}
            required={getCurrData('upstream') !== '0'}
            help="KB/s"
            value={getCurrData('upstream')}
            {...upstream}
          >
          <FormInput
            type="checkbox"
            value="64"
            checked={ getCurrData('upstream') === '' || getCurrData('upstream') > 0 }
            onChange={this.onUpdate('upstream')}
          />
            {_('limited to') + ' '}
            <FormInput
              type="number"
              maxLength="6"
              size="sm"
              disabled={ getCurrData('upstream') === '0' }
              value={getCurrData('upstream')}
              onChange={this.onUpdate('upstream')}
            />
          </FormGroup>

          <FormGroup
            type="number"
            label={msg.downSpeed}
            help="KB/s"
            maxLength="6"
            required={getCurrData('downstream') !== '0'}
            value={getCurrData('downstream')}
            onChange={this.onUpdate('downstream')}
            {...downstream}
          >
            <FormInput
              type="checkbox"
              value="256"
              checked={ getCurrData('downstream') === '' || getCurrData('downstream') > 0 }
              onChange={this.onUpdate('downstream')}
            />
            {_('limited to') + ' '}
            <FormInput
              type="number"
              maxLength="6"
              size="sm"
              disabled={ getCurrData('downstream') === '0' }
              value={getCurrData('downstream')}
              onChange={this.onUpdate('downstream')}
            />
          </FormGroup>
        </div>

        <FormGroup role="save">
          {
            noControl ? null : (
              <SaveButton
                type='button'
                loading={this.props.app.get('saving')}
                onClick={this.onSave}
              />
            )
          }
        </FormGroup>
      </div>
    );
  }
});

function mapStateToProps(state) {
  var myState = state.guest;

  return {
    store: myState,
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    { fetchDeviceGroups },
    appActions,
    myActions
  ), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Guest);

export const reducer = myReducer;
