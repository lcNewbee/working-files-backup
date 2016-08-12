import React, { PropTypes } from 'react';
import Select from 'react-select';
import { connect } from 'react-redux';
import { FormGroup, FormInput } from 'shared/components';
import Switchs from 'shared/components/Switchs';
import Button from 'shared/components/Button';
import * as actions from './actions.js';
import reducer from './reducer.js';

const propTypes = {
  data: PropTypes.object,
};

const defaultProps = {};

const typeArr = [
  {
    value: 'ap',
    label: _('AP'),
  },
  {
    value: 'station',
    label: _('Station'),
  },
  {
    value: 'repeater',
    label: _('Repeater'),
  },
];

const countryOptions = [
  { value: 'China', label: 'China' },
  { value: 'America', label: 'America' },
];

const rateOptions = [
  { value: 'MCS0', label: 'MSC0' },
  { value: 'MCS1', label: 'MSC1' },
  { value: 'MCS2', label: 'MCS2' },
  { value: 'MCS3', label: 'MCS3' },
  { value: 'MCS4', label: 'MCS4' },
  { value: 'MCS5', label: 'MCS5' },
  { value: 'MCS6', label: 'MCS6' },
  { value: 'MCS7', label: 'MCS7' },
];

const securityOptions = [
  { value: 'None', label: 'None' },
  { value: 'WPA-AES', label: 'WPA-AES' },
  { value: 'WPA2-AES', label: 'WPA2-AES' },
  { value: 'WEP', label: 'WEP' },
];

const wepAuthenOptions = [
  { value: 'Open', label: 'Open' },
  { value: 'Shared', label: 'Shared' },
];

const wepKeyLengthOptions = [
  { value: '64bit', label: '64bit' },
  { value: '128bit', label: '128bit' },
];

const keyIndexOptions = [
  { value: 'key 1', label: 'key 1' },
  { value: 'key 2', label: 'key 2' },
  { value: 'key 3', label: 'key 3' },
  { value: 'key 4', label: 'key 4' },
];

const keyTypeOptions = [
  { value: 'Hex', label: 'Hex' },
  { value: 'ASCII', label: 'ASCII' },
];

export default class Basic extends React.Component {

  render() {
    return (
      <div>
        <FormGroup
          label={_('Wireless Mode')}
        >
          <Switchs
            size="lg"
            options={typeArr}
            value={this.props.data.get('WirelessMode')}
          />
        </FormGroup>
        <FormGroup
          label="SSID"
        />
        <FormGroup
          label={_('Scan')}
        >
          <Button
            text={_('Start Scan')}
          />
        </FormGroup>
        <FormGroup
          label={_('Lock To AP')}
        />
        <FormGroup
          label={_('Hide SSID')}
          type="checkbox"
        />
        <FormGroup
          label={_('Country Code')}
        >
          <Select
            name="countryCode"
            value="China"
            options={countryOptions}
          />
        </FormGroup>
        <FormGroup
          label={_('IEEE 802.11 Mode')}
        >
          B/G/N/AC
        </FormGroup>
        <FormGroup
          label={_('Channel Bandwidth')}
        >
          40MHz
        </FormGroup>
        <FormGroup
          label={_('Outpower Power')}
        >
          <FormInput
            type="number"
          />
        </FormGroup>
        <FormGroup
          label={_('Max TX Rate')}
        >
          <Select
            name="maxtxrate"
            value="MCS7"
            options={rateOptions}
          />
        </FormGroup>
        <FormGroup
          label={_('Security')}
        >
          <Select
            name="securityMode"
            value="WEP"
            options={securityOptions}
          />
        </FormGroup>
        <FormGroup
          label={_('Keys')}
        >
          <FormInput
            type="password"
          />
        </FormGroup>
        <FormGroup
          label={_('Authentication Type')}
        >
          <Select
            name="authenticationType"
            options={wepAuthenOptions}
          />
        </FormGroup>
        <FormGroup
          label={_('WEP Key Length')}
        >
          <Select
            name="wepKeyLength"
            options={wepKeyLengthOptions}
          />
        </FormGroup>
        <FormGroup
          label={_('WEP Key Length')}
        >
          <Select
            name="wepKeyLength"
            options={wepKeyLengthOptions}
          />
        </FormGroup>
        <FormGroup
          label={_('Key Index')}
        >
          <Select
            name="keyIndex"
            options={keyIndexOptions}
          />
        </FormGroup>
        <FormGroup
          label={_('Key 1')}
        >
          <span className="fl">{_('Type')}</span>
          <Select
            className="fl"
            name="keyType"
            options={keyTypeOptions}
          />
          <span>{_('Keys')}</span>
          <FormInput
            type="password"
          />
        </FormGroup>
        <FormGroup
          label={_('Key 2')}
        >
          <span className="fl">{_('Type')}</span>
          <Select
            className="fl"
            name="keyType"
            options={keyTypeOptions}
          />
          <span>{_('Keys')}</span>
          <FormInput
            type="password"
          />
        </FormGroup>
        <FormGroup
          label={_('Key 3')}
        >
          <span className="fl">{_('Type')}</span>
          <Select
            className="fl"
            name="keyType"
            options={keyTypeOptions}
          />
          <span>{_('Keys')}</span>
          <FormInput
            type="password"
          />
        </FormGroup>
        <FormGroup
          label={_('Key 4')}
        >
          <span className="fl">{_('Type')}</span>
          <Select
            className="fl"
            name="keyType"
            options={keyTypeOptions}
          />
          <span>{_('Keys')}</span>
          <FormInput
            type="password"
          />
        </FormGroup>
      </div>
    );
  }
}

Basic.propTypes = propTypes;
Basic.defaultProps = defaultProps;

function mapStateToProps(state) {
  const myState = state.basic;

  return {
    fecthing: myState.get('fetching'),
    data: myState.get('data'),
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(Basic);

export const basic = reducer;
