import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import validator from 'shared/validator';
import { actions as appActions } from 'shared/containers/app';
import { FormGroup, FormInput } from 'shared/components/Form';
import { SaveButton } from 'shared/components';
import Switchs from 'shared/components/Switchs';
import channels from 'shared/config/country.json';
import * as myActions from './actions';
import { fetchDeviceGroups } from '../GroupSettings/actions';
import myReducer from './reducer';

const msg = {
  upSpeed: __('Up Speed'),
  downSpeed: __('Down Speed'),
  selectGroup: __('Select Group'),
};
const encryptionOptions = [
  {
    value: 'none',
    label: __('NONE'),
  },
  {
    value: 'psk-mixed',
    label: __('STRONG'),
  },
];
const txPowerOptions = [
    {
      value: '3%',
      label: '3%',
    }, {
      value: '6%',
      label: '6%',
    }, {
      value: '12%',
      label: '12%',
    }, {
      value: '25%',
      label: '25%',
    }, {
      value: '50%',
      label: '50%',
    }, {
      value: '100%',
      label: '100%',
    },
];
const channelBandwidthOptions = fromJS([
  {
    value: '20',
    label: '20',
  }, {
    value: '40',
    label: '40',
  },
]);

const validOptions = Map({
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 31]',
  }),
  vlanid: validator({
    rules: 'num:[2, 4095]',
  }),
  ssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]',
  }),
  upstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
  downstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
});

const channelsList = List(channels);


function getCountryOptions() {
  return channelsList.map(item =>
     ({
       value: item.country,
       label: b28n.getLang() === 'cn' ? __(item.cn) : __(item.en),
     }),
  ).toJS();
}

function getChannelsOptions(currCountry) {
  let i;
  let len;
  let channelsRange;
  const channelsOptions = [
    {
      value: '0',
      label: __('auto'),
    },
  ];
  const channelsOption = channelsList.find(item =>
     item.country === currCountry,
  );

  if (channelsOption) {
    channelsRange = channelsOption['2.4g'].split('-');
    i = parseInt(channelsRange[0], 10);
    len = parseInt(channelsRange[1], 10);
  } else {
    i = 1;
    len = 13;
  }

  for (i; i <= len; i++) {
    channelsOptions.push({
      value: `${i}`,
      label: `${i}`,
    });
  }

  return channelsOptions;
}

const propTypes = {
  fetchWifiSettings: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  changeWifiGroup: PropTypes.func,
  changeWifiFrequency: PropTypes.func,
  validateOption: PropTypes.object,
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
};

