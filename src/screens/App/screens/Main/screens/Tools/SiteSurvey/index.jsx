import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  Button, FormGroup, FormInput, Table,
} from 'shared/components';
import * as appActions from 'shared/actions/app';
import * as sharedActions from 'shared/actions/settings';
import * as selfActions from './actions';
import selfReducer from './reducer';

const propTypes = {
  store: PropTypes.instanceOf(Map),
  route: PropTypes.object,
  initSettings: PropTypes.func,
  selfState: PropTypes.instanceOf(Map),
};

const defaultProps = {};

const siteScanResultOptions = fromJS([
  {
    id: 'mac',
    text: _('MAC address'),
  },
  {
    id: 'ssid',
    text: _('SSID'),
  },
  {
    id: 'security',
    text: _('Security'),
  },
  {
    id: 'signal',
    text: _('Signal, dBm'),
  },
  {
    id: 'noise',
    text: _('Noise,dBm'),
  },
  {
    id: 'protocol',
    text: _('Protocol'),
  },
  {
    id: 'channel',
    text: _('Channel'),
  },
  {
    id: 'channelWidth',
    text: _('Channel Width'),
  },
]);

export default class SiteSurvey extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      defaultData: {
        fetching: true,
        siteList: [
          {
            mac: '11:11:11:11:11:11',
            ssid: 'axilspot',
            security: 'WPA',
            signal: '-70',
            noise: '-90',
            protocol: 'b/g/n',
            channel: '36',
            channelWidth: '40+',
          },
        ],
      },
    });
  }

  render() {
    const { fetching, siteList } = this.props.store.get('curData').toJS();
    return (
      <div>
        <FormInput
          type="plain-text"
          value={_('Note: Site survey scan may temporary disable wireless link(s)')}
        /> <br /><br />
        {
          fetching ? (
            <Button
              theme="primary"
              loading={fetching}
              text={_('Stop Scan')}
            />
          ) : (
            <Button
              theme="primary"
              text={_('Start Scan')}
            />
          )
        }
        <br /><br />
        {
          this.props.selfState.get('showTable') ? (
            <Table
              className="table"
              options={siteScanResultOptions}
              list={siteList}
            />
          ) : null
        }
      </div>
    );
  }
}

SiteSurvey.porpTypes = propTypes;
SiteSurvey.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    app: state.app,
    store: state.settings,
    selfState: state.sitesurvey,
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
)(SiteSurvey);

export const sitesurvey = selfReducer;
