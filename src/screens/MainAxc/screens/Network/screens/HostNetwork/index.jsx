import React from 'react';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';
import { actions as appActions } from 'shared/containers/app';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { bindActionCreators } from 'redux';

const settingsFormOptions = fromJS([
  {
    id: 'ip',
    label: 'IP',
    type: 'text',
  },
  {
    id: 'mask',
    label: 'MASK',
    type: 'text',
  },
  {
    id: 'firstDNS',
    label: 'First DNS',
    type: 'text',
  },
  {
    id: 'secondaryDNS',
    label: 'Secondary DNS',
    type: 'text',
  },
]);


export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AppScreen
        {...this.props}
        settingsFormOptions={settingsFormOptions}
        hasSettingsSaveButton
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.screens,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(utils.extend({},
    appActions,
    screenActions,
  ), dispatch);
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(View);
