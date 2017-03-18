import React, { PropTypes, PureComponent } from 'react';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
import { fromJS, Map, List } from 'immutable';
import { connect } from 'react-redux';
import validator from 'shared/validator';
import * as appActions from 'shared/actions/app';
import { FormGroup, FormInput } from 'shared/components/Form';
import { SaveButton } from 'shared/components';
import Switchs from 'shared/components/Switchs';
import channels from 'shared/config/country.json';
import * as myActions from './actions';
import { fetchDeviceGroups } from '../GroupSettings/actions';
import myReducer from './reducer';

const msg = {
  upSpeed: _('Up Speed'),
  downSpeed: _('Down Speed'),
  selectGroup: _('Select Group'),
};
const encryptionOptions = [
  {
    value: 'none',
    label: _('NONE'),
  },
  {
    value: 'psk-mixed',
    label: _('STRONG'),
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
       label: b28n.getLang() === 'cn' ? _(item.cn) : _(item.en),
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
      label: _('auto'),
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
  validateOption: PropTypes.object,
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
};

export class Wireless extends PureComponent {
  constructor(props) {
    super(props);

    utils.binds(this, [
      'onUpdate', 'onChangeGroup', 'onChangeEncryption', 'onUpdateSettings',
      'onSave', 'getCurrData', 'getGroupOptions', 'getChannelsOptions',
      'getChannelsValue',
    ]);
    this.state = {
      frequency: '2.4G',
    };
  }
  componentWillMount() {
    this.props.fetchWifiSettings();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.props.fetchWifiSettings();
    }
  }

  componentWillUnmount() {
    this.props.resetVaildateMsg();
  }

  onUpdate(name) {
    return (item) => {
      const data = {};

      data[name] = item.value;
      this.props.changeWifiSettings(data);
    };
  }

  onChangeGroup(item) {
    this.props.changeWifiGroup(item.value);
  }

  onChangeEncryption(item) {
    const data = {
      encryption: item.value,
    };

    this.props.changeWifiSettings(data);
  }

  onUpdateSettings(name) {
    return (item) => {
      const data = {};
      data[name] = item.value;

      if (name === 'country') {
        data.channel = this.getChannelsValue(item.value);
      }

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

  getCurrData(name, defaultVal) {
    const myDefault = defaultVal || '';

    return this.props.store.getIn(['data', 'curr', name]) || myDefault;
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
          label = _('Ungrouped Devices');
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
          label={_('SSID')}
          required
          value={getCurrData('ssid')}
          maxLength="31"
          id="ssid"
          onChange={this.onUpdateSettings('ssid')}
          {...ssid}
        />
        <FormGroup
          type="switch"
          label={_('Encryption')}
          options={encryptionOptions}
          value={getCurrData('encryption')}
          onChange={this.onUpdateSettings('encryption')}
        />
        {
          getCurrData('encryption') === 'psk-mixed' ?
            <FormGroup
              label={_('Password')}
              type="password"
              required
              value={getCurrData('password')}
              maxLength="31"
              onChange={this.onUpdateSettings('password')}
              {...password}
            /> : null
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
            style={{ marginLeft: '3px' }}
            className="input-sm"
            disabled={getCurrData('vlanenable') != '1'}
            value={getCurrData('vlanid')}
            onChange={this.onUpdate('vlanid')}
          />
          <span className="help">(2 - 4095)</span>
        </FormGroup>
        <h3>{_('Radio Settings')}</h3>
        <FormGroup
          type="select"
          label={_('Country')}
          options={countryOptions}
          value={getCurrData('country')}
          onChange={this.onUpdateSettings('country')}
        />
        <FormGroup
          type="switch"
          label={_('Frequency')}
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
          onChange={
            data => this.setState({
              frequency: data.value,
            })
          }
        />
        {
          this.state.frequency === '5G' ? (
            <div>
              <FormGroup
                type="select"
                label={_('Channel')}
                options={channelsOptions}
                value={getCurrData('channel5g')}
                onChange={this.onUpdateSettings('channel5g')}
              />
              <FormGroup label={_('Channel Bandwidth')} >
                <Switchs
                  options={myChannelWidthOptions}
                  value={getCurrData('channelsBandwidth5g')}
                  onChange={this.onUpdateSettings('channelsBandwidth5g')}
                />
              </FormGroup>
            </div>
            ) : (
            <div>
              <FormGroup
                type="select"
                label={_('Channel')}
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
            </div>
            )
        }
        <h3>{_('Bandwidth Control')}</h3>
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
          {`${_('limited to')} `}
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
          {`${_('limited to')} `}
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
