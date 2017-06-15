import React from 'react'; import PropTypes from 'prop-types';
import utils from 'shared/utils';
import { connect } from 'react-redux';
import { fromJS, Map } from 'immutable';
import { bindActionCreators } from 'redux';
import {
  Button, FormInput, Table,
} from 'shared/components';
import { actions as appActions } from 'shared/containers/app';
import { actions as sharedActions } from 'shared/containers/settings';
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
  fetchSettings: PropTypes.func,
  fetch: PropTypes.func,
};

const defaultProps = {};

const siteScanResultOptions = fromJS([
  {
    id: 'mac',
    text: __('MAC'),
  },
  {
    id: 'ssid',
    text: __('SSID'),
  },
  {
    id: 'security',
    text: __('Security'),
    render(val) {
      return val.get('mode');
    },
  },
  {
    id: 'signal',
    text: __('Signal,dBm'),
  },
  {
    id: 'noise',
    text: __('Noise,dBm'),
  },
  {
    id: 'protocol',
    text: __('Protocol'),
  },
  {
    id: 'frequency',
    text: __('Channel'),
  },
  {
    id: 'channelWidth',
    text: __('Channel Width'),
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
    this.props.changeShowTableStatus(false);
    this.props.leaveSettingsScreen();
  }
  onScanBtnClick() {
    this.props.changeShowTableStatus(false);
    this.props.fetchSettings().then(() => {
      this.props.changeShowTableStatus(true);
    });
  }

  render() {
    const { siteList } = this.props.store.get('curData').toJS();
    const fetching = this.props.store.getIn([this.props.route.id, 'fetching']);
    return (
      <div>
        <FormInput
          type="plain-text"
          value={__('Notice: Site survey scan may temporary disable wireless link(s)')}
        /> <br /><br />
        <Button
          theme="primary"
          loading={fetching}
          disabled={fetching}
          text={__('Scan')}
          onClick={this.onScanBtnClick}
        /><br /><br />
        {
          this.props.selfState.get('showTable') ? (
            <div className="stats-group">
              <div className="stats-group-cell">
                <Table
                  className="table"
                  options={siteScanResultOptions}
                  list={siteList}
                />
              </div>
            </div>
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
