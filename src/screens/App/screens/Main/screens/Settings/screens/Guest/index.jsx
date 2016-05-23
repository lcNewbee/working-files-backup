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

import {FormGruop} from 'components/Form/Input';
import Select from 'components/Select';
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

export const Bandwidth = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
    this.props.fetchGuestSettings();
  },
  
  onUpdate(name) {
    return function(e) {
      const elem = e.target;
      let data = {};
      
      if(elem.type !== 'checkbox') {
        data[name] = e.target.value;
      } else {
        
        if(elem.checked) {
          data[name] = '1';
        } else {
          data[name] = '0';
        }
      }
      
      this.props.changeGuestSettings(data);
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
    this.props.setGuest();
  },
  
  render() {
    const groupOptions = this.props.data
      .get('list').map(function(item, i) {
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
    
    const currData =  this.props.data.get('curr');
    
    let settngClassName = 'none';
    
    if(currData.get('enable') == '1') {
      settngClassName = '';
    }

    return (
      <div>
        <h3>{ _('Current Group') }</h3>
        <div className="form-group">
          <label htmlFor="">{msg.selectGroup}</label>
          <div className="form-control">
            <Select
              options={groupOptions}
              clearable={false}
              onChange={this.onChangeGroup}
              value={currData.get('groupname')}
            />
          </div>
        </div>
        
        <h3>{_('Guest Settings')}</h3>
        
        <div className="form-group">
          <label htmlFor="">{ _('Enable Guest') }</label>
          <div className="form-control">
            <input
              type="checkbox"
              checked={currData.get('enable') == '1'}
              onChange={this.onUpdate('enable')}
            />
            <span className="help">{_('Enable')}</span>
          </div>
        </div>
        
        <div className={settngClassName}>
          <FormGruop
            label={ _('Guest SSID') }
            value={currData.get('guestssid')}
            updater={this.onUpdate('guestssid')}
          />
          
          <div className="form-group">
            <label htmlFor="">{ _('Encryption') }</label>
            <div className="form-control">
              <Select
                clearable={false}
                value={currData.get('encryption')}
                options={encryptionOptions}
                searchable={false}
                onChange={this.onChangeEncryption}
              />
            </div>
          </div>
          
          {
            currData.get('encryption') === 'psk-mixed' ?
              <FormGruop
                label={ _('Password') }
                type="password"
                className="text"
                value={currData.get('password')}
                updater={this.onUpdate('password')}
              /> : null
          }
          
          <div className="form-group">
            <label htmlFor="">{ _('Portal Enable') }</label>
            <div className="form-control">
              <input
                type="checkbox"
                checked={currData.get('portalenable') == '1'}
                onChange={this.onUpdate('portalenable')}
              />
              <span className="help">{_('Enable')}</span>
            </div>
          </div>
          
        </div>
        
        <div className="form-group">
          <div className="form-control">
             <Button
              type='button'
              text={_('Save')}
              role="save"
              onClick={this.onSave}
            />
          </div>
        </div>
      </div>
    );
  }
});

Bandwidth.propTypes = propTypes;

//React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  var myState = state.guest;

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({fetchDeviceGroups}, myActions), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bandwidth);

export const reducer = myReducer;
