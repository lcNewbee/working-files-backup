import React, { PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
import validator from 'shared/utils/lib/validator';
import { FormInput, FormGroup } from 'shared/components/Form';
import { SaveButton } from 'shared/components/Button';
import * as sharedActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import * as selfActions from './actions.js';
import reducer from './reducer.js';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  save: PropTypes.func,
  route: PropTypes.object,
  app: PropTypes.instanceOf(Map),
  validateOption: PropTypes.object,
  validateAll: PropTypes.func,
  saveSettings: PropTypes.func,

  leaveSettingsScreen: PropTypes.func,
  leaveScreen: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  productInfo: PropTypes.instanceOf(Map),
  selfState: PropTypes.instanceOf(Map),
  changeCurrRadioConfig: PropTypes.func,
};

const validOptions = Map({
  validLed1: validator({
    rules: 'num:[-98, -10]',
  }),
  validLed2: validator({
    rules: 'num:[-98, -10]',
  }),
  validLed3: validator({
    rules: 'num:[-98, -10]',
  }),
  validLed4: validator({
    rules: 'num:[-98, -10]',
  }),
  validSens: validator({
    rules: 'num:[-98, -10]',
  }),
});

export default class Advance extends React.Component {
  constructor(prop) {
    super(prop);
    this.onSave = this.onSave.bind(this);
    this.firstInAndRefresh = this.firstInAndRefresh.bind(this);
    this.changeFormValue = this.changeFormValue.bind(this);
  }

  componentWillMount() {
    this.firstInAndRefresh();
  }

  componentDidUpdate(prevProps) {
    if (this.props.app.get('refreshAt') !== prevProps.app.get('refreshAt')) {
      this.firstInAndRefresh();
    }
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
    this.props.resetVaildateMsg();
  }

  onSave() {
    const radioId = this.props.selfState.getIn(['currRadioConfig', 'radioId']);
    const saveData = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    this.props.validateAll().then((msg) => {
      if (msg.isEmpty()) {
        this.props.save('goform/set_adv_wireless', saveData);
        console.log('saveData', saveData);
      }
    });
  }

  onChangeRadio(data) {
    const radioType = this.props.productInfo.getIn(['deviceRadioList', data.value, 'radioType']);
    const config = fromJS({
      radioId: data.value,
      radioType,
    });
    this.props.changeCurrRadioConfig(config);
  }

