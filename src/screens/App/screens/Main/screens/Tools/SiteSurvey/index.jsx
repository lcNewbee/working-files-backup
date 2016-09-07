import React, { PropTypes } from 'react';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  Button, FormInput, Table,
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

  reqeustFetchSettings: PropTypes.func,
  changeShowTableStatus: PropTypes.func,
  leaveSettingsScreen: PropTypes.func,
  reciveFetchSettings: PropTypes.func,
  fetch: PropTypes.func,
};

const defaultProps = {};

const siteScanResultOptions = fromJS([
  {
    id: 'mac',
    text: _('MAC'),
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
    this.onScanBtnClick = this.onScanBtnClick.bind(this);
  }

  componentWillMount() {
    this.props.initSettings({
      settingId: this.props.route.id,
      fetchUrl: this.props.route.fetchUrl,
      defaultData: {
      },
    });
    this.props.changeShowTableStatus(false);
  }
  componentWillUnmount() {
    this.props.leaveSettingsScreen();
  }
  onScanBtnClick() {
    this.props.changeShowTableStatus(false);
    const fetchUrl = this.props.route.fetchUrl;
    this.props.fetch(fetchUrl)
              .then((json) => {
                if (json.state && json.state.code === 2000) {
                  this.props.reciveFetchSettings(json.data);
                  this.props.changeShowTableStatus(true);
                }
              });
  }

  render() {
    const { siteList } = this.props.store.get('curData', 'siteList').toJS();
    const fetching = this.props.store.getIn([this.props.route.id, 'fetching']);
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
              loading
              text={_('Stop Scan')}
            />
          ) : (
            <Button
              theme="primary"
              text={_('Start Scan')}
              onClick={this.onScanBtnClick}
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

SiteSurvey.propTypes = propTypes;
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
