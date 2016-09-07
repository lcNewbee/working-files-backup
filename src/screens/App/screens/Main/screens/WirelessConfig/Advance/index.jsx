import React, { PropTypes } from 'react';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { bindActionCreators } from 'redux';
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
};

export default class Advance extends React.Component {

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
        isolation: '1',
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

  render() {
    const {
      autoAdjust, sensEnable, distance, sensThreshold, rtsEnable, rts,
      isolation, led1Threshold, led2Threshold, led3Threshold, led4Threshold,
    } = this.props.store.get('curData').toJS();
    return (
      <div className="advanceWrap">
        <div className="rtsConfg">
          <FormGroup
            label={_('RTS Switch')}
            type="checkbox"
            checked={rtsEnable === '1'}
            onChange={(data) => this.props.updateItemSettings({
              rtsEnable: data.value,
            })}
          />
          {
            rtsEnable === '1' ? (
              <FormGroup
                className="rtsThresholdValue"
                label={_('RTS Threshold')}
                type="number"
                help={_('Range: ')}
                value={rts}
                onChange={(data) => this.props.updateItemSettings({
                  rts: data.value,
                })}
                required
              />
            ) : null
          }
        </div>
        <div className="disConfg">
          <FormGroup
            label={_('Distance Adjust Mode')}
            type="checkbox"
          >
            <label htmlFor="autoDis">
              <FormInput
                name="distanceConfg"
                type="radio"
                id="autoDis"
                checked={autoAdjust === '1'}
                onClick={() => this.props.updateItemSettings({
                  autoAdjust: '1',
                })}
              />
              <span
                style={{ paddingRight: '15px',
                         paddingLeft: '5px',
                  }}
              >
                Auto Adjust
              </span>
            </label>
            <label htmlFor="manuDis">
              <FormInput
                name="distanceConfg"
                type="radio"
                id="manuDis"
                checked={autoAdjust === '0'}
                onClick={() => this.props.updateItemSettings({
                  autoAdjust: '0',
                })}
              />
              <span
                style={{ paddingRight: '15px',
                         paddingLeft: '5px',
                  }}
              >
                Manu Adjust
              </span>
            </label>
          </FormGroup>
        </div>
        {
          autoAdjust === '0' ? (
            <div className="disValue">
              <FormGroup
                type="number"
                label={_('Distance Value')}
                help="km"
                value={parseInt(distance, 10)}
              />
            </div>
          ) : null
        }
        <div className="clientIsoConfg">
          <FormGroup
            label={_('Client Isolation')}
            type="checkbox"
            checked={isolation === '1'}
            onChange={(data) => this.props.updateItemSettings({
              isolation: data.value,
            })}
          />
        </div>

        <div className="sensitivityConfg">
          <FormGroup
            label={_('Sensitivity Threshold')}
            type="checkbox"
            checked={sensEnable === '1'}
            onChange={(data) => this.props.updateItemSettings({
              sensEnable: data.value,
            })}
          />
          {
            sensEnable === '1' ? (
              <FormGroup
                className="sensThresholdValue"
                label={_('Threshold Value')}
                type="number"
                value={sensThreshold}
                onChange={(data) => this.props.updateItemSettings({
                  sensThreshold: data.value,
                })}
                required
              />
            ) : null
          }
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
                help="dbm"
                value={led1Threshold}
                onChange={(data) => this.props.updateItemSettings({
                  led1Threshold: data.value,
                })}
                style={{
                  width: '165px',
                }}
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
                id="threshdForLed1"
                type="number"
                label="LED1"
                help="dbm"
                value={led2Threshold}
                onChange={(data) => this.props.updateItemSettings({
                  led2Threshold: data.value,
                })}
                style={{
                  width: '165px',
                }}
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
                id="threshdForLed1"
                type="number"
                label="LED1"
                help="dbm"
                value={led3Threshold}
                onChange={(data) => this.props.updateItemSettings({
                  led3Threshold: data.value,
                })}
                style={{
                  width: '165px',
                }}
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
                id="threshdForLed1"
                type="number"
                label="LED1"
                help="dbm"
                value={led4Threshold}
                onChange={(data) => this.props.updateItemSettings({
                  led4Threshold: data.value,
                })}
                style={{
                  width: '165px',
                }}
              />
            </div>
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <SaveButton
              loading={this.props.app.get('saving')}
              onClick={() => {
                this.props.save(this.props.route.saveUrl, this.props.store.get('curData').toJS());
              }}
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
)(Advance);

export const advance = reducer;
