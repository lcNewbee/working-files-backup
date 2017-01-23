import React from 'react';
import { connect } from 'react-redux';
import {fromJS} from 'immutable';
import utils from 'shared/utils';

//component
import { FormInput, FormGroup } from 'shared/components/Form';


//custom
import reducer from './reducer';
import * as actions from './actions';

export const Advance = React.createClass({
  render() {
    return (
      <div className='advanceWrap'>

        <div className='rtsConfg'>
          <FormGroup
            label={_('RTS Switch') }
            type="checkbox"
            onChange={this.onRtsSwitchToggle}
          />
          <FormGroup
            className="rtsThresholdValue"
            label={_('RTS Threshold') }
            type="number"
            help={_("Range: ")}
            required
          />
        </div>

        <div className="disConfg">
          <FormGroup
            label={_("Distance Adjust Mode")}
            type="checkbox"
          >
            <label htmlFor="autoDis">
              <FormInput
                name="distanceConfg"
                type="radio"
                id="autoDis"
                value='auto'
              />
              <span>Auto Adjust</span>
            </label>
            <label htmlFor="manuDis">
              <FormInput
                name="distanceConfg"
                type="radio"
                id="manuDis"
                value='manu'
              />
              <span>Manu Adjust</span>
            </label>
          </FormGroup>
        </div>

          <div className="disValue">
            <FormGroup
              type="number"
              label={_("Distance Value") }
              help="M"
            />
          </div>

        <div className="clientIsoConfg">
          <FormGroup
            label={_("Client Isolation") }
            type="checkbox"
          />
        </div>

        <div className="sensitivityConfg">
          <FormGroup
            label={_("Sensitivity Threshold") }
            type="checkbox"
          />
          <FormGroup
            className="sensThresholdValue"
            label={_('Threshold Value') }
            type="number"
            help={"dBm "+_("Range: ")+"-96 ~ 0"}
            required
           />
        </div>

        <div className="signalLedConfg">
          <FormGroup label={_("Signal LED Thresholds") } >
            <br/><br/>
            <label htmlFor="threshdForLed1">
              <span>LED1  </span>
              <FormInput
                className="threshdForLed"
                id="threshdForLed1"
                label="LED1"
                type="number"
              />
              <span>{" "+"dbm"}</span>
            </label>
            <br/><br/>
            <label htmlFor="threshdForLed1">
              <span>LED2  </span>
              <FormInput
                className="threshdForLed"
                id="threshdForLed2"
                label="LED2"
                type="number"
              />
              <span>{" "+"dbm"}</span>
            </label>
            <br/><br/>
            <label htmlFor="threshdForLed1">
              <span>LED3  </span>
              <FormInput
                className="threshdForLed"
                id="threshdForLed3"
                label="LED3"
                type="number"
              />
              <span>{" "+"dbm"}</span>
            </label>
            <br/><br/>
            <label htmlFor="threshdForLed1">
              <span>LED4  </span>
              <FormInput
                className="threshdForLed"
                id="threshdForLed4"
                label="LED4"
                type="number"
              />
              <span>{" "+"dbm"}</span>
            </label>
          </FormGroup>
        </div>

      </div>
    )
  }
});

function mapStateToProps(state) {
  var myState = state.advance;

  return {
    rts: myState.get('rts')
  }
}

export const Screen = connect(
  mapStateToProps,
  actions
)(Advance)

export const advance = reducer;



