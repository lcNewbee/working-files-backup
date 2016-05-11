import React, {PropTypes} from 'react';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
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
    this.props.fetchWifiSettings();
  },
  
  onChangeUpSpeed() {
    
  },
  
  onChangeDownSpeed() {
    
  },
  
  onUpdate(name) {
    return function(e) {
      var data = {};
      
      data[name] = e.target.value;
      this.props.changeWirelessSettings();
    }.bind(this)
  },
  
  onChangeGroup() {
    
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
       label: "STRONG"
     }
   ];
    
    const currData =  this.props.data.get('curr');

    return (
      <div>
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
        
        <FormGruop
          label={ _('SSID') }
          value={currData.get('ssid')}
          updater={this.onUpdate('ssid')}
        />
        
        <div className="form-group">
          <label htmlFor="">{ _('Encryption') }</label>
          <div className="form-control">
            <Select
              clearable={false}
              value={currData.get('encryption')}
              options={encryptionOptions}
            />
          </div>
        </div>
        
        <FormGruop
          label={ _('Password') }
          type="password"
          className="text"
          value={currData.get('password')}
          updater={this.onUpdate('password')}
        />
        
        <div className="form-group">
          <label htmlFor="">{ _('VLAN') }</label>
          <div className="form-control">
            <input type="checkbox"/>
            <span style={{'marginLeft': '5px'}} className="none">
              { _('Use VLAN ID:') }
              <input type="text" className="input-sm"/>
            </span>
          </div>
        </div>
        
        <div className="form-group">
          <div className="form-control">
             <Button
              type='button'
              text={_('Save')}
              role="save"
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
  var myState = state.wireless;

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({fetchDeviceGroups}, myActions), dispatch)
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(Bandwidth);

export const reducer = myReducer;
