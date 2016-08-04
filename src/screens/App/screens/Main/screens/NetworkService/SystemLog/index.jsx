import React from 'react';
import utils from 'shared/utils';
import {fromJS,Map} from 'immutable';
import { connect } from 'react-redux';
import * as actions from './actions';
import reducer from './reducer';
import {FormGroup, FormInput} from 'shared/components/Form';



class SyStemLog extends React.Component{



  render(){
    return(
      <div className="systemLogConfg">
        <FormGroup
          label={_("System Log")}
          type="checkbox"
          defaultChecked
        />
      </div>
    )
  }
}

function mapStateToProps(state){
  var myState = state.ntpclient;

  return {
    fetching:myState.get("fetching"),
    ntpswitch:myState.get("ntpswitch")
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(SyStemLog);

export const systemlog = reducer;
