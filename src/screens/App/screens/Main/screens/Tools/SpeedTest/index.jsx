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
import * as selfActions from './actions';
import selfReducer from './reducer';

const propTypes = {
  app: PropTypes.instanceOf(Map),
  store: PropTypes.instanceOf(Map),

  route: PropTypes.object,
  initSettings: PropTypes.func,
  fetchSettings: PropTypes.func,
  saveSettings: PropTypes.func,
  updateItemSettings: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,

  selfState: PropTypes.object,
  initSelfState: PropTypes.func,
  clickSpeedTestRunBtn: PropTypes.func,
  toggleShowAdvanceBtn: PropTypes.func,
};

const defaultProps = {};

export default class SpeedTest extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const props = this.props;

    props.initSettings({
      settingId: props.route.id,
      fetchUrl: props.route.formUrl,
      saveUrl: props.route.saveUrl,
      defaultData: {
        ip: '192.168.1.10',
        username: 'root',
        password: '123',
        port: '5001',
        time: '30',
        direction: 'duplex',
      },
    });
    props.initSelfState();
  }


  render() {
    const {
      ip, username, password, port, time, direction,
    } = this.props.store.get('curData').toJS();
    const { showResults, showAdvance, bandwidth, rx, tx, total } = this.props.selfState.toJS();
    return (
      <div>
        <div className="clearfix">
          <FormGroup
            className="fl"
            type="text"
            label={_('Destination IP')}
            value={ip}
            onChange={(data) => this.props.updateItemSettings({
              ip: data.value,
            })}
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
          onChange={(data) => this.props.updateItemSettings({
            username: data.value,
          })}
        />
        <FormGroup
          type="text"
          label={_('Password')}
          value={password}
          onChange={(data) => this.props.updateItemSettings({
            password: data.value,
          })}
        />
        <FormGroup
          type="text"
          label={_('Remote WEB Port')}
          value={port}
          onChange={(data) => this.props.updateItemSettings({
            port: data.value,
          })}
        />
        <FormGroup
          type="checkbox"
          label={_('Show Advanced Options')}
          value={showAdvance === '1'}
          onClick={this.props.toggleShowAdvanceBtn}
        />
        {
          (showAdvance === '1') ? (
            <div>
              <FormGroup
                type="radio"
                label={_('Direction')}
              >
                <FormInput
                  type="radio"
                  name="directionSelect"
                  text={_('duplex')}
                  checked={direction === '0'}
                  onChange={() => this.props.updateItemSettings({
                    direction: '0',
                  })}
                />
                <FormInput
                  type="radio"
                  name="directionSelect"
                  text={_('receive')}
                  checked={direction === '1'}
                  onChange={() => this.props.updateItemSettings({
                    direction: '1',
                  })}
                />
                <FormInput
                  type="radio"
                  name="directionSelect"
                  text={_('transmit')}
                  checked={direction === '2'}
                  onChange={() => this.props.updateItemSettings({
                    direction: '2',
                  })}
                />
              </FormGroup>
              <FormGroup
                type="number"
                label={_('Duration')}
                value={time}
                onChange={(data) => this.props.updateItemSettings({
                  time: data.value,
                })}
              />
            </div>
          ) : null
        }
        <FormGroup>
          <Button
            theme="primary"
            text={_('Run')}
            onClick={this.props.clickSpeedTestRunBtn}
          />
        </FormGroup>
        {
          (showResults === '1') ? (
            <div className="result">
              <FormGroup
                type="text"
                label={_('rx')}
                value={rx}
              />
              <FormGroup
                type="text"
                label={_('tx')}
                value={tx}
              />
              <FormGroup
                type="text"
                label={_('total')}
                value={total}
              />
            </div>
          ) : null
        }
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
    selfState: state.speedtest,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    utils.extend({}, appActions, sharedActions, selfActions),
    dispatch
  );
}

export const Screen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SpeedTest);


export const speedtest = selfReducer;
