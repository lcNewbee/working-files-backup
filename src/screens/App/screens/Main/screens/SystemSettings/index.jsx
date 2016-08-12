import React from 'react';
import { connect } from 'react-redux';
import * as actions from './actions.js';
import reducer from './reducer.js';


export default class SystemSettings extends React.Component {


  render() {
    return (
      <div>
        <span>this is SystemSettings page</span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const myState = state.systemsettings;

  return {
    fecthing: myState.get('fetching'),
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(SystemSettings);

export const systemsettings = reducer;
