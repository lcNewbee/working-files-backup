import React from 'react';
import { connect } from 'react-redux';
import { FormInput, FormGroup } from 'shared/components/Form';
import * as actions from './actions.js';
import reducer from './reducer.js';


export default class Advance extends React.Component {


  render() {
    return (
      <div className="advanceWrap">
        <div className="rtsConfg">
          <FormGroup
            label={_('RTS Switch')}
            type="checkbox"
            onChange={this.onRtsSwitchToggle}
          />
          {

          }
          <FormGroup
            className="rtsThresholdValue"
            label={_('RTS Threshold')}
            type="number"
            help={_('Range: ')}
            required
          />
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
                value="auto"
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
                value="manu"
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
        <div className="disValue">
          <FormGroup
            type="number"
            label={_('Distance Value')}
            help="M"
          />
        </div>

        <div className="clientIsoConfg">
          <FormGroup
            label={_('Client Isolation')}
            type="checkbox"
          />
        </div>

        <div className="sensitivityConfg">
          <FormGroup
            label={_('Sensitivity Threshold')}
            type="checkbox"
          />
          <FormGroup
            className="sensThresholdValue"
            label={_('Threshold Value')}
            type="number"
            required
          />
        </div>

        <div className="signalLedConfg">
          <FormGroup
            label={_('Signal LED Thresholds')}
          >
            <br />
            <label htmlFor="threshdForLed1">
              <span>LED1 </span>
              <FormInput
                className="threshdForLed"
                id="threshdForLed1"
                label="LED1"
                type="number"
              />
              <span>dbm</span>
            </label>
            <br /><br />
            <label htmlFor="threshdForLed1">
              <span>LED2 </span>
              <FormInput
                className="threshdForLed"
                id="threshdForLed2"
                label="LED2"
                type="number"
              />
              <span>dbm</span>
            </label>
            <br /><br />
            <label htmlFor="threshdForLed1">
              <span>LED3 </span>
              <FormInput
                className="threshdForLed"
                size="min"
                id="threshdForLed3"
                label="LED3"
                type="number"
              />
              <span>dbm</span>
            </label>
            <br /><br />
            <label htmlFor="threshdForLed1">
              <span>LED4 </span>
              <FormInput
                className="threshdForLed"
                id="threshdForLed4"
                label="LED4"
                type="number"
              />
              <span>dbm</span>
            </label>
          </FormGroup>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state) {
  const myState = state.advance;

  return {
    fecthing: myState.get('fetching'),
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(Advance);

export const advance = reducer;
