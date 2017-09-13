import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import validator from 'shared/validator';
import { FormGroup, FormInput } from 'shared/components/Form';
import { SaveButton } from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import PureComponent from 'shared/components/Base/PureComponent';
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

const propTypes = {
  changeGuestGroup: PropTypes.func,
  fetchGuestSettings: PropTypes.func,
  setGuest: PropTypes.func,
  changeGuestSettings: PropTypes.func,
  validateAll: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  validateOption: PropTypes.object,
  store: PropTypes.instanceOf(Map),
  app: PropTypes.instanceOf(Map),
};

const validOptions = Map({
  guestssid: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[1, 31]',
  }),
  password: validator({
    rules: 'remarkTxt:["\'\\\\"]|len:[8, 31]',
  }),
  upstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),
  downstream: validator({
    rules: 'num:[32, 102400, 0]',
  }),

  vlanid: validator({
    rules: 'num:[2, 4095]',
  }),
});

export class Guest extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      frequency: '2.4G',
    };
    utils.binds(this, [
      'onUpdate',
      'onChangeGroup',
      'onChangeEncryption',
      'onSave',
      'getCurrData',
      'getGroupOptions',
    ]);
  }

  componentWillMount() {
    this.props.fetchGuestSettings();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.app.get('refreshAt') !== this.props.app.get('refreshAt')) {
      this.props.fetchGuestSettings();
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
      this.props.changeGuestSettings(data);
    };
  }

  onChangeGroup(item) {
    this.props.changeGuestGroup(item.value);
  }

  onChangeEncryption(item) {
    const data = {};
    const radio5Object = {};
    const radio2Object = {};
    const modeVal = this.state.frequency;
    if (modeVal === '5G') {
      radio5Object.encryption = item.value;
    } else {
      radio2Object.encryption = item.value;
    }
    data['radio5.8G'] = radio5Object;
    data['radio2.4G'] = radio2Object;
    this.props.changeGuestSettings(data);
  }

  onSave() {
    this.props.validateAll()
      .then((invalid) => {
        if (invalid.isEmpty()) {
          this.props.setGuest();
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

  getGroupOptions() {
    return this.props.store
      .getIn(['data', 'list'])
      .map((item) => {
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

  render() {
    const groupOptions = this.getGroupOptions();
    const { password, guestssid, upstream, downstream, vlanid } = this.props.validateOption;
    const getCurrData = this.getCurrData;
    const noControl = this.props.app.get('noControl');

    let settngClassName = 'none';

    if (getCurrData('enable') === '1') {
      settngClassName = '';
    }

    return (
      <div>
        <h3>{ __('Current Group') }</h3>
        <FormGroup
          label={msg.selectGroup}
          type="select"
          options={groupOptions}
          value={getCurrData('groupname')}
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
          onChange={
            data => this.setState(
              {
                frequency: data.value,
              },
            )
          }
        />
        <h3>{__('Guest Settings') }</h3>
        <FormGroup
          label={__('Enable Guest')}
          type="checkbox"
          options={{
            label: __('Enable'),
          }}
          checked={getCurrData('enable') == '1'}
          onChange={this.onUpdate('enable')}
        />

        <div className={settngClassName}>
          <FormGroup
            label={__('Guest SSID')}
            required
            maxLength="31"
            value={getCurrData('guestssid')}
            onChange={this.onUpdate('guestssid')}

            {...guestssid}
          />

          <FormGroup
            label={__('Encryption')}
            type="select"
            value={getCurrData('encryption')}
            options={encryptionOptions}
            onChange={this.onChangeEncryption}
          />
          {
            getCurrData('encryption') === 'psk-mixed' ?
              <FormGroup
                label={__('Password')}
                required
                type="password"
                maxLength="31"
                className="text"
                value={getCurrData('password')}
                onChange={this.onUpdate('password')}
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
              style={{ marginLeft: '3px', width: '115px' }}
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
              checked={getCurrData('upstream') === '' || getCurrData('upstream') > 0}
              onChange={this.onUpdate('upstream')}
            />
            {__('limited to') + ' '}
            <FormInput
              type="number"
              maxLength="6"
              size="sm"
              style={{ width: '115px' }}
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
            {__('limited to') + ' '}
            <FormInput
              type="number"
              maxLength="6"
              size="sm"
              style={{ width: '115px' }}
              disabled={getCurrData('downstream') === '0'}
              value={getCurrData('downstream')}
              onChange={this.onUpdate('downstream')}
            />
          </FormGroup>
          {/* <FormGroup
            type="checkbox"
            label={__('Enable Portal')}
            options={{
              label: __('Enable'),
            }}
            checked={getCurrData('portalenable') == '1'}
            onChange={this.onUpdate('portalenable')}
          /> */}
        </div>

        <FormGroup role="save">
          {
            noControl ? null : (
              <SaveButton
                type="button"
                loading={this.props.app.get('saving')}
                onClick={this.onSave}
              />
            )
          }
        </FormGroup>
      </div>
    );
  }
}

Guest.propTypes = propTypes;

function mapStateToProps(state) {
  const myState = state.guest;

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

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(Guest);

export const reducer = myReducer;
