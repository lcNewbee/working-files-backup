import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  SaveButton, FormGroup, FormInput,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as settingsActions from 'shared/actions/settings';
import utils from 'shared/utils';
import * as selfActions from './actions';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,

  fetch: PropTypes.func,
  updateItemSettings: PropTypes.func,
  initSettings: PropTypes.func,
};


export default class CommonSettings extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      defaultData: {
        ntpEnable: '0',
      },
    });
    this.props.fetch('goform/get_ntp_info')
              .then((json) => {
                if (json.state && json.state.code === 2000) {
                  this.props.updateItemSettings({
                    ntpEnable: json.data.ntpEnable,
                    ntpServer: json.data.ntpServer,
                  });
                }
              });
  }

  render() {
    const { ntpEnable, ntpServer } = this.props.store.get('curData').toJS();
    return (
      <div>
        <div>
          <h3>{_('Accounts Settings')}</h3>
          <FormGroup
            type="text"
            label={_('Old User Name')}
          />
          <FormGroup
            type="password"
            label={_('Old Password')}
          />
          <FormGroup
            type="text"
            label={_('New User Name')}
          />
          <FormGroup
            type="password"
            label={_('New Password')}
          />
          <FormGroup
            type="password"
            label={_('Confirm Password')}
          />
        </div>
        <div>
          <h3>{_('Time Settings')}</h3>
          <FormGroup
            type="checkbox"
            label={_('NTP Client')}
            checked={ntpEnable === '1'}
            onChange={(data) => this.props.updateItemSettings({
              ntpEnable: data.value,
            })}
          />
          <FormGroup
            type="text"
            label={_('NTP Server')}
            value={ntpServer}
            disabled={ntpEnable === '0'}
            onChange={(data) => this.props.updateItemSettings({
              ntpServer: data.value,
            })}
          />
        </div>
      </div>
    );
  }
}

CommonSettings.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.commonsettings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, settingsActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps
)(CommonSettings);

