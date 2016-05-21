import React, {PropTypes} from 'react';
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
import channels from './channels.json';
import Switchs from 'components/Switchs';

const msg = {
  'upSpeed': _('Up Speed'),
  'downSpeed': _('Down Speed'),
  'selectGroup': _('Select Group')
};

const validOptions = Map({
  password: validator({
    rules: 'len:[8, 64]'
  }),
  vlanid: validator({
    rules: 'num:[0, 4096]'
  }),
  ssid: validator({
    rules: 'len:[1, 64]'
  }),
});

const channelsList = List(channels);

const propTypes = {
  fetchDeviceGroups: PropTypes.func,
  fetching: PropTypes.bool,
  data: PropTypes.instanceOf(Map),
  groups: PropTypes.instanceOf(List)
};

export const Wireless = React.createClass({
  mixins: [PureRenderMixin],
  
  componentWillMount() {
    this.props.fetchWifiSettings();
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
      
      this.props.changeWifiSettings(data);
    }.bind(this)
  },
  
  onChangeGroup(item) {
    this.props.changeWifiGroup(item.value);
  },
  
  onChangeEncryption(item) {
    const data = {
      encryption: item.value
    };
    
    this.props.changeWifiSettings(data);
  },
  
  onUpdateSelect(name) {
    
    return function(item) {
      const data = {};
      data[name] = item.value;
      
      this.props.changeWifiSettings(data);
    }.bind(this)
  },
  
  onSave() {
    this.props.validateAll(function(invalid) {
      if(invalid.isEmpty()) {
        this.props.setWifi();
      }
    }.bind(this));
    
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
    const countryOption = channelsList.map(function(item) {
      return {
        value: item.country,
        label: _(item.en)
      }
    }).toJS();
    const channelBandwidthOptions = fromJS([
      {
        value: '20',
        label: '20'
      }, {
        value: '40',
        label: '40'
      }
    ]);
    const {password, vlanid, ssid} = this.props.validateOption;
    
    const currData =  this.props.data.get('curr');
    let i, len, channelsRange;
    let channelsOptions = [
      {
        value: '0',
        label: _('auto')
      }
    ];
    
    let channelsOption = channelsList.find(function(item) {
      return item.country === currData.get('country');
    });
    
    if(channelsOption) {
      
      channelsRange = channelsOption['2.4g'].split('-');
      i = parseInt(channelsRange[0], 10);
      len = parseInt(channelsRange[1], 10);
    } else {
      i = 1;
      len = 13;
    }
    
    for(i; i <= len ; i++) {
      channelsOptions.push({
        value: i + '',
        label: i + ''
      });
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
        
        <h3>{_('Base Options')}</h3>
     
        <FormGruop
          label={ _('SSID') }
          required={true}
          value={currData.get('ssid')}
          updater={this.onUpdate('ssid')}
          {...ssid}
        />
        
        <div className="form-group">
          <label htmlFor="">{ _('Encryption') }</label>
          <div className="form-control">
            <Select
              clearable={false}
              value={currData.get('encryption')}
              options={encryptionOptions}
              searchable={false}
              onChange={this.onUpdateSelect('encryption')}
            />
          </div>
        </div>
        
        {
          currData.get('encryption') === 'psk-mixed' ?
            <FormGruop
              label={ _('Password') }
              type="password"
              required={true}
              className="text"
              value={currData.get('password')}
              updater={this.onUpdate('password')}
              {...password}
            /> : ''
        }
        
        
        <FormGruop
          label={_('VLAN')}
          value={currData.get('vlanid')}
          {...vlanid}
        >
          <input
            type="checkbox"
            required={true}
            checked={currData.get('vlanenable') == '1'}
            onChange={this.onUpdate('vlanenable')}
          />
            
          {
            currData.get('vlanenable') == '1' ? 
              (
                <span style={{'marginLeft': '5px'}}>
                  { _('Use VLAN ID:') }
                  <input
                    type="text"
                    className="input-sm"
                    value={currData.get('vlanid')}
                    onChange={this.onUpdate('vlanid')}
                  />
                </span>
              ) : ''
          }
        </FormGruop>
        
        
        <h3>{_('Wireless Channel')}</h3>
        
        <div className="form-group">
          <label htmlFor="">{ _('Country') }</label>
          <div className="form-control">
            <Select
              clearable={false}
              value={currData.get('country')}
              options={countryOption}
              searchable={false}
              onChange={this.onUpdateSelect('country')}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="">{ _('Channel') }</label>
          <div className="form-control">
            <Select
              clearable={false}
              value={currData.get('channel')}
              options={channelsOptions}
              searchable={false}
              onChange={this.onUpdateSelect('channel')}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="">{ _('Channel Bandwidth') }</label>
          <div className="form-control">
            <Switchs
              options={channelBandwidthOptions}
              value={currData.get('channelsBandwidth')}
              onChange={this.onUpdateSelect('channelsBandwidth')}
            />
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

Wireless.propTypes = propTypes;

//React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  var myState = state.wireless;

  return {
    fetching: myState.get('fetching'),
    data: myState.get('data'),
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    {fetchDeviceGroups},
    validateActions,
    myActions
  ), dispatch)
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Wireless);

export const reducer = myReducer;
