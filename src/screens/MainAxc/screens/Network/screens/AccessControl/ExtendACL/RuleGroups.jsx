import React from 'react';
import { fromJS } from 'immutable';
import { Button, Icon } from 'shared/components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import utils from 'shared/utils';
import { actions as appActions } from 'shared/containers/app';
import { actions as screenActions, AppScreen } from 'shared/containers/appScreen';

import './style.css';

export default class View extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        <div className="group-slide-wrap col-10 col-offset-1">
          <Icon
            name="caret-left"
            className="text-primary"
            size="4x"
          />
          <div className="group-slide col-10 col-offset-1">
            <Button
              theme="primary"
              text="GROUP1"
              size="lg"
              className="group-button"
            />
            <Button
              theme="primary"
              text="GROUP2"
              size="lg"
              className="group-button"
            />
            <Button
              theme="primary"
              text="GROUP3"
              size="lg"
              className="group-button"
            />
            <Button
              theme="primary"
              text="GROUP4"
              size="lg"
              className="group-button"
            />
            <Button
              theme="primary"
              text="GROUP5"
              size="lg"
              className="group-button"
            />
          </div>
        </div>
      </div>
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
