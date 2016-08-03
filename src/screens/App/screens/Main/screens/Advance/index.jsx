import React from 'react';
import { connect } from 'react-redux';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {fromJS} from 'immutable';
import utils from 'shared/utils';

//component
import {FormInput, FormGroup} from 'shared/components/Form';


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
          >
            <label htmlFor="rtsOn" className="radio">
              <FormInput
                name="rtsSwitch"
                type="radio"
                id="rtsOn"
                value='on'
              />
              <span>On</span>
            </label>
            <label htmlFor="rtsOff" className="radio">
              <FormInput
                name="rtsSwitch"
                type="radio"
                id="rtsOff"
                value='off'
              />
              <span>Off</span>
            </label>
          </FormGroup>
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
          >
            <label htmlFor="isolateOn">
              <FormInput
                name="clientIsolateConfg"
                type="radio"
                id="isolateOn"
                value='on'
              />
              <span>On</span>
            </label>
            <label htmlFor="isolateOff">
              <FormInput
                name="clientIsolateConfg"
                type="radio"
                id="isolateOff"
                value='off'
              />
              <span>Off</span>
            </label>
          </FormGroup>
        </div>

        <div className="sensitivityConfg">
          <FormGroup
            label={_("Sensitivity Threshold") }
          >
            <label htmlFor="thresholdOn">
              <FormInput
                name="sensitivityThresConfg"
                type="radio"
                id="thresholdOn"
                value='on'
              />
              <span>On</span>
            </label>
            <label htmlFor="thresholdOff">
              <FormInput
                name="sensitivityThresConfg"
                type="radio"
                id="thresholdOff"
                value='off'
              />
              <span>Off</span>
            </label>
          </FormGroup>
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
                defaultValue="-94"
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
                help="dbm"
                defaultValue="-80"
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
                help="dbm"
                defaultValue="-73"
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
                help="dbm"
                defaultValue="-65"
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



