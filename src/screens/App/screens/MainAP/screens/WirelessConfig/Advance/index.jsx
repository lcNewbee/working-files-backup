import React, { PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
import validator from 'shared/validator';
import { FormInput, FormGroup } from 'shared/components/Form';
import { SaveButton } from 'shared/components/Button';
import * as sharedActions from 'shared/actions/settings';
import * as appActions from 'shared/actions/app';
import * as selfActions from './actions';
import reducer from './reducer';

// 可配置功能项
/**
advance: {
    ledThreshFun: true, // 信号强度控制LED灯功能
    beaconIntervalFun: false, // Beacon帧间间隔
    dtimIntervalFun: false, // DTIM间隔
    segmentThreshFun: false, // 分片阈值
    ampduFun: false, // ampdu值
    rateSetFun: false, // 速率集
    rssiLimitFun: false, // rssi限制
    airTimeFairnessFun: false, // 时间公平性
  }
 */

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
  fetch: PropTypes.func,
  createModal: PropTypes.func,

  leaveSettingsScreen: PropTypes.func,
  leaveScreen: PropTypes.func,
  resetVaildateMsg: PropTypes.func,
  productInfo: PropTypes.instanceOf(Map),
  selfState: PropTypes.instanceOf(Map),
  changeCurrRadioConfig: PropTypes.func,
  changeRateSetOptions: PropTypes.func,
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
  validBeacon: validator({
    rules: 'num:[1, 3500]',
  }),
  validDtim: validator({
    rules: 'num:[1, 255]',
  }),
  validSegment: validator({
    rules: 'num:[256, 2347, 0]',
    // exclude: '0',
  }),
  validAmpdu: validator({
    rules: 'num:[1, 64]',
  }),
  validRts: validator({
    rules: 'num:[1, 2347]',
  }),
});

