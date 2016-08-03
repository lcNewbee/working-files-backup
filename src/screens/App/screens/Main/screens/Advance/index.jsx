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
            label={_('RTS Threshold') }
            type="number"
            help="范围："
            required
          />
        </div>

        <div className="disConfg">
          <span>{_("Distance Adjust Mode") }</span>
          <FormInput name="distanceConfg" type="radio" id="autoDis" value='auto' />
          <span htmlFor='rtsOn'>Auto Adjust</span>
          <FormInput name="distanceConfg" type="radio" id="manuDis" value='manu'/>
          <span htmlFor='rtsOff'>Manu Adjust</span>
          <div className="disValue">
            <span>{_("Distance Value") }</span>
            <FormInput type="number" />m
          </div>
        </div>
        <div className="clientIsoConfg">
          <span>{_("Client Isolation") }</span>
          <FormInput name="clientIsolateConfg" type="radio" id="isolateOn" value='on' />
          <span htmlFor='isolateOn'>On</span>
          <FormInput name="clientIsolateConfg" type="radio" id="isolateOff" value='off' defaultChecked/>
          <span htmlFor='isolateOff'>Off</span>
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