  firstInAndRefresh() {
    const props = this.props;
    this.props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.fetchUrl,
      saveUrl: props.route.saveUrl,
    });
    this.props.fetchSettings();
    this.onChangeRadio({ value: '0' });
  }

  changeFormValue(id, name, value) {
    // id为射频编号，name为所配置的变量名
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                      .setIn([id, name], value);
    this.props.updateItemSettings({ radioList });
  }

  render() {
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    if (!this.props.store.getIn(['curData', 'radioList', radioId])) return null;
    const {
      sensEnable, distance, sensThreshold, rtsEnable, rts, autoAdjust,
      led1Threshold, led2Threshold, led3Threshold, led4Threshold, beaconInterval,
      dtimInterval, segmentThresh, ampdu, fiveFirst, multiToUnicast, tgmpSnoop,
      multiMonitor, probeRqstForbid, timeFairness, beamforming,
    } = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    const { validLed1, validLed2, validLed3, validLed4, validSens } = this.props.validateOption;
    return (
      <div className="advanceWrap">
        {
          this.props.productInfo.get('deviceRadioList').size > 1 ? (
            <FormGroup
              type="switch"
              label={_('Radio Select')}
              value={this.props.selfState.getIn(['currRadioConfig', 'radioId'])}
              options={this.props.productInfo.get('radioSelectOptions')}
              minWidth="100px"
              onChange={(data) => { this.onChangeRadio(data); }}
            />
          ) : null
        }
        <h3>{_('Advance')}</h3>
        {/*
          <FormGroup
            type="number"
            label={_('Beacon Interval')}
            value={beaconInterval}
            onChange={(data) => { this.changeFormValue(radioId, 'beaconInterval', data.value); }}
          />
          <FormGroup
            type="number"
            label={_('DTIM Interval')}
            value={dtimInterval}
            onChange={(data) => { this.changeFormValue(radioId, 'dtimInterval', data.value); }}
          />
        */}
        <div className="clearfix">
          <div style={{ width: '300px' }} >
            <FormGroup
              className="fl"
              label={_('RTS Threshold')}
              type="number"
              placeholder={_('Range: ')}
              disabled={rtsEnable === '0'}
              value={rts}
              onChange={(data) => { this.changeFormValue(radioId, 'rts', data.value); }}
              required
            />
          </div>
          <span
            className="fl"
            style={{
              marginTop: '12px',
              marginLeft: '4px',
            }}
          >
            <label htmlFor="threshold">
              <input
                id="threshold"
                type="checkbox"
                checked={rtsEnable === '0'}
                onChange={() => {
                  const value = rtsEnable === '0' ? '1' : '0';
                  this.changeFormValue(radioId, 'rtsEnable', value);
                }}
                style={{ marginRight: '3px' }}
              />
              {_('Default')}
            </label>
          </span>
        </div>

        {/*
          <FormGroup
            type="number"
            label={_('Segment Threshold')}
            value={segmentThresh}
            onChange={(data) => { this.changeFormValue(radioId, 'segmentThresh', data.value); }}
          />

          <FormGroup
            type="number"
            label={_('AMPDU')}
            value={ampdu}
            onChange={(data) => { this.changeFormValue(radioId, 'ampdu', data.value); }}
          />
        */}
        <div className="clearfix">
          <div style={{ width: '300px' }} >
            <FormGroup
              className="fl"
              label={_('Sensitivity Threshold')}
              type="number"
              disabled={sensEnable === '0'}
              placeholder={_('Range: -90 ~ -50')}
              value={sensThreshold}
              onChange={(data) => { this.changeFormValue(radioId, 'sensThreshold', data.value); }}
              required
              {...validSens}
            />
          </div>
          <span
            className="fl"
            style={{
              marginTop: '12px',
              marginLeft: '4px',
            }}
          >
            <label htmlFor="sensThreshold">
              <input
                id="sensThreshold"
                type="checkbox"
                checked={sensEnable === '0'}
                onChange={() => {
                  const value = sensEnable === '1' ? '0' : '1';
                  this.changeFormValue(radioId, 'sensEnable', value);
                }}
                style={{ marginRight: '3px' }}
              />
              {_('Default')}
            </label>
          </span>
        </div>
        <div className="clearfix">
          <FormGroup
            className="fl"
            type="range"
            label={_('Distance Value')}
            min="0"
            max="10"
            step="0.1"
            help="km"
            value={distance}
            hasTextInput
            disabled={autoAdjust === '1'}
            onChange={(data) => { this.changeFormValue(radioId, 'distance', data.value); }}
          />
          <span
            className="fl"
            style={{
              marginTop: '12px',
              marginLeft: '4px',
            }}
          >
            <label htmlFor="distance">
              <input
                id="distance"
                type="checkbox"
                checked={autoAdjust === '1'}
                onChange={() => {
                  const value = autoAdjust === '1' ? '0' : '1';
                  this.changeFormValue(radioId, 'autoAdjust', value);
                }}
                style={{ marginRight: '3px' }}
              />
              {_('auto')}
            </label>
          </span>
        </div>
        {/*
          {
            radioType === '5G' ? (
              <FormGroup
                type="checkbox"
                label={_('5G First')}
                checked={fiveFirst === '1'}
                onChange={() => {
                  const value = fiveFirst === '1' ? '0' : '1';
                  this.changeFormValue(radioId, 'fiveFirst', value);
                }}
              />
            ) : null
          }
          <FormGroup
            type="checkbox"
            label={_('Multicast To Unicast')}
            checked={multiToUnicast === '1'}
            onChange={() => {
              const value = multiToUnicast === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'multiToUnicast', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={_('TGMP Snooping')}
            checked={tgmpSnoop === '1'}
            onChange={() => {
              const value = tgmpSnoop === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'tgmpSnoop', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={_('Multicast Monitor')}
            checked={multiMonitor === '1'}
            onChange={() => {
              const value = multiMonitor === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'multiMonitor', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={_('Probe Request Forbidden')}
            checked={probeRqstForbid === '1'}
            onChange={() => {
              const value = probeRqstForbid === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'probeRqstForbid', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={_('Airtime Fairness')}
            checked={timeFairness === '1'}
            onChange={() => {
              const value = timeFairness === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'timeFairness', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={_('Beamforming')}
            checked={beamforming === '1'}
            onChange={() => {
              const value = beamforming === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'beamforming', value);
            }}
          />
        */}
        <div className="signalLedConfg">
          <FormGroup
            label={_('Signal LED Thresholds')}
          >
            <br /><br />
            <div
              style={{
                marginLeft: '-130px',
                marginRight: '5px',
              }}
            >
              <FormGroup
                className="threshdForLed"
                id="threshdForLed1"
                type="number"
                label="LED1"
                help={"dbm " + _('range:') + " -98 ~ -10"}
                value={led1Threshold}
                onChange={(data) => { this.changeFormValue(radioId, 'led1Threshold', data.value); }}
                size="sm"
                required
                {...validLed1}
              />
            </div>
            <br /><br />
            <div
              style={{
                marginLeft: '-130px',
                marginRight: '5px',
                marginTop: '-40px',
              }}
            >
              <FormGroup
                className="threshdForLed"
                id="threshdForLed2"
                type="number"
                label="LED2"
                help={"dbm " + _('range:') + " -98 ~ -10"}
                value={led2Threshold}
                onChange={(data) => { this.changeFormValue(radioId, 'led2Threshold', data.value); }}
                size="sm"
                required
                {...validLed2}
              />
            </div>
            <br /><br />
            <div
              style={{
                marginLeft: '-130px',
                marginRight: '5px',
                marginTop: '-40px',
              }}
            >
              <FormGroup
                className="threshdForLed"
                id="threshdForLed3"
                type="number"
                label="LED3"
                help={"dbm " + _('range:') + " -98 ~ -10"}
                value={led3Threshold}
                onChange={(data) => { this.changeFormValue(radioId, 'led3Threshold', data.value); }}
                size="sm"
                required
                {...validLed3}
              />
            </div>
            <br /><br />
            <div
              style={{
                marginLeft: '-130px',
                marginRight: '5px',
                marginTop: '-40px',
              }}
            >
              <FormGroup
                className="threshdForLed"
                id="threshdForLed4"
                type="number"
                label="LED4"
                help={"dbm " + _('range:') + " -98 ~ -10"}
                value={led4Threshold}
                onChange={(data) => { this.changeFormValue(radioId, 'led4Threshold', data.value); }}
                size="sm"
                required
                {...validLed4}
              />
            </div>
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <SaveButton
              loading={this.props.app.get('saving')}
              onClick={() => this.onSave()}
            />
          </FormGroup>
        </div>
      </div>
    );
  }
}

Advance.propTypes = propTypes;


function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.advance,
    productInfo: state.product,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions)
)(Advance);

export const advance = reducer;
