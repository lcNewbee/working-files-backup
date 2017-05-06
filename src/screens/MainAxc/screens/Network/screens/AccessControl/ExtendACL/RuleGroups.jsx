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
      <div className="container-grid">
        <div className="row">
          <div className="group-slide-wrap cols col-10 col-offset-1">
            <div className="left-caret cols col-1">
              <Icon
                name="caret-left"
                style={{ color: '#0083cd' }}
                size="4x"
              />
            </div>
            <div className="slide-view cols col-10">
              <div className="group-slide">
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
                <Button
                  theme="primary"
                  text="GROUP6"
                  size="lg"
                  className="group-button"
                />
                <Button
                  theme="primary"
                  text="GROUP7"
                  size="lg"
                  className="group-button"
                />
              </div>
            </div>
            <div className="right-caret cols col-1">
              <Icon
                name="caret-right"
                style={{ color: '#0083cd' }}
                size="4x"
              />
            </div>
          </div>
          <div className="group-config-wrap cols col-10 col-offset-1 text-justify">
            <div className="list-in-group cols col-5">
              <div className="list-in-group-head">

              </div>
              <div className="list-in-group-body">

              </div>
            </div>
            <div className="exchange-arrow cols col-2">
              <Icon
                name="exchange"
                style={{ color: '#0083cd' }}
                size="4x"
              />
            </div>
            <div className="list-out-group cols col-5">
              <div className="list-out-group-head">
                <Icon
                  name="plus"
                  size="2x"
                  style={{ color: '#0083cd' }}
                />
              </div>
              <div className="list-out-group-body">

              </div>
            </div>
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
