import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import {
  Button, FormGroup, FormInput,
} from 'shared/components';
import { bindActionCreators } from 'redux';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
};

const defaultProps = {};

export default class SpeedTest extends React.Component {

  constructor(props) {
    super(props);
    this.onToggleShowAdvanceBtn = this.onToggleShowAdvanceBtn.bind(this);
    this.onSpeedTestRun = this.onSpeedTestRun.bind(this);
  }

  componentWillMount() {
    const props = this.props;

    props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      showResult: false,
      showAdvance: false,
      defaultData: {
        ip: '192.168.1.10',
        username: 'root',
        password: '123',
        port: '5001',
        time: '30',
        direction: 'duplex',
      },
    });
  }

  onToggleShowAdvanceBtn() {
    const routeId = this.props.store.get('curSettingId');
    const showAdvance = this.props.store.getIn([routeId, 'showAdvance']);
    this.props.store.setIn([routeId, 'showAdvance'], !showAdvance);
  }

  onSpeedTestRun() {

  }

  render() {
    const {
      ip, username, password, port, time, direction,
    } = this.props.store.get('curData').toJS();
    const routeId = this.props.store.get('curSettingId');
    const { showResult, showAdvance } = this.props.store.get(routeId);

    return (
      <div>
        <div className="clearfix">
          <FormGroup
            className="fl"
            type="text"
            label={_('Destination IP')}
            value={ip}
          />
          <Button
            className="fl"
            theme="default"
            text={_('Select')}
          />
        </div>
        <FormGroup
          type="text"
          label={_('User')}
          value={username}
        />
        <FormGroup
          type="text"
          label={_('Password')}
          value={password}
        />
        <FormGroup
          type="text"
          label={_('Remote WEB Port')}
          value={port}
        />
        <FormGroup
          type="checkbox"
          label={_('Show Advanced Options')}
          checked={showAdvance}
          onClick={this.onToggleShowAdvanceBtn}
        />
        {
          showAdvance ? (
            <div>
              <FormGroup
                type="radio"
                label={_('Direction')}
                text={_('duplex')}
              >
                <FormInput
                  type="radio"
                  name="directionSelect"
                  text={_('duplex')}
                  checked={direction === 'duplex'}
                />
                <FormInput
                  type="radio"
                  name="directionSelect"
                  text={_('receive')}
                  checked={direction === 'receive'}
                />
                <FormInput
                  type="radio"
                  name="directionSelect"
                  text={_('transmit')}
                  checked={direction === 'transmit'}
                />
              </FormGroup>
              <FormGroup
                type="number"
                label={_('Duration')}
                value={time}
              />
            </div>
          ) : null
        }
        <FormGroup>
          <Button
            theme="primary"
            text={_('Run')}
            onClick={this.onSpeedTestRun}
          />
        </FormGroup>
      </div>
    );
  }
}

SpeedTest.propTypes = propTypes;
SpeedTest.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpeedTest);
