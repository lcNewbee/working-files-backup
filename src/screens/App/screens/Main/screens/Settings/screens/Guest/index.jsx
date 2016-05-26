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
    rules: 'len:[1, 64]'
  }),
  password: validator({
    rules: 'len:[8, 64]'
  }),
  upstream: validator({
    rules: 'num:[1, 102400]'
  }),
  downstream: validator({
    rules: 'num:[1, 102400]',
  })
});

export const Guest = React.createClass({
  mixins: [PureRenderMixin],

  propTypes,

  componentWillMount() {
    this.props.fetchGuestSettings();
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
  
  getCurrData(name) {
    return this.props.store.getIn(['data', 'curr', name]);
  },
  
  getGroupOptions() {
    return this.props.store
      .getIn(['data', 'list'])
      .map(function(item, i) {
        return {
          value: item.get('groupname'),
          label: item.get('groupname')
        }
      })
      .toJS();
  },

  render() {
    const groupOptions = this.getGroupOptions();
    const {password, guestssid, upstream, downstream} = this.props.validateOption;
    const getCurrData = this.getCurrData;

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
                className="text"
                value={getCurrData('password') }
                onChange={this.onUpdate('password') }
                {...password}
                /> : null
          }
          <FormGroup
            label={_('Portal Enable') }
            type="checkbox"
            help={_('Enable') }
            checked={ getCurrData('portalenable') == '1'}
            onChange={this.onUpdate('portalenable') }
            />
            
          <FormGroup
            type="number"
            label={msg.upSpeed}
            required={true}
            maxLength="6"
            help="KB"
            value={getCurrData('upstream')}
            onChange={this.onUpdate('upstream')}
            {...upstream}
          />
          
          <FormGroup
            type="number"
            label={msg.downSpeed}
            help="KB"
            maxLength="6"
            required={true}
            value={getCurrData('downstream')}
            onChange={this.onUpdate('downstream')}
            {...downstream}
          />
        </div>
        
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
    store: myState,
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