export class Wireless extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onUpdate', 'onChangeGroup','onChangeFrequency', 'onChangeEncryption', 'onUpdateSettings',
      'onSave', 'getCurrData', 'getGroupOptions', 'getChannelsOptions',
      'getChannelsValue',
    ]);
    this.state = {
      frequency: '2.4G',
    };
  }
  componentWillMount() {
    const frequencyValue = this.state.frequency;
    this.props.fetchWifiSettings(frequencyValue);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      const frequencyValue = this.state.frequency;
      this.props.fetchWifiSettings(frequencyValue);
    }
  }
  componentWillUnmount() {
    this.props.resetVaildateMsg();
  }

  onUpdate(name) {
    return (item) => {
      const data = {};
      const radio5Object = {};
      const radio2Object = {};
      const modeVal = this.state.frequency;
      if (modeVal === '5G') {
        radio5Object[name] = item.value;
      } else {
        radio2Object[name] = item.value;
      }
      data['radio5.8G'] = radio5Object;
      data['radio2.4G'] = radio2Object;
      this.props.changeWifiSettings(data);
    };
  }

  onChangeGroup(item) {
    const modeVal = this.state.frequency;
    this.props.changeWifiGroup(item.value, modeVal);
  }

  onChangeFrequency(item) {
    const frequencyValue = this.setState({
      frequency: item.value,
    });
    this.props.fetchWifiSettings(item.value);
  }

  // 没有用
  onChangeEncryption(item) {
    const data = {
      encryption: item.value,
    };
    this.props.changeWifiSettings(data);
  }

  onUpdateSettings(name, defaultVal) {
    return (item) => {
      const myDefault = defaultVal || '';
      const radio5Object = {};
      const radio2Object = {};
      const data = {};
      const currGroupName = this.props.store.getIn(['data', 'curr', 'groupname']);
      data.groupname = currGroupName;
      const modeVal = this.state.frequency;
      if (modeVal === '5G') {
        if (name === 'country') {
          radio5Object.channel = this.getChannelsValue(item.value) || myDefault;
        } else {
          radio5Object[name] = item.value || myDefault;
        }
      } else {
        radio2Object[name] = item.value || myDefault;
      }
      data['radio5.8G'] = radio5Object;
      data['radio2.4G'] = radio2Object;
      this.props.changeWifiSettings(data);
    };
  }

  onSave() {
    this.props.validateAll()
      .then((invalid) => {
        if (invalid.isEmpty()) {
          this.props.setWifi();
        }
      });
  }

  getCurrData(name) {
    const modeVal = this.state.frequency;
    let ret;
    if (name !== 'groupname') {
      if (modeVal === '5G') {
        ret = this.props.store.getIn(['data', 'curr', 'radio5.8G', name]);
      } else {
        ret = this.props.store.getIn(['data', 'curr', 'radio2.4G', name]);
      }
    } else {
      ret = this.props.store.getIn(['data', 'curr', name]);
    }
    return ret;
  }

  getChannelsValue(country) {
    let ret = parseInt(this.getCurrData('channel'));
    const maxChannel = getChannelsOptions(country).length - 1;
    if (ret > maxChannel) {
      ret = maxChannel.toString();
    }

    return `${ret}`;
  }
  getGroupOptions() {
    return this.props.store
      .getIn(['data', 'list'])
      .map((item, i) => {
        const groupname = item.get('groupname');
        let label = groupname;

        if (groupname === 'Default') {
          label = __('Ungrouped Devices');
        }
        return {
          value: groupname,
          label,
        };
      })
      .toJS();
  }
  getChannelWidthOptions() {
    const modeVal = this.state.frequency;
    let $$ret = channelBandwidthOptions;

    if (modeVal === '5G') {
      $$ret = $$ret.push(fromJS({
        value: '80',
        label: '80',
      }));
    }

    return $$ret;
  }

  render() {
    const {
      password, vlanid, ssid, upstream, downstream,
    } = this.props.validateOption;
    const groupOptions = this.getGroupOptions();
    const countryOptions = getCountryOptions();
    const getCurrData = this.getCurrData;
    const channelsOptions = getChannelsOptions(getCurrData('country'));
    const myChannelWidthOptions = this.getChannelWidthOptions();
    const noControl = this.props.app.get('noControl');
    return (
      <div>
        <h3>{ __('Current Group') }</h3>
        <FormGroup
          type="select"
          label={msg.selectGroup}
          options={groupOptions}
          value={getCurrData('groupname')}
          id="groupname"
          onChange={this.onChangeGroup}
        />
        <h3>{ __('Current Frequency') }</h3>
        <FormGroup
          type="switch"
          label={__('Frequency')}
          inputStyle={{
            width: '199px',
          }}
          options={[
            {
              value: '2.4G',
              label: '2.4G',
            }, {
              value: '5G',
              label: '5G',
            },
          ]}
          value={this.state.frequency}
          onChange={this.onChangeFrequency}
        />
        <h3>{__('Basic Configuration')}</h3>
        <FormGroup
          label={__('SSID')}
          required
          value={getCurrData('ssid')}
          maxLength="31"
          id="ssid"
          onChange={this.onUpdateSettings('ssid')}
          {...ssid}
        />
        <FormGroup
          label={__('SSID Isolation')}
          id="ssidisolate"
          required
          type="checkbox"
          checked={getCurrData('ssidisolate') === '1'}
          onChange={this.onUpdate('ssidisolate')}
        />
        <FormGroup
          type="select"
          label={__('Tx Power')}
          options={txPowerOptions}
          value={getCurrData('txpower')}
          id="txpower"
          onChange={this.onUpdate('txpower')}
        />
        <FormGroup
          type="switch"
          label={__('Encryption')}
          options={encryptionOptions}
          value={getCurrData('encryption')}
          onChange={this.onUpdateSettings('encryption')}
        />
        {
          getCurrData('encryption') === 'psk-mixed' ?
            <FormGroup
              label={__('Password')}
              type="password"
              required
              value={getCurrData('password')}
              maxLength="31"
              onChange={this.onUpdateSettings('password')}
              {...password}
            /> : null
        }
        <FormGroup
          label={__('VLAN')}
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
          { __('VLAN ID:') }
          <FormInput
            type="text"
            style={{ marginLeft: '3px' }}
            className="input-sm"
            disabled={getCurrData('vlanenable') != '1'}
            value={getCurrData('vlanid')}
            onChange={this.onUpdate('vlanid')}
          />
          <span className="help">(2 - 4095)</span>
        </FormGroup>
        <h3>{__('Radio Settings')}</h3>
        <FormGroup
          type="select"
          label={__('Country')}
          options={countryOptions}
          value={getCurrData('country')}
          onChange={this.onUpdateSettings('country')}
        />
        <FormGroup
          type="select"
          label={__('Channel')}
          options={channelsOptions}
          value={getCurrData('channel')}
          onChange={this.onUpdateSettings('channel')}
        />
        {
          this.state.frequency === '5G' ? (
            <FormGroup label={__('Channel Bandwidth')} >
              <Switchs
                options={myChannelWidthOptions}
                value={getCurrData('channelsBandwidth')}
                onChange={this.onUpdateSettings('channelsBandwidth')}
              />
            </FormGroup>
            ) : (
              <FormGroup label={__('Channel Bandwidth')} >
                <Switchs
                  options={channelBandwidthOptions}
                  value={getCurrData('channelsBandwidth')}
                  onChange={this.onUpdateSettings('channelsBandwidth')}
                />
              </FormGroup>
            )
        }
        <h3>{__('Bandwidth Control')}</h3>
        <FormGroup
          label={msg.upSpeed}
          help="KB/s"
          required={getCurrData('upstream') !== '0'}
          value={getCurrData('upstream')}
          {...upstream}
        >
          <FormInput
            type="checkbox"
            value="64"
            checked={getCurrData('upstream') === '' || getCurrData('upstream') > 0}
            onChange={this.onUpdate('upstream')}
          />
          {`${__('limited to')} `}
          <FormInput
            type="number"
            maxLength="6"
            size="sm"
            disabled={getCurrData('upstream') === '0'}
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
            checked={getCurrData('downstream') === '' || getCurrData('downstream') > 0}
            onChange={this.onUpdate('downstream')}
          />
          {`${__('limited to')} `}
          <FormInput
            type="number"
            maxLength="6"
            size="sm"
            disabled={getCurrData('downstream') === '0'}
            value={getCurrData('downstream')}
            onChange={this.onUpdate('downstream')}
          />
        </FormGroup>

        <div className="form-group form-group-save">
          <div className="form-control">
            {
              noControl ? null : (
                <SaveButton
                  type="button"
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
}

Wireless.propTypes = propTypes;

// React.PropTypes.instanceOf(Immutable.List).isRequired
function mapStateToProps(state) {
  const myState = state.wireless;

  return {
    store: myState,
    app: state.app,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    { fetchDeviceGroups },
    appActions,
    myActions,
  ), dispatch);
}

// 添加 redux 属性的 react 页面
export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(Wireless);

export const reducer = myReducer;
