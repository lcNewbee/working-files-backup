import React from 'react';
import { connect } from 'react-redux';
import * as actions from './actions.js';
import reducer from './reducer.js';


export default class QuickSetup extends React.Component {


  render() {
    return (
      <div>
        <span>this is quick setup page</span>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const myState = state.quicksetup;

  return {
    fecthing: myState.get('fetching'),
  };
}

export const Screen = connect(
  mapStateToProps,
  actions
)(QuickSetup);

export const quicksetup = reducer;