export default class Advance extends React.Component {
  constructor(prop) {
    super(prop);
    this.onSave = this.onSave.bind(this);
    this.firstInAndRefresh = this.firstInAndRefresh.bind(this);
    this.changeFormValue = this.changeFormValue.bind(this);
    this.makeRateSetOptions = this.makeRateSetOptions.bind(this);
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
    const rssiEnable = this.props.store.getIn(['curData', 'radioList', radioId, 'rssiEnable']);
    this.props.validateAll().then((msg) => {
      if (msg.isEmpty()) {
        const rssi = this.props.store.getIn(['curData', 'radioList', radioId, 'rssi']);
        if (this.props.route.funConfig.rssiLimitFun && rssiEnable === '1' &&
          (rssi < -98 || rssi > -40 || !Number.isInteger(Number(rssi)))) {
          this.props.createModal({
            role: 'alert',
            text: __('Please input a valid rssi value.'),
          });
        } else {
          this.props.save('goform/set_adv_wireless', saveData);
        }
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
    Promise.resolve().then(() => {
      this.onChangeRadio({ value: '0' });
    }).then(() => {
      this.makeRateSetOptions();
    });
  }

  changeFormValue(id, name, value) {
    // id为射频编号，name为所配置的变量名
    const radioList = this.props.store.getIn(['curData', 'radioList'])
                      .setIn([id, name], value);
    this.props.updateItemSettings({ radioList });
  }

  makeRateSetOptions() {
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    const radio = radioType;
    let radioMode;
    function converListToOptions(list) { // list为immutable模式
      return list.map(item => ({
        label: item,
        value: item,
      }));
    }
    this.props.fetch('goform/get_base_wl_info_forTestUse').then((json) => {
      if (json.state && json.state.code === 2000) {
        radioMode = json.data.radioList[radioId].radioMode;
      }
      return { radio, radioMode };
    }).then(query => this.props.fetch('goform/get_rate_set', query)).then((data) => {
      if (data.state && data.state.code === 2000) {
        const rateSetOptions = converListToOptions(fromJS(data.data.rateSetList));
        this.props.changeRateSetOptions(rateSetOptions);
      }
    });
  }

  render() {
    const { radioId, radioType } = this.props.selfState.get('currRadioConfig').toJS();
    if (!this.props.store.getIn(['curData', 'radioList', radioId])) return null;
    const {
      sensEnable, distance, sensThreshold, rtsEnable, rts, autoAdjust,
      led1Threshold, led2Threshold, led3Threshold, led4Threshold, beaconInterval,
      dtimInterval, segmentThresh, ampdu, fiveFirst, multiToUnicast, tgmpSnoop,
      multiMonitor, probeRqstForbid, timeFairness, beamforming, rateSet, rssiEnable,
      rssi, airTimeEnable, fairAlgthm,
    } = this.props.store.getIn(['curData', 'radioList', radioId]).toJS();
    const { validLed1, validLed2, validLed3, validLed4, validSens, validBeacon, validDtim, validSegment, validAmpdu, validRts } = this.props.validateOption;
    const funConfig = this.props.route.funConfig;
    return (
      <div className="advanceWrap">
        {
          this.props.productInfo.get('deviceRadioList').size > 1 ? (
            <FormInput
              type="switch"
              label={__('Radio Select')}
              value={this.props.selfState.getIn(['currRadioConfig', 'radioId'])}
              options={this.props.productInfo.get('radioSelectOptions')}
              minWidth="100px"
              onChange={(data) => {
                Promise.resolve().then(() => {
                  this.onChangeRadio(data);
                }).then(() => {
                  this.makeRateSetOptions();
                });
              }}
              style={{
                marginRight: '10px',
                marginBottom: '15px',
              }}
            />
          ) : null
        }
        <h3>{__('Advance')}</h3>
        { // Beacon帧间间隔
          funConfig.beaconIntervalFun ? (
            <FormGroup
              type="number"
              label={__('Beacon Interval')}
              min="1"
              max="3500"
              defaultValue="100"
              value={beaconInterval}
              help={`${__('Range: ')}1 ~ 3500`}
              style={{ width: '490px' }}
              onChange={(data) => { this.changeFormValue(radioId, 'beaconInterval', data.value); }}
              required
              {...validBeacon}
            />
          ) : null
        }
        { // DTIM间隔
          funConfig.dtimIntervalFun ? (
            <FormGroup
              type="number"
              label={__('DTIM Interval')}
              value={dtimInterval}
              min="1"
              max="255"
              help={`${__('Range: ')}1 ~ 255`}
              style={{ width: '490px' }}
              onChange={(data) => { this.changeFormValue(radioId, 'dtimInterval', data.value); }}
              required
              {...validDtim}
            />
          ) : null
        }
        { // 分片阈值
          funConfig.segmentThreshFun ? (
            <FormGroup
              type="number"
              label={__('Segment Threshold')}
              value={segmentThresh}
              min="0"
              max="2347"
              help={`${__('Range: ')}${__('0 or 256 ~ 2347')}`}
              style={{ width: '610px' }}
              onChange={(data) => { this.changeFormValue(radioId, 'segmentThresh', data.value); }}
              required
              {...validSegment}
            />
          ) : null
        }
        { // ampdu值
          funConfig.ampduFun ? (
            <FormGroup
              type="number"
              label={__('AMPDU')}
              value={ampdu}
              min="1"
              max="64"
              help={`${__('Range: ')}1 ~ 64`}
              onChange={(data) => { this.changeFormValue(radioId, 'ampdu', data.value); }}
              required
              style={{ width: '490px' }}
              {...validAmpdu}
            />
          ) : null
        }
        <div className="clearfix">
          <div style={{ width: '300px' }} >
            <FormGroup
              className="fl"
              label={__('RTS Threshold')}
              type="number"
              min="1"
              max="2347"
              defaultValue="1400"
              disabled={rtsEnable === '0'}
              value={rts}
              onChange={(data) => { this.changeFormValue(radioId, 'rts', data.value); }}
              required
              {...validRts}
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
              {__('Default')}
            </label>
          </span>
          <span
            className="fl"
            style={{
              marginTop: '12px',
              marginLeft: '4px',
              color: '#999',
            }}
          >
            {`${__('Range: ')}1 ~ 2347`}
          </span>
        </div>

        <div className="clearfix">
          <div style={{ width: '300px' }} >
            <FormGroup
              className="fl"
              label={__('Sensitivity Threshold')}
              type="number"
              min="-98"
              max="-10"
              defaultValue="-98"
              disabled={sensEnable === '0'}
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
              {__('Default')}
            </label>
          </span>
          <span
            className="fl"
            style={{
              marginTop: '12px',
              marginLeft: '4px',
              color: '#999',
            }}
          >
            {`${__('Range: ')}-98 ~ -10`}
          </span>
        </div>
        {
          funConfig.rateSetFun ? (
            <FormGroup
              type="select"
              label={__('Rate Set')}
              value={rateSet}
              options={this.props.selfState.get('rateSetOptions').toJS()}
              onChange={(data) => {
                this.changeFormValue(radioId, 'rateSet', data.value);
              }}
            />
          ) : null
        }
        {
          funConfig.rssiLimitFun ? (
            <div className="clearfix">
              <FormGroup
                type="checkbox"
                label={__('RSSI Limit')}
                className="fl"
                checked={rssiEnable === '1'}
                defaultValue="-98"
                onClick={() => {
                  const val = rssiEnable === '1' ? '0' : '1';
                  this.changeFormValue(radioId, 'rssiEnable', val);
                }}
              />
              <FormInput
                type="number"
                value={rssi}
                style={{
                  width: '164px',
                  padding: '0.6em 0.75em',
                }}
                min="-98"
                max="-40"
                defaultValue="-98"
                disabled={rssiEnable === '0'}
                className="fl"
                onChange={(data) => {
                  this.changeFormValue(radioId, 'rssi', data.value);
                }}
              />
              <span
                style={{
                  marginTop: '6px',
                  marginLeft: '7px',
                  display: 'inline-block',
                  color: '#999',
                }}
              >
                {`${__('Range: ')}-98 ~ -40 dbm`}
              </span>
            </div>
          ) : null
        }
        {
          funConfig.airTimeFairnessFun ? (
            <div className="clearfix">
              <FormGroup
                type="checkbox"
                label={__('Airtime Fairness')}
                className="fl"
                checked={airTimeEnable === '1'}
                onClick={() => {
                  const val = airTimeEnable === '1' ? '0' : '1';
                  this.changeFormValue(radioId, 'airTimeEnable', val);
                }}
              />
              <FormInput
                type="select"
                value={fairAlgthm}
                className="fl"
                disabled={airTimeEnable === '0'}
                options={[
                  { value: 'strict', label: __('Strict Schedule Algorithm') },
                  { value: 'fairquen', label: __('Fair Quene Algorithm') },
                ]}
                onChange={(data) => {
                  this.changeFormValue(radioId, 'fairAlgthm', data.value);
                }}
                style={{ width: '164px' }}
              />
            </div>
          ) : null
        }
        {
          funConfig.distanceFun ? (
            <div className="clearfix">
              <div className="fl">
                <FormGroup
                  type="number"
                  label={__('Distance Value')}
                  min="0"
                  max="10"
                  step="0.1"
                  value={distance}
                  hasTextInput
                  disabled={autoAdjust === '1'}
                  onChange={(data) => {
                    this.changeFormValue(radioId, 'distance', data.value);
                  }}
                  help={`${__('Range: ')}0~10 km`}
                  // inputStyle={{
                  //   backgroundColor: '#f2f2f2',
                  // }}
                />
              </div>
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
                  {__('auto')}
                </label>
              </span>
            </div>
          ) : null
        }
        {/*
          {
            radioType === '5G' ? (
              <FormGroup
                type="checkbox"
                label={__('5G First')}
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
            label={__('Multicast To Unicast')}
            checked={multiToUnicast === '1'}
            onChange={() => {
              const value = multiToUnicast === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'multiToUnicast', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={__('TGMP Snooping')}
            checked={tgmpSnoop === '1'}
            onChange={() => {
              const value = tgmpSnoop === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'tgmpSnoop', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={__('Multicast Monitor')}
            checked={multiMonitor === '1'}
            onChange={() => {
              const value = multiMonitor === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'multiMonitor', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={__('Probe Request Forbidden')}
            checked={probeRqstForbid === '1'}
            onChange={() => {
              const value = probeRqstForbid === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'probeRqstForbid', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={__('Airtime Fairness')}
            checked={timeFairness === '1'}
            onChange={() => {
              const value = timeFairness === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'timeFairness', value);
            }}
          />
          <FormGroup
            type="checkbox"
            label={__('Beamforming')}
            checked={beamforming === '1'}
            onChange={() => {
              const value = beamforming === '1' ? '0' : '1';
              this.changeFormValue(radioId, 'beamforming', value);
            }}
          />
        */}
        {
          funConfig.ledThreshFun ? (
            <div className="signalLedConfg">
              <FormGroup
                label={__('Signal LED Thresholds')}
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
                    min="-98"
                    max="-10"
                    help={`${__('Range: ')} -98 ~ -10 dbm`}
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
                    min="-98"
                    max="-10"
                    help={`${__('Range: ')} -98 ~ -10 dbm`}
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
                    min="-98"
                    max="-10"
                    help={`${__('Range: ')} -98 ~ -10 dbm`}
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
                    min="-98"
                    max="-10"
                    help={`${__('Range: ')} -98 ~ -10 dbm`}
                    value={led4Threshold}
                    onChange={(data) => { this.changeFormValue(radioId, 'led4Threshold', data.value); }}
                    size="sm"
                    required
                    {...validLed4}
                  />
                </div>
              </FormGroup>
            </div>
          ) : null
        }
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
    dispatch,
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
  validator.mergeProps(validOptions),
)(Advance);

export const advance = reducer;
