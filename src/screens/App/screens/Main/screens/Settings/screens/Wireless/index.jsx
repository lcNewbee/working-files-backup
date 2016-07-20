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

import {FormGroup, Checkbox, FormInput} from 'shared/components/Form';
import Select from 'shared/components/Select';
import Button from 'shared/components/Button';
import SaveButton from 'shared/components/Button/Save';
import channels from './channels.json';
import Switchs from 'shared/components/Switchs';


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
const channelBandwidthOptions = fromJS([
  {
    value: '20',
    label: '20'
  }, {
    value: '40',
    label: '40'
  }
]);

const validOptions = Map({
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 31]'
  }),
  vlanid: validator({
    rules: 'num:[2, 4095]'
  }),
  ssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]'
  }),
  upstream: validator({
    rules: 'num:[32, 102400]',
  }),
  downstream: validator({
    rules: 'num:[32, 102400]',
  })
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

  componentDidUpdate(prevProps) {
    if(prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.props.fetchWifiSettings();
    }
  },

  componentWillUnmount() {
    this.props.resetVaildateMsg();
  },

  onUpdate(name) {
    return function(item) {
      let data = {};

      data[name] = item.value;
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

  getChannelsValue(country) {
    var ret = parseInt(this.getCurrData('channel'));
    var maxChannel = this.getChannelsOptions(country).length - 1;

    if(ret > maxChannel) {
      ret = maxChannel.toString();
    }

    return ret + '';
  },

  onUpdateSettings(name) {
    return function(item) {
      const data = {};
      data[name] = item.value;

      if(name === 'country') {
        data.channel = this.getChannelsValue(item.value);
      }

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

  getCurrData(name) {
    return this.props.store.getIn(['data', 'curr', name]);
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

  getCountryOptions() {
    return channelsList.map(function(item) {
      return {
        value: item.country,
        label: b28n.getLang() === 'cn' ? _(item.cn) : _(item.en)
      }
    }).toJS();
  },

  getChannelsOptions(currCountry) {
    let i, len, channelsRange;
    let channelsOptions = [
      {
        value: '0',
        label: _('auto')
      }
    ];
    let channelsOption = channelsList.find(function(item) {
      return item.country === currCountry;
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

    return channelsOptions;
  },

  render() {
    const {
        password, vlanid, ssid, upstream, downstream
      } = this.props.validateOption;
    const groupOptions = this.getGroupOptions();
    const countryOptions = this.getCountryOptions();
    const getCurrData =  this.getCurrData;
    const channelsOptions = this.getChannelsOptions(getCurrData('country'));
    const noControl = this.props.app.get('noControl');

    return (
      <div>
        <h3>{ _('Current Group') }</h3>
        <FormGroup
          type="select"
          label={msg.selectGroup}
          options={groupOptions}
          value={getCurrData('groupname')}
          id="groupname"
          onChange={this.onChangeGroup}
        />

        <h3>{_('Basic Configuration')}</h3>
        <FormGroup
          label={ _('SSID') }
          required={true}
          value={getCurrData('ssid')}
          maxLength="31"
          id="ssid"
          onChange={this.onUpdateSettings('ssid')}
          {...ssid}
        />
        <FormGroup
          type="select"
          label={_('Encryption')}
          options={encryptionOptions}
          value={getCurrData('encryption')}
          onChange={this.onUpdateSettings('encryption')}
        />
        {
          getCurrData('encryption') === 'psk-mixed' ?
            <FormGroup
              label={ _('Password') }
              type="password"
              required={true}
              value={getCurrData('password')}
              maxLength="31"
              onChange={this.onUpdateSettings('password')}
              {...password}
            /> : ''
        }
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

        <h3>{_('Wireless Channel')}</h3>
        <FormGroup
          type="select"
          label={ _('Country')}
          options={countryOptions}
          value={getCurrData('country')}
          onChange={this.onUpdateSettings('country')}
        />
        <FormGroup
          type="select"
          label={ _('Channel')}
          options={channelsOptions}
          value={getCurrData('channel')}
          onChange={this.onUpdateSettings('channel')}
        />
        <FormGroup label={_('Channel Bandwidth')} >
          <Switchs
            options={channelBandwidthOptions}
            value={getCurrData('channelsBandwidth')}
            onChange={this.onUpdateSettings('channelsBandwidth')}
          />
        </FormGroup>

        <h3>{_('Bandwidth Control')}</h3>
        <FormGroup
          label={msg.upSpeed}
          required={true}
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
          required={true}
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

        <div className="form-group form-group-save">
          <div className="form-control">
            {
              noControl ? null : (
                <SaveButton
                  type='button'
                  loading={this.props.app.get('saving')}
                  onClick={this.onSave}
                />
              )
            }
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
    store: myState,
    app: state.app
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    {fetchDeviceGroups},
    appActions,
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
