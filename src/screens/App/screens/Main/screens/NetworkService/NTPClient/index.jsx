import React from 'react';
import utils from 'shared/utils';
import {fromJS,Map} from 'immutable';
import { connect } from 'react-redux';
import * as actions from './actions';
import reducer from './reducer';
import {FormGroup, FormInput} from 'shared/components/Form';



class NTPClient extends React.Component{



  render(){
    return (
      <div className="ntpClientConfg">
        <FormGroup
          label={_("NTP Client")}
          type="checkbox"
          defaultChecked
        />
        <FormGroup
          label={_("NTP Server")}
          help="IP地址或域名"
          required
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
)(NTPClient);

export const ntpclient = reducer;


