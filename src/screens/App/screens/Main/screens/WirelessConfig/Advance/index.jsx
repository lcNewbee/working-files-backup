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
  }

  componentDidMount() {
    const props = this.props;
    this.props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.fetchUrl,
      saveUrl: props.route.saveUrl,
      defaultData: {
        rts: '100',
        distance: '0.7',
        autoAdjust: '1',
        sensThreshold: '-90',
        sensEnable: '1',
        led1Threshold: '-30',
        led2Threshold: '-40',
        led3Threshold: '-50',
        led4Threshold: '-60',
      },
    });
    this.props.fetchSettings();
  }

  componentWillUnmount() {
    this.props.leaveSettingsScreen();
    this.props.resetVaildateMsg();
  }

  onSave() {
    this.props.validateAll()
      .then(msg => {
        if (msg.isEmpty()) {
          this.props.saveSettings();
        }
      });
  }

  render() {
    const {
      sensEnable, distance, sensThreshold, rtsEnable, rts, autoAdjust,
      led1Threshold, led2Threshold, led3Threshold, led4Threshold,
    } = this.props.store.get('curData').toJS();
    const { validLed1, validLed2, validLed3, validLed4, validSens } = this.props.validateOption;
    return (
      <div className="advanceWrap">
        <h3>{_('Advance')}</h3>
        <div className="clearfix">
          <div style={{ width: '300px' }} >
            <FormGroup
              className="rtsThresholdValue fl"
              label={_('RTS Threshold')}
              type="number"
              placeholder={_('Range: ')}
              disabled={rtsEnable === '0'}
              value={rts}
              onChange={(data) => this.props.updateItemSettings({
                rts: data.value,
              })}
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
                onClick={() => {
                  this.props.updateItemSettings({
                    rtsEnable: rtsEnable === '1' ? '0' : '1',
                  });
                }}
                style={{ marginRight: '3px' }}
              />
              {_('Default')}
            </label>
          </span>
        </div>

        <div className="sensitivityConfg clearfix">
          <div style={{ width: '300px' }} >
            <FormGroup
              className="sensThresholdValue fl"
              label={_('Threshold Value')}
              type="number"
              disabled={sensEnable === '0'}
              placeholder={_('Range: -90 ~ -50')}
              value={sensThreshold}
              onChange={(data) => this.props.updateItemSettings({
                sensThreshold: data.value,
              })}
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
                onClick={() => {
                  this.props.updateItemSettings({
                    sensEnable: sensEnable === '1' ? '0' : '1',
                  });
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
            onChange={(data) => {
              this.props.updateItemSettings({
                distance: data.value,
              });
            }}
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
                onClick={() => {
                  this.props.updateItemSettings({
                    autoAdjust: autoAdjust === '1' ? '0' : '1',
                  });
                }}
                style={{ marginRight: '3px' }}
              />
              {_('auto')}
            </label>
          </span>
        </div>
        <div className="signalLedConfg">
          <FormGroup
            label={_('Signal LED Thresholds')}
          >
            <br />
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
                onChange={(data) => this.props.updateItemSettings({
                  led1Threshold: data.value,
                })}
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
                marginTop: '-50px',
              }}
            >
              <FormGroup
                className="threshdForLed"
                id="threshdForLed2"
                type="number"
                label="LED2"
                help={"dbm " + _('range:') + " -98 ~ -10"}
                value={led2Threshold}
                onChange={(data) => this.props.updateItemSettings({
                  led2Threshold: data.value,
                })}
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
                marginTop: '-50px',
              }}
            >
              <FormGroup
                className="threshdForLed"
                id="threshdForLed3"
                type="number"
                label="LED3"
                help={"dbm " + _('range:') + " -98 ~ -10"}
                value={led3Threshold}
                onChange={(data) => this.props.updateItemSettings({
                  led3Threshold: data.value,
                })}
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
                marginTop: '-50px',
              }}
            >
              <FormGroup
                className="threshdForLed"
                id="threshdForLed4"
                type="number"
                label="LED4"
                help={"dbm " + _('range:') + " -98 ~ -10"}
                value={led4Threshold}
                onChange={(data) => this.props.updateItemSettings({
                  led4Threshold: data.value,
                })}
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
              onClick={this.onSave}
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
